import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateCoupon, AVAILABLE_COUPONS } from '../src/lib/couponEngine';
import { calculateOrderPricingServer } from '../src/lib/serverPricing';
import { POST as contactHandler } from '../src/app/api/contact/route';

describe('Phase 7: Production-Readiness & Core Flow Security Suite', () => {

  // =========================================================================
  // 1. Server-Authoritative Coupon Engine
  // =========================================================================
  describe('1. Coupon Engine Validation & Security', () => {
    it('applies DOGRA5000 correctly on qualifying cart (₹50,000+)', () => {
      const subtotalPaise = 6000000; // ₹60,000
      const res = validateCoupon('DOGRA5000', subtotalPaise);
      assert.strictEqual(res.isValid, true);
      assert.strictEqual(res.discountPaise, 500000); // ₹5,000 off
      assert.strictEqual(res.code, 'DOGRA5000');
    });

    it('rejects DOGRA5000 if order subtotal is below minimum ₹50,000', () => {
      const subtotalPaise = 3000000; // ₹30,000
      const res = validateCoupon('DOGRA5000', subtotalPaise);
      assert.strictEqual(res.isValid, false);
      assert.strictEqual(res.discountPaise, 0);
      assert.match(res.message, /minimum order subtotal/i);
    });

    it('applies WELCOME2026 percentage discount correctly with cap', () => {
      // 2% off on ₹1,00,000 order = ₹2,000 (200,000 paise)
      const subtotalPaise = 10000000;
      const res = validateCoupon('WELCOME2026', subtotalPaise);
      assert.strictEqual(res.isValid, true);
      assert.strictEqual(res.discountPaise, 200000);

      // Super large order: 2% of ₹10,00,000 is ₹20,000, capped at max ₹10,000 (1,000,000 paise)
      const largeSubtotal = 100000000;
      const cappedRes = validateCoupon('WELCOME2026', largeSubtotal);
      assert.strictEqual(cappedRes.isValid, true);
      assert.strictEqual(cappedRes.discountPaise, 1000000);
    });

    it('rejects expired coupon code EXPIRED2025', () => {
      const subtotalPaise = 5000000;
      const res = validateCoupon('EXPIRED2025', subtotalPaise);
      assert.strictEqual(res.isValid, false);
      assert.strictEqual(res.discountPaise, 0);
      assert.match(res.message, /expired/i);
    });

    it('rejects fake or non-existent coupon codes', () => {
      const res = validateCoupon('FAKECOUPON99', 5000000);
      assert.strictEqual(res.isValid, false);
      assert.strictEqual(res.discountPaise, 0);
      assert.match(res.message, /invalid or does not exist/i);
    });

    it('handles null, undefined, and empty coupon inputs safely', () => {
      assert.strictEqual(validateCoupon('', 5000000).isValid, false);
      assert.strictEqual(validateCoupon(null as any, 5000000).isValid, false);
      assert.strictEqual(validateCoupon(undefined as any, 5000000).isValid, false);
      assert.strictEqual(validateCoupon('   ', 5000000).isValid, false);
    });
  });

  // =========================================================================
  // 2. Server Pricing Calculation & Out-of-Stock Guard
  // =========================================================================
  describe('2. Server Pricing Calculation & Stock Guard', () => {
    const testResolver = async (id: string) => {
      if (id === 'test_prod_1') {
        return { price: 6000000, name: 'Dogra Gold Kada', stock_status: 'in_stock' };
      }
      if (id === 'test_prod_sold_out') {
        return { price: 15000000, name: 'Vintage Guluband', stock_status: 'out_of_stock' };
      }
      return null;
    };

    it('applies valid coupon discount and computes 3% GST on discounted subtotal', async () => {
      const dummyItem = {
        product_id: 'test_prod_1',
        quantity: 1
      };

      const result = await calculateOrderPricingServer(
        [dummyItem],
        testResolver,
        'DOGRA5000'
      );
      // Subtotal = 60,000; Discount = 5,000; Discounted = 55,000; GST (3%) = 1,650; Total = 56,650
      assert.strictEqual(result.subtotal_paise, 6000000);
      assert.strictEqual(result.discount_paise, 500000);
      assert.strictEqual(result.coupon_code, 'DOGRA5000');
      assert.strictEqual(result.tax_paise, Math.round(5500000 * 0.03));
      assert.strictEqual(result.total_paise, 5500000 + Math.round(5500000 * 0.03));
    });

    it('throws error and halts checkout when an item is out of stock', async () => {
      const outOfStockItem = {
        product_id: 'test_prod_sold_out',
        quantity: 1
      };

      await assert.rejects(
        async () => {
          await calculateOrderPricingServer([outOfStockItem], testResolver);
        },
        /is currently out of stock and cannot be ordered/i
      );
    });
  });

  // =========================================================================
  // 3. Contact & Concierge API Validation
  // =========================================================================
  describe('3. Contact Inquiry Endpoint Validation', () => {
    it('rejects contact request with missing required name', async () => {
      const req = new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '',
          email: 'priya@example.com',
          phone: '9876543210',
          message: 'Hello Ambika Jewels'
        })
      });

      const res = await contactHandler(req);
      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.strictEqual(data.success, false);
      assert.match(data.error, /Please enter your full name/i);
    });

    it('rejects invalid email formats', async () => {
      const req = new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Priya Sharma',
          email: 'not-an-email',
          phone: '9876543210',
          message: 'Looking for a bespoke Dogra bridal necklace.'
        })
      });

      const res = await contactHandler(req);
      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.strictEqual(data.success, false);
      assert.match(data.error, /Please provide a valid email address/i);
    });

    it('accepts valid contact submission and succeeds', async () => {
      const req = new Request('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Priya Sharma',
          email: 'priya.sharma@example.com',
          phone: '+919876543210',
          subject: 'Bespoke Consultation',
          message: 'Looking for a bespoke Dogra bridal necklace for my upcoming wedding in Jammu.'
        })
      });

      const res = await contactHandler(req);
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
    });
  });
});
