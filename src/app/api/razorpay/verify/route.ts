import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { checkRateLimit } from '@/lib/rateLimit';

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';
import { encryptSensitiveData, generateOrderAccessToken } from '@/lib/encryption';
import { generateSecureOrderNumber } from '@/lib/orderUtils';
import { executePaymentFulfillment } from '@/lib/orderFulfillment';

interface GuestCustomerInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  pan_number?: string;
  notes?: string;
}

interface CartItem {
  product_id: string;
  name: string;
  price: number; // in paise
  quantity: number;
  image?: string;
  metal_finish?: string;
  weight_grams?: number;
  dimensions?: {
    length_cm: number;
    breadth_cm: number;
    height_cm: number;
  };
}

// In-memory idempotency cache to protect against rapid concurrent verify / webhook hits
interface CachedPaymentVerification {
  response: Record<string, unknown>;
  timestamp: number;
}
const processedPayments = new Map<string, CachedPaymentVerification>();

function cleanupOldIdempotencyRecords() {
  const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
  for (const [key, val] of processedPayments.entries()) {
    if (val.timestamp < thirtyMinutesAgo) {
      processedPayments.delete(key);
    }
  }
}

export async function POST(request: Request) {
  try {
    cleanupOldIdempotencyRecords();

    // 0. Shared Upstash Redis Rate Limiting (15 attempts per 5 minutes)
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
    const rateCheck = await checkRateLimit('verifyPayment', ip);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, error: 'Too many verification requests. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customer_info,
      items,
      total_amount,
      is_mock,
      supabase_order_id
    }: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      customer_info: GuestCustomerInfo;
      items: CartItem[];
      total_amount: number;
      is_mock?: boolean;
      supabase_order_id?: string;
    } = body;

    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_secret && process.env.NODE_ENV === 'production') {
      console.error('[SECURITY FATAL] RAZORPAY_KEY_SECRET is not configured in production.');
      return NextResponse.json(
        { success: false, error: 'Server misconfiguration: Payment verification key missing.' },
        { status: 500 }
      );
    }

    // 1. Signature Verification
    let isSignatureValid = false;

    if (is_mock && process.env.NODE_ENV !== 'production' && !key_secret) {
      console.warn('Mock payment verification accepted for local testing in development.');
      isSignatureValid = true;
    } else if (key_secret && razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', key_secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      const sigBuf = Buffer.from(razorpay_signature);
      const expBuf = Buffer.from(generatedSignature);
      isSignatureValid = sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf);
    }

    if (!isSignatureValid) {
      return NextResponse.json(
        { success: false, error: 'Payment verification failed: Invalid Razorpay signature' },
        { status: 400 }
      );
    }

    // 2. Dual-Layer Idempotency Check
    // A. Check in-memory deduplication cache
    if (processedPayments.has(razorpay_payment_id)) {
      const cached = processedPayments.get(razorpay_payment_id)!;
      console.log(`[IDEMPOTENT HIT] Returning cached verification for payment: ${razorpay_payment_id}`);
      return NextResponse.json({ ...cached.response, idempotent: true });
    }

    // B. Check persistent Supabase database
    const dbClient = isSupabaseAdminConfigured ? supabaseAdmin : (isSupabaseConfigured ? supabase : null);
    let pendingOrder: any = null;

    if (dbClient) {
      try {
        if (razorpay_order_id) {
          const { data } = await dbClient
            .from('orders')
            .select('*')
            .eq('razorpay_order_id', razorpay_order_id)
            .maybeSingle();
          pendingOrder = data;
        }

        if (!pendingOrder && supabase_order_id) {
          const { data } = await dbClient
            .from('orders')
            .select('*')
            .eq('id', supabase_order_id)
            .maybeSingle();
          pendingOrder = data;
        }

        // Check if this payment ID was already marked paid in DB
        const { data: existingPaidOrder } = await dbClient
          .from('orders')
          .select('*')
          .or(`payment_id.eq.${razorpay_payment_id},razorpay_payment_id.eq.${razorpay_payment_id}`)
          .maybeSingle();

        if (existingPaidOrder && (existingPaidOrder.payment_status === 'paid' || existingPaidOrder.status === 'confirmed')) {
          const accessToken = generateOrderAccessToken(
            existingPaidOrder.order_number || existingPaidOrder.id,
            existingPaidOrder.email || existingPaidOrder.customer_email || existingPaidOrder.phone || existingPaidOrder.customer_phone || ''
          );
          const idempotentResponse = {
            success: true,
            message: 'Payment already verified (Idempotent)',
            order_number: existingPaidOrder.order_number || existingPaidOrder.id,
            token: accessToken,
            payment_id: razorpay_payment_id,
            shiprocket_status: existingPaidOrder.shiprocket_status,
            shiprocket_order_id: existingPaidOrder.shiprocket_order_id,
            idempotent: true
          };
          processedPayments.set(razorpay_payment_id, {
            response: idempotentResponse,
            timestamp: Date.now()
          });
          return NextResponse.json(idempotentResponse);
        }
      } catch (checkErr) {
        console.error('Error during database order lookup/idempotency check:', checkErr);
      }
    }

    // 3. Authoritative Order Binding & Anti-Tampering Checks
    if (dbClient && !pendingOrder && (isSupabaseAdminConfigured || process.env.NODE_ENV === 'production')) {
      console.warn(`[SECURITY ALERT] Verification rejected: No pending order found for razorpay_order_id=${razorpay_order_id}`);
      return NextResponse.json(
        { success: false, error: 'Payment verification failed: No matching pending order found.' },
        { status: 400 }
      );
    }

    if (pendingOrder) {
      // 3A. Bind order: DB razorpay_order_id must match incoming razorpay_order_id
      if (pendingOrder.razorpay_order_id && razorpay_order_id && pendingOrder.razorpay_order_id !== razorpay_order_id) {
        console.error(`[SECURITY ALERT] Order ID substitution attempt: DB=${pendingOrder.razorpay_order_id}, Request=${razorpay_order_id}`);
        return NextResponse.json(
          { success: false, error: 'Payment verification failed: Razorpay order ID mismatch.' },
          { status: 400 }
        );
      }

      // 3B. Amount verification: database pre-calculated total is authoritative source of truth.
      // We log any discrepancy for audit reconciliation while preserving verified payment for pendingOrder.total.
      if (typeof pendingOrder.total === 'number' && typeof total_amount === 'number' && total_amount !== pendingOrder.total) {
        console.warn(`[AUDIT NOTICE] Client submitted amount (${total_amount} paise) differs from authoritative DB total (${pendingOrder.total} paise). Reconciling to authorized DB total.`);
      }
    }

    // 4. Encrypt PAN securely (CBDT Rule 114B) - Never log or disclose raw PAN
    const encryptedPan = customer_info?.pan_number
      ? encryptSensitiveData(customer_info.pan_number)
      : (pendingOrder?.pan_number || null);

    if (encryptedPan && dbClient && pendingOrder?.id && !pendingOrder.pan_number) {
      dbClient.from('orders').update({ pan_number: encryptedPan }).eq('id', pendingOrder.id).then();
    }

    // 5. Authoritative Atomic Payment Fulfillment (BVC Consignment, Email, Inventory Confirmation)
    const verifiedTotalPaise = (pendingOrder && typeof pendingOrder.total === 'number') ? pendingOrder.total : total_amount;
    const verifiedItems = (pendingOrder && Array.isArray(pendingOrder.items) && pendingOrder.items.length > 0)
      ? pendingOrder.items
      : items;

    const fulfillment = await executePaymentFulfillment({
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      customerInfo: customer_info,
      items: verifiedItems,
      totalAmountPaise: verifiedTotalPaise,
      source: 'verify',
      supabaseOrderId: pendingOrder?.id || supabase_order_id
    });

    if (fulfillment.oversold) {
      return NextResponse.json(
        {
          success: false,
          oversold: true,
          error: fulfillment.errorMessage || 'Inventory was unavailable. Order flagged for review and safe refund initiated.',
          order_number: fulfillment.orderNumber,
          payment_id: razorpay_payment_id,
          refund_id: fulfillment.refundId,
          refund_status: fulfillment.refundStatus
        },
        { status: 409 }
      );
    }

    const successResponse = {
      success: true,
      message: fulfillment.idempotent
        ? 'Payment already verified (Idempotent)'
        : 'Payment verified and secured BVC shipment registered successfully',
      order_number: fulfillment.orderNumber,
      token: fulfillment.orderAccessToken,
      payment_id: razorpay_payment_id,
      bvc_status: fulfillment.bvcStatus,
      bvc_docket_number: fulfillment.bvcDocketNumber,
      bvc_shipment_id: fulfillment.bvcShipmentId,
      bvc_security_bag_number: fulfillment.bvcSecurityBag,
      bvc_error: fulfillment.bvcError,
      shiprocket_status: fulfillment.bvcStatus,
      shiprocket_order_id: fulfillment.bvcDocketNumber,
      shiprocket_error: fulfillment.bvcError,
      idempotent: fulfillment.idempotent || false
    };

    // Store in idempotency cache
    processedPayments.set(razorpay_payment_id, {
      response: successResponse,
      timestamp: Date.now()
    });

    return NextResponse.json(successResponse);
  } catch (error: unknown) {
    console.error('Payment Verification Route Exception:', error);
    const errorMsg = error instanceof Error ? error.message : 'Internal server error during payment verification';
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
