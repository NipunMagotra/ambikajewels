import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { checkRateLimit } from '@/lib/rateLimit';
import { calculateOrderPricingServer } from '@/lib/serverPricing';
import { verifyBullionRateFreshness } from '@/app/api/admin/rates/route';
import { isSupabaseConfigured } from '@/lib/supabase';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';
import { siteConfig } from '@/config/siteConfig';
import { verifyRateLockToken } from '@/lib/rateLock';
import { generateSecureOrderNumber } from '@/lib/orderUtils';
import { encryptSensitiveData } from '@/lib/encryption';

interface CustomerInfo {
  first_name: string;
  last_name?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  pan_number?: string;
  notes?: string;
}

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

    const body = await request.json().catch(() => ({}));
    const { items, notes, rate_lock_token, customer_info, rate_timestamp } = body as {
      items: Array<{ id?: string; product_id?: string; quantity?: unknown }>;
      notes?: Record<string, string>;
      rate_lock_token?: string;
      customer_info?: CustomerInfo;
      rate_timestamp?: string | number;
    };

    // 2. Server-Side Rate-Lock Verification (F3: Guarantees price against stale rates via signed token)
    if (rate_lock_token) {
      const lockVerification = verifyRateLockToken(rate_lock_token);
      if (!lockVerification.valid) {
        return NextResponse.json(
          {
            success: false,
            error: lockVerification.expired
              ? 'Your 15-minute price rate-lock window has expired. Please refresh rates before submitting payment.'
              : (lockVerification.error || 'Invalid or forged rate-lock token. Please refresh checkout.')
          },
          { status: 400 }
        );
      }
    }

    // 3. Stale Bullion Rate Guard (F8: Configurable, friendly customer message)
    if (isSupabaseConfigured) {
      const rateFreshness = await verifyBullionRateFreshness();
      if (!rateFreshness.isFresh) {
        return NextResponse.json(
          {
            success: false,
            error: siteConfig.rates.staleRateCustomerMessage || `Daily bullion rates are being refreshed by our Jammu showroom. Please contact us at +91 9682589725 to confirm today's live rate before checkout.`
          },
          { status: 400 }
        );
      }
    }

    // 4. Gold Rate TTL — Reject checkout if cart was priced on a stale/different IST date
    //    or if showroom updated live rates after the cart was stamped.
    //    Skipped when rate_timestamp is absent (fixed-price items like
    //    925 Silver accessories, or legacy clients without rate awareness).
    if (rate_timestamp) {
      let cartRateTime: number;
      if (typeof rate_timestamp === 'number') {
        // Handle both 10-digit unix seconds and 13-digit milliseconds
        cartRateTime = rate_timestamp < 10000000000 ? rate_timestamp * 1000 : rate_timestamp;
      } else {
        cartRateTime = new Date(rate_timestamp).getTime();
      }

      if (isNaN(cartRateTime)) {
        return NextResponse.json(
          { success: false, error: 'Invalid rate_timestamp format. Please refresh your cart.' },
          { status: 400 }
        );
      }

      const MAX_RATE_AGE_MS = (siteConfig.rates.maxRateAgeHours ?? 24) * 60 * 60 * 1000;
      const ageMs = Date.now() - cartRateTime;

      // Hard TTL: reject if the rate snapshot is older than maxRateAgeHours (default 24h)
      if (ageMs > MAX_RATE_AGE_MS) {
        return NextResponse.json(
          {
            success: false,
            error: 'Gold prices have updated. Please refresh your cart to see the latest prices.',
            code: 'RATE_EXPIRED'
          },
          { status: 409 }
        );
      }

      // IST day-boundary check: ensure cart rate is from today's IST date.
      // Gold rates in India change each morning, so a cart priced at 11:55 PM IST
      // yesterday is stale by 10 AM today even if it's within 24 hours.
      const toISTDateString = (ms: number) => {
        const d = new Date(ms);
        // IST = UTC+5:30 → add 5.5 hours in ms
        const istMs = d.getTime() + (5.5 * 60 * 60 * 1000);
        const ist = new Date(istMs);
        return ist.toISOString().slice(0, 10); // 'YYYY-MM-DD'
      };

      const cartDateIST = toISTDateString(cartRateTime);
      const todayDateIST = toISTDateString(Date.now());

      if (cartDateIST !== todayDateIST) {
        return NextResponse.json(
          {
            success: false,
            error: `Gold prices have updated since ${cartDateIST}. Please refresh your cart to see today's rates.`,
            code: 'RATE_DAY_MISMATCH',
            cart_rate_date: cartDateIST,
            server_date: todayDateIST
          },
          { status: 409 }
        );
      }

      // Live showroom rate check: If daily rates were updated in Supabase
      // after the cart rate was captured (with 30-second clock skew tolerance)
      if (isSupabaseConfigured) {
        try {
          const rateFreshness = await verifyBullionRateFreshness();
          if (rateFreshness.latestRate?.updated_at) {
            const dbRateTime = new Date(rateFreshness.latestRate.updated_at).getTime();
            if (cartRateTime < (dbRateTime - 30000)) {
              return NextResponse.json(
                {
                  success: false,
                  error: 'Gold prices have been updated by our showroom. Please refresh your cart to see the latest rates.',
                  code: 'RATE_UPDATED',
                  updated_at: rateFreshness.latestRate.updated_at
                },
                { status: 409 }
              );
            }
          }
        } catch (liveRateErr) {
          console.warn('[GOLD RATE TTL] Live rate freshness comparison skipped:', liveRateErr);
        }
      }
    }

    // 5. Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order must contain at least one item.' },
        { status: 400 }
      );
    }

    // 6. Validate customer_info is present (required for pre-insertion)
    if (!customer_info || !customer_info.first_name || !customer_info.phone || !customer_info.email) {
      return NextResponse.json(
        { success: false, error: 'Customer information (name, phone, email) is required to initiate an order.' },
        { status: 400 }
      );
    }

    // 7. Authoritative Server-Side Price Verification (Rejects Unknown Products, Enforces Integer Qty >= 1)
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

    // 8. CBDT Rule 114B — Mandatory PAN for jewelry purchases exceeding ₹2,00,000
    //    Threshold is config-driven via siteConfig.compliance.panRequirementThresholdInr (in INR).
    //    This gate fires BEFORE any DB insert or Razorpay call to avoid orphaned records.
    const panThresholdPaise = siteConfig.compliance.panRequirementThresholdInr * 100;
    if (validatedAmount > panThresholdPaise) {
      const rawPan = (customer_info.pan_number || '').trim().toUpperCase();
      const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

      if (!rawPan) {
        return NextResponse.json(
          {
            success: false,
            error: `PAN card is mandatory for purchases over ₹${siteConfig.compliance.panRequirementThresholdInr.toLocaleString('en-IN')} (CBDT Rule 114B). Please provide your PAN number to proceed.`
          },
          { status: 400 }
        );
      }

      if (!PAN_REGEX.test(rawPan)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid PAN format "${rawPan}". A valid PAN is 10 characters (e.g. ABCDE1234F). Please correct and retry.`
          },
          { status: 400 }
        );
      }
    }

    // 9. Sanitize notes: Never store raw customer PAN or sensitive auth data in payment gateway notes
    const sanitizedNotes: Record<string, string> = {
      store: 'Ambika Jewels Checkout',
      item_count: String(validatedPricing.items.length),
      ...(notes || {})
    };
    delete sanitizedNotes.pan_number;

    // 10. Generate secure, unguessable order number (AMB-XXXXX-XXXXXXXX)
    const orderNumber = generateSecureOrderNumber();

    // 11. Encrypt PAN if provided (CBDT Rule 114B)
    const encryptedPan = customer_info.pan_number
      ? encryptSensitiveData(customer_info.pan_number.toUpperCase())
      : null;

    // 12. Supabase Pre-Insertion: Create a 'pending' order BEFORE payment
    //    This closes the "lost order" vulnerability — even if the customer pays
    //    and closes the browser, the webhook can reconcile via razorpay_order_id.
    let supabaseOrderId: string | null = null;

    if (isSupabaseAdminConfigured && supabaseAdmin) {
      try {
        const { data: insertedOrder, error: insertError } = await supabaseAdmin
          .from('orders')
          .insert({
            order_number: orderNumber,
            customer_name: `${customer_info.first_name} ${customer_info.last_name || ''}`.trim(),
            customer_phone: customer_info.phone,
            customer_email: customer_info.email,
            shipping_address: `${customer_info.address}, ${customer_info.city}, ${customer_info.state} - ${customer_info.pincode}`,
            pincode: customer_info.pincode,
            pan_number: encryptedPan,
            items: validatedPricing.items,
            subtotal: validatedPricing.subtotal_paise,
            tax: validatedPricing.tax_paise,
            shipping: validatedPricing.shipping_paise,
            total: validatedPricing.total_paise,
            status: 'pending_confirmation',
            payment_status: 'unpaid',
            payment_method: 'razorpay',
            notes: customer_info.notes || ''
          })
          .select('id')
          .single();

        if (insertError) {
          console.error('[ORDER PRE-INSERT FAILED] Supabase error:', insertError.message);
          return NextResponse.json(
            { success: false, error: 'Failed to initialize order record. Please try again.' },
            { status: 500 }
          );
        }

        supabaseOrderId = insertedOrder.id;
        console.log(`[ORDER PRE-INSERT] Pending order ${orderNumber} (${supabaseOrderId}) created before payment.`);
      } catch (dbErr) {
        console.error('[ORDER PRE-INSERT EXCEPTION]', dbErr);
        return NextResponse.json(
          { success: false, error: 'Failed to initialize order record. Please try again.' },
          { status: 500 }
        );
      }
    }

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
        is_mock: true,
        order_number: orderNumber,
        supabase_order_id: supabaseOrderId
      });
    }

    // 13. Create Razorpay Order — use the order_number as receipt for reconciliation
    const razorpay = new Razorpay({
      key_id,
      key_secret
    });

    const orderOptions = {
      amount: validatedAmount, // in paise (e.g. 5000000 = ₹50,000)
      currency: 'INR',
      receipt: orderNumber,
      notes: sanitizedNotes
    };

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create(orderOptions);
    } catch (rzpErr) {
      // Razorpay API failed — roll back the Supabase pending order to avoid orphans
      console.error('[RAZORPAY CREATE FAILED]', rzpErr);
      if (isSupabaseAdminConfigured && supabaseAdmin && supabaseOrderId) {
        try {
          await supabaseAdmin
            .from('orders')
            .update({ status: 'cancelled', notes: 'Razorpay order creation failed — auto-cancelled.' })
            .eq('id', supabaseOrderId);
        } catch (rollbackErr) {
          console.error('[ROLLBACK FAILED] Could not cancel orphaned pending order:', rollbackErr);
        }
      }
      const errMsg = rzpErr instanceof Error ? rzpErr.message : 'Failed to create payment order with Razorpay.';
      return NextResponse.json(
        { success: false, error: errMsg },
        { status: 500 }
      );
    }

    // 14. Link the Razorpay order ID back to the Supabase pending record
    if (isSupabaseAdminConfigured && supabaseAdmin && supabaseOrderId) {
      try {
        await supabaseAdmin
          .from('orders')
          .update({ razorpay_order_id: razorpayOrder.id })
          .eq('id', supabaseOrderId);
      } catch (linkErr) {
        // Non-fatal: the verify route or webhook can still reconcile via order_number receipt
        console.error('[RAZORPAY LINK WARNING] Could not update razorpay_order_id on pending order:', linkErr);
      }
    }

    return NextResponse.json({
      success: true,
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: key_id,
      order_number: orderNumber,
      supabase_order_id: supabaseOrderId
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
