/**
 * Ambika Jewels — Server-Authoritative Coupon & Promotional Discount Engine
 *
 * All coupon validations occur strictly server-side.
 * Never trust discount calculations from the browser.
 */

export interface CouponRule {
  code: string;
  type: 'flat' | 'percentage';
  value: number; // in paise for flat, or percentage (e.g. 2 for 2%)
  maxDiscountPaise?: number; // Cap for percentage discounts
  minOrderPaise: number;
  validUntil: string; // ISO date string (YYYY-MM-DD)
  description: string;
  isActive: boolean;
  usageCount?: number;
}

export const PRESET_COUPONS: Record<string, CouponRule> = {
  'DOGRA5000': {
    code: 'DOGRA5000',
    type: 'flat',
    value: 500000, // ₹5,000 off
    minOrderPaise: 5000000, // Min ₹50,000 order
    validUntil: '2027-12-31',
    description: 'Festive privilege: ₹5,000 flat discount on orders above ₹50,000.',
    isActive: true,
    usageCount: 42,
  },
  'WELCOME2026': {
    code: 'WELCOME2026',
    type: 'percentage',
    value: 2, // 2% off
    maxDiscountPaise: 1000000, // Max ₹10,000 discount
    minOrderPaise: 2500000, // Min ₹25,000 order
    validUntil: '2027-12-31',
    description: 'Welcome heirloom privilege: 2% off up to ₹10,000 on orders above ₹25,000.',
    isActive: true,
    usageCount: 118,
  },
  'HERITAGE2500': {
    code: 'HERITAGE2500',
    type: 'flat',
    value: 250000, // ₹2,500 off
    minOrderPaise: 3000000, // Min ₹30,000 order
    validUntil: '2027-12-31',
    description: 'Dogra heritage launch: ₹2,500 flat discount on orders above ₹30,000.',
    isActive: true,
    usageCount: 29,
  },
  'EXPIRED2025': {
    code: 'EXPIRED2025',
    type: 'flat',
    value: 100000,
    minOrderPaise: 1000000,
    validUntil: '2025-01-01', // Expired
    description: 'Expired test promotion.',
    isActive: true,
    usageCount: 5,
  },
};

// In-memory dynamic coupons map initialized from PRESET_COUPONS
export const AVAILABLE_COUPONS: Record<string, CouponRule> = { ...PRESET_COUPONS };

export interface CouponValidationResult {
  isValid: boolean;
  code: string;
  discountPaise: number;
  message: string;
  rule?: CouponRule;
}

/**
 * Validates a coupon against the subtotal and returns the discount amount in paise.
 */
export function validateCoupon(
  rawCode: string | undefined | null,
  subtotalPaise: number
): CouponValidationResult {
  if (!rawCode || typeof rawCode !== 'string') {
    return {
      isValid: false,
      code: '',
      discountPaise: 0,
      message: 'No coupon code provided.',
    };
  }

  const code = rawCode.trim().toUpperCase();
  if (!code) {
    return {
      isValid: false,
      code: '',
      discountPaise: 0,
      message: 'Please enter a valid coupon code.',
    };
  }

  const coupon = AVAILABLE_COUPONS[code];
  if (!coupon) {
    return {
      isValid: false,
      code,
      discountPaise: 0,
      message: `Coupon code "${code}" is invalid or does not exist.`,
    };
  }

  if (!coupon.isActive) {
    return {
      isValid: false,
      code,
      discountPaise: 0,
      message: `Coupon code "${code}" is currently inactive or disabled.`,
    };
  }

  // Expiration check
  const expiryDate = new Date(`${coupon.validUntil}T23:59:59.999Z`);
  if (Date.now() > expiryDate.getTime()) {
    return {
      isValid: false,
      code,
      discountPaise: 0,
      message: `Coupon code "${code}" has expired on ${coupon.validUntil}.`,
    };
  }

  // Minimum order check
  if (subtotalPaise < coupon.minOrderPaise) {
    const minRupees = Math.round(coupon.minOrderPaise / 100).toLocaleString('en-IN');
    return {
      isValid: false,
      code,
      discountPaise: 0,
      message: `Coupon "${code}" requires a minimum order subtotal of ₹${minRupees}.`,
    };
  }

  // Calculate discount
  let discount = 0;
  if (coupon.type === 'flat') {
    discount = Math.min(coupon.value, subtotalPaise);
  } else if (coupon.type === 'percentage') {
    const rawDiscount = Math.round((subtotalPaise * coupon.value) / 100);
    discount = coupon.maxDiscountPaise
      ? Math.min(rawDiscount, coupon.maxDiscountPaise)
      : rawDiscount;
  }

  return {
    isValid: true,
    code,
    discountPaise: discount,
    message: `Coupon "${code}" applied: ₹${(discount / 100).toLocaleString('en-IN')} savings.`,
    rule: coupon,
  };
}
