import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { pgoldStore } from '@/lib/pgoldStore';

const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      transaction_id,
      is_demo
    } = body;

    if (is_demo) {
      return NextResponse.json({
        success: true,
        message: 'Demo transaction verified successfully! (Future payment mode)',
        data: {
          transaction_id,
          payment_id: `pay_demo_${Date.now()}`,
          status: 'completed'
        }
      });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: 'Missing Razorpay verification parameters' },
        { status: 400 }
      );
    }

    // Verify HMAC-SHA256 signature
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: 'Invalid payment signature verification failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'P-Gold payment verified successfully!',
      data: {
        transaction_id,
        payment_id: razorpay_payment_id,
        status: 'completed'
      }
    });
  } catch (error) {
    console.error('Error verifying P-Gold payment:', error);
    return NextResponse.json(
      { success: false, message: 'Payment verification error' },
      { status: 500 }
    );
  }
}
