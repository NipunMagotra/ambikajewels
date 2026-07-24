import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { siteConfig } from '@/config/siteConfig';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer_name, customer_phone, customer_email, shipping_address, items, notes } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const subtotal = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * siteConfig.tax.gstRate);
    const isFreeShipping = subtotal >= siteConfig.shipping.freeThreshold;
    const shipping = isFreeShipping ? 0 : siteConfig.shipping.flatRate;
    const total = subtotal + tax + shipping;

    const orderNumber = `AMB-${Math.floor(100000 + Math.random() * 900000)}`;

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name,
        customer_phone,
        customer_email: customer_email || '',
        shipping_address,
        items,
        subtotal,
        tax,
        shipping,
        total,
        status: 'pending_confirmation',
        payment_method: 'whatsapp_pending',
        notes: notes || ''
      })
      .select()
      .single();

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

    // In a real implementation with Razorpay:
    // 1. Create a Razorpay order ID here
    // 2. Return the Razorpay order ID along with our internal DB order ID
    // 3. Update the internal order with the Razorpay order ID

    return NextResponse.json({ order });
  } catch (err) {
    console.error('API Orders error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
