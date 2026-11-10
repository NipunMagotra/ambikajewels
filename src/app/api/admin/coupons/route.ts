import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { getAllCoupons, saveCoupon, deleteCoupon } from '@/lib/serverCoupons';
import { CouponRule } from '@/lib/couponEngine';
import { recordAuditLog } from '@/lib/auditLog';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/coupons
 * Returns list of all promotional discount coupons
 */
export async function GET(request: Request) {
  try {
    const isAuth = await verifyAdminAuth(request);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    const coupons = await getAllCoupons();
    return NextResponse.json({
      success: true,
      coupons
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/coupons
 * Create or replace a coupon
 */
export async function POST(request: Request) {
  try {
    const isAuth = await verifyAdminAuth(request);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { code, type, value, minOrderPaise, maxDiscountPaise, validUntil, description, isActive } = body;

    if (!code || typeof code !== 'string' || !code.trim()) {
      return NextResponse.json(
        { success: false, message: 'Coupon code is required (e.g., FESTIVE1000).' },
        { status: 400 }
      );
    }

    if (!['flat', 'percentage'].includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid coupon type. Must be "flat" or "percentage".' },
        { status: 400 }
      );
    }

    const numValue = Number(value);
    if (isNaN(numValue) || numValue <= 0) {
      return NextResponse.json(
        { success: false, message: 'Coupon value must be a positive number.' },
        { status: 400 }
      );
    }

    if (type === 'percentage' && (numValue < 1 || numValue > 50)) {
      return NextResponse.json(
        { success: false, message: 'Percentage discount must be between 1% and 50%.' },
        { status: 400 }
      );
    }

    if (!validUntil || isNaN(Date.parse(validUntil))) {
      return NextResponse.json(
        { success: false, message: 'Valid expiration date required (YYYY-MM-DD).' },
        { status: 400 }
      );
    }

    const newCoupon: CouponRule = {
      code: code.trim().toUpperCase(),
      type,
      value: numValue,
      minOrderPaise: Number(minOrderPaise || 0),
      maxDiscountPaise: maxDiscountPaise ? Number(maxDiscountPaise) : undefined,
      validUntil,
      description: (description || '').trim(),
      isActive: isActive !== false
    };

    const saved = await saveCoupon(newCoupon);

    await recordAuditLog({
      action: 'COUPON_CREATED',
      entityType: 'coupon',
      entityId: saved.code,
      newValues: saved as unknown as Record<string, unknown>,
      request
    });

    return NextResponse.json({
      success: true,
      message: `Coupon ${saved.code} created successfully`,
      coupon: saved
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/coupons
 * Toggle active status or update details
 */
export async function PATCH(request: Request) {
  try {
    const isAuth = await verifyAdminAuth(request);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { code, isActive, ...updates } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Coupon code is required.' },
        { status: 400 }
      );
    }

    const all = await getAllCoupons();
    const existing = all.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!existing) {
      return NextResponse.json(
        { success: false, message: `Coupon "${code}" not found.` },
        { status: 404 }
      );
    }

    const updated: CouponRule = {
      ...existing,
      ...updates,
      code: existing.code,
      isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive
    };

    const saved = await saveCoupon(updated);

    await recordAuditLog({
      action: 'COUPON_UPDATED',
      entityType: 'coupon',
      entityId: saved.code,
      oldValues: existing as unknown as Record<string, unknown>,
      newValues: saved as unknown as Record<string, unknown>,
      request
    });

    return NextResponse.json({
      success: true,
      message: `Coupon ${saved.code} updated`,
      coupon: saved
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/coupons
 */
export async function DELETE(request: Request) {
  try {
    const isAuth = await verifyAdminAuth(request);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const code = url.searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Coupon code is required in query (?code=).' },
        { status: 400 }
      );
    }

    await deleteCoupon(code);

    await recordAuditLog({
      action: 'COUPON_DELETED',
      entityType: 'coupon',
      entityId: code.toUpperCase(),
      request
    });

    return NextResponse.json({
      success: true,
      message: `Coupon ${code.toUpperCase()} deleted`
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 }
    );
  }
}

