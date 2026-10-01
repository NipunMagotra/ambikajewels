import { NextResponse } from 'next/server';
import crypto from 'crypto';

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';
import { encryptSensitiveData, generateOrderAccessToken } from '@/lib/encryption';
import { sendOrderConfirmationEmail, sendAdminShiprocketFailureAlert } from '@/lib/email';

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
  response: any;
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
      is_mock
    }: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      customer_info: GuestCustomerInfo;
      items: CartItem[];
      total_amount: number;
      is_mock?: boolean;
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

    const orderNumber = `AMB-${Math.floor(100000 + Math.random() * 900000)}`;
    let shiprocketStatus = 'pending';
    let shiprocketOrderId = null;
    let shiprocketError = null;

    // 3. Encrypt PAN securely (CBDT Rule 114B) - Never log or disclose raw PAN
    const encryptedPan = customer_info?.pan_number
      ? encryptSensitiveData(customer_info.pan_number)
      : null;

    // 4. Authenticate & Create Shipment in Shiprocket
    const shiprocketEmail = process.env.SHIPROCKET_EMAIL;
    const shiprocketPassword = process.env.SHIPROCKET_PASSWORD;

    if (shiprocketEmail && shiprocketPassword) {
      try {
        const authRes = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: shiprocketEmail,
            password: shiprocketPassword,
          }),
        });

        const authData = await authRes.json();

        if (authRes.ok && authData.token) {
          const token = authData.token;

          // Calculate real parcel weight and dimensions from verified items
          let totalNetWeightGrams = 0;
          let maxL = 12;
          let maxB = 12;
          let maxH = 6;

          for (const item of (items || [])) {
            const w = item.weight_grams || 25;
            totalNetWeightGrams += w * (item.quantity || 1);
            if (item.dimensions) {
              if (item.dimensions.length_cm > maxL) maxL = Math.ceil(item.dimensions.length_cm + 2);
              if (item.dimensions.breadth_cm > maxB) maxB = Math.ceil(item.dimensions.breadth_cm + 2);
              if (item.dimensions.height_cm > maxH) maxH = Math.ceil(item.dimensions.height_cm + 2);
            }
          }

          // Add tamper-evident luxury jewelry security packaging weight (approx 200g)
          const finalPackageWeightKg = Math.max(0.3, Math.round(((totalNetWeightGrams + 200) / 1000) * 100) / 100);

          const currentDateStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
          const shiprocketPayload = {
            order_id: orderNumber,
            order_date: currentDateStr,
            pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary',
            // Safe comment with zero raw PAN disclosure
            comment: customer_info.notes || 'Ambika Jewels Fine Jewelry Order',
            billing_customer_name: customer_info.first_name,
            billing_last_name: customer_info.last_name || customer_info.first_name,
            billing_address: customer_info.address,
            billing_address_2: '',
            billing_city: customer_info.city,
            billing_pincode: customer_info.pincode,
            billing_state: customer_info.state,
            billing_country: 'India',
            billing_email: customer_info.email,
            billing_phone: customer_info.phone,
            shipping_is_billing: true,
            order_items: (items || []).map((item) => ({
              name: item.name,
              sku: item.product_id || item.name.replace(/[^a-zA-Z0-9]/g, '-').toUpperCase(),
              units: item.quantity,
              selling_price: Math.round(item.price / 100),
              discount: 0,
              tax: 0,
              hsn: 7113
            })),
            payment_method: 'Prepaid',
            shipping_charges: 0,
            giftwrap_charges: 0,
            transaction_charges: 0,
            total_discount: 0,
            sub_total: Math.round(total_amount / 100),
            length: maxL,
            breadth: maxB,
            height: maxH,
            weight: finalPackageWeightKg
          };

          const orderRes = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(shiprocketPayload),
          });

          const orderData = await orderRes.json();

          if (orderRes.ok && orderData.order_id) {
            shiprocketStatus = 'created';
            shiprocketOrderId = orderData.order_id;
          } else {
            console.error('Shiprocket Order Creation Error:', orderData);
            shiprocketStatus = 'failed';
            shiprocketError = orderData.message || JSON.stringify(orderData);
          }
        } else {
          console.error('Shiprocket Auth Error:', authData);
          shiprocketStatus = 'auth_failed';
          shiprocketError = authData.message || 'Authentication failed';
        }
      } catch (srErr: any) {
        console.error('Shiprocket Exception:', srErr);
        shiprocketStatus = 'exception';
        shiprocketError = srErr?.message || 'Network exception';
      }
    } else {
      console.warn('Shiprocket credentials not provided in environment variables. Simulating order processing.');
      shiprocketStatus = 'skipped_no_credentials';
    }

    // Trigger Admin Email Alert if Shiprocket Order Creation Failed (Item 6)
    if (shiprocketStatus !== 'created') {
      sendAdminShiprocketFailureAlert({
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
        errorMessage: shiprocketError || `Shiprocket shipment creation was not completed (status: ${shiprocketStatus})`
      }).catch((alertErr) => {
        console.error('Failed to dispatch Shiprocket failure alert to admin:', alertErr);
      });
    }

    // 5. Persist Order in Supabase Database (Idempotent Upsert on razorpay_payment_id)
    if (dbClient) {
      try {
        await dbClient.from('orders').upsert({
          order_number: orderNumber,
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
          status: 'confirmed',
          payment_status: 'paid',
          payment_method: 'razorpay',
          payment_id: razorpay_payment_id,
          razorpay_payment_id: razorpay_payment_id,
          razorpay_order_id: razorpay_order_id,
          shiprocket_status: shiprocketStatus,
          shiprocket_order_id: shiprocketOrderId ? String(shiprocketOrderId) : null,
          notes: customer_info.notes || ''
        }, {
          onConflict: 'razorpay_payment_id',
          ignoreDuplicates: true
        });
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
      shiprocketAwb: shiprocketOrderId ? `SR-${shiprocketOrderId}` : undefined
    }).catch((emailErr) => {
      console.error('Background order confirmation email dispatch error:', emailErr);
    });

    const successResponse = {
      success: true,
      message: 'Payment verified successfully',
      order_number: orderNumber,
      token: orderAccessToken,
      payment_id: razorpay_payment_id,
      shiprocket_status: shiprocketStatus,
      shiprocket_order_id: shiprocketOrderId,
      shiprocket_error: shiprocketError
    };

    // Store in idempotency cache
    processedPayments.set(razorpay_payment_id, {
      response: successResponse,
      timestamp: Date.now()
    });

    return NextResponse.json(successResponse);
  } catch (error: any) {
    console.error('Payment Verification Route Exception:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error during payment verification' },
      { status: 500 }
    );
  }
}
