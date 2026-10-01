import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { checkRateLimit } from '@/lib/rateLimit';
import { calculateOrderPricingServer } from '@/lib/serverPricing';
import { verifyBullionRateFreshness } from '@/app/api/admin/rates/route';
import { isSupabaseConfigured } from '@/lib/supabase';
import { siteConfig } from '@/config/siteConfig';

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // 1. Shared Upstash Redis Rate Limiting (10 requests per 5 minutes)
    const rateCheck = await checkRateLimit('createOrder', ip);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Too many order requests. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    // 2. Stale Bullion Rate Guard (Blocks checkout if daily rates are outdated)
    if (isSupabaseConfigured) {
      const rateFreshness = await verifyBullionRateFreshness();
      if (!rateFreshness.isFresh) {
        return NextResponse.json(
          {
            success: false,
            error: `Store gold rates are outdated (${rateFreshness.ageHours} hours old; maximum allowed: ${siteConfig.rates.maxRateAgeHours}h). Please contact the showroom at +91 9682589725 to confirm today's live rate before checkout.`
          },
          { status: 400 }
        );
      }
    }

    const body = await request.json().catch(() => ({}));
    const { items, notes } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order must contain at least one item.' },
        { status: 400 }
      );
    }

    // 3. Authoritative Server-Side Price Verification (Rejects Unknown Products, Enforces Integer Qty >= 1)
    let validatedPricing;
    try {
      validatedPricing = await calculateOrderPricingServer(items);
    } catch (pricingErr: unknown) {
      const errMsg = pricingErr instanceof Error ? pricingErr.message : 'Price calculation failed.';
      console.warn(`[SECURITY ALERT] Invalid order rejected from IP ${ip}: ${errMsg}`);
      return NextResponse.json(
        { success: false, error: errMsg },
        { status: 400 }
      );
    }

    const validatedAmount = validatedPricing.total_paise;

    // 3. Sanitize notes: Never store raw customer PAN or sensitive auth data in payment gateway notes
    const sanitizedNotes: Record<string, string> = {
      store: 'Ambika Jewels Checkout',
      item_count: String(validatedPricing.items.length),
      ...(notes || {})
    };
    delete sanitizedNotes.pan_number;

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    // Graceful fallback for local development testing only; fails loudly in production
    if (!key_id || !key_secret) {
      if (process.env.NODE_ENV === 'production') {
        console.error('[SECURITY FATAL] Razorpay API keys (NEXT_PUBLIC_RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET) missing in production.');
        return NextResponse.json(
          { success: false, error: 'Server misconfiguration: Payment gateway keys not configured.' },
          { status: 500 }
        );
      }
      console.warn('Razorpay API keys missing in environment variables. Generating mock order ID for testing.');
      return NextResponse.json({
        success: true,
        order_id: `order_mock_${Date.now()}`,
        amount: validatedAmount,
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
      amount: validatedAmount, // in paise (e.g. 5000000 = ₹50,000)
      currency: 'INR',
      receipt,
      notes: sanitizedNotes
    };

    const order = await razorpay.orders.create(orderOptions);

    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: key_id
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to create Razorpay order';
    console.error('Razorpay Create Order Error:', error);
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
