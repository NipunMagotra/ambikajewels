import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';
import { formatInr } from '@/lib/pricingEngine';

export const dynamic = 'force-dynamic';

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

/**
 * GET /api/admin/products
 * Fetch all products from the catalog (supports ?category= and ?search=)
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

    if (!isSupabaseAdminConfigured || !supabaseAdmin) {
      return NextResponse.json({
        success: true,
        products: [],
        notice: 'Supabase admin is not yet configured.'
      });
    }

    const url = request ? new URL(request.url) : null;
    const category = url?.searchParams.get('category');
    const search = url?.searchParams.get('search');

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

    if (error) {
      console.error('[ADMIN PRODUCTS GET ERROR]', error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      products: products || []
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
 * Add a new product to the catalog
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

    if (!isSupabaseAdminConfigured || !supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: 'Supabase admin client is not available.' },
        { status: 500 }
      );
    }

    const body = await request.json();
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
      craftsmanship_story = ''
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

    // Price handling: Expect positive number
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      return NextResponse.json(
        { success: false, message: 'A valid positive price is required.' },
        { status: 400 }
      );
    }

    // Convert price to paise if provided in rupees (heuristic: if user entered 95000, it's 9500000 paise)
    // If input already exceeds 10,000,000 or has flag, handle cleanly
    const pricePaise = body.isPaise ? Math.round(numPrice) : Math.round(numPrice * 100);
    const displayPrice = formatInr(pricePaise);

    // Generate unique slug
    const baseSlug = slugify(name);
    const uniqueSuffix = Math.random().toString(36).substring(2, 6);
    const slug = `${baseSlug}-${uniqueSuffix}`;

    const newProduct = {
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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: inserted, error } = await supabaseAdmin
      .from('products')
      .insert(newProduct)
      .select('*')
      .single();

    if (error) {
      console.error('[ADMIN PRODUCTS INSERT ERROR]', error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product: inserted
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
 * Update an existing product by id
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

    if (!isSupabaseAdminConfigured || !supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: 'Supabase admin client is not available.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required.' },
        { status: 400 }
      );
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

    if (updates.price !== undefined) {
      const numPrice = Number(updates.price);
      if (!isNaN(numPrice) && numPrice > 0) {
        const pricePaise = updates.isPaise ? Math.round(numPrice) : Math.round(numPrice * 100);
        cleanUpdates.price = pricePaise;
        cleanUpdates.display_price = formatInr(pricePaise);
      }
    }

    const { data: updated, error } = await supabaseAdmin
      .from('products')
      .update(cleanUpdates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('[ADMIN PRODUCTS UPDATE ERROR]', error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: updated
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
 * Delete a product by id (from body or query param)
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

    if (!isSupabaseAdminConfigured || !supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: 'Supabase admin client is not available.' },
        { status: 500 }
      );
    }

    let id: string | null = null;
    const url = new URL(request.url);
    id = url.searchParams.get('id');

    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch {
        // query param is fine
      }
    }

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required for deletion.' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[ADMIN PRODUCTS DELETE ERROR]', error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

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
