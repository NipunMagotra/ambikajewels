import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';
import { siteConfig } from '@/config/siteConfig';
import { checkRateLimit } from '@/lib/rateLimit';

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

    const body = await request.json();
    const { customer_name, customer_phone, customer_email, shipping_address, items, notes } = body;

    if (!customer_name || typeof customer_name !== 'string' || !customer_phone || typeof customer_phone !== 'string') {
      return NextResponse.json({ error: 'Customer name and phone number are required' }, { status: 400 });
    }

    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
      return NextResponse.json({ error: 'Cart must contain between 1 and 50 items' }, { status: 400 });
    }

    const subtotal = items.reduce((acc: number, item: any) => {
      const price = typeof item.price === 'number' && item.price > 0 ? item.price : 0;
      const qty = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;
      return acc + price * qty;
    }, 0);

    const tax = Math.round(subtotal * siteConfig.tax.gstRate);
    const isFreeShipping = subtotal >= siteConfig.shipping.freeThreshold;
    const shipping = isFreeShipping ? 0 : siteConfig.shipping.flatRate;
    const total = subtotal + tax + shipping;

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
          items,
          subtotal,
          tax,
          shipping,
          total,
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
          total,
          status: 'pending_confirmation'
        } 
      });
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error('API Orders error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
