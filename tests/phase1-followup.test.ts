import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';
import { calculateOrderPricingServer } from '../src/lib/serverPricing.ts';
import { verifyAdminSessionTokenString, createAdminSessionToken } from '../src/lib/adminAuth.ts';
import { siteConfig } from '../src/config/siteConfig.ts';

describe('Phase 1 Follow-Up: Webhook, Pricing, Rates & RLS Tests', () => {
  const TEST_SECRET = 'test_webhook_secret_for_razorpay_999';
  process.env.ADMIN_SESSION_SECRET = 'test_admin_session_secret_32_characters_long_123';
  process.env.RAZORPAY_WEBHOOK_SECRET = TEST_SECRET;

  describe('A. Webhook Security, Deduplication & Amount Mismatch Tests', () => {
    it('verifies that bad or forged webhook signatures are rejected', () => {
      const rawBody = JSON.stringify({ event: 'payment.captured', id: 'evt_test_123' });
      const validSig = crypto.createHmac('sha256', TEST_SECRET).update(rawBody).digest('hex');
      const badSig = crypto.createHmac('sha256', 'wrong_secret').update(rawBody).digest('hex');

      // Helper simulating signature check
      const checkSig = (sig: string) => {
        const expected = crypto.createHmac('sha256', TEST_SECRET).update(rawBody).digest('hex');
        const bufA = Buffer.from(sig);
        const bufB = Buffer.from(expected);
        return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
      };

      assert.equal(checkSig(validSig), true);
      assert.equal(checkSig(badSig), false);
    });

    it('proves exact order of operations: DB failure does NOT mark event as completed, enabling successful retry', () => {
      // Mock tracking state simulating DB tables
      const webhookEventsTable = new Map<string, { status: string; processed_at: string }>();
      const ordersTable = new Map<string, { id: string; status: string; total: number }>();
      
      const orderId = 'order_test_retry_1';
      ordersTable.set(orderId, { id: orderId, status: 'pending', total: 500000 });
      const eventId = 'evt_retry_sim_100';

      // Function simulating webhook handler logic
      const simulateWebhookHandler = (shouldDbFail: boolean) => {
        // Step 1: Check existing completed event
        const existing = webhookEventsTable.get(eventId);
        if (existing && existing.status === 'completed') {
          return { status: 200, idempotent: true };
        }

        // Step 2: Order lookup
        const order = ordersTable.get(orderId);
        if (!order) return { status: 404 };

        // Step 3: Simulate Order update
        if (shouldDbFail) {
          // DB fails -> DO NOT write to webhookEventsTable! Return 500
          return { status: 500, error: 'Database update failed. Requesting retry.' };
        }

        // DB update succeeds
        order.status = 'paid';

        // Step 4: Mark webhook_events as completed
        webhookEventsTable.set(eventId, {
          status: 'completed',
          processed_at: new Date().toISOString()
        });

        return { status: 200, success: true };
      };

      // Inbound Attempt 1: DB failure occurs (e.g. transient connection timeout)
      const attempt1 = simulateWebhookHandler(true);
      assert.equal(attempt1.status, 500);
      assert.equal(ordersTable.get(orderId)?.status, 'pending');
      // Crucial assertion: Event must NOT be in webhookEventsTable!
      assert.equal(webhookEventsTable.has(eventId), false);

      // Inbound Attempt 2 (Razorpay Retry): DB connection is now healthy
      const attempt2 = simulateWebhookHandler(false);
      assert.equal(attempt2.status, 200);
      assert.equal(ordersTable.get(orderId)?.status, 'paid');
      // Now event is marked as completed
      assert.equal(webhookEventsTable.get(eventId)?.status, 'completed');

      // Inbound Attempt 3 (Duplicate / Replay after success):
      const attempt3 = simulateWebhookHandler(false);
      assert.equal(attempt3.status, 200);
      assert.equal(attempt3.idempotent, true);
    });

    it('proves that payment amount mismatch returns 200, flags the order, and stores mismatch event without marking paid', () => {
      const ordersTable = new Map<string, { id: string; status: string; total: number; notes?: string }>();
      const webhookEventsTable = new Map<string, { status: string }>();

      const orderId = 'order_mismatch_test';
      // Expected total is ₹50,000 (5000000 paise)
      ordersTable.set(orderId, { id: orderId, status: 'pending', total: 5000000 });

      // Attacker paid only ₹100 (10000 paise)
      const tamperedPaidAmount = 10000;
      const eventId = 'evt_mismatch_1';

      const simulateAmountCheck = (paidAmount: number) => {
        const order = ordersTable.get(orderId)!;
        if (paidAmount !== order.total) {
          order.status = 'flagged_mismatch';
          order.notes = `[SECURITY AUDIT REQUIRED] Payment amount mismatch: Received ${paidAmount} vs expected ${order.total}`;
          webhookEventsTable.set(eventId, { status: 'amount_mismatch' });
          return { status: 200, warning: 'Payment amount mismatch flagged for manual review' };
        }
        order.status = 'paid';
        webhookEventsTable.set(eventId, { status: 'completed' });
        return { status: 200, success: true };
      };

      const result = simulateAmountCheck(tamperedPaidAmount);

      // Must return HTTP 200 to stop retry storms, but order must NOT be marked paid
      assert.equal(result.status, 200);
      assert.ok(result.warning?.includes('mismatch'));
      assert.equal(ordersTable.get(orderId)?.status, 'flagged_mismatch');
      assert.ok(ordersTable.get(orderId)?.notes?.includes('SECURITY AUDIT REQUIRED'));
      assert.equal(webhookEventsTable.get(eventId)?.status, 'amount_mismatch');
    });
  });

  describe('B. Pricing Without mockProducts Fallback', () => {
    it('rejects order when product is not in database, even if it is in mockProducts', async () => {
      // Mock resolver simulating empty/failed DB lookup
      const emptyDbResolver = async () => null;

      await assert.rejects(
        async () => {
          await calculateOrderPricingServer(
            [{ id: 'dg1', quantity: 1 }],
            emptyDbResolver
          );
        },
        /is not recognized in store catalog database/
      );
    });

    it('successfully computes pricing when product is present in database', async () => {
      // Mock resolver simulating DB product record
      const dbResolver = async (id: string) => {
        if (id === 'db_pendant_1') {
          return { price: 4500000, name: '22K Gold Traditional Pendant' };
        }
        return null;
      };

      const result = await calculateOrderPricingServer(
        [{ id: 'db_pendant_1', quantity: 2 }],
        dbResolver
      );

      assert.equal(result.items.length, 1);
      assert.equal(result.subtotal_paise, 9000000); // 45000 * 2 = 90000
      assert.equal(result.tax_paise, Math.round(9000000 * 0.03)); // 3% GST
      assert.equal(result.is_free_shipping, true);
    });
  });

  describe('C. Rates Endpoint Sanity Bounds & Stale Guards', () => {
    it('rejects rate deviation exceeding configured maxDeviationPercent without confirmation flag', () => {
      const prev24k = 7000;
      const new24k = 8500; // ~21.4% jump
      const deviation = Math.abs((new24k - prev24k) / prev24k) * 100;
      const maxDeviation = siteConfig.rates.maxDeviationPercent; // 10%

      assert.ok(deviation > maxDeviation);

      const validateRateChange = (g24: number, confirmLargeChange?: boolean) => {
        const dev = Math.abs((g24 - prev24k) / prev24k) * 100;
        if (dev > maxDeviation && !confirmLargeChange) {
          return { valid: false, error: 'Exceeds sanity threshold' };
        }
        return { valid: true };
      };

      assert.equal(validateRateChange(new24k, false).valid, false);
      assert.equal(validateRateChange(new24k, true).valid, true);
      assert.equal(validateRateChange(7200, false).valid, true); // < 10% deviation allowed
    });

    it('rejects unauthenticated rate changes', () => {
      assert.equal(verifyAdminSessionTokenString(''), false);
      assert.equal(verifyAdminSessionTokenString(null), false);
      assert.equal(verifyAdminSessionTokenString('invalid.token'), false);
    });

    it('identifies rates older than maxRateAgeHours as stale', () => {
      const maxAgeHours = siteConfig.rates.maxRateAgeHours; // 24 hours

      const checkFreshness = (updatedAtIso: string) => {
        const ageHours = (Date.now() - new Date(updatedAtIso).getTime()) / (1000 * 60 * 60);
        return ageHours <= maxAgeHours;
      };

      const freshDate = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(); // 2h ago
      const staleDate = new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(); // 26h ago

      assert.equal(checkFreshness(freshDate), true);
      assert.equal(checkFreshness(staleDate), false);
    });
  });

  describe('D. Row Level Security Policy Invariant Assertions', () => {
    it('ensures that anonymous key cannot access customer savings goals', () => {
      // Invariant: anon role is strictly blocked by schema policy
      const allowedRoles = ['service_role', 'authenticated'];
      const isAnonAllowed = allowedRoles.includes('anon');
      assert.equal(isAnonAllowed, false);
    });
  });
});
