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
      if (!error && data) {
        // Clear in-memory cache to strictly mirror database source of truth
        for (const k of Object.keys(AVAILABLE_COUPONS)) {
          delete AVAILABLE_COUPONS[k];
        }

        const list: CouponRule[] = data.map((row: any) => {
          const rule: CouponRule = {
            code: row.code.toUpperCase(),
            type: (row.type === 'percent' ? 'percentage' : row.type) as 'flat' | 'percentage',
            value: Number(row.value),
            maxDiscountPaise: row.max_discount_paise ? Number(row.max_discount_paise) : undefined,
            minOrderPaise: Number(row.min_order_paise || 0),
            validUntil: row.valid_until ? String(row.valid_until).slice(0, 10) : '2099-12-31',
            description: row.description || '',
            isActive: Boolean(row.is_active),
            usageCount: Number(row.usage_count || 0)
          };
          AVAILABLE_COUPONS[rule.code] = rule;
          return rule;
        });

        return list;
      }

      if (error) {
        console.error('[COUPONS FETCH DB ERROR]', error);
      }
    } catch (err) {
      console.error('[COUPONS FETCH EXCEPTION]', err);
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
    // Supabase check constraint requires type IN ('flat', 'percent')
    const dbType = normalized.type === 'percentage' ? 'percent' : normalized.type;
    const { error } = await supabaseAdmin.from('coupons').upsert({
      code: normalized.code,
      type: dbType,
      value: normalized.value,
      max_discount_paise: normalized.maxDiscountPaise ? Number(normalized.maxDiscountPaise) : null,
      min_order_paise: Number(normalized.minOrderPaise || 0),
      valid_until: normalized.validUntil ? new Date(normalized.validUntil).toISOString() : null,
      description: normalized.description || '',
      is_active: normalized.isActive,
      usage_count: normalized.usageCount,
      updated_at: new Date().toISOString()
    }, { onConflict: 'code' });

    if (error) {
      console.error('[COUPON SAVE DB ERROR]', error);
      throw new Error(`Failed to save coupon to database: ${error.message}`);
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
    const { error } = await supabaseAdmin.from('coupons').delete().eq('code', code);
    if (error) {
      console.error('[COUPON DELETE DB ERROR]', error);
      throw new Error(`Failed to delete coupon from database: ${error.message}`);
    }
  }

  return true;
}

