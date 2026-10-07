import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { checkRateLimit } from '@/lib/rateLimit';

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';
import { encryptSensitiveData, generateOrderAccessToken } from '@/lib/encryption';
import { sendOrderConfirmationEmail, sendAdminBvcFailureAlert } from '@/lib/email';
import { createBvcShipment } from '@/lib/bvcLogistics';
import { generateSecureOrderNumber } from '@/lib/orderUtils';

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

      // 3B. Amount verification: client-submitted total_amount must match DB pre-calculated total
      if (typeof pendingOrder.total === 'number' && typeof total_amount === 'number' && total_amount !== pendingOrder.total) {
        console.error(`[SECURITY ALERT] Payment amount mismatch: DB=${pendingOrder.total} paise, Submitted=${total_amount} paise`);
        return NextResponse.json(
          { success: false, error: 'Payment verification failed: Submitted amount does not match authorized order total.' },
          { status: 400 }
        );
      }
    }

    // F6: Non-guessable order identifiers
    const orderNumber = pendingOrder?.order_number || generateSecureOrderNumber();
    const verifiedTotalPaise = (pendingOrder && typeof pendingOrder.total === 'number') ? pendingOrder.total : total_amount;
    const verifiedSubtotalPaise = (pendingOrder && typeof pendingOrder.subtotal === 'number')
      ? pendingOrder.subtotal
      : Math.round(verifiedTotalPaise * 100 / 103);
    const verifiedTaxPaise = (pendingOrder && typeof pendingOrder.tax === 'number')
      ? pendingOrder.tax
      : verifiedTotalPaise - verifiedSubtotalPaise;
    const verifiedItems = (pendingOrder && Array.isArray(pendingOrder.items) && pendingOrder.items.length > 0)
      ? pendingOrder.items
      : items;

    // 4. Encrypt PAN securely (CBDT Rule 114B) - Never log or disclose raw PAN
    const encryptedPan = customer_info?.pan_number
      ? encryptSensitiveData(customer_info.pan_number)
      : (pendingOrder?.pan_number || null);

    // 5. Authenticate & Create Secured Shipment in BVC Logistics eSHIP API (Precious Cargo, HSN 7113)
    let bvcStatus = 'pending';
    let bvcDocketNumber: string | null = null;
    let bvcShipmentId: string | null = null;
    let bvcSecurityBag: string | null = null;
    let bvcError: string | null = null;

    try {
      const bvcResult = await createBvcShipment({
        orderNumber,
        customer: customer_info,
        items: (verifiedItems || []).map((it: any) => ({
          name: it.name,
          product_id: it.product_id,
          sku: it.product_id || (it.name ? it.name.replace(/[^a-zA-Z0-9]/g, '-').toUpperCase() : 'AMB-ITEM'),
          quantity: it.quantity,
          price: it.price || it.unit_price_paise,
          weight_grams: it.weight_grams,
          dimensions: it.dimensions
        })),
        totalAmountPaise: verifiedTotalPaise,
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id
      });

      bvcStatus = bvcResult.status;
      bvcDocketNumber = bvcResult.docketNumber;
      bvcShipmentId = bvcResult.shipmentId;
      bvcSecurityBag = bvcResult.securityBagNumber;
      bvcError = bvcResult.errorMessage || null;

      if (!bvcResult.success && bvcStatus === 'failed') {
        console.error('[BVC SHIPMENT FAILED]', { orderNumber, error: bvcError });
      }
    } catch (bvcErr: unknown) {
      console.error('[BVC LOGISTICS UNCAUGHT EXCEPTION]', bvcErr);
      bvcStatus = 'exception';
      bvcError = bvcErr instanceof Error ? bvcErr.message : 'Unexpected exception during BVC shipment dispatch';
    }

    // Trigger Admin Email Alert if BVC Consignment Creation Failed
    if (bvcStatus === 'failed' || bvcStatus === 'exception') {
      sendAdminBvcFailureAlert({
        orderNumber,
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        customerName: `${customer_info.first_name} ${customer_info.last_name || ''}`.trim(),
        customerEmail: customer_info.email,
        customerPhone: customer_info.phone,
        amount: verifiedTotalPaise,
        items: (verifiedItems || []).map((it: any) => ({
          name: it.name,
          quantity: it.quantity,
          price: it.price || it.unit_price_paise
        })),
        errorMessage: bvcError || `BVC shipment booking was not completed (status: ${bvcStatus})`,
        securityBagNumber: bvcSecurityBag || undefined
      }).catch((alertErr) => {
        console.error('Failed to dispatch BVC failure alert to admin:', alertErr);
      });
    }

    // 6. Persist / Update Order in Supabase Database
    //    Guarantees authoritative server prices are never overwritten by client
    const paymentUpdatePayload: Record<string, unknown> = {
      customer_name: `${customer_info?.first_name || ''} ${customer_info?.last_name || ''}`.trim() || pendingOrder?.customer_name,
      customer_phone: customer_info?.phone || pendingOrder?.customer_phone,
      customer_email: customer_info?.email || pendingOrder?.customer_email,
      shipping_address: customer_info?.address
        ? `${customer_info.address}, ${customer_info.city}, ${customer_info.state} - ${customer_info.pincode}`
        : pendingOrder?.shipping_address,
      pincode: customer_info?.pincode || pendingOrder?.pincode,
      pan_number: encryptedPan,
      status: 'confirmed' as const,
      payment_status: 'paid' as const,
      payment_method: 'razorpay',
      payment_id: razorpay_payment_id,
      razorpay_payment_id: razorpay_payment_id,
      razorpay_order_id: razorpay_order_id,
      bvc_status: bvcStatus,
      bvc_docket_number: bvcDocketNumber,
      bvc_shipment_id: bvcShipmentId,
      bvc_security_bag_number: bvcSecurityBag,
      shiprocket_status: bvcStatus,
      shiprocket_order_id: bvcDocketNumber ? String(bvcDocketNumber) : null,
      shiprocket_awb: bvcDocketNumber ? String(bvcDocketNumber) : null,
      shipping_provider: 'bvc',
      tracking_awb: bvcDocketNumber ? String(bvcDocketNumber) : null,
      notes: customer_info?.notes || pendingOrder?.notes || ''
    };

    if (dbClient) {
      try {
        if (pendingOrder?.id) {
          await dbClient
            .from('orders')
            .update(paymentUpdatePayload)
            .eq('id', pendingOrder.id);
          console.log(`[ORDER CONFIRMED] Updated pending order ${pendingOrder.id} → confirmed/paid.`);
        } else {
          // Dev mock / legacy fallback
          await dbClient.from('orders').upsert({
            order_number: orderNumber,
            total: verifiedTotalPaise,
            subtotal: verifiedSubtotalPaise,
            tax: verifiedTaxPaise,
            shipping: 0,
            items: verifiedItems,
            ...paymentUpdatePayload
          }, {
            onConflict: 'razorpay_payment_id',
            ignoreDuplicates: true
          });
        }
      } catch (dbErr) {
        console.error('Error persisting verified order to Supabase:', dbErr);
      }
    }

    // 7. Generate unguessable verification token for seamless client access
    const orderAccessToken = generateOrderAccessToken(
      orderNumber,
      customer_info?.email || customer_info?.phone || ''
    );

    // 8. Send Real Transactional Confirmation Email via Resend
    sendOrderConfirmationEmail({
      orderNumber,
      customerName: `${customer_info?.first_name || ''} ${customer_info?.last_name || ''}`.trim(),
      customerEmail: customer_info?.email,
      items: (verifiedItems || []).map((it: any) => ({
        name: it.name,
        quantity: it.quantity,
        price: it.price || it.unit_price_paise,
        metal_finish: it.metal_finish
      })),
      subtotal: verifiedSubtotalPaise,
      tax: verifiedTaxPaise,
      shipping: 0,
      total: verifiedTotalPaise,
      shippingAddress: `${customer_info?.address || ''}, ${customer_info?.city || ''}, ${customer_info?.state || ''} - ${customer_info?.pincode || ''}`,
      paymentId: razorpay_payment_id,
      bvcDocketNumber: bvcDocketNumber || undefined,
      securityBagNumber: bvcSecurityBag || undefined,
      shiprocketAwb: bvcDocketNumber || undefined
    }).catch((emailErr) => {
      console.error('Background order confirmation email dispatch error:', emailErr);
    });

    const successResponse = {
      success: true,
      message: 'Payment verified and secured BVC shipment registered successfully',
      order_number: orderNumber,
      token: orderAccessToken,
      payment_id: razorpay_payment_id,
      bvc_status: bvcStatus,
      bvc_docket_number: bvcDocketNumber,
      bvc_shipment_id: bvcShipmentId,
      bvc_security_bag_number: bvcSecurityBag,
      bvc_error: bvcError,
      shiprocket_status: bvcStatus,
      shiprocket_order_id: bvcDocketNumber,
      shiprocket_error: bvcError
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
