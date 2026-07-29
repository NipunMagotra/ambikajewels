import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
  try {
    const { amount, notes } = await request.json();

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid order amount' },
        { status: 400 }
      );
    }

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    // Graceful fallback for development testing if keys aren't set in environment yet
    if (!key_id || !key_secret) {
      console.warn('Razorpay API keys missing in environment variables. Generating mock order ID for testing.');
      return NextResponse.json({
        success: true,
        order_id: `order_mock_${Date.now()}`,
        amount: Math.round(amount),
        currency: 'INR',
        key: key_id || 'rzp_test_mock_key',
        is_mock: true
      });
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret
    });

    const receipt = `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const orderOptions = {
      amount: Math.round(amount), // in paise (e.g. 5000000 = ₹50,000)
      currency: 'INR',
      receipt,
      notes: notes || { store: 'Ambika Jewels Guest Checkout' }
    };

    const order = await razorpay.orders.create(orderOptions);

    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: key_id
    });
  } catch (error: any) {
    console.error('Razorpay Create Order Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create Razorpay order' },
      { status: 500 }
    );
  }
}
