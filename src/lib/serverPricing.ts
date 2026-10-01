import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';
import { siteConfig } from '@/config/siteConfig';

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
  tax_paise: number;
  shipping_paise: number;
  total_paise: number;
  is_free_shipping: boolean;
}

export type ProductResolver = (
  productId: string
) => Promise<{ price: number; name: string; image?: string } | null>;

/**
 * Authoritatively verifies item catalog existence strictly from the Supabase database products table,
 * rejects unknown products, enforces positive integer quantities, and computes all taxes and totals server-side.
 * NOTE: mockProducts fallback is completely removed. Unknown products are rejected.
 */
export async function calculateOrderPricingServer(
  rawItems: Array<{ id?: string; product_id?: string; quantity?: unknown }>,
  customResolver?: ProductResolver
): Promise<PricingBreakdownResult> {
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
        foundPrice = resolved.price;
        foundName = resolved.name;
        foundImage = resolved.image || '';
      }
    } else if (dbClient) {
      // 2. Authoritative Database lookup from Supabase products table
      try {
        const { data: dbProduct } = await dbClient
          .from('products')
          .select('id, name, price, images')
          .eq('id', productId)
          .maybeSingle();

        if (dbProduct && typeof dbProduct.price === 'number' && dbProduct.price > 0) {
          foundPrice = dbProduct.price;
          foundName = dbProduct.name;
          foundImage = Array.isArray(dbProduct.images) && dbProduct.images.length > 0 ? dbProduct.images[0] : '';
        }
      } catch (err) {
        console.warn(`[PRICING] Error fetching product ${productId} from DB:`, err);
      }
    }

    // 3. REJECT UNKNOWN PRODUCTS (NO MOCK PRODUCTS FALLBACK PER COMPLIANCE RULES)
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

  // 4. Compute Tax, Shipping and Total Server-Side
  // Note: 3% GST on precious jewellery (HSN 7113) - verify with CA
  const calculatedTax = Math.round(calculatedSubtotal * siteConfig.tax.gstRate);
  const isFreeShipping = calculatedSubtotal >= siteConfig.shipping.freeThreshold;
  const calculatedShipping = isFreeShipping ? 0 : siteConfig.shipping.flatRate;
  const calculatedTotal = calculatedSubtotal + calculatedTax + calculatedShipping;

  return {
    items: verifiedItems,
    subtotal_paise: calculatedSubtotal,
    tax_paise: calculatedTax,
    shipping_paise: calculatedShipping,
    total_paise: calculatedTotal,
    is_free_shipping: isFreeShipping
  };
}
