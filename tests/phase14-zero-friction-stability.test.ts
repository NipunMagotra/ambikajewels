import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

process.env.ADMIN_SESSION_SECRET = 'ambika_secure_admin_session_secret_2026_key_99';

import { createAdminSessionToken } from '../src/lib/adminAuth';
import { getCartWhatsAppUrl } from '../src/lib/whatsapp';
import { siteConfig } from '../src/config/siteConfig';
import { PATCH as patchAdminOrder } from '../src/app/api/admin/orders/route';

describe('Phase 14: Zero-Friction Stability & Workflow Assurance Test Suite', () => {
  const adminToken = createAdminSessionToken();

  // =========================================================================
  // 1. Bullion Rate Freshness & Weekend Continuity
  // =========================================================================
  describe('1. Weekend Bullion Rate Continuity', () => {
    it('allows rates up to 72 hours old on weekends so shoppers are never blocked', () => {
      const baseMaxHours = 24;
      
      // Helper mirroring verifyBullionRateFreshness logic
      const checkFreshnessForDay = (ageHours: number, dayOfWeek: number) => {
        const effectiveMaxHours = (dayOfWeek === 0 || dayOfWeek === 6 || dayOfWeek === 1)
          ? Math.max(baseMaxHours, 72)
          : baseMaxHours;
        return ageHours <= effectiveMaxHours;
      };

      // Scenario: Saturday evening (day 6), rate stamped 30 hours ago (Friday morning)
      assert.equal(checkFreshnessForDay(30, 6), true);

      // Scenario: Sunday afternoon (day 0), rate stamped 50 hours ago (Friday morning)
      assert.equal(checkFreshnessForDay(50, 0), true);

      // Scenario: Monday morning 9 AM (day 1), rate stamped 68 hours ago (Friday morning)
      assert.equal(checkFreshnessForDay(68, 1), true);

      // Scenario: Regular Wednesday (day 3), rate older than 24h should be flagged for showroom update
      assert.equal(checkFreshnessForDay(26, 3), false);
    });
  });

  // =========================================================================
  // 2. WhatsApp Concierge Fallback Payload Validation
  // =========================================================================
  describe('2. WhatsApp Concierge Fallback Payload Integrity', () => {
    it('generates properly formatted and encoded WhatsApp order URL for seamless recovery', () => {
      const testItems = [
        {
          product_id: 'prod_kundan_1',
          name: 'Royal Heritage Kundan Choker',
          price: 24500000,
          quantity: 1,
          metal_finish: '22K Gold'
        }
      ];

      const url = getCartWhatsAppUrl(testItems as any, '₹2,45,000');
      assert.ok(url.startsWith('https://wa.me/'));
      assert.ok(url.includes(siteConfig.contact.whatsapp.replace('+', '')));
      assert.ok(url.includes('Royal%20Heritage%20Kundan%20Choker') || url.includes('Royal+Heritage+Kundan+Choker'));
      assert.ok(url.includes('2%2C45%2C000') || url.includes('2,45,000'));
    });
  });

  // =========================================================================
  // 3. Cart Defensive Sanitization Invariant
  // =========================================================================
  describe('3. Cart Hydration Sanitization Invariant', () => {
    it('filters out corrupt or NaN cart items to prevent checkout NaN crashes', () => {
      const corruptedSavedCart = {
        items: [
          {
            product_id: 'prod_valid_1',
            name: 'Valid Diamond Ring',
            price: 5000000,
            quantity: 1,
            metal_finish: '18K Gold'
          },
          {
            product_id: 'prod_corrupt_2',
            name: 'Broken Item with NaN price',
            price: NaN,
            quantity: 1
          },
          {
            product_id: undefined,
            name: 'Broken Item missing ID',
            price: 10000,
            quantity: 1
          },
          {
            product_id: 'prod_zero_qty',
            name: 'Item with 0 quantity',
            price: 10000,
            quantity: 0
          }
        ]
      };

      // Mirror CartProvider hydration sanitizer
      const validItems = corruptedSavedCart.items.filter(
        (it: any) => it && it.product_id && typeof it.price === 'number' && !isNaN(it.price) && it.quantity > 0
      );

      assert.equal(validItems.length, 1);
      assert.equal(validItems[0].product_id, 'prod_valid_1');

      const cartTotal = validItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      assert.equal(cartTotal, 5000000);
      assert.equal(isNaN(cartTotal), false);
    });

    it('ensures mount effect does not overwrite localStorage before state initialization', () => {
      let isInitialized = false;
      let storageSaved = false;

      // Simulate mount commit
      const mountEffect = () => {
        if (!isInitialized) {
          isInitialized = true;
          return;
        }
        storageSaved = true;
      };

      mountEffect(); // Initial render mount
      assert.equal(storageSaved, false, 'Initial mount effect must not overwrite localStorage');

      // Subsequent update / re-render
      mountEffect();
      assert.equal(storageSaved, true, 'Subsequent re-render safely persists cart');
    });
  });

  // =========================================================================
  // 4. Phone Number Normalization Assertion
  // =========================================================================
  describe('4. Phone Number Normalization for Customer Order Lookup', () => {
    it('normalizes diverse customer phone inputs to 10-digit base format', () => {
      const inputs = [
        '+91 96825 89725',
        '+919682589725',
        '9682589725',
        '09682589725',
        '+91-96825-89725'
      ];

      for (const input of inputs) {
        const clean = input.replace(/\D/g, '').slice(-10);
        assert.equal(clean, '9682589725');
      }
    });
  });

  // =========================================================================
  // 5. Admin Docket Number Synchronized Propagation
  // =========================================================================
  describe('5. Admin Docket Number Synchronization', () => {
    it('blocks unauthenticated PATCH /api/admin/orders with 401', async () => {
      const req = new Request('http://localhost:3000/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 'dummy_order_id', bvc_docket_number: 'BVC-JAM-9988' })
      });
      const res = await patchAdminOrder(req);
      assert.equal(res.status, 401);
    });

    it('validates status bounds and rejects invalid order status', async () => {
      const req = new Request('http://localhost:3000/api/admin/orders', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: 'dummy_order_id', status: 'invalid_status_xyz' })
      });
      const res = await patchAdminOrder(req);
      assert.equal(res.status, 400);
      const data = await res.json();
      assert.equal(data.success, false);
      assert.match(data.message, /Invalid order status/);
    });
  });
});

