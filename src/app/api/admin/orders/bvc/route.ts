import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';

/**
 * GET /api/admin/orders/bvc
 *
 * Authenticated admin endpoint that returns all orders shipped via BVC Logistics.
 * Requires a valid admin session cookie (HMAC-signed, 12-hour expiry).
 *
 * Query parameters:
 *   ?status=pending|booked|in_transit|delivered|failed|exception
 *   ?limit=50  (default 50, max 200)
 *   ?offset=0  (for pagination)
 */
export async function GET(request: Request) {
  try {
    // ── 1. Admin Authentication ──────────────────────────────────────────
    const isAuthed = await verifyAdminAuth();
    if (!isAuthed) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in to the admin panel.' },
        { status: 401 }
      );
    }

    // ── 2. Database Client Check ─────────────────────────────────────────
    if (!isSupabaseAdminConfigured || !supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: 'Database service is not configured.' },
        { status: 500 }
      );
    }

    // ── 3. Parse Query Parameters ────────────────────────────────────────
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status')?.trim() || '';
    const limitParam = Math.min(Math.max(parseInt(searchParams.get('limit') || '50', 10) || 50, 1), 200);
    const offsetParam = Math.max(parseInt(searchParams.get('offset') || '0', 10) || 0, 0);

    // ── 4. Query BVC Orders ──────────────────────────────────────────────
    let query = supabaseAdmin
      .from('orders')
      .select(
        `id,
         order_number,
         customer_name,
         customer_phone,
         customer_email,
         shipping_address,
         pincode,
         total,
         subtotal,
         tax,
         shipping,
         status,
         payment_status,
         payment_method,
         razorpay_order_id,
         razorpay_payment_id,
         shipping_provider,
         tracking_awb,
         bvc_docket_number,
         bvc_shipment_id,
         bvc_status,
         bvc_security_bag_number,
         bvc_insurance_fee,
         bvc_freight_fee,
         items,
         notes,
         created_at,
         updated_at`,
        { count: 'exact' }
      )
      .eq('shipping_provider', 'bvc')
      .order('created_at', { ascending: false })
      .range(offsetParam, offsetParam + limitParam - 1);

    // Optional: filter by BVC shipment status
    if (statusFilter) {
      query = query.eq('bvc_status', statusFilter);
    }

    const { data: orders, error: queryError, count } = await query;

    if (queryError) {
      console.error('[ADMIN BVC ORDERS] Query failed:', queryError.message);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch BVC orders.' },
        { status: 500 }
      );
    }

    // ── 5. Response ──────────────────────────────────────────────────────
    return NextResponse.json({
      success: true,
      orders: orders || [],
      total_count: count ?? 0,
      limit: limitParam,
      offset: offsetParam
    });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to retrieve BVC orders';
    console.error('[ADMIN BVC ORDERS] Exception:', error);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
