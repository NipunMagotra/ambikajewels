import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';
import { mockProducts } from '@/data/mockProducts';
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

/**
 * Authoritatively verifies item catalog existence, checks unit prices against DB / mock fallback,
 * rejects unknown products, enforces positive integer quantities, and computes all taxes and totals server-side.
 */
export async function calculateOrderPricingServer(
  rawItems: Array<{ id?: string; product_id?: string; quantity?: unknown }>
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

    // 1. Check Supabase DB products table
    if (dbClient) {
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

    // 2. Authoritative static catalog fallback (if DB not populated or item in mock catalog)
    if (foundPrice === null) {
      const catalogItem = mockProducts.find(p => p.id === productId || p.slug === productId);
      if (catalogItem && typeof catalogItem.price === 'number' && catalogItem.price > 0) {
        foundPrice = catalogItem.price;
        foundName = catalogItem.name;
        foundImage = catalogItem.images && catalogItem.images[0] ? catalogItem.images[0] : '';
      }
    }

    // 3. REJECT UNKNOWN PRODUCTS (NO CLIENT FALLBACK)
    if (foundPrice === null) {
      throw new Error(`Product "${productId}" is not recognized in store catalog. Price verification failed.`);
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
