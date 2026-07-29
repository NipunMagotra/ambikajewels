import { NextResponse } from 'next/server';
import crypto from 'crypto';

interface GuestCustomerInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
}

interface CartItem {
  product_id: string;
  name: string;
  price: number; // in paise
  quantity: number;
  image?: string;
  metal_finish?: string;
}

export async function POST(request: Request) {
  try {
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

    // 1. Signature Verification
    let isSignatureValid = false;

    if (is_mock) {
      console.warn('Mock payment verification accepted for testing.');
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

    const orderNumber = `AMB-${Math.floor(100000 + Math.random() * 900000)}`;
    let shiprocketStatus = 'pending';
    let shiprocketOrderId = null;
    let shiprocketError = null;

    // 2. Authenticate & Create Order in Shiprocket
    const shiprocketEmail = process.env.SHIPROCKET_EMAIL;
    const shiprocketPassword = process.env.SHIPROCKET_PASSWORD;

    if (shiprocketEmail && shiprocketPassword) {
      try {
        // Authenticate with Shiprocket API
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

          // Format Shiprocket Order Payload
          const currentDateStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
          const shiprocketPayload = {
            order_id: orderNumber,
            order_date: currentDateStr,
            pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary',
            comment: customer_info.notes || 'Ambika Jewels Guest Order',
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
            length: 10,
            breadth: 10,
            height: 5,
            weight: 0.5
          };

          // Create Adhoc Order in Shiprocket
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

    // 3. Graceful Fallback Handling (Simulate Admin Alert if Shiprocket creation failed)
    if (shiprocketStatus !== 'created' && shiprocketStatus !== 'skipped_no_credentials') {
      console.warn(`[ADMIN ALERT SIMULATION] Payment ${razorpay_payment_id} succeeded, but Shiprocket shipping order creation failed (${shiprocketStatus}): ${shiprocketError}. Customer: ${customer_info.first_name} ${customer_info.last_name} (${customer_info.phone}).`);
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      order_number: orderNumber,
      payment_id: razorpay_payment_id,
      shiprocket_status: shiprocketStatus,
      shiprocket_order_id: shiprocketOrderId,
      shiprocket_error: shiprocketError
    });
  } catch (error: any) {
    console.error('Payment Verification Route Exception:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error during payment verification' },
      { status: 500 }
    );
  }
}
