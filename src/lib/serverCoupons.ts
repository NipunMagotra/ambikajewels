/**
 * Ambika Jewels — Server-Side Coupon Persistence & DB Operations
 *
 * This module is strictly server-only. It interfaces with Supabase Admin
 * to persist and retrieve coupons, keeping client bundles completely isolated
 * from database credentials.
 */

import { supabaseAdmin, isSupabaseAdminConfigured } from './supabaseAdmin';
import { AVAILABLE_COUPONS, CouponRule } from './couponEngine';

export async function getAllCoupons(): Promise<CouponRule[]> {
  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin.from('coupons').select('*');
      if (!error && data && data.length > 0) {
        data.forEach((row: any) => {
          AVAILABLE_COUPONS[row.code.toUpperCase()] = {
            code: row.code.toUpperCase(),
            type: row.type,
            value: Number(row.value),
            maxDiscountPaise: row.max_discount_paise ? Number(row.max_discount_paise) : undefined,
            minOrderPaise: Number(row.min_order_paise || 0),
            validUntil: row.valid_until,
            description: row.description || '',
            isActive: Boolean(row.is_active),
            usageCount: Number(row.usage_count || 0)
          };
        });
      }
    } catch {
      // Fallback to memory
    }
  }
  return Object.values(AVAILABLE_COUPONS);
}

export async function saveCoupon(coupon: CouponRule): Promise<CouponRule> {
  const code = coupon.code.trim().toUpperCase();
  const normalized: CouponRule = {
    ...coupon,
    code,
    usageCount: coupon.usageCount ?? (AVAILABLE_COUPONS[code]?.usageCount || 0)
  };

  AVAILABLE_COUPONS[code] = normalized;

  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('coupons').upsert({
        code: normalized.code,
        type: normalized.type,
        value: normalized.value,
        max_discount_paise: normalized.maxDiscountPaise,
        min_order_paise: normalized.minOrderPaise,
        valid_until: normalized.validUntil,
        description: normalized.description,
        is_active: normalized.isActive,
        usage_count: normalized.usageCount,
        updated_at: new Date().toISOString()
      }, { onConflict: 'code' });
    } catch {
      // Memory state is maintained
    }
  }

  return normalized;
}

export async function deleteCoupon(rawCode: string): Promise<boolean> {
  const code = rawCode.trim().toUpperCase();
  if (AVAILABLE_COUPONS[code]) {
    delete AVAILABLE_COUPONS[code];
  }

  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('coupons').delete().eq('code', code);
    } catch {
      // Memory state is maintained
    }
  }

  return true;
}

