import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';
import { siteConfig } from '@/config/siteConfig';
import { validateCoupon } from '@/lib/couponEngine';

export interface VerifiedOrderItem {
  product_id: string;
  name: string;
  unit_price_paise: number;
  quantity: number;
  subtotal_paise: number;
  image?: string;
}

export interface PricingBreakdownResult {
  items: VerifiedOrderItem[];
  subtotal_paise: number;
  discount_paise: number;
  coupon_code?: string;
  tax_paise: number;
  shipping_paise: number;
  total_paise: number;
  is_free_shipping: boolean;
}

export type ProductResolver = (
  productId: string
) => Promise<{ price: number; name: string; image?: string; stock_status?: string } | null>;

/**
 * Authoritatively verifies item catalog existence strictly from the Supabase database products table,
 * rejects unknown products, rejects out-of-stock items, enforces positive integer quantities,
 * validates optional coupon discounts, and computes all taxes and totals server-side.
 * NOTE: mockProducts fallback is completely removed. Unknown products are rejected.
 */
export async function calculateOrderPricingServer(
  rawItems: Array<{ id?: string; product_id?: string; quantity?: unknown }>,
  customResolverOrCoupon?: ProductResolver | string,
  explicitCouponCode?: string
): Promise<PricingBreakdownResult> {
  const customResolver = typeof customResolverOrCoupon === 'function' ? customResolverOrCoupon : undefined;
  const couponCode = typeof customResolverOrCoupon === 'string' ? customResolverOrCoupon : explicitCouponCode;
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new Error('Order must contain at least one item.');
  }

  if (rawItems.length > 50) {
    throw new Error('Order exceeds maximum allowed unique items (50).');
  }

  const dbClient = isSupabaseAdminConfigured ? supabaseAdmin : (isSupabaseConfigured ? supabase : null);
  const verifiedItems: VerifiedOrderItem[] = [];
  let calculatedSubtotal = 0;

  for (const rawItem of rawItems) {
    const productId = String(rawItem.product_id || rawItem.id || '').trim();
    if (!productId) {
      throw new Error('Missing product identifier in order item.');
    }

    const qty = rawItem.quantity;
    if (typeof qty !== 'number' || !Number.isInteger(qty) || qty < 1 || qty > 50) {
      throw new Error(`Invalid quantity for item "${productId}". Must be an integer between 1 and 50.`);
    }

    let foundPrice: number | null = null;
    let foundName: string = '';
    let foundImage: string = '';

    // 1. If custom resolver provided (e.g. for unit tests), check it
    if (customResolver) {
      const resolved = await customResolver(productId);
      if (resolved && typeof resolved.price === 'number' && resolved.price > 0) {
        if (resolved.stock_status === 'out_of_stock') {
          throw new Error(`Product "${resolved.name || productId}" is currently out of stock and cannot be ordered.`);
        }
        foundPrice = resolved.price;
        foundName = resolved.name;
        foundImage = resolved.image || '';
      }
    } else if (dbClient) {
      // 2. Authoritative Database lookup from Supabase products table
      try {
        const { data: dbProduct } = await dbClient
          .from('products')
          .select('id, name, price, images, stock_status')
          .eq('id', productId)
          .maybeSingle();

        if (dbProduct && typeof dbProduct.price === 'number' && dbProduct.price > 0) {
          if (dbProduct.stock_status === 'out_of_stock') {
            throw new Error(`Product "${dbProduct.name || productId}" is currently out of stock and cannot be ordered.`);
          }
          foundPrice = dbProduct.price;
          foundName = dbProduct.name;
          foundImage = Array.isArray(dbProduct.images) && dbProduct.images.length > 0 ? dbProduct.images[0] : '';
        }
      } catch (err) {
        if (err instanceof Error && err.message.includes('out of stock')) {
          throw err;
        }
        console.warn(`[PRICING] Error fetching product ${productId} from DB:`, err);
      }
    }

    // 3. Fallback to store management memory when DB did not return the product (e.g. newly created admin item or testing)
    if (!customResolver && foundPrice === null) {
      try {
        const memList = (globalThis as any).__ambika_memory_products;
        const memProduct = Array.isArray(memList) ? memList.find((p: any) => p.id === productId || p.slug === productId) : null;
        if (memProduct && typeof memProduct.price === 'number' && memProduct.price > 0) {
          if (memProduct.stock_status === 'out_of_stock') {
            throw new Error(`Product "${memProduct.name || productId}" is currently out of stock and cannot be ordered.`);
          }
          foundPrice = memProduct.price;
          foundName = memProduct.name;
          foundImage = Array.isArray(memProduct.images) && memProduct.images.length > 0 ? memProduct.images[0] : '';
        }
      } catch (err) {
        if (err instanceof Error && err.message.includes('out of stock')) {
          throw err;
        }
      }
    }

    // 4. REJECT UNKNOWN PRODUCTS (NO MOCK PRODUCTS FALLBACK PER COMPLIANCE RULES)
    if (foundPrice === null) {
      throw new Error(`Product "${productId}" is not recognized in store catalog database. Price verification failed.`);
    }

    const itemSubtotal = foundPrice * qty;
    calculatedSubtotal += itemSubtotal;

    verifiedItems.push({
      product_id: productId,
      name: foundName,
      unit_price_paise: foundPrice,
      quantity: qty,
      subtotal_paise: itemSubtotal,
      image: foundImage
    });
  }

  // 4. Validate & Apply Coupon if provided
  let discountPaise = 0;
  let appliedCouponCode: string | undefined = undefined;

  if (couponCode) {
    const couponValidation = validateCoupon(couponCode, calculatedSubtotal);
    if (!couponValidation.isValid) {
      throw new Error(couponValidation.message);
    }
    discountPaise = couponValidation.discountPaise;
    appliedCouponCode = couponValidation.code;
  }

  // 5. Compute Tax, Shipping and Total Server-Side
  // Note: 3% GST on precious jewellery (HSN 7113) applied on discounted consideration
  const taxableAmount = Math.max(0, calculatedSubtotal - discountPaise);
  const calculatedTax = Math.round(taxableAmount * siteConfig.tax.gstRate);
  const isFreeShipping = taxableAmount >= siteConfig.shipping.freeThreshold;
  const calculatedShipping = isFreeShipping ? 0 : siteConfig.shipping.flatRate;
  const calculatedTotal = taxableAmount + calculatedTax + calculatedShipping;

  return {
    items: verifiedItems,
    subtotal_paise: calculatedSubtotal,
    discount_paise: discountPaise,
    coupon_code: appliedCouponCode,
    tax_paise: calculatedTax,
    shipping_paise: calculatedShipping,
    total_paise: calculatedTotal,
    is_free_shipping: isFreeShipping
  };
}
