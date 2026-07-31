import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { pgoldStore } from '@/lib/pgoldStore';

const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

const isRazorpayConfigured = Boolean(
  keyId && keySecret && !keyId.includes('your_key_id')
);

export async function POST(request: Request) {
  try {
    const settings = await pgoldStore.getSettings();

    if (!settings.is_enabled) {
      return NextResponse.json(
        { success: false, message: 'P-Gold purchases are currently paused by administration.' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { customer_name, customer_phone, customer_email, amount_inr, weight_grams, purity = '24K' } = body;

    // Validate inputs
    if (!customer_name || !customer_name.trim()) {
      return NextResponse.json({ success: false, message: 'Customer name is required' }, { status: 400 });
    }
    if (!customer_phone || !customer_phone.trim() || customer_phone.trim().length < 10) {
      return NextResponse.json({ success: false, message: 'Valid 10-digit mobile number is required' }, { status: 400 });
    }

    const numAmount = Number(amount_inr);
    if (isNaN(numAmount) || numAmount < settings.min_purchase_amount) {
      return NextResponse.json({
        success: false,
        message: `Minimum purchase amount is ₹${settings.min_purchase_amount.toLocaleString('en-IN')}`
      }, { status: 400 });
    }

    if (numAmount > settings.max_purchase_amount) {
      return NextResponse.json({
        success: false,
        message: `Maximum purchase amount is ₹${settings.max_purchase_amount.toLocaleString('en-IN')}`
      }, { status: 400 });
    }

    const currentRate = purity === '22K' ? settings.price_per_gram_22k : settings.price_per_gram_24k;
    const numWeight = Number(weight_grams) || (numAmount / currentRate);

    // Create database transaction log
    const transaction = await pgoldStore.createTransaction({
      customer_name: customer_name.trim(),
      customer_phone: customer_phone.trim(),
      customer_email: customer_email?.trim() || '',
      amount_inr: numAmount,
      weight_grams: Number(numWeight.toFixed(4)),
      gold_rate_per_gram: currentRate,
      purity,
      payment_method: 'razorpay'
    });

    // If Razorpay API credentials are standard/configured, initialize Razorpay order
    let razorpayOrderId = `order_pgold_demo_${Date.now()}`;
    
    if (isRazorpayConfigured) {
      try {
        const razorpay = new Razorpay({
          key_id: keyId,
          key_secret: keySecret
        });

        const amountInPaise = Math.round(numAmount * 100);
        const order = await razorpay.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: transaction.transaction_number,
          notes: {
            customer_name: customer_name.trim(),
            customer_phone: customer_phone.trim(),
            purity,
            weight_grams: numWeight.toFixed(4)
          }
        });
        razorpayOrderId = order.id;
      } catch (rzpErr) {
        console.warn('Razorpay order creation fallback to simulated order ID:', rzpErr);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        transaction_id: transaction.id,
        transaction_number: transaction.transaction_number,
        razorpay_order_id: razorpayOrderId,
        razorpay_key_id: keyId,
        amount_inr: numAmount,
        weight_grams: Number(numWeight.toFixed(4)),
        gold_rate_per_gram: currentRate,
        purity,
        is_demo: !isRazorpayConfigured
      }
    });
  } catch (error) {
    console.error('Error creating P-Gold order:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error creating order' },
      { status: 500 }
    );
  }
}
