import { NextResponse } from 'next/server';
import { checkBvcPincodeServiceability, calculateBvcDynamicPricing } from '@/lib/bvcLogistics';
import { siteConfig } from '@/config/siteConfig';
import { checkRateLimit } from '@/lib/rateLimit';

/**
 * BVC Logistics Pincode Serviceability & Dynamic Pricing Calculator Endpoint
 * 
 * Computes live, insured transit charges for high-value gold and diamond jewelry:
 * Total Shipping Fee = Base Freight + (Cart Value * Ad Valorem Insurance Rate) + 18% GST.
 */
export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    const rateResult = await checkRateLimit('serviceability', ip);
    if (!rateResult.success) {
      return NextResponse.json(
        { success: false, error: 'Too many serviceability requests. Please wait a moment.', isServiceable: false },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const destinationPincode = String(body.pincode || body.destination_pincode || '').trim();
    const declaredValuePaise = Number(body.declared_value_paise || body.cart_value || body.cart_total || 0);
    const packageWeightKg = body.weight_kg ? Number(body.weight_kg) : 0.5;

    if (!destinationPincode) {
      return NextResponse.json(
        {
          success: false,
          error: 'Destination PIN Code is required.',
          isServiceable: false
        },
        { status: 400 }
      );
    }

    // Call BVC Logistics eSHIP Serviceability Engine
    const result = await checkBvcPincodeServiceability({
      destinationPincode,
      declaredValuePaise,
      packageWeightKg
    });

    // Determine if order qualifies for complimentary insured shipping
    const qualifiesForFreeShipping = declaredValuePaise >= siteConfig.shipping.freeThreshold;

    return NextResponse.json({
      success: true,
      serviceable: result.isServiceable,
      destination_pincode: result.destinationPincode,
      origin_pincode: result.originPincode,
      pricing: {
        cart_value_inr: result.pricing.cartValueInr,
        base_freight_inr: result.pricing.baseFreightInr,
        ad_valorem_insurance_inr: result.pricing.adValoremInsuranceInr,
        subtotal_inr: result.pricing.subtotalInr,
        gst_amount_inr: result.pricing.gstAmountInr,
        total_shipping_fee_inr: qualifiesForFreeShipping ? 0 : result.pricing.totalShippingFeeInr,
        total_shipping_fee_paise: qualifiesForFreeShipping ? 0 : result.pricing.totalShippingFeePaise,
        standard_quote_paise: result.pricing.totalShippingFeePaise,
        is_complimentary: qualifiesForFreeShipping,
        insurance_rate_applied: result.pricing.adValoremRatePercentage,
        gst_rate_applied: result.pricing.gstRatePercentage
      },
      logistics_details: {
        carrier: result.courierPartner,
        transit_type: result.transitType,
        estimated_delivery: result.estimatedDeliveryDays,
        tamper_evident_packaging: 'Serialized High-Security Bag (HSN 7113)',
        handover_protocol: 'Recipient OTP Verification Required'
      },
      is_simulated: result.isSimulated
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown serviceability exception';
    console.error('[API SHIPPING SERVICEABILITY ERROR]', error);

    // Fallback calculation so front-end checkout never crashes
    const fallbackPricing = calculateBvcDynamicPricing(5000000); // 50k default
    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
        serviceable: true,
        pricing: fallbackPricing
      },
      { status: 200 }
    );
  }
}

export async function GET(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

  const rateResult = await checkRateLimit('serviceability', ip);
  if (!rateResult.success) {
    return NextResponse.json(
      { success: false, error: 'Too many serviceability requests. Please wait a moment.' },
      { status: 429 }
    );
  }

  const { searchParams } = new URL(request.url);
  const pincode = searchParams.get('pincode') || searchParams.get('destination_pincode') || '';
  const cartValue = Number(searchParams.get('cart_value') || searchParams.get('value') || 0);

  if (!pincode) {
    return NextResponse.json(
      { success: false, error: 'Query parameter "pincode" is required.' },
      { status: 400 }
    );
  }

  const result = await checkBvcPincodeServiceability({
    destinationPincode: pincode,
    declaredValuePaise: cartValue
  });

  return NextResponse.json({
    success: true,
    serviceable: result.isServiceable,
    pricing: result.pricing,
    carrier: result.courierPartner,
    estimated_delivery: result.estimatedDeliveryDays
  });
}
