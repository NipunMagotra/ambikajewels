import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';
import { recordAuditLog } from '@/lib/auditLog';
import { mockProducts } from '@/data/mockProducts';

export const dynamic = 'force-dynamic';

// In-memory products store used for test environments or when DB is initializing
declare global {
  var __ambika_memory_products: any[] | undefined;
}

if (!globalThis.__ambika_memory_products) {
  globalThis.__ambika_memory_products = [...mockProducts];
}

let memoryProducts = globalThis.__ambika_memory_products;

export function getAdminMemoryProducts() {
  return globalThis.__ambika_memory_products || memoryProducts;
}

export function getAdminMemoryProduct(idOrSlug: string) {
  const list = globalThis.__ambika_memory_products || memoryProducts;
  return list.find((p: any) => p.id === idOrSlug || p.slug === idOrSlug);
}

export const findAdminMemoryProduct = getAdminMemoryProduct;

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function formatInr(paise: number): string {
  const rupees = Math.round(paise / 100);
  return `₹${rupees.toLocaleString('en-IN')}`;
}

/**
 * GET /api/admin/products
 * Fetch all products from catalog (supports ?category= and ?search=)
 */
export async function GET(request?: Request) {
  try {
    const isAuth = await verifyAdminAuth(request);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    const url = request ? new URL(request.url) : null;
    const category = url?.searchParams.get('category');
    const search = url?.searchParams.get('search');

    if (isSupabaseAdminConfigured && supabaseAdmin) {
      let query = supabaseAdmin
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (category && category !== 'All') {
        query = query.eq('category', category);
      }

      if (search && search.trim()) {
        query = query.ilike('name', `%${search.trim()}%`);
      }

      const { data: products, error } = await query;

      if (!error && products && products.length > 0) {
        return NextResponse.json({
          success: true,
          products
        });
      }
    }

    // Fallback to memory products
    let filtered = [...memoryProducts];
    if (category && category !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q));
    }

    return NextResponse.json({
      success: true,
      products: filtered
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    console.error('[ADMIN PRODUCTS GET EXCEPTION]', err);
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/products
 * Add a new product, or duplicate an existing one
 */
export async function POST(request: Request) {
  try {
    const isAuth = await verifyAdminAuth(request);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // ── Handle Duplicate Action ──
    if (body.action === 'duplicate' && body.id) {
      let original: any = null;
      if (isSupabaseAdminConfigured && supabaseAdmin) {
        const { data } = await supabaseAdmin.from('products').select('*').eq('id', body.id).maybeSingle();
        original = data;
      }
      if (!original) {
        original = memoryProducts.find(p => p.id === body.id);
      }

      if (!original) {
        return NextResponse.json(
          { success: false, message: `Product with ID ${body.id} not found.` },
          { status: 404 }
        );
      }

      const copyName = `${original.name} (Copy)`;
      const copySlug = `${slugify(copyName)}-${Math.random().toString(36).substring(2, 6)}`;
      const duplicated = {
        ...original,
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `prod_${Date.now()}`,
        name: copyName,
        slug: copySlug,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (isSupabaseAdminConfigured && supabaseAdmin) {
        const { error } = await supabaseAdmin.from('products').insert(duplicated);
        if (error) {
          console.warn('[ADMIN PRODUCT DUPLICATE WARN]', error);
        }
      }

      memoryProducts.unshift(duplicated);

      await recordAuditLog({
        action: 'PRODUCT_DUPLICATED',
        entityType: 'product',
        entityId: duplicated.id,
        newValues: { originalId: original.id, newName: duplicated.name, newSlug: duplicated.slug },
        request
      });

      return NextResponse.json({
        success: true,
        message: `Product duplicated as "${copyName}"`,
        product: duplicated
      });
    }

    // ── Standard Product Creation ──
    const {
      name,
      category,
      price,
      description,
      images,
      badges,
      metal_finishes,
      stock_status = 'in_stock',
      is_featured = false,
      collection = 'Heritage',
      craftsmanship_story = '',
      material,
      purity,
      bis_hallmark,
      is_hallmarked,
      huid,
      weight_grams,
      gross_weight_grams,
      dimensions,
      hsn_code = '7113',
      care_instructions,
      making_charge_type = 'percent',
      making_charge_rate = 8,
      stone_weight_grams = 0,
      stone_value_paise = 0,
      pricing_mode = 'fixed',
      size_variants
    } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Product name is required.' },
        { status: 400 }
      );
    }

    if (!category || typeof category !== 'string' || !category.trim()) {
      return NextResponse.json(
        { success: false, message: 'Product category is required.' },
        { status: 400 }
      );
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      return NextResponse.json(
        { success: false, message: 'A valid positive price is required.' },
        { status: 400 }
      );
    }

    const pricePaise = body.isPaise ? Math.round(numPrice) : Math.round(numPrice * 100);
    const displayPrice = formatInr(pricePaise);

    const baseSlug = slugify(name);
    const uniqueSuffix = Math.random().toString(36).substring(2, 6);
    const slug = `${baseSlug}-${uniqueSuffix}`;

    const newProduct: any = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `prod_${Date.now()}`,
      name: name.trim(),
      slug,
      description: (description || '').trim(),
      price: pricePaise,
      display_price: displayPrice,
      category: category.trim(),
      images: Array.isArray(images) && images.length > 0 ? images.filter(Boolean) : ['/hero-clean.png'],
      badges: Array.isArray(badges) ? badges.filter(Boolean) : ['22K BIS'],
      metal_finishes: Array.isArray(metal_finishes) && metal_finishes.length > 0 ? metal_finishes : ['Gold'],
      stock_status: ['in_stock', 'limited', 'out_of_stock'].includes(stock_status) ? stock_status : 'in_stock',
      is_featured: Boolean(is_featured),
      collection: (collection || 'Heritage').trim(),
      craftsmanship_story: (craftsmanship_story || '').trim(),
      material: material || `${purity || '22K'} Solid Gold (BIS Hallmarked)`,
      purity: purity || '22K (916 Purity)',
      bis_hallmark: bis_hallmark || 'BIS Hallmarked with unique 6-character HUID',
      is_hallmarked: is_hallmarked !== undefined ? Boolean(is_hallmarked) : true,
      huid: huid || '',
      weight_grams: weight_grams ? Number(weight_grams) : 10.0,
      gross_weight_grams: gross_weight_grams ? Number(gross_weight_grams) : (weight_grams ? Number(weight_grams) : 10.0),
      dimensions: dimensions || { length_cm: 3, breadth_cm: 2, height_cm: 1 },
      hsn_code: hsn_code || '7113',
      country_of_origin: 'India',
      seller_details: 'Ambika Jewels, Shop no.3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, J&K 180013',
      care_instructions: care_instructions || 'Store in provided velvet box away from direct perfumes.',
      making_charge_type,
      making_charge_rate: Number(making_charge_rate || 8),
      stone_weight_grams: Number(stone_weight_grams || 0),
      stone_value_paise: Number(stone_value_paise || 0),
      pricing_mode,
      size_variants: Array.isArray(size_variants) ? size_variants : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isSupabaseAdminConfigured && supabaseAdmin) {
      // First attempt full insert; if column error occurs, fallback to standard schema columns
      let insertResult = await supabaseAdmin.from('products').insert(newProduct).select('*').single();
      if (insertResult.error) {
        const standardProduct = {
          name: newProduct.name,
          slug: newProduct.slug,
          description: newProduct.description,
          price: newProduct.price,
          display_price: newProduct.display_price,
          category: newProduct.category,
          images: newProduct.images,
          badges: newProduct.badges,
          metal_finishes: newProduct.metal_finishes,
          stock_status: newProduct.stock_status,
          is_featured: newProduct.is_featured,
          collection: newProduct.collection,
          craftsmanship_story: newProduct.craftsmanship_story,
          created_at: newProduct.created_at,
          updated_at: newProduct.updated_at
        };
        insertResult = await supabaseAdmin.from('products').insert(standardProduct).select('*').single();
      }

      if (insertResult.data) {
        newProduct.id = insertResult.data.id;
      }
    }

    memoryProducts.unshift(newProduct);

    await recordAuditLog({
      action: 'PRODUCT_CREATED',
      entityType: 'product',
      entityId: newProduct.id,
      newValues: { name: newProduct.name, price: newProduct.price, category: newProduct.category },
      request
    });

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    console.error('[ADMIN PRODUCTS POST EXCEPTION]', err);
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/products
 * Update single product or perform bulk operations
 */
export async function PATCH(request: Request) {
  try {
    const isAuth = await verifyAdminAuth(request);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // ── Handle Bulk Update Action ──
    if (body.action === 'bulk_update') {
      const { product_ids, updates } = body;
      if (!Array.isArray(product_ids) || product_ids.length === 0) {
        return NextResponse.json(
          { success: false, message: 'product_ids array is required for bulk update.' },
          { status: 400 }
        );
      }

      const updatedList: any[] = [];

      for (const id of product_ids) {
        let current = memoryProducts.find(p => p.id === id);
        if (!current && isSupabaseAdminConfigured && supabaseAdmin) {
          const { data } = await supabaseAdmin.from('products').select('*').eq('id', id).maybeSingle();
          current = data;
        }

        if (current) {
          let newPrice = current.price;
          if (updates.pricePercentDelta !== undefined) {
            const factor = 1 + (Number(updates.pricePercentDelta) / 100);
            newPrice = Math.max(1000, Math.round(current.price * factor));
          } else if (updates.priceDeltaPaise !== undefined) {
            newPrice = Math.max(1000, current.price + Number(updates.priceDeltaPaise));
          }

          const cleanUpdates: Record<string, any> = {
            updated_at: new Date().toISOString()
          };

          if (updates.stock_status && ['in_stock', 'limited', 'out_of_stock'].includes(updates.stock_status)) {
            cleanUpdates.stock_status = updates.stock_status;
          }
          if (updates.category) {
            cleanUpdates.category = updates.category.trim();
          }
          if (newPrice !== current.price) {
            cleanUpdates.price = newPrice;
            cleanUpdates.display_price = formatInr(newPrice);
          }

          if (isSupabaseAdminConfigured && supabaseAdmin) {
            await supabaseAdmin.from('products').update(cleanUpdates).eq('id', id);
          }

          // Update memory
          const memIdx = memoryProducts.findIndex(p => p.id === id);
          if (memIdx >= 0) {
            memoryProducts[memIdx] = { ...memoryProducts[memIdx], ...cleanUpdates };
            updatedList.push(memoryProducts[memIdx]);
          } else {
            updatedList.push({ ...current, ...cleanUpdates });
          }
        }
      }

      await recordAuditLog({
        action: 'PRODUCT_BULK_UPDATED',
        entityType: 'product',
        newValues: { count: updatedList.length, updates },
        request
      });

      return NextResponse.json({
        success: true,
        message: `Successfully updated ${updatedList.length} products in bulk`,
        updatedCount: updatedList.length,
        products: updatedList
      });
    }

    // ── Single Product Update ──
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required.' },
        { status: 400 }
      );
    }

    // Capture old product snapshot for audit logging
    let oldProduct = memoryProducts.find(p => p.id === id);
    if (!oldProduct && isSupabaseAdminConfigured && supabaseAdmin) {
      const { data } = await supabaseAdmin.from('products').select('*').eq('id', id).maybeSingle();
      if (data) oldProduct = data;
    }

    const cleanUpdates: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    if (updates.name !== undefined) cleanUpdates.name = updates.name.trim();
    if (updates.category !== undefined) cleanUpdates.category = updates.category.trim();
    if (updates.description !== undefined) cleanUpdates.description = updates.description.trim();
    if (updates.collection !== undefined) cleanUpdates.collection = updates.collection.trim();
    if (updates.craftsmanship_story !== undefined) cleanUpdates.craftsmanship_story = updates.craftsmanship_story.trim();
    if (updates.stock_status !== undefined && ['in_stock', 'limited', 'out_of_stock'].includes(updates.stock_status)) {
      cleanUpdates.stock_status = updates.stock_status;
    }
    if (updates.is_featured !== undefined) cleanUpdates.is_featured = Boolean(updates.is_featured);
    if (Array.isArray(updates.images)) cleanUpdates.images = updates.images.filter(Boolean);
    if (Array.isArray(updates.badges)) cleanUpdates.badges = updates.badges.filter(Boolean);
    if (Array.isArray(updates.metal_finishes)) cleanUpdates.metal_finishes = updates.metal_finishes.filter(Boolean);

    // Jewelry details
    if (updates.material !== undefined) cleanUpdates.material = updates.material;
    if (updates.purity !== undefined) cleanUpdates.purity = updates.purity;
    if (updates.bis_hallmark !== undefined) cleanUpdates.bis_hallmark = updates.bis_hallmark;
    if (updates.is_hallmarked !== undefined) cleanUpdates.is_hallmarked = Boolean(updates.is_hallmarked);
    if (updates.huid !== undefined) cleanUpdates.huid = updates.huid;
    if (updates.weight_grams !== undefined) cleanUpdates.weight_grams = Number(updates.weight_grams);
    if (updates.gross_weight_grams !== undefined) cleanUpdates.gross_weight_grams = Number(updates.gross_weight_grams);
    if (updates.dimensions !== undefined) cleanUpdates.dimensions = updates.dimensions;
    if (updates.care_instructions !== undefined) cleanUpdates.care_instructions = updates.care_instructions;
    if (updates.making_charge_type !== undefined) cleanUpdates.making_charge_type = updates.making_charge_type;
    if (updates.making_charge_rate !== undefined) cleanUpdates.making_charge_rate = Number(updates.making_charge_rate);
    if (updates.stone_weight_grams !== undefined) cleanUpdates.stone_weight_grams = Number(updates.stone_weight_grams);
    if (updates.stone_value_paise !== undefined) cleanUpdates.stone_value_paise = Number(updates.stone_value_paise);
    if (updates.pricing_mode !== undefined) cleanUpdates.pricing_mode = updates.pricing_mode;

    if (updates.price !== undefined) {
      const numPrice = Number(updates.price);
      if (!isNaN(numPrice) && numPrice > 0) {
        const pricePaise = updates.isPaise ? Math.round(numPrice) : Math.round(numPrice * 100);
        cleanUpdates.price = pricePaise;
        cleanUpdates.display_price = formatInr(pricePaise);
      }
    }

    let updatedProduct: any = null;

    if (isSupabaseAdminConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('products')
        .update(cleanUpdates)
        .eq('id', id)
        .select('*')
        .maybeSingle();

      if (!error && data) {
        updatedProduct = data;
      } else {
        // Fallback retry with basic columns only if schema has not migrated extra columns
        const basicColumns = {
          name: cleanUpdates.name,
          category: cleanUpdates.category,
          description: cleanUpdates.description,
          collection: cleanUpdates.collection,
          craftsmanship_story: cleanUpdates.craftsmanship_story,
          stock_status: cleanUpdates.stock_status,
          is_featured: cleanUpdates.is_featured,
          images: cleanUpdates.images,
          badges: cleanUpdates.badges,
          metal_finishes: cleanUpdates.metal_finishes,
          price: cleanUpdates.price,
          display_price: cleanUpdates.display_price,
          updated_at: cleanUpdates.updated_at
        };
        const cleanedBasic = Object.fromEntries(Object.entries(basicColumns).filter(([_, v]) => v !== undefined));
        const retry = await supabaseAdmin.from('products').update(cleanedBasic).eq('id', id).select('*').maybeSingle();
        if (retry.data) updatedProduct = retry.data;
      }
    }

    // Update memory
    const memIdx = memoryProducts.findIndex(p => p.id === id);
    if (memIdx >= 0) {
      memoryProducts[memIdx] = { ...memoryProducts[memIdx], ...cleanUpdates };
      if (!updatedProduct) updatedProduct = memoryProducts[memIdx];
    }

    const isPriceChanged = cleanUpdates.price !== undefined && oldProduct && cleanUpdates.price !== oldProduct.price;

    await recordAuditLog({
      action: isPriceChanged ? 'PRODUCT_PRICE_CHANGED' : 'PRODUCT_UPDATED',
      entityType: 'product',
      entityId: id,
      oldValues: oldProduct ? { price: oldProduct.price, display_price: oldProduct.display_price, name: oldProduct.name } : null,
      newValues: cleanUpdates,
      request
    });

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct || { id, ...cleanUpdates }
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    console.error('[ADMIN PRODUCTS PATCH EXCEPTION]', err);
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/products
 * Supports:
 * - ?id=<id> or { id: "<id>" } -> Delete single product
 * - { ids: ["id1", "id2", ...] } -> Bulk delete selected products
 * - ?all=true or { all: true } -> Delete all products
 */
export async function DELETE(request: Request) {
  try {
    const isAuth = await verifyAdminAuth(request);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    let id: string | null = null;
    let ids: string[] | null = null;
    let deleteAll = false;

    const url = new URL(request.url);
    id = url.searchParams.get('id');
    if (url.searchParams.get('all') === 'true') {
      deleteAll = true;
    }

    try {
      const body = await request.json();
      if (body) {
        if (body.id) id = body.id;
        if (Array.isArray(body.ids)) ids = body.ids;
        if (Array.isArray(body.product_ids)) ids = body.product_ids;
        if (body.all === true || body.action === 'delete_all') deleteAll = true;
      }
    } catch {
      // Query param fallback
    }

    // ── 1. Delete All Products ──
    if (deleteAll) {
      if (isSupabaseAdminConfigured && supabaseAdmin) {
        await supabaseAdmin.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      }

      const totalDeleted = (globalThis.__ambika_memory_products || memoryProducts).length;
      globalThis.__ambika_memory_products = [];
      memoryProducts = [];

      await recordAuditLog({
        action: 'ALL_PRODUCTS_DELETED',
        entityType: 'product',
        newValues: { count: totalDeleted },
        request
      });

      return NextResponse.json({
        success: true,
        message: 'All jewellery pieces deleted successfully',
        deletedCount: totalDeleted
      });
    }

    // ── 2. Bulk Delete Selected Products ──
    if (Array.isArray(ids) && ids.length > 0) {
      if (isSupabaseAdminConfigured && supabaseAdmin) {
        await supabaseAdmin.from('products').delete().in('id', ids);
      }

      if (globalThis.__ambika_memory_products) {
        globalThis.__ambika_memory_products = globalThis.__ambika_memory_products.filter(
          p => !ids!.includes(p.id)
        );
        memoryProducts = globalThis.__ambika_memory_products;
      } else {
        memoryProducts = memoryProducts.filter(p => !ids!.includes(p.id));
      }

      await recordAuditLog({
        action: 'PRODUCTS_BULK_DELETED',
        entityType: 'product',
        newValues: { ids, count: ids.length },
        request
      });

      return NextResponse.json({
        success: true,
        message: `Successfully deleted ${ids.length} selected pieces`,
        deletedCount: ids.length,
        ids
      });
    }

    // ── 3. Single Product Delete ──
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Product ID or IDs array is required for deletion.' },
        { status: 400 }
      );
    }

    if (isSupabaseAdminConfigured && supabaseAdmin) {
      await supabaseAdmin.from('products').delete().eq('id', id);
    }

    if (globalThis.__ambika_memory_products) {
      globalThis.__ambika_memory_products = globalThis.__ambika_memory_products.filter(p => p.id !== id);
      memoryProducts = globalThis.__ambika_memory_products;
    } else {
      memoryProducts = memoryProducts.filter(p => p.id !== id);
    }

    await recordAuditLog({
      action: 'PRODUCT_DELETED',
      entityType: 'product',
      entityId: id,
      request
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      id
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    console.error('[ADMIN PRODUCTS DELETE EXCEPTION]', err);
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 }
    );
  }
}
