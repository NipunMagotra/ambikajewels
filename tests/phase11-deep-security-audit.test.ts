import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { POST as adminLogin } from '../src/app/api/admin/login/route';
import { POST as adminLogout } from '../src/app/api/admin/logout/route';
import { GET as getRates, POST as postRates } from '../src/app/api/admin/rates/route';
import { GET as getAdminProducts, POST as postAdminProducts, PATCH as patchAdminProducts } from '../src/app/api/admin/products/route';
import { POST as uploadFile } from '../src/app/api/admin/upload/route';
import { POST as createOrder } from '../src/app/api/razorpay/create-order/route';
import { POST as verifyPayment } from '../src/app/api/razorpay/verify/route';
import { POST as razorpayWebhook } from '../src/app/api/razorpay/webhook/route';
import { GET as trackOrder } from '../src/app/api/track/route';
import { createAdminSessionToken, verifyAdminSessionTokenString, revokeAdminSessionToken } from '../src/lib/adminAuth';
import crypto from 'crypto';

process.env.ADMIN_PASSCODE = '9682589725';
process.env.ADMIN_SESSION_SECRET = 'ambika_super_secret_audit_key_2026_test_env_12345';
process.env.RAZORPAY_KEY_ID = 'rzp_test_sec_audit_mock_id';
process.env.RAZORPAY_KEY_SECRET = 'rzp_test_sec_audit_mock_secret_key_12345';
process.env.RAZORPAY_WEBHOOK_SECRET = 'whsec_audit_test_secret_for_ambika_12345';

describe('Phase 11: Deep Security Audit & Penetration Testing Suite — Ambika Jewels', () => {

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario A — Anonymous Attacker
  // ──────────────────────────────────────────────────────────────────────────
  describe('Scenario A: Anonymous Attacker Surface Probing', () => {
    it('strictly denies anonymous calls to GET /api/admin/products with HTTP 401', async () => {
      const req = new Request('http://localhost:3000/api/admin/products', { method: 'GET' });
      const res = await getAdminProducts(req);
      assert.equal(res.status, 401);
      const json = await res.json();
      assert.equal(json.success, false);
    });

    it('strictly denies anonymous calls to POST /api/admin/products with HTTP 401', async () => {
      const req = new Request('http://localhost:3000/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Hacked Necklace', price: 100 })
      });
      const res = await postAdminProducts(req);
      assert.equal(res.status, 401);
    });

    it('strictly denies anonymous calls to GET /api/admin/rates with HTTP 401', async () => {
      const req = new Request('http://localhost:3000/api/admin/rates', { method: 'GET' });
      const res = await getRates(req);
      assert.equal(res.status, 401);
    });

    it('strictly denies anonymous calls to POST /api/admin/upload with HTTP 401', async () => {
      const form = new FormData();
      form.append('file', new Blob(['test'], { type: 'image/jpeg' }), 'test.jpg');
      const req = new Request('http://localhost:3000/api/admin/upload', {
        method: 'POST',
        body: form
      });
      const res = await uploadFile(req);
      assert.equal(res.status, 401);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario B — Ordinary Customer BOLA/IDOR Probing
  // ──────────────────────────────────────────────────────────────────────────
  describe('Scenario B: Customer IDOR & Unauthorized Record Access', () => {
    it('denies order tracking when no phone, email, or token is provided (prevents order enumeration)', async () => {
      const req = new Request('http://localhost:3000/api/track?orderId=AMB-108249');
      const res = await trackOrder(req);
      assert.equal(res.status, 401);
      const json = await res.json();
      assert.equal(json.authRequired, true);
    });

    it('rejects order tracking when invalid phone format is provided', async () => {
      const req = new Request('http://localhost:3000/api/track?orderId=AMB-108249&phone=1234');
      const res = await trackOrder(req);
      assert.equal(res.status, 400);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario C — Stolen Session, Expiry & Logout Revocation
  // ──────────────────────────────────────────────────────────────────────────
  describe('Scenario C: Stolen Session & Post-Logout Revocation Invariants', () => {
    it('rejects expired session tokens cryptographically', () => {
      // Token expired 10 seconds ago
      const expiredTimestamp = Date.now() - 10000;
      const secret = process.env.ADMIN_SESSION_SECRET!;
      const sig = crypto.createHmac('sha256', secret).update(`admin_session:${expiredTimestamp}`).digest('hex');
      const expiredToken = `${expiredTimestamp}.${sig}`;

      const isValid = verifyAdminSessionTokenString(expiredToken);
      assert.equal(isValid, false);
    });

    it('rejects tampered session tokens', () => {
      const validToken = createAdminSessionToken(3600);
      const tampered = validToken.slice(0, -4) + 'abcd';
      assert.equal(verifyAdminSessionTokenString(tampered), false);
    });

    it('proves that a logged-out token is actively revoked and cannot be replayed', async () => {
      const token = createAdminSessionToken(3600);
      assert.equal(verifyAdminSessionTokenString(token), true);

      // Admin logs out with this token
      const logoutReq = new Request('http://localhost:3000/api/admin/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const logoutRes = await adminLogout(logoutReq);
      assert.equal(logoutRes.status, 200);

      // Attacker attempts to replay the token after logout
      assert.equal(verifyAdminSessionTokenString(token), false, 'Token MUST be rejected after logout');
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario D — Malicious Admin / Bullion Rate Integrity
  // ──────────────────────────────────────────────────────────────────────────
  describe('Scenario D: Bullion Rate Sanity Bounds & Typo Defense', () => {
    it('rejects extreme gold rate change without explicit confirmation override', async () => {
      const token = createAdminSessionToken(3600);
      const req = new Request('http://localhost:3000/api/admin/rates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          gold_24k: 999999, // Unreasonable rate > 1000% deviation
          gold_22k: 7200,
          gold_18k: 5900,
          gold_14k: 4600,
          silver_999: 95,
          silver_925: 88
        })
      });

      const res = await postRates(req);
      assert.equal(res.status, 400);
      const json = await res.json();
      assert.equal(json.requiresConfirmation, true);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario E — Malicious Checkout & Server-Side Price Authority
  // ──────────────────────────────────────────────────────────────────────────
  describe('Scenario E: Checkout Price Tampering Defenses', () => {
    it('rejects order with non-existent product IDs', async () => {
      const req = new Request('http://localhost:3000/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ product_id: 'fake-item-id-999', quantity: 1 }],
          customer_info: {
            first_name: 'Adversary',
            phone: '9876543210',
            email: 'adv@example.com',
            address: 'Unknown Street',
            city: 'Jammu',
            state: 'Jammu and Kashmir',
            pincode: '180001'
          }
        })
      });

      const res = await createOrder(req);
      assert.equal(res.status, 400);
      const json = await res.json();
      assert.match(json.error, /not recognized|not found/i);
    });

    it('rejects order with zero or negative quantity', async () => {
      const req = new Request('http://localhost:3000/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ product_id: 'test-product', quantity: -5 }],
          customer_info: {
            first_name: 'Adversary',
            phone: '9876543210',
            email: 'adv@example.com',
            address: 'Unknown Street',
            city: 'Jammu',
            state: 'Jammu and Kashmir',
            pincode: '180001'
          }
        })
      });

      const res = await createOrder(req);
      assert.equal(res.status, 400);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario F — Payment Verification & Webhook Forgery Defenses
  // ──────────────────────────────────────────────────────────────────────────
  describe('Scenario F: Cryptographic Signature & Webhook Integrity', () => {
    it('rejects forged payment verification signature with HTTP 400', async () => {
      const req = new Request('http://localhost:3000/api/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: 'order_test_123',
          razorpay_payment_id: 'pay_test_456',
          razorpay_signature: 'forged_fake_signature_hex_value',
          customer_info: {
            first_name: 'Test',
            last_name: 'User',
            email: 'test@example.com',
            phone: '9876543210',
            address: 'Jammu',
            city: 'Jammu',
            state: 'J&K',
            pincode: '180001'
          },
          items: [],
          total_amount: 100000
        })
      });

      const res = await verifyPayment(req);
      assert.equal(res.status, 400);
      const json = await res.json();
      assert.match(json.error, /Invalid Razorpay signature/i);
    });

    it('rejects forged Razorpay webhook with missing signature', async () => {
      const req = new Request('http://localhost:3000/api/razorpay/webhook', {
        method: 'POST',
        body: JSON.stringify({ event: 'payment.captured' })
      });

      const res = await razorpayWebhook(req);
      assert.equal(res.status, 400);
    });

    it('rejects forged Razorpay webhook with invalid HMAC signature', async () => {
      const payload = JSON.stringify({ event: 'payment.captured', id: 'evt_123' });
      const req = new Request('http://localhost:3000/api/razorpay/webhook', {
        method: 'POST',
        headers: {
          'x-razorpay-signature': '0000000000000000000000000000000000000000000000000000000000000000'
        },
        body: payload
      });

      const res = await razorpayWebhook(req);
      assert.equal(res.status, 400);
      const json = await res.json();
      assert.match(json.error, /Invalid webhook signature/i);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // Scenario H — Storage & File Upload Hardening
  // ──────────────────────────────────────────────────────────────────────────
  describe('Scenario H: File Upload Magic Bytes & Anti-Script Defense', () => {
    it('rejects uploaded file with text disguised as image/jpeg via binary inspection', async () => {
      const token = createAdminSessionToken(3600);
      // Construct a fake JPEG containing ASCII text instead of valid FF D8 FF headers
      const fakeJpegBytes = new Uint8Array([0x3c, 0x73, 0x63, 0x72, 0x69, 0x70, 0x74, 0x3e]); // "<script>"
      const form = new FormData();
      form.append('file', new Blob([fakeJpegBytes], { type: 'image/jpeg' }), 'payload.jpg');

      const req = new Request('http://localhost:3000/api/admin/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: form
      });

      const res = await uploadFile(req);
      assert.equal(res.status, 400);
      const json = await res.json();
      assert.match(json.message, /Binary inspection failed/i);
    });

    it('accepts authentic JPEG with genuine magic bytes (FF D8 FF)', async () => {
      const token = createAdminSessionToken(3600);
      const validJpgBuffer = Buffer.from(
        '/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAABv/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJwAHgT/2Q==',
        'base64'
      );
      const form = new FormData();
      form.append('file', new Blob([validJpgBuffer], { type: 'image/jpeg' }), 'valid_jewel.jpg');

      const req = new Request('http://localhost:3000/api/admin/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: form
      });

      const res = await uploadFile(req);
      assert.equal(res.status, 200);
      const json = await res.json();
      assert.equal(json.success, true);
      assert.match(json.url, /\/uploads\/.*\.webp/);
    });
  });

});
