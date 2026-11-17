import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';

import {
  encryptSensitiveData,
  decryptSensitiveData,
  maskPanNumber,
  generateOrderAccessToken,
  verifyOrderAccessToken
} from '../src/lib/encryption';
import {
  sendCustomerOtp,
  verifyCustomerOtp,
  createCustomerSessionToken,
  parseCustomerSessionToken
} from '../src/lib/customerAuth';
import {
  getAdminSecret,
  verifyAdminSessionTokenString,
  createAdminSessionToken
} from '../src/lib/adminAuth';
import {
  verifyStaffSession,
  createStaffSessionToken,
  hashPassword,
  verifyPassword
} from '../src/lib/staffAuth';
import { validateEnvironment } from '../src/lib/env';
import { POST as adminLoginRoute } from '../src/app/api/admin/login/route';
import { POST as webhookRoute } from '../src/app/api/razorpay/webhook/route';
import { POST as otpSendRoute } from '../src/app/api/auth/otp/send/route';
import { POST as otpVerifyRoute } from '../src/app/api/auth/otp/verify/route';
import { generateOrderConfirmationEmailHtml } from '../src/lib/email';
import { verifyBvcWebhookSignature } from '../src/lib/bvcLogistics';

describe('P0 Production Blockers Comprehensive Test Suite', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
    // Ensure test baseline
    process.env.ADMIN_SESSION_SECRET = 'test_admin_session_secret_32_chars_123';
    process.env.PAN_ENCRYPTION_SECRET = 'test_pan_encryption_secret_32_chars_123';
    process.env.ENCRYPTION_SECRET = 'test_pan_encryption_secret_32_chars_123';
    process.env.ADMIN_PASSCODE = 'ambika987654';
    process.env.RESEND_API_KEY = 're_test_key_12345';
    process.env.RESEND_FROM_EMAIL = 'Ambika Jewels <orders@ambikajewelsonline.com>';
    process.env.RAZORPAY_KEY_SECRET = 'rzp_test_secret_key_123';
    process.env.RAZORPAY_WEBHOOK_SECRET = 'whsec_test_razorpay_webhook_999';
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID = 'rzp_test_key_id_123';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  // =========================================================================
  // P0.1: Sharp Dependency & Image Upload Handling
  // =========================================================================
  describe('P0.1: Image Upload & Sharp Verification', () => {
    it('verifies that sharp is installed and loadable in package dependencies', async () => {
      const sharp = (await import('sharp')).default;
      assert.ok(sharp, 'Sharp must be loadable');
      const testBuffer = await sharp({
        create: {
          width: 10,
          height: 10,
          channels: 3,
          background: { r: 255, g: 0, b: 0 }
        }
      }).png().toBuffer();
      assert.ok(testBuffer.length > 0);
    });
  });

  // =========================================================================
  // P0.2: Hardcoded Fallback Secrets Removal
  // =========================================================================
  describe('P0.2: Removal of Hardcoded Fallback Secrets', () => {
    it('rejects login with old hardcoded default passcode "ambika2026" when server passcode is different', async () => {
      process.env.ADMIN_PASSCODE = 'real_secure_passcode_9999';

      const req = new Request('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: 'ambika2026' })
      });
      const res = await adminLoginRoute(req);
      assert.equal(res.status, 401);
      const data = await res.json();
      assert.equal(data.success, false);
    });

    it('fails safely with 500 when ADMIN_PASSCODE is missing on server', async () => {
      delete process.env.ADMIN_PASSCODE;

      const req = new Request('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: 'ambika2026' })
      });
      const res = await adminLoginRoute(req);
      assert.equal(res.status, 500);
      const data = await res.json();
      assert.match(data.message, /not configured/i);
    });

    it('strictly throws fatal error in production when ADMIN_SESSION_SECRET is missing', () => {
      (process.env as any).NODE_ENV = 'production';
      delete process.env.ADMIN_SESSION_SECRET;

      assert.throws(
        () => getAdminSecret(),
        /\[SECURITY FATAL\] Missing or insecure ADMIN_SESSION_SECRET/
      );
    });

    it('environment validator flags missing or insecure ADMIN_PASSCODE and ADMIN_SESSION_SECRET in production', () => {
      (process.env as any).NODE_ENV = 'production';
      delete process.env.ADMIN_PASSCODE;
      delete process.env.ADMIN_SESSION_SECRET;

      assert.throws(
        () => validateEnvironment(),
        /ADMIN_PASSCODE[\s\S]*ADMIN_SESSION_SECRET/
      );
    });
  });

  // =========================================================================
  // P0.3: Customer OTP Security, Zero Plaintext Leakage & Rate Limiting
  // =========================================================================
  describe('P0.3: Customer OTP Flow & Leak Elimination', () => {
    const testEmail = 'customer.audit@example.com';

    it('never leaks testOtp in production responses even if RESEND_API_KEY is missing', async () => {
      (process.env as any).NODE_ENV = 'production';
      delete process.env.RESEND_API_KEY;

      const res = await sendCustomerOtp(testEmail);
      // In production without email provider, fails safely and NEVER includes testOtp
      assert.equal(res.success, false);
      assert.equal((res as any).testOtp, undefined);
      assert.match(res.message, /unavailable/i);
    });

    it('never leaks testOtp in production responses when RESEND_API_KEY is present', async () => {
      (process.env as any).NODE_ENV = 'production';
      process.env.RESEND_API_KEY = 're_live_key_999';

      const res = await sendCustomerOtp('patron.prod@ambikajewels.com');
      assert.equal((res as any).testOtp, undefined);
    });

    it('does not store OTP in plaintext in memory buffer', async () => {
      const email = 'hash.check@example.com';
      await sendCustomerOtp(email);

      const store = (globalThis as any).__ambika_customer_otps as Map<string, any>;
      const record = store.get(email);
      assert.ok(record, 'Record should exist in store');
      assert.equal(record.code, undefined, 'Plaintext code MUST NOT exist on record');
      assert.ok(record.hashedCode, 'Hashed code must exist');
      assert.ok(record.salt, 'Cryptographic salt must exist');
      assert.equal(record.hashedCode.length, 64, 'Must be SHA-256 64-char hex string');
    });

    it('verifies valid OTP and rejects invalid OTP with attempt decrements', async () => {
      process.env.NODE_ENV = 'test';
      const email = 'verify.test@example.com';
      const sendRes = await sendCustomerOtp(email);
      assert.ok(sendRes.testOtp);

      // Wrong code
      const wrong = await verifyCustomerOtp(email, '000000');
      assert.equal(wrong.success, false);
      assert.match(wrong.message, /attempts remaining/i);

      // Correct code
      const right = await verifyCustomerOtp(email, sendRes.testOtp);
      assert.equal(right.success, true);
      assert.ok(right.token);
    });

    it('locks and invalidates OTP after 5 consecutive failed verification attempts', async () => {
      process.env.NODE_ENV = 'test';
      const email = 'lockout.test@example.com';
      const sendRes = await sendCustomerOtp(email);
      assert.ok(sendRes.testOtp);

      for (let i = 0; i < 4; i++) {
        const attempt = await verifyCustomerOtp(email, '111111');
        assert.equal(attempt.success, false);
      }

      // 5th failed attempt triggers lockout
      const fifth = await verifyCustomerOtp(email, '111111');
      assert.equal(fifth.success, false);
      assert.match(fifth.message, /Too many invalid attempts/i);

      // Even correct OTP is now rejected because record was invalidated
      const correctAfterLock = await verifyCustomerOtp(email, sendRes.testOtp);
      assert.equal(correctAfterLock.success, false);
    });

    it('enforces 60-second cooldown between repeated OTP generation requests', async () => {
      const email = 'cooldown.test@example.com';
      const first = await sendCustomerOtp(email);
      assert.equal(first.success, true);

      // Immediate second request must be rejected with cooldown
      const second = await sendCustomerOtp(email);
      assert.equal(second.success, false);
      assert.ok(second.cooldownSeconds && second.cooldownSeconds > 0);
      assert.match(second.message, /seconds before requesting a new code/i);
    });

    it('rejects expired OTP tokens', async () => {
      process.env.NODE_ENV = 'test';
      const email = 'expired.test@example.com';
      const sendRes = await sendCustomerOtp(email);
      assert.ok(sendRes.testOtp);

      const store = (globalThis as any).__ambika_customer_otps as Map<string, any>;
      const record = store.get(email);
      // Manually set expiry to the past
      record.expiresAt = Date.now() - 5000;

      const res = await verifyCustomerOtp(email, sendRes.testOtp);
      assert.equal(res.success, false);
      assert.match(res.message, /expired/i);
    });
  });

  // =========================================================================
  // P0.4: Customer Phone Login Blocker (Option A)
  // =========================================================================
  describe('P0.4: Customer Phone Login Disabled in Production', () => {
    it('strictly rejects phone number login in production mode with clear message to use email', async () => {
      (process.env as any).NODE_ENV = 'production';
      process.env.RESEND_API_KEY = 're_live_key_999';

      const res = await sendCustomerOtp('9876543210');
      assert.equal(res.success, false);
      assert.match(res.message, /Mobile SMS authentication is not available.*registered email/i);
    });

    it('accepts email address login in production mode', async () => {
      (process.env as any).NODE_ENV = 'production';
      process.env.RESEND_API_KEY = 're_live_key_999';

      const res = await sendCustomerOtp('patron@example.com');
      assert.equal(res.success, true);
      assert.match(res.message, /Verification code sent to/i);
    });
  });

  // =========================================================================
  // P0.5: Dedicated PAN Encryption Secret
  // =========================================================================
  describe('P0.5: Dedicated PAN Encryption Isolation', () => {
    it('encrypts and decrypts PAN data with dedicated PAN_ENCRYPTION_SECRET', () => {
      const rawPan = 'ABCDE1234F';
      const encrypted = encryptSensitiveData(rawPan);

      assert.ok(encrypted.includes(':'));
      assert.notEqual(encrypted, rawPan);
      assert.equal(encrypted.includes(rawPan), false, 'Plaintext PAN must not appear in cipher text');

      const decrypted = decryptSensitiveData(encrypted);
      assert.equal(decrypted, rawPan);
    });

    it('strictly fails and throws when PAN_ENCRYPTION_SECRET and ENCRYPTION_SECRET are missing', () => {
      delete process.env.PAN_ENCRYPTION_SECRET;
      delete process.env.ENCRYPTION_SECRET;
      // Even if Razorpay key exists, it MUST NOT fall back to Razorpay!
      process.env.RAZORPAY_KEY_SECRET = 'rzp_some_secret_key_12345';

      assert.throws(
        () => encryptSensitiveData('ABCDE1234F'),
        /\[SECURITY FATAL\] Missing or insecure PAN_ENCRYPTION_SECRET/
      );
    });

    it('environment validator flags missing or insecure PAN_ENCRYPTION_SECRET', () => {
      (process.env as any).NODE_ENV = 'production';
      delete process.env.PAN_ENCRYPTION_SECRET;
      delete process.env.ENCRYPTION_SECRET;

      assert.throws(
        () => validateEnvironment(),
        /PAN_ENCRYPTION_SECRET/
      );
    });

    it('fails safely and returns empty string when decrypting with incorrect key or corrupted tag', () => {
      const rawPan = 'XYZAB5678K';
      const encrypted = encryptSensitiveData(rawPan);

      // Change secret to wrong key
      process.env.PAN_ENCRYPTION_SECRET = 'completely_different_key_32_characters_long_999';
      process.env.ENCRYPTION_SECRET = 'completely_different_key_32_characters_long_999';

      const result = decryptSensitiveData(encrypted);
      assert.equal(result, '', 'Decryption with wrong key must safely return empty string');
    });

    it('supports backward-compatible migration via PAN_ENCRYPTION_LEGACY_KEY', () => {
      const oldSecret = 'legacy_secret_key_used_before_deployment_123';
      process.env.PAN_ENCRYPTION_SECRET = oldSecret;
      const legacyEncrypted = encryptSensitiveData('BNZPA9999M');

      // Now rotate to new key, but provide old key as legacy fallback
      process.env.PAN_ENCRYPTION_SECRET = 'new_brand_new_primary_key_32_chars_123';
      process.env.PAN_ENCRYPTION_LEGACY_KEY = oldSecret;

      const decrypted = decryptSensitiveData(legacyEncrypted);
      assert.equal(decrypted, 'BNZPA9999M', 'Should seamlessly decrypt legacy records using migration key');
    });

    it('masks PAN number correctly for public invoice display', () => {
      assert.equal(maskPanNumber('ABCDE1234F'), 'XXXXX1234X');
      assert.equal(maskPanNumber(''), 'XXXXX0000X');
    });
  });

  // =========================================================================
  // P0.6: Razorpay Webhook Recovery, BVC & Email Post-Payment Processing
  // =========================================================================
  describe('P0.6: Razorpay Webhook Payment Recovery & Post-Processing', () => {
    it('rejects webhooks with missing signature with 400', async () => {
      const req = new Request('http://localhost:3000/api/razorpay/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: 'payment.captured' })
      });
      const res = await webhookRoute(req);
      assert.equal(res.status, 400);
      const data = await res.json();
      assert.match(data.error, /missing x-razorpay-signature/i);
    });

    it('rejects forged webhook signature with 400', async () => {
      const rawBody = JSON.stringify({ event: 'payment.captured', id: 'evt_forged_1' });
      const badSig = crypto.createHmac('sha256', 'wrong_secret').update(rawBody).digest('hex');

      const req = new Request('http://localhost:3000/api/razorpay/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': badSig
        },
        body: rawBody
      });
      const res = await webhookRoute(req);
      assert.equal(res.status, 400);
      const data = await res.json();
      assert.match(data.error, /invalid webhook signature/i);
    });

    it('processes valid webhook signature and handles unreconciled event safely', async () => {
      const rawBody = JSON.stringify({
        event: 'payment.captured',
        id: `evt_valid_${Date.now()}`,
        payload: {
          payment: {
            entity: {
              id: 'pay_valid_123',
              order_id: 'order_nonexistent_999',
              amount: 5000000
            }
          }
        }
      });
      const validSig = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
        .update(rawBody)
        .digest('hex');

      const req = new Request('http://localhost:3000/api/razorpay/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': validSig
        },
        body: rawBody
      });
      const res = await webhookRoute(req);
      // Must return 200 to acknowledge Razorpay so it does not retry orphaned events
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
    });
  });

  // =========================================================================
  // P0.7: Resend Production Email Configuration
  // =========================================================================
  describe('P0.7: Production Resend Email Configuration', () => {
    it('verifies that RESEND_FROM_EMAIL uses verified domain and does not use onboarding@resend.dev in production', () => {
      (process.env as any).NODE_ENV = 'production';
      process.env.RESEND_FROM_EMAIL = 'Ambika Jewels <onboarding@resend.dev>';

      assert.throws(
        () => validateEnvironment(),
        /onboarding@resend\.dev/
      );
    });

    it('verifies that configured verified production sender passes validation', () => {
      (process.env as any).NODE_ENV = 'production';
      process.env.RESEND_FROM_EMAIL = 'Ambika Jewels <orders@ambikajewelsonline.com>';
      process.env.RESEND_API_KEY = 're_verified_key_12345';
      process.env.ADMIN_PASSCODE = 'ambika987654';
      process.env.ADMIN_SESSION_SECRET = 'ambika_secure_admin_session_secret_2026_key_99';
      process.env.PAN_ENCRYPTION_SECRET = 'ambika_pan_encryption_secret_2026_aes256_key_99';
      process.env.RAZORPAY_KEY_SECRET = 'rzp_secret_key_123';
      process.env.RAZORPAY_WEBHOOK_SECRET = 'rzp_whsec_123';
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID = 'rzp_key_id_123';

      const report = validateEnvironment();
      assert.equal(report.isValid, true, `Errors found: ${report.errors.join(', ')}`);
    });

    it('generates compliant HTML confirmation email with statutory seller details', () => {
      const emailHtml = generateOrderConfirmationEmailHtml({
        orderNumber: 'AMB-TEST-001',
        customerName: 'Smt. Anjali Sharma',
        customerEmail: 'anjali@example.com',
        items: [{
          name: '22K Gold Kundan Earrings',
          quantity: 1,
          price: 12500000,
          metal_finish: '22K Yellow Gold'
        }],
        subtotal: 12500000,
        tax: 375000,
        shipping: 0,
        total: 12875000,
        shippingAddress: 'Sector 1, Lower Roop Nagar, Jammu, 180013',
        paymentId: 'pay_test_123456',
        bvcDocketNumber: 'BVC-ARM-998877'
      });

      assert.ok(emailHtml.includes('AMB-TEST-001'));
      assert.ok(emailHtml.includes('22K Gold Kundan Earrings'));
      assert.ok(emailHtml.includes('BVC Logistics Secure Armed Network'));
      assert.ok(emailHtml.includes('BVC-ARM-998877'));
      assert.ok(emailHtml.includes('GSTIN'));
    });
  });

  // =========================================================================
  // Additional Deep P0 Defense & Edge Case Invariants
  // =========================================================================
  describe('P0 Deep Hardening: Rate Limiting, Concurrency & Signature Security', () => {
    it('rate-limits excessive OTP send requests from same IP with HTTP 429', async () => {
      const ip = '192.168.10.42';
      // Attempt 6 requests rapidly from same IP
      let lastStatus = 200;
      for (let i = 0; i < 6; i++) {
        const req = new Request('http://localhost:3000/api/auth/otp/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-forwarded-for': ip
          },
          body: JSON.stringify({ identifier: `patron_${i}@example.com` })
        });
        const res = await otpSendRoute(req);
        lastStatus = res.status;
      }
      assert.equal(lastStatus, 429, '6th request must trigger HTTP 429 rate limit');
    });

    it('rate-limits excessive OTP verify attempts from same IP with HTTP 429', async () => {
      const ip = '192.168.10.99';
      let lastStatus = 400;
      for (let i = 0; i < 11; i++) {
        const req = new Request('http://localhost:3000/api/auth/otp/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-forwarded-for': ip
          },
          body: JSON.stringify({ identifier: 'lockout@example.com', code: '000000' })
        });
        const res = await otpVerifyRoute(req);
        lastStatus = res.status;
      }
      assert.equal(lastStatus, 429, '11th verification attempt must trigger HTTP 429 rate limit');
    });

    it('environment validator rejects known default passcode "ambika2026" in production', () => {
      (process.env as any).NODE_ENV = 'production';
      process.env.ADMIN_PASSCODE = 'ambika2026'; // Old default
      process.env.ADMIN_SESSION_SECRET = 'valid_session_secret_32_characters_long_123';
      process.env.PAN_ENCRYPTION_SECRET = 'valid_pan_secret_32_characters_long_123';
      process.env.RESEND_API_KEY = 're_live_key_valid';
      process.env.RESEND_FROM_EMAIL = 'Ambika Jewels <orders@ambikajewelsonline.com>';
      process.env.RAZORPAY_KEY_SECRET = 'rzp_sec_123';
      process.env.RAZORPAY_WEBHOOK_SECRET = 'whsec_123';
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID = 'rzp_id_123';

      assert.throws(
        () => validateEnvironment(),
        /insecure default placeholder/
      );
    });

    it('environment validator rejects missing RESEND_FROM_EMAIL in production', () => {
      (process.env as any).NODE_ENV = 'production';
      delete process.env.RESEND_FROM_EMAIL;
      process.env.ADMIN_PASSCODE = 'secure_admin_passcode_987654';
      process.env.ADMIN_SESSION_SECRET = 'valid_session_secret_32_characters_long_123';
      process.env.PAN_ENCRYPTION_SECRET = 'valid_pan_secret_32_characters_long_123';
      process.env.RESEND_API_KEY = 're_live_key_valid';
      process.env.RAZORPAY_KEY_SECRET = 'rzp_sec_123';
      process.env.RAZORPAY_WEBHOOK_SECRET = 'whsec_123';
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID = 'rzp_id_123';

      assert.throws(
        () => validateEnvironment(),
        /RESEND_FROM_EMAIL is missing/
      );
    });

    it('verifies BVC webhook rejects forged or missing signatures strictly', () => {
      process.env.BVC_WEBHOOK_SECRET = 'bvc_sec_live_998877';
      const body = JSON.stringify({ status: 'DELIVERED', docket_number: 'BVC-12345' });

      // Missing signature
      assert.equal(verifyBvcWebhookSignature(body, null), false);

      // Forged signature
      assert.equal(verifyBvcWebhookSignature(body, 'sha256=invalid_forged_hash'), false);

      // Valid signature
      const validSig = crypto.createHmac('sha256', process.env.BVC_WEBHOOK_SECRET).update(body).digest('hex');
      assert.equal(verifyBvcWebhookSignature(body, `sha256=${validSig}`), true);
    });
  });
});
