import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';
import { POST as verifyPaymentHandler } from '../src/app/api/razorpay/verify/route';
import { PATCH as patchAdminOrders } from '../src/app/api/admin/orders/route';
import { calculateOrderPricingServer } from '../src/lib/serverPricing';
import { createAdminSessionToken } from '../src/lib/adminAuth';
import { checkRateLimit } from '../src/lib/rateLimit';

describe('Phase 6: Comprehensive E-Commerce Payment & Business Logic Security Suite', () => {
  const TEST_KEY_SECRET = 'test_razorpay_secret_key_32_chars_123';
  const TEST_ADMIN_SECRET = 'ambika_secure_admin_session_secret_2026_key_99';

  process.env.RAZORPAY_KEY_SECRET = TEST_KEY_SECRET;
  process.env.ADMIN_SESSION_SECRET = TEST_ADMIN_SECRET;

  // Helper to generate valid Razorpay payment signature
  const generateValidSignature = (orderId: string, paymentId: string) => {
    return crypto
      .createHmac('sha256', TEST_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
  };

  // =========================================================================
  // 1. Razorpay Payment Verification & Signature Defense
  // =========================================================================
  describe('1. Cryptographic Signature & Rate Limiting on /api/razorpay/verify', () => {
    it('rejects tampered or invalid Razorpay HMAC signatures with HTTP 400', async () => {
      const orderId = 'order_test_999';
      const paymentId = 'pay_test_999';

      const req = new Request('http://localhost:3000/api/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: 'tampered_invalid_signature_hex_code',
          customer_info: {
            first_name: 'Ananya',
            email: 'ananya@example.com',
            phone: '9876543210',
            address: 'Gandhi Nagar',
            city: 'Jammu',
            state: 'Jammu & Kashmir',
            pincode: '180004'
          },
          items: [],
          total_amount: 5000000
        })
      });

      const res = await verifyPaymentHandler(req);
      const data = await res.json();

      assert.strictEqual(res.status, 400);
      assert.strictEqual(data.success, false);
      assert.match(data.error, /invalid razorpay signature/i);
    });

    it('enforces rate limiting on /api/razorpay/verify', async () => {
      const testIp = '198.51.100.77';
      // Rate limit allows up to 15 requests in 5 minutes
      for (let i = 0; i < 15; i++) {
        await checkRateLimit('verifyPayment', testIp);
      }
      const blocked = await checkRateLimit('verifyPayment', testIp);
      assert.strictEqual(blocked.success, false, '16th request must be rate limited');
    });
  });

  // =========================================================================
  // 2. Business Logic: Amount Mismatch & Order Substitution Defenses
  // =========================================================================
  describe('2. E-Commerce Business Logic & Amount Anti-Tampering', () => {
    it('rejects order with invalid, negative, or fractional quantities in server pricing', async () => {
      // Test negative quantity (-1)
      await assert.rejects(
        async () => {
          await calculateOrderPricingServer([{ id: 'test_item', quantity: -1 }]);
        },
        /Must be an integer between 1 and 50/
      );

      // Test fractional quantity (0.25)
      await assert.rejects(
        async () => {
          await calculateOrderPricingServer([{ id: 'test_item', quantity: 0.25 }]);
        },
        /Must be an integer between 1 and 50/
      );

      // Test zero quantity
      await assert.rejects(
        async () => {
          await calculateOrderPricingServer([{ id: 'test_item', quantity: 0 }]);
        },
        /Must be an integer between 1 and 50/
      );

      // Test overflow quantity (999999)
      await assert.rejects(
        async () => {
          await calculateOrderPricingServer([{ id: 'test_item', quantity: 999999 }]);
        },
        /Must be an integer between 1 and 50/
      );
    });

    it('server pricing engine strictly computes 3% GST and free shipping thresholds', async () => {
      const mockResolver = async (id: string) => {
        if (id === 'prod_100k') return { price: 10000000, name: 'Heritage Gold Choker' }; // ₹1,00,000
        return null;
      };

      const result = await calculateOrderPricingServer(
        [{ id: 'prod_100k', quantity: 1 }],
        mockResolver
      );

      assert.strictEqual(result.subtotal_paise, 10000000);
      assert.strictEqual(result.tax_paise, 300000); // 3% GST = ₹3,000
      assert.strictEqual(result.shipping_paise, 0); // Free shipping for orders >= ₹50,000
      assert.strictEqual(result.total_paise, 10300000); // ₹1,03,000
    });
  });

  // =========================================================================
  // 3. Admin Orders Status Allowlist Validation
  // =========================================================================
  describe('3. Admin Orders API Input Validation (Allowlist)', () => {
    it('rejects malicious or unknown status values in PATCH /api/admin/orders with HTTP 400', async () => {
      const token = createAdminSessionToken(3600);
      const invalidStatusRequests = [
        'hacked_free_shipment',
        'sql_injection_status',
        '<script>alert(1)</script>',
        'super_admin_bypass'
      ];

      for (const badStatus of invalidStatusRequests) {
        const req = new Request('http://localhost:3000/api/admin/orders', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            id: 'ord_12345',
            status: badStatus
          })
        });

        const res = await patchAdminOrders(req);
        const data = await res.json();

        assert.strictEqual(res.status, 400, `Expected 400 for bad status: ${badStatus}`);
        assert.strictEqual(data.success, false);
        assert.match(data.message, /invalid order status/i);
      }
    });

    it('requires order id in PATCH /api/admin/orders', async () => {
      const token = createAdminSessionToken(3600);
      const req = new Request('http://localhost:3000/api/admin/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'confirmed'
        })
      });

      const res = await patchAdminOrders(req);
      const data = await res.json();

      assert.strictEqual(res.status, 400);
      assert.strictEqual(data.success, false);
      assert.match(data.message, /order id is required/i);
    });
  });
});
