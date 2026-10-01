import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';
import { checkRateLimit } from '@/lib/rateLimit';
import { calculateOrderPricingServer } from '@/lib/serverPricing';

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // 1. Shared Upstash Redis Rate Limiting (10 requests per 10 minutes)
    const rateCheck = await checkRateLimit('orders', ip);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many order requests. Please wait a few minutes before submitting another order.' },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { customer_name, customer_phone, customer_email, shipping_address, items, notes } = body;

    if (!customer_name || typeof customer_name !== 'string' || !customer_phone || typeof customer_phone !== 'string') {
      return NextResponse.json({ error: 'Customer name and phone number are required' }, { status: 400 });
    }

    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
      return NextResponse.json({ error: 'Cart must contain between 1 and 50 items' }, { status: 400 });
    }

    // 2. Authoritative Server-Side Price Verification (Rejects Unknown Products, Enforces Integer Qty >= 1)
    let validatedPricing;
    try {
      validatedPricing = await calculateOrderPricingServer(items);
    } catch (pricingErr: unknown) {
      const errMsg = pricingErr instanceof Error ? pricingErr.message : 'Invalid order items.';
      console.warn(`[SECURITY ALERT] Invalid order rejected in /api/orders from IP ${ip}: ${errMsg}`);
      return NextResponse.json({ error: errMsg }, { status: 400 });
    }

    const orderNumber = `AMB-${Math.floor(100000 + Math.random() * 900000)}`;
    const dbClient = isSupabaseAdminConfigured ? supabaseAdmin : (isSupabaseConfigured ? supabase : null);

    let order = null;
    let error = null;

    if (dbClient) {
      const res = await dbClient
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: customer_name.trim().slice(0, 100),
          customer_phone: customer_phone.trim().slice(0, 20),
          customer_email: customer_email ? customer_email.trim().slice(0, 100) : '',
          shipping_address: shipping_address ? String(shipping_address).slice(0, 300) : '',
          items: validatedPricing.items,
          subtotal: validatedPricing.subtotal_paise,
          tax: validatedPricing.tax_paise,
          shipping: validatedPricing.shipping_paise,
          total: validatedPricing.total_paise,
          status: 'pending_confirmation',
          payment_method: 'whatsapp_pending',
          notes: notes ? String(notes).slice(0, 300) : ''
        })
        .select()
        .single();
      order = res.data;
      error = res.error;
    }

    if (error) {
      console.warn('Supabase DB error (using fallback local order):', error);
      return NextResponse.json({ 
        order: {
          order_number: orderNumber,
          customer_name,
          customer_phone,
          customer_email,
          shipping_address,
          total: validatedPricing.total_paise,
          status: 'pending_confirmation'
        } 
      });
    }

    return NextResponse.json({ order });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error';
    console.error('API Orders error:', err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
