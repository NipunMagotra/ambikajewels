import { NextResponse } from 'next/server';
import crypto from 'crypto';

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

    const body = await request.json();
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

      isSignatureValid = generatedSignature === razorpay_signature;
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

    // B. Check persistent Supabase database (uses server-only supabaseAdmin if configured)
    const dbClient = isSupabaseAdminConfigured ? supabaseAdmin : (isSupabaseConfigured ? supabase : null);
    if (dbClient) {
      try {
        const { data: existingOrder } = await dbClient
          .from('orders')
          .select('*')
          .or(`payment_id.eq.${razorpay_payment_id},razorpay_payment_id.eq.${razorpay_payment_id},razorpay_order_id.eq.${razorpay_order_id}`)
          .maybeSingle();

        if (existingOrder) {
          const accessToken = generateOrderAccessToken(
            existingOrder.order_number || existingOrder.id,
            existingOrder.email || existingOrder.customer_email || existingOrder.phone || existingOrder.customer_phone
          );
          const idempotentResponse = {
            success: true,
            message: 'Payment already verified (Idempotent)',
            order_number: existingOrder.order_number || existingOrder.id,
            token: accessToken,
            payment_id: razorpay_payment_id,
            shiprocket_status: existingOrder.shiprocket_status,
            shiprocket_order_id: existingOrder.shiprocket_order_id,
            idempotent: true
          };
          processedPayments.set(razorpay_payment_id, {
            response: idempotentResponse,
            timestamp: Date.now()
          });
          return NextResponse.json(idempotentResponse);
        }
      } catch (checkErr) {
        console.error('Error during database idempotency check:', checkErr);
      }
    }

    // F6: Non-guessable order identifiers
    // If create-order pre-inserted a pending row, we'll resolve its order_number;
    // otherwise generate a new one (backwards-compat / webhook-only path).
    let orderNumber = generateSecureOrderNumber();

    // Resolve existing pending order from Supabase (pre-inserted by create-order route)
    if (supabase_order_id && dbClient) {
      try {
        const { data: pendingOrder } = await dbClient
          .from('orders')
          .select('order_number')
          .eq('id', supabase_order_id)
          .maybeSingle();

        if (pendingOrder?.order_number) {
          orderNumber = pendingOrder.order_number;
        }
      } catch (lookupErr) {
        console.warn('[VERIFY] Could not look up pending order, using new order number:', lookupErr);
      }
    }

    // 3. Encrypt PAN securely (CBDT Rule 114B) - Never log or disclose raw PAN
    const encryptedPan = customer_info?.pan_number
      ? encryptSensitiveData(customer_info.pan_number)
      : null;

    // 4. Authenticate & Create Secured Shipment in BVC Logistics eSHIP API (Precious Cargo, HSN 7113)
    let bvcStatus = 'pending';
    let bvcDocketNumber: string | null = null;
    let bvcShipmentId: string | null = null;
    let bvcSecurityBag: string | null = null;
    let bvcError: string | null = null;

    try {
      const bvcResult = await createBvcShipment({
        orderNumber,
        customer: customer_info,
        items: (items || []).map((it) => ({
          name: it.name,
          product_id: it.product_id,
          sku: it.product_id || it.name.replace(/[^a-zA-Z0-9]/g, '-').toUpperCase(),
          quantity: it.quantity,
          price: it.price,
          weight_grams: it.weight_grams,
          dimensions: it.dimensions
        })),
        totalAmountPaise: total_amount,
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
        amount: total_amount,
        items: (items || []).map((it) => ({
          name: it.name,
          quantity: it.quantity,
          price: it.price
        })),
        errorMessage: bvcError || `BVC shipment booking was not completed (status: ${bvcStatus})`,
        securityBagNumber: bvcSecurityBag || undefined
      }).catch((alertErr) => {
        console.error('Failed to dispatch BVC failure alert to admin:', alertErr);
      });
    }

    // 5. Persist Order in Supabase Database
    //    Two paths:
    //    A) If create-order pre-inserted a pending row → UPDATE it to confirmed/paid
    //    B) Fallback: upsert a new row (webhook-only path / backwards compatibility)
    const paymentUpdatePayload = {
      customer_name: `${customer_info.first_name} ${customer_info.last_name || ''}`.trim(),
      customer_phone: customer_info.phone,
      customer_email: customer_info.email,
      shipping_address: `${customer_info.address}, ${customer_info.city}, ${customer_info.state} - ${customer_info.pincode}`,
      pincode: customer_info.pincode,
      pan_number: encryptedPan, // Stored encrypted (CBDT Rule 114B compliant)
      total: total_amount,
      subtotal: Math.round(total_amount * 100 / 103),
      tax: total_amount - Math.round(total_amount * 100 / 103),
      shipping: 0,
      items: items,
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
      notes: customer_info.notes || ''
    };

    if (dbClient) {
      try {
        if (supabase_order_id) {
          // Path A: Update the existing pending order created by create-order
          await dbClient
            .from('orders')
            .update(paymentUpdatePayload)
            .eq('id', supabase_order_id);
          console.log(`[ORDER CONFIRMED] Updated pending order ${supabase_order_id} → confirmed/paid.`);
        } else {
          // Path B: Backwards-compatible upsert (webhook / legacy clients)
          await dbClient.from('orders').upsert({
            order_number: orderNumber,
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

    // 6. Generate unguessable verification token for seamless client access
    const orderAccessToken = generateOrderAccessToken(
      orderNumber,
      customer_info.email || customer_info.phone
    );

    // 7. Send Real Transactional Confirmation Email via Resend
    sendOrderConfirmationEmail({
      orderNumber,
      customerName: `${customer_info.first_name} ${customer_info.last_name || ''}`.trim(),
      customerEmail: customer_info.email,
      items: (items || []).map((it) => ({
        name: it.name,
        quantity: it.quantity,
        price: it.price,
        metal_finish: it.metal_finish
      })),
      subtotal: Math.round(total_amount * 100 / 103),
      tax: total_amount - Math.round(total_amount * 100 / 103),
      shipping: 0,
      total: total_amount,
      shippingAddress: `${customer_info.address}, ${customer_info.city}, ${customer_info.state} - ${customer_info.pincode}`,
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
