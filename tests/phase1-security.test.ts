import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateOrderPricingServer } from '../src/lib/serverPricing';
import {
  createAdminSessionToken,
  verifyAdminSessionTokenString,
  getAdminSecret,
  ADMIN_SESSION_MAX_AGE_SECONDS
} from '../src/lib/adminAuth';

describe('Phase 1 Security & Calculation Tests', () => {
  // Setup environment for testing
  process.env.ADMIN_SESSION_SECRET = 'test_admin_session_secret_32_characters_long_123';
  process.env.ADMIN_PASSCODE = 'SecretPasscode123';

  describe('1. Server-Side Pricing & Price Tampering Defenses', () => {
    it('rejects orders with unknown product IDs (blocks client price injection)', async () => {
      await assert.rejects(
        async () => {
          await calculateOrderPricingServer([
            { id: 'fabricated_product_999', quantity: 1 }
          ]);
        },
        /is not recognized in store catalog/
      );
    });

    it('rejects invalid, negative, or fractional quantities', async () => {
      await assert.rejects(
        async () => {
          await calculateOrderPricingServer([
            { id: 'dg1', quantity: -1 }
          ]);
        },
        /Must be an integer between 1 and 50/
      );

      await assert.rejects(
        async () => {
          await calculateOrderPricingServer([
            { id: 'dg1', quantity: 0.5 }
          ]);
        },
        /Must be an integer between 1 and 50/
      );

      await assert.rejects(
        async () => {
          await calculateOrderPricingServer([
            { id: 'dg1', quantity: 0 }
          ]);
        },
        /Must be an integer between 1 and 50/
      );
    });

    it('accurately computes subtotal, 3% GST, and shipping thresholds from authoritative catalog', async () => {
      const testResolver = async (id: string) => {
        if (id === 'dg1') return { price: 9500000, name: 'Authentic 22K Dogri Jhumki' };
        return null;
      };

      const result = await calculateOrderPricingServer(
        [{ id: 'dg1', quantity: 1 }],
        testResolver
      );

      assert.equal(result.items.length, 1);
      assert.equal(result.subtotal_paise, 9500000); // ₹95,000
      
      // 3% GST on ₹95,000 = ₹2,850 (285000 paise)
      const expectedTax = Math.round(9500000 * 0.03);
      assert.equal(result.tax_paise, expectedTax);

      // Above ₹50,000 threshold -> Free Shipping
      assert.equal(result.is_free_shipping, true);
      assert.equal(result.shipping_paise, 0);

      // Total = Subtotal + Tax
      assert.equal(result.total_paise, 9500000 + expectedTax);
    });
  });

  describe('2. Dedicated Admin Session & Lifetime Verification', () => {
    it('verifies that ADMIN_SESSION_SECRET is required and accessible', () => {
      const secret = getAdminSecret();
      assert.equal(secret, 'test_admin_session_secret_32_characters_long_123');
      assert.ok(secret.length >= 16);
    });

    it('creates a signed token with maximum lifetime of 12 hours', () => {
      assert.equal(ADMIN_SESSION_MAX_AGE_SECONDS, 12 * 60 * 60);

      const token = createAdminSessionToken();
      assert.ok(token.includes('.'));

      const [expiryStr] = token.split('.');
      const expiry = Number(expiryStr);
      const remainingMs = expiry - Date.now();

      // Should be approximately 12 hours (within 5 seconds)
      assert.ok(remainingMs <= 12 * 60 * 60 * 1000);
      assert.ok(remainingMs >= (12 * 60 * 60 - 5) * 1000);

      // Verify the generated token is cryptographically valid
      assert.equal(verifyAdminSessionTokenString(token), true);
    });

    it('rejects tampered or forged tokens', () => {
      const validToken = createAdminSessionToken();
      const [expiryStr, sig] = validToken.split('.');

      // Tampered expiry
      const tamperedExpiryToken = `${Number(expiryStr) + 1000}.${sig}`;
      assert.equal(verifyAdminSessionTokenString(tamperedExpiryToken), false);

      // Tampered signature
      const tamperedSigToken = `${expiryStr}.abc123456789deadbeef`;
      assert.equal(verifyAdminSessionTokenString(tamperedSigToken), false);

      // Expired token
      const expiredToken = `${Date.now() - 5000}.${sig}`;
      assert.equal(verifyAdminSessionTokenString(expiredToken), false);
    });
  });
});
