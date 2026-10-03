import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const isAuth = await verifyAdminAuth();
    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    if (!isSupabaseAdminConfigured || !supabaseAdmin) {
      return NextResponse.json({
        success: true,
        orders: [],
        notice: 'Supabase admin is not yet fully configured. Showing empty orders.'
      });
    }

    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[ADMIN ORDERS API ERROR]', error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orders: orders || []
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    console.error('[ADMIN ORDERS API EXCEPTION]', err);
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const isAuth = await verifyAdminAuth();
    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, status, bvc_docket_number, shiprocket_awb, notes } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required.' },
        { status: 400 }
      );
    }

    if (!isSupabaseAdminConfigured || !supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: 'Supabase admin client is not available.' },
        { status: 500 }
      );
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    if (status !== undefined) updates.status = status;
    if (bvc_docket_number !== undefined) updates.bvc_docket_number = bvc_docket_number;
    if (shiprocket_awb !== undefined) updates.shiprocket_awb = shiprocket_awb;
    if (notes !== undefined) updates.notes = notes;

    const { data: updatedOrder, error } = await supabaseAdmin
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[ADMIN ORDER UPDATE ERROR]', error);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    console.error('[ADMIN ORDER UPDATE EXCEPTION]', err);
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 }
    );
  }
}
