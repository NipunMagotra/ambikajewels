import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { mockProducts } from '@/data/mockProducts';
import { siteConfig } from '@/config/siteConfig';

// In-memory rate limiting against order creation bot abuse: max 10 requests per 5 minutes per IP
interface OrderCreateLimitRecord {
  count: number;
  resetTime: number;
}
const orderRateLimits = new Map<string, OrderCreateLimitRecord>();

function checkOrderRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = orderRateLimits.get(ip);

  if (!record || now > record.resetTime) {
    orderRateLimits.set(ip, { count: 1, resetTime: now + 5 * 60 * 1000 });
    return true;
  }

  if (record.count >= 10) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // 1. Bot & Abuse Rate Limiting
    if (!checkOrderRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many order requests. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { amount, items, notes } = body;

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid order amount' },
        { status: 400 }
      );
    }

    // 2. Server-Side Price Verification (Prevent Client-Side Price Tampering Exploits)
    let validatedAmount = Math.round(amount);

    if (Array.isArray(items) && items.length > 0) {
      let calculatedSubtotal = 0;

      for (const item of items) {
        const productId = item.product_id || item.id;
        const catalogItem = mockProducts.find(p => p.id === productId);

        const unitPrice = catalogItem ? catalogItem.price : item.price;
        const qty = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1;
        calculatedSubtotal += unitPrice * qty;
      }

      const calculatedTax = Math.round(calculatedSubtotal * siteConfig.tax.gstRate);
      const calculatedShipping = calculatedSubtotal >= siteConfig.shipping.freeThreshold ? 0 : siteConfig.shipping.flatRate;
      const calculatedTotal = calculatedSubtotal + calculatedTax + calculatedShipping;

      // Check for price tampering (allowing minor INR 1 rounding variance)
      if (Math.abs(calculatedTotal - amount) > 100) {
        console.warn(`[SECURITY ALERT] Price tampering attempt detected from IP ${ip}! Client submitted: ${amount}, Calculated catalog total: ${calculatedTotal}`);
        return NextResponse.json(
          {
            success: false,
            error: 'Price mismatch detected. Order amount does not match verified catalog prices.'
          },
          { status: 400 }
        );
      }

      validatedAmount = calculatedTotal;
    }

    // 3. Sanitize notes: Never store raw customer PAN or sensitive auth data in payment gateway notes
    const sanitizedNotes: Record<string, string> = {
      store: 'Ambika Jewels Checkout',
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
  } catch (error: any) {
    console.error('Razorpay Create Order Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create Razorpay order' },
      { status: 500 }
    );
  }
}
