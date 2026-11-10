import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';
import { POST as verifyPaymentHandler } from '../src/app/api/razorpay/verify/route';
import { POST as webhookHandler } from '../src/app/api/razorpay/webhook/route';
import { GET as trackHandler } from '../src/app/api/track/route';
import { GET as getAdminOrders, PATCH as patchAdminOrders } from '../src/app/api/admin/orders/route';
import { POST as postAdminRates } from '../src/app/api/admin/rates/route';
import { calculateOrderPricingServer } from '../src/lib/serverPricing';
import { validateCoupon } from '../src/lib/couponEngine';
import { createAdminSessionToken } from '../src/lib/adminAuth';

describe('Phase 8 Pre-Launch Verification: End-to-End Core Invariants', () => {
  const TEST_KEY_SECRET = 'test_razorpay_secret_key_32_chars_123';
  const TEST_ADMIN_SECRET = 'ambika_secure_admin_session_secret_2026_key_99';
  const TEST_WEBHOOK_SECRET = 'test_webhook_secret_key_32_chars_999';

  process.env.RAZORPAY_KEY_SECRET = TEST_KEY_SECRET;
  process.env.ADMIN_SESSION_SECRET = TEST_ADMIN_SECRET;
  process.env.RAZORPAY_WEBHOOK_SECRET = TEST_WEBHOOK_SECRET;

  const generateSignature = (orderId: string, paymentId: string) => {
    return crypto
      .createHmac('sha256', TEST_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
  };

  // =========================================================================
  // 1. Payment Verification (Razorpay Test Mode)
  // =========================================================================
  describe('1. Payment Verification & Cryptographic Defense', () => {
    it('accepts valid HMAC signature and processes order verification', async () => {
      const orderId = 'order_test_success_1';
      const paymentId = 'pay_test_success_1';
      const validSig = generateSignature(orderId, paymentId);

      const req = new Request('http://localhost:3000/api/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: validSig,
          customer_info: {
            first_name: 'Rohit',
            last_name: 'Sharma',
            email: 'rohit@example.com',
            phone: '9876543210',
            address: 'Residency Road',
            city: 'Jammu',
            state: 'Jammu & Kashmir',
            pincode: '180001'
          },
          items: [{ product_id: 'test_item_1', name: 'Dogra Kada', price: 5000000, quantity: 1 }],
          total_amount: 5150000
        })
      });

      const res = await verifyPaymentHandler(req);
      const data = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.success, true);
      assert.match(data.order_number, /^AMB-/);
    });

    it('rejects tampered or forged HMAC signatures with HTTP 400', async () => {
      const req = new Request('http://localhost:3000/api/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: 'order_test_tamper',
          razorpay_payment_id: 'pay_test_tamper',
          razorpay_signature: 'invalid_forged_signature_hex_000000',
          customer_info: {
            first_name: 'Tamper',
            email: 'tamper@example.com',
            phone: '9876543210'
          },
          items: [],
          total_amount: 100
        })
      });

      const res = await verifyPaymentHandler(req);
      const data = await res.json();
      assert.strictEqual(res.status, 400);
      assert.strictEqual(data.success, false);
      assert.match(data.error, /invalid razorpay signature/i);
    });

    it('webhook rejects requests with missing or invalid signature', async () => {
      const rawBody = JSON.stringify({ event: 'payment.captured', id: 'evt_invalid_1' });
      const req = new Request('http://localhost:3000/api/razorpay/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': 'tampered_signature_hex'
        },
        body: rawBody
      });

      const res = await webhookHandler(req);
      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.strictEqual(data.success, false);
      assert.match(data.error, /invalid.*signature/i);
    });
  });

  // =========================================================================
  // 2. Inventory & Stock Controls
  // =========================================================================
  describe('2. Inventory & Stock Control Boundaries', () => {
    const stockResolver = async (id: string) => {
      if (id === 'in_stock_kada') {
        return { price: 8000000, name: 'Dogra Gold Kada', stock_status: 'in_stock' };
      }
      if (id === 'sold_out_ring') {
        return { price: 4500000, name: 'Dogri Nath', stock_status: 'out_of_stock' };
      }
      return null;
    };

    it('calculates price correctly for in-stock items with 3% GST', async () => {
      const result = await calculateOrderPricingServer(
        [{ product_id: 'in_stock_kada', quantity: 1 }],
        stockResolver
      );

      assert.strictEqual(result.subtotal_paise, 8000000);
      assert.strictEqual(result.tax_paise, 240000); // 3% of 80,000 = 2,400
      assert.strictEqual(result.shipping_paise, 0); // Complimentary > 50,000
      assert.strictEqual(result.total_paise, 8240000);
    });

    it('strictly halts and throws error when an out-of-stock item is submitted', async () => {
      await assert.rejects(
        async () => {
          await calculateOrderPricingServer(
            [{ product_id: 'sold_out_ring', quantity: 1 }],
            stockResolver
          );
        },
        /is currently out of stock and cannot be ordered/i
      );
    });

    it('rejects order quantities above maximum limit of 50 units', async () => {
      await assert.rejects(
        async () => {
          await calculateOrderPricingServer(
            [{ product_id: 'in_stock_kada', quantity: 51 }],
            stockResolver
          );
        },
        /must be an integer between 1 and 50/i
      );
    });
  });

  // =========================================================================
  // 3. Coupon Engine Server Authority
  // =========================================================================
  describe('3. Coupon Engine Server Authority & Anti-Tampering', () => {
    it('applies flat DOGRA5000 coupon on orders >= ₹50,000', () => {
      const res = validateCoupon('DOGRA5000', 5000000); // exactly ₹50,000
      assert.strictEqual(res.isValid, true);
      assert.strictEqual(res.discountPaise, 500000); // ₹5,000 off
    });

    it('rejects DOGRA5000 when subtotal is ₹49,999 (below minimum)', () => {
      const res = validateCoupon('DOGRA5000', 4999900);
      assert.strictEqual(res.isValid, false);
      assert.strictEqual(res.discountPaise, 0);
      assert.match(res.message, /minimum order subtotal of ₹50,000/i);
    });

    it('caps percentage discount at configured maximum (WELCOME2026 cap = ₹10,000)', () => {
      // 2% of ₹10,00,000 = ₹20,000; should cap at ₹10,000 (1,000,000 paise)
      const res = validateCoupon('WELCOME2026', 100000000);
      assert.strictEqual(res.isValid, true);
      assert.strictEqual(res.discountPaise, 1000000);
    });

    it('rejects expired coupon EXPIRED2025', () => {
      const res = validateCoupon('EXPIRED2025', 5000000);
      assert.strictEqual(res.isValid, false);
      assert.match(res.message, /expired/i);
    });

    it('rejects unknown or invalid coupon strings safely', () => {
      assert.strictEqual(validateCoupon('INVALID_CODE', 5000000).isValid, false);
      assert.strictEqual(validateCoupon('', 5000000).isValid, false);
      assert.strictEqual(validateCoupon(null, 5000000).isValid, false);
    });
  });

  // =========================================================================
  // 4. Admin Security & Zero-Trust Verification
  // =========================================================================
  describe('4. Admin Security & Zero-Trust Invariants', () => {
    it('strictly denies unauthenticated GET /api/admin/orders with HTTP 401', async () => {
      const req = new Request('http://localhost:3000/api/admin/orders', {
        method: 'GET'
      });
      const res = await getAdminOrders(req);
      assert.strictEqual(res.status, 401);
      const data = await res.json();
      assert.strictEqual(data.success, false);
      assert.match(data.message, /unauthorized|admin session required/i);
    });

    it('strictly denies unauthenticated PATCH /api/admin/orders with HTTP 401', async () => {
      const req = new Request('http://localhost:3000/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: 'order_123', status: 'shipped' })
      });
      const res = await patchAdminOrders(req);
      assert.strictEqual(res.status, 401);
      const data = await res.json();
      assert.strictEqual(data.success, false);
    });

    it('strictly denies unauthenticated POST /api/admin/rates with HTTP 401', async () => {
      const req = new Request('http://localhost:3000/api/admin/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gold_24k: 8000 })
      });
      const res = await postAdminRates(req);
      assert.strictEqual(res.status, 401);
      const data = await res.json();
      assert.strictEqual(data.success, false);
    });

    it('grants access to admin orders when valid HMAC session token is provided', async () => {
      const validToken = createAdminSessionToken(3600);
      const req = new Request('http://localhost:3000/api/admin/orders', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${validToken}`,
          Cookie: `ambika_admin_session=${encodeURIComponent(validToken)}`
        }
      });
      const res = await getAdminOrders(req);
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(Array.isArray(data.orders));
    });
  });

  // =========================================================================
  // 5. Order Tracking Privacy & Dual-Possession IDOR Prevention
  // =========================================================================
  describe('5. Order Tracking Privacy & IDOR Prevention', () => {
    it('allows access when order reference and valid phone match', async () => {
      const req = new Request('http://localhost:3000/api/track?orderId=AMB-108249&phone=9682589725');
      const res = await trackHandler(req);
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(data.order.order_number);
      assert.ok(data.order.invoice);
    });

    it('allows access when order reference and valid email match', async () => {
      const req = new Request('http://localhost:3000/api/track?orderId=AMB-108249&email=concierge@ambikajewels.com');
      const res = await trackHandler(req);
      assert.strictEqual(res.status, 200);
      const data = await res.json();
      assert.strictEqual(data.success, true);
      assert.ok(data.order.order_number);
      assert.ok(data.order.invoice);
    });

    it('strictly denies access when neither phone, email, nor token is supplied with HTTP 401', async () => {
      const req = new Request('http://localhost:3000/api/track?orderId=AMB-108249');
      const res = await trackHandler(req);
      assert.strictEqual(res.status, 401);
      const data = await res.json();
      assert.strictEqual(data.success, false);
      assert.strictEqual(data.authRequired, true);
    });

    it('rejects invalid phone format with HTTP 400', async () => {
      const req = new Request('http://localhost:3000/api/track?orderId=AMB-108249&phone=123');
      const res = await trackHandler(req);
      assert.strictEqual(res.status, 400);
      const data = await res.json();
      assert.strictEqual(data.success, false);
    });
  });
});
