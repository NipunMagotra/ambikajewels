import { NextResponse } from 'next/server';
import { pgoldStore } from '@/lib/pgoldStore';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { PGoldSettings } from '@/types/pgold';

export async function GET() {
  try {
    const settings = await pgoldStore.getSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching P-Gold settings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch P-Gold settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const isAuth = await verifyAdminAuth();
    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validation
    const errors: string[] = [];

    if (body.price_per_gram_24k !== undefined) {
      const p24 = Number(body.price_per_gram_24k);
      if (isNaN(p24) || p24 <= 0) {
        errors.push('24K gold rate per gram must be a positive number');
      }
    }

    if (body.price_per_gram_22k !== undefined) {
      const p22 = Number(body.price_per_gram_22k);
      if (isNaN(p22) || p22 <= 0) {
        errors.push('22K gold rate per gram must be a positive number');
      }
    }

    if (body.min_purchase_amount !== undefined) {
      const min = Number(body.min_purchase_amount);
      if (isNaN(min) || min < 1) {
        errors.push('Minimum purchase amount must be at least ₹1');
      }
    }

    if (body.max_purchase_amount !== undefined) {
      const max = Number(body.max_purchase_amount);
      if (isNaN(max) || max < 100) {
        errors.push('Maximum purchase amount must be at least ₹100');
      }
    }

    if (
      body.min_purchase_amount !== undefined &&
      body.max_purchase_amount !== undefined &&
      Number(body.min_purchase_amount) > Number(body.max_purchase_amount)
    ) {
      errors.push('Minimum purchase amount cannot exceed maximum purchase amount');
    }

    if (body.page_title !== undefined && !body.page_title.trim()) {
      errors.push('Page title cannot be empty');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors, message: errors.join('. ') },
        { status: 400 }
      );
    }

    const payload: Partial<PGoldSettings> = {};

    if (body.price_per_gram_24k !== undefined) payload.price_per_gram_24k = Number(body.price_per_gram_24k);
    if (body.price_per_gram_22k !== undefined) payload.price_per_gram_22k = Number(body.price_per_gram_22k);
    if (body.is_enabled !== undefined) payload.is_enabled = Boolean(body.is_enabled);
    if (body.min_purchase_amount !== undefined) payload.min_purchase_amount = Number(body.min_purchase_amount);
    if (body.max_purchase_amount !== undefined) payload.max_purchase_amount = Number(body.max_purchase_amount);
    if (body.pricing_mode !== undefined) payload.pricing_mode = body.pricing_mode === 'api' ? 'api' : 'manual';
    if (body.api_provider_url !== undefined) payload.api_provider_url = String(body.api_provider_url).trim();
    if (body.page_title !== undefined) payload.page_title = String(body.page_title).trim();
    if (body.page_subtitle !== undefined) payload.page_subtitle = String(body.page_subtitle).trim();
    if (body.banner_image !== undefined) payload.banner_image = String(body.banner_image).trim();
    if (body.content_description !== undefined) payload.content_description = String(body.content_description).trim();
    if (body.terms_and_conditions !== undefined) payload.terms_and_conditions = String(body.terms_and_conditions).trim();

    const updatedSettings = await pgoldStore.updateSettings(payload);

    return NextResponse.json({
      success: true,
      message: 'P-Gold settings updated successfully',
      data: updatedSettings
    });
  } catch (error) {
    console.error('Error updating P-Gold settings:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error while updating settings' },
      { status: 500 }
    );
  }
}
