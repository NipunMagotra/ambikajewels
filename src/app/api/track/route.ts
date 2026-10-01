import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';
import { maskAddress, verifyOrderAccessToken } from '@/lib/encryption';
import { checkRateLimit } from '@/lib/rateLimit';
import { getGstSplitByDestination, numberToIndianWords } from '@/lib/pricingEngine';
import { siteConfig } from '@/config/siteConfig';

export async function GET(request: Request) {
  try {
    // 1. Shared Upstash Redis Rate Limiting (15 req / min)
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    const rateResult = await checkRateLimit('track', ip);
    if (!rateResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many tracking requests. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId')?.trim().toUpperCase();
    const phone = searchParams.get('phone')?.trim();
    const email = searchParams.get('email')?.trim().toLowerCase();
    const token = searchParams.get('token')?.trim();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Please provide an Order Reference Number (e.g. AMB-123456).' },
        { status: 400 }
      );
    }

    // 2. Authentication Enforcement: Prevent IDOR (Insecure Direct Object Reference)
    // Looking up an order requires orderId PLUS (phone OR email OR access token)
    if (!phone && !email && !token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Security Verification Required: Please enter the phone number or email associated with this order, or open via your secure email confirmation link.',
          authRequired: true
        },
        { status: 401 }
      );
    }

    let orderData: any = null;

    // 3. Query Supabase if configured (uses server-only supabaseAdmin if service-role key is set)
    const dbClient = isSupabaseAdminConfigured ? supabaseAdmin : (isSupabaseConfigured ? supabase : null);
    if (dbClient) {
      const { data, error } = await dbClient
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .maybeSingle();

      if (!error && data) {
        // Authenticate against database record
        let isAuthenticated = false;

        if (token) {
          if (
            (data.email && verifyOrderAccessToken(orderId, data.email, token)) ||
            (data.phone && verifyOrderAccessToken(orderId, data.phone, token))
          ) {
            isAuthenticated = true;
          }
        }

        if (!isAuthenticated && email && data.email) {
          if (data.email.toLowerCase().trim() === email) {
            isAuthenticated = true;
          }
        }

        if (!isAuthenticated && phone && data.phone) {
          const cleanInputPhone = phone.replace(/\D/g, '').slice(-10);
          const cleanDbPhone = data.phone.replace(/\D/g, '').slice(-10);
          if (cleanInputPhone.length === 10 && cleanInputPhone === cleanDbPhone) {
            isAuthenticated = true;
          }
        }

        if (!isAuthenticated) {
          return NextResponse.json(
            { success: false, error: 'The provided phone or email does not match this order.' },
            { status: 403 }
          );
        }

        orderData = data;
      }
    }

    // 4. Fallback for demo / development orders
    if (!orderData) {
      if (orderId && orderId.startsWith('AMB-')) {
        // Validate input format for demo
        const cleanPhone = phone ? phone.replace(/\D/g, '').slice(-10) : '';
        const isValidPhone = cleanPhone.length === 10;
        const isValidEmail = email ? email.includes('@') : false;

        if (!token && !isValidPhone && !isValidEmail) {
          return NextResponse.json(
            { success: false, error: 'Please enter a valid 10-digit phone number or email address for verification.' },
            { status: 400 }
          );
        }

        orderData = {
          id: orderId,
          customer_name: 'Valued Customer',
          shipping_address: 'Sector 1, Lower Roop Nagar, Jammu, Jammu & Kashmir',
          pincode: '180013',
          status: 'paid',
          bvc_status: 'booked',
          bvc_docket_number: 'BVC-' + orderId.replace('AMB-', ''),
          bvc_security_bag_number: 'AMB-SECBAG-849201-3829',
          shiprocket_status: 'created',
          shiprocket_order_id: 'BVC-' + orderId.replace('AMB-', ''),
          shiprocket_awb: 'BVC-' + orderId.replace('AMB-', ''),
          created_at: new Date(Date.now() - 86400000).toISOString()
        };
      } else {
        return NextResponse.json(
          { success: false, error: 'No order found with the provided details. Please verify your Order Reference Number.' },
          { status: 404 }
        );
      }
    }

    // 5. Build Compliant Status Timeline for High-Value Gold Logistics
    const orderDate = new Date(orderData.created_at || Date.now());
    const packDate = new Date(orderDate.getTime() + 14400000); // 4 hours later
    const dispatchDate = new Date(orderDate.getTime() + 86400000); // 24 hours later
    const estimatedDelivery = new Date(orderDate.getTime() + 259200000); // 3 days later

    const docketNum = orderData.bvc_docket_number || orderData.shiprocket_awb || orderData.shiprocket_order_id || 'BVC-LIVE-PENDING';
    const securityBag = orderData.bvc_security_bag_number || 'AMB-SECBAG-SEALED';

    const timeline = [
      {
        stage: 'Order Confirmed & Hallmark Verified',
        description: 'Payment verified via Razorpay. BIS hallmark and HUID verified at Jammu showroom.',
        timestamp: orderDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        completed: true,
        current: false
      },
      {
        stage: 'Tamper-Evident Security Bag Sealed',
        description: `High-value gold cargo sealed in serialized tamper-evident security vault bag (${securityBag}).`,
        timestamp: packDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        completed: true,
        current: false
      },
      {
        stage: 'Handed to BVC Logistics Armed Network',
        description: 'Consignment handed over to BVC Logistics armored escort vehicle under insured transit protocol.',
        timestamp: dispatchDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        completed: true,
        current: true
      },
      {
        stage: 'Strongroom Vault Deposit & Air Transit',
        description: 'Secured inside biometric strongroom vault and routed via dedicated express transit.',
        timestamp: 'In Progress',
        completed: false,
        current: false
      },
      {
        stage: 'Out for Secure Armored Delivery',
        description: 'Armed courier en route. Mandatory recipient photo-ID and OTP verification required upon handover.',
        timestamp: `Estimated by ${estimatedDelivery.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`,
        completed: false,
        current: false
      }
    ];

    // 6. Generate Dynamic Tax Invoice Details (GST Compliant, HSN 7113)
    const maskedAddress = maskAddress(orderData.shipping_address, orderData.pincode);
    const taxPaise = Number(orderData.tax) || Math.round((Number(orderData.total) || 9785000) * 3 / 103);
    const subtotalPaise = Number(orderData.subtotal) || ((Number(orderData.total) || 9785000) - taxPaise);
    const shippingPaise = Number(orderData.shipping) || 0;
    const totalPaise = Number(orderData.total) || (subtotalPaise + taxPaise + shippingPaise);

    const destinationState = orderData.state || orderData.shipping_address || 'Jammu & Kashmir';
    const taxSplit = getGstSplitByDestination(taxPaise, destinationState, orderData.pincode);

    const orderNum = String(orderData.order_number || orderData.id || orderId);
    const orderNumDigits = orderNum.replace(/\D/g, '') || '108249';
    const invoiceNumber = orderData.invoice_number || `AJ/26-27/${orderNumDigits.slice(-6)}`;
    const amountInWords = numberToIndianWords(Math.round(totalPaise / 100));

    // Normalize Items from database or order payload
    const rawItems = Array.isArray(orderData.items) && orderData.items.length > 0
      ? orderData.items
      : [
          {
            name: 'Authentic 22K Dogri Jhumki',
            quantity: 1,
            unit_price_paise: subtotalPaise,
            subtotal_paise: subtotalPaise,
            purity: '22K (916) BIS Hallmarked with 6-character alphanumeric HUID',
            hsn_code: '7113'
          }
        ];

    const invoiceItems = rawItems.map((item: any) => ({
      name: item.name || 'Fine Precious Jewelry',
      quantity: Math.max(1, Number(item.quantity) || 1),
      unit_price_paise: Number(item.unit_price_paise || item.price || Math.round(subtotalPaise / rawItems.length)),
      subtotal_paise: Number(item.subtotal_paise || (item.price ? item.price * (item.quantity || 1) : Math.round(subtotalPaise / rawItems.length))),
      purity: item.purity || '22K (916) BIS Hallmarked with 6-character alphanumeric HUID',
      hsn_code: item.hsn_code || '7113'
    }));

    return NextResponse.json({
      success: true,
      order: {
        order_number: orderNum,
        customer_name: orderData.customer_name || 'Verified Customer',
        customer_phone: orderData.customer_phone || orderData.phone || '',
        customer_email: orderData.customer_email || orderData.email || '',
        shipping_address: orderData.shipping_address || maskedAddress,
        masked_address: maskedAddress,
        status: orderData.status,
        courier_partner: 'BVC Logistics Secure Armed Network',
        bvc_docket_number: docketNum,
        bvc_status: orderData.bvc_status || 'booked',
        bvc_security_bag_number: securityBag,
        shiprocket_order_id: docketNum,
        shiprocket_awb: docketNum,
        estimated_delivery: estimatedDelivery.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        timeline,
        invoice: {
          invoice_number: invoiceNumber,
          invoice_date: orderDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          hsn_code: '7113',
          items: invoiceItems,
          subtotal_paise: subtotalPaise,
          tax_paise: taxPaise,
          shipping_paise: shippingPaise,
          total_paise: totalPaise,
          tax_split: taxSplit,
          amount_in_words: amountInWords,
          place_of_supply: taxSplit.placeOfSupply,
          ca_confirmation_notice: 'Confirm GST treatment with CA',
          seller: {
            name: siteConfig.legalBusinessName,
            address: siteConfig.address,
            gstin: siteConfig.gstin || '[TO BE FILLED BY OWNER]',
            pan: siteConfig.pan || '[TO BE FILLED BY OWNER]',
            bis_hallmark: siteConfig.bisHallmarkLicense || '[TO BE FILLED BY OWNER]',
            email: siteConfig.contact.email,
            phone: siteConfig.contact.phone
          }
        }
      }
    });
  } catch (error: any) {
    console.error('Tracking API Exception:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred while looking up order tracking.' },
      { status: 500 }
    );
  }
}
