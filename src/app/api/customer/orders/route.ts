import { NextResponse } from 'next/server';
import { verifyCustomerAuth } from '@/lib/customerAuth';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await verifyCustomerAuth(request);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Customer session required.' },
        { status: 401 }
      );
    }

    if (!isSupabaseAdminConfigured || !supabaseAdmin) {
      return NextResponse.json({
        success: true,
        orders: []
      });
    }

    // Query orders matching either the customer's email or phone number in any standard format
    const orConditions: string[] = [];

    if (session.email) {
      orConditions.push(`customer_email.eq.${session.email.toLowerCase().trim()}`);
    }

    if (session.phone) {
      const cleanPhone = session.phone.replace(/\D/g, '').slice(-10);
      if (cleanPhone) {
        orConditions.push(`customer_phone.eq.${cleanPhone}`);
        orConditions.push(`customer_phone.eq.+91${cleanPhone}`);
        orConditions.push(`customer_phone.eq.91${cleanPhone}`);
      }
      if (session.phone !== cleanPhone && session.phone !== `+91${cleanPhone}`) {
        orConditions.push(`customer_phone.eq.${session.phone}`);
      }
    }

    if (orConditions.length === 0) {
      return NextResponse.json({ success: true, orders: [] });
    }

    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .or(orConditions.join(','))
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[CUSTOMER ORDERS QUERY ERROR]', error);
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
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

