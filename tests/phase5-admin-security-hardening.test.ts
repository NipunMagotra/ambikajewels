import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { GET as getAdminOrders, PATCH as patchAdminOrders } from '../src/app/api/admin/orders/route';
import { POST as postAdminRates } from '../src/app/api/admin/rates/route';
import { GET as getBvcOrders } from '../src/app/api/admin/orders/bvc/route';
import { GET as checkAuthHandler } from '../src/app/api/admin/check-auth/route';
import { middleware } from '../src/middleware';
import {
  createAdminSessionToken,
  verifyAdminSessionTokenString,
  verifyAdminAuth,
  getAdminCookieName,
  ADMIN_SESSION_MAX_AGE_SECONDS,
} from '../src/lib/adminAuth';

describe('Phase 5: Admin Security Hardening & Zero-Trust Access Regression Suite', () => {
  const TEST_SECRET = 'ambika_secure_admin_session_secret_2026_key_99';
  process.env.ADMIN_SESSION_SECRET = TEST_SECRET;
  process.env.ADMIN_PASSCODE = 'ambika2026';

  // Helper to create a valid authorization header
  const createValidAuthHeaders = () => {
    const token = createAdminSessionToken(3600);
    return {
      Authorization: `Bearer ${token}`,
      Cookie: `${getAdminCookieName()}=${encodeURIComponent(token)}`,
    };
  };

  // =========================================================================
  // 1. Unauthenticated GET /api/admin/orders returns 401
  // =========================================================================
  describe('1. Unauthenticated GET /api/admin/orders', () => {
    it('returns HTTP 401 when called with no credentials', async () => {
      const req = new Request('http://localhost:3000/api/admin/orders', {
        method: 'GET',
      });
      const res = await getAdminOrders(req);
      const data = await res.json();

      assert.strictEqual(res.status, 401, 'Should return 401 status code');
      assert.strictEqual(data.success, false);
      assert.match(data.message, /unauthorized|admin session required/i);
    });

    it('returns HTTP 401 when called with invalid/forged token', async () => {
      const req = new Request('http://localhost:3000/api/admin/orders', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer invalid_forged_token.1234567890abcdef',
        },
      });
      const res = await getAdminOrders(req);
      assert.strictEqual(res.status, 401);
    });

    it('returns HTTP 401 when called with an expired session token', async () => {
      // Create token expired 1 hour ago
      const expiredTimestamp = Date.now() - 3600 * 1000;
      const expiredToken = `${expiredTimestamp}.deadbeef1234567890`;
      const req = new Request('http://localhost:3000/api/admin/orders', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${expiredToken}`,
        },
      });
      const res = await getAdminOrders(req);
      assert.strictEqual(res.status, 401);
    });
  });

  // =========================================================================
  // 2. Unauthenticated PATCH /api/admin/orders returns 401
  // =========================================================================
  describe('2. Unauthenticated PATCH /api/admin/orders', () => {
    it('returns HTTP 401 when attempting to update order status without auth', async () => {
      const req = new Request('http://localhost:3000/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 'order_123', status: 'shipped' }),
      });
      const res = await patchAdminOrders(req);
      const data = await res.json();

      assert.strictEqual(res.status, 401);
      assert.strictEqual(data.success, false);
      assert.match(data.message, /unauthorized/i);
    });
  });

  // =========================================================================
  // 3. Unauthenticated POST /api/admin/rates returns 401
  // =========================================================================
  describe('3. Unauthenticated POST /api/admin/rates', () => {
    it('returns HTTP 401 when attempting to modify bullion rates without auth', async () => {
      const req = new Request('http://localhost:3000/api/admin/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gold_24k: 9999,
          gold_22k: 8888,
          silver_999: 100,
        }),
      });
      const res = await postAdminRates(req);
      const data = await res.json();

      assert.strictEqual(res.status, 401);
      assert.strictEqual(data.success, false);
      assert.match(data.error, /unauthorized/i);
    });
  });

  // =========================================================================
  // 4. Unauthenticated access to /admin/orders is blocked or redirected
  // =========================================================================
  describe('4. Middleware Blocking & Redirection for Unauthenticated Users', () => {
    it('redirects unauthenticated browser requests from /admin/orders to /admin/login', async () => {
      const req = new NextRequest('http://localhost:3000/admin/orders');
      const res = await middleware(req);

      // In Next.js middleware, redirection returns 307 or 302 with Location header
      assert.ok(res.status === 307 || res.status === 302, `Expected redirect status, got ${res.status}`);
      const location = res.headers.get('location') || '';
      assert.ok(location.includes('/admin/login'), `Expected redirect to /admin/login, got: ${location}`);
      assert.ok(location.includes('redirect=%2Fadmin%2Forders') || location.includes('redirect=/admin/orders'));
    });

    it('redirects unauthenticated requests to root /admin to /admin/login', async () => {
      const req = new NextRequest('http://localhost:3000/admin');
      const res = await middleware(req);

      assert.ok(res.status === 307 || res.status === 302);
      const location = res.headers.get('location') || '';
      assert.ok(location.includes('/admin/login'));
    });

    it('blocks unauthenticated API requests to /api/admin/orders at the middleware layer with 401', async () => {
      const req = new NextRequest('http://localhost:3000/api/admin/orders');
      const res = await middleware(req);

      assert.strictEqual(res.status, 401);
      const data = await res.json();
      assert.strictEqual(data.success, false);
      assert.match(data.error, /unauthorized/i);
    });
  });

  // =========================================================================
  // 5. Valid authenticated admin can access these functions
  // =========================================================================
  describe('5. Authenticated Admin Access Verification', () => {
    it('grants access to GET /api/admin/orders when a valid token is provided', async () => {
      const auth = createValidAuthHeaders();
      const req = new Request('http://localhost:3000/api/admin/orders', {
        method: 'GET',
        headers: auth,
      });

      const res = await getAdminOrders(req);
      const data = await res.json();

      assert.strictEqual(res.status, 200, 'Authenticated admin should receive HTTP 200');
      assert.strictEqual(data.success, true);
      assert.ok(Array.isArray(data.orders));
    });

    it('allows middleware to pass /admin/orders when valid session cookie is attached', async () => {
      const token = createAdminSessionToken(3600);
      const req = new NextRequest('http://localhost:3000/admin/orders', {
        headers: {
          Cookie: `${getAdminCookieName()}=${encodeURIComponent(token)}`,
        },
      });

      const res = await middleware(req);
      // When permitted, Next.js middleware returns next() with x-middleware-next header or status 200
      assert.strictEqual(res.status, 200);
      assert.notStrictEqual(res.headers.get('location')?.includes('/admin/login'), true);
    });

    it('verifies /api/admin/check-auth returns { authenticated: true } for valid session', async () => {
      const auth = createValidAuthHeaders();
      const req = new Request('http://localhost:3000/api/admin/check-auth', {
        headers: auth,
      });
      const res = await checkAuthHandler(req);
      const data = await res.json();

      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.authenticated, true);
    });

    it('verifies /api/admin/check-auth returns { authenticated: false } for missing session', async () => {
      const req = new Request('http://localhost:3000/api/admin/check-auth');
      const res = await checkAuthHandler(req);
      const data = await res.json();

      assert.strictEqual(res.status, 200);
      assert.strictEqual(data.authenticated, false);
    });
  });

  // =========================================================================
  // 6. Customer PII is never returned to unauthenticated requests
  // =========================================================================
  describe('6. Customer PII Protection Guarantee', () => {
    it('strictly guarantees zero customer PII fields are exposed to unauthenticated callers', async () => {
      const req = new Request('http://localhost:3000/api/admin/orders');
      const res = await getAdminOrders(req);
      const rawText = await res.text();

      assert.strictEqual(res.status, 401);

      // Verify no PII keys exist anywhere in the payload
      assert.strictEqual(rawText.includes('customer_name'), false, 'Must not expose customer_name');
      assert.strictEqual(rawText.includes('customer_phone'), false, 'Must not expose customer_phone');
      assert.strictEqual(rawText.includes('customer_email'), false, 'Must not expose customer_email');
      assert.strictEqual(rawText.includes('shipping_address'), false, 'Must not expose shipping_address');
      assert.strictEqual(rawText.includes('pan_number'), false, 'Must not expose pan_number');
    });

    it('strictly guarantees BVC armored shipment data is not exposed to unauthenticated callers', async () => {
      const req = new Request('http://localhost:3000/api/admin/orders/bvc');
      const res = await getBvcOrders(req);
      const rawText = await res.text();

      assert.strictEqual(res.status, 401);
      assert.strictEqual(rawText.includes('bvc_docket_number'), false);
      assert.strictEqual(rawText.includes('customer_phone'), false);
    });
  });

  // =========================================================================
  // 7. Admin authentication cannot be bypassed
  // =========================================================================
  describe('7. Tampering & Bypass Resistance Defenses', () => {
    it('cannot be bypassed by query parameter injection (e.g. ?admin=true, ?bypass=1, ?auth=1)', async () => {
      const bypassUrls = [
        'http://localhost:3000/api/admin/orders?admin=true',
        'http://localhost:3000/api/admin/orders?bypass=1',
        'http://localhost:3000/api/admin/orders?auth=1',
        'http://localhost:3000/api/admin/orders?role=admin',
        'http://localhost:3000/api/admin/orders?secret=ambika2026',
      ];

      for (const url of bypassUrls) {
        const req = new Request(url);
        const res = await getAdminOrders(req);
        assert.strictEqual(res.status, 401, `Failed to block query bypass: ${url}`);
      }
    });

    it('cannot be bypassed by spoofed client headers (X-Forwarded-For, X-Admin, X-Role, etc.)', async () => {
      const spoofHeaders: Record<string, string>[] = [
        { 'X-Admin': 'true' },
        { 'X-Forwarded-For': '127.0.0.1' },
        { 'X-Role': 'admin' },
        { 'X-Original-URL': '/admin/orders' },
        { 'X-Rewrite-URL': '/admin/orders' },
        { Authorization: 'Basic YWRtaW46cGFzc3dvcmQ=' }, // Invalid basic auth
      ];

      for (const headers of spoofHeaders) {
        const req = new Request('http://localhost:3000/api/admin/orders', { headers });
        const res = await getAdminOrders(req);
        assert.strictEqual(res.status, 401, `Failed to block spoofed headers: ${JSON.stringify(headers)}`);
      }
    });

    it('cannot be bypassed by tampering with signature bytes or timestamp', () => {
      const validToken = createAdminSessionToken(3600);
      const [expiry, sig] = validToken.split('.');

      // 1. Tamper with timestamp
      const tamperedTimeToken = `${Number(expiry) + 1000}.${sig}`;
      assert.strictEqual(verifyAdminSessionTokenString(tamperedTimeToken), false);

      // 2. Tamper with signature hex characters
      const tamperedSigToken = `${expiry}.${sig.slice(0, -2)}00`;
      assert.strictEqual(verifyAdminSessionTokenString(tamperedSigToken), false);

      // 3. Null / undefined / empty string tokens
      assert.strictEqual(verifyAdminSessionTokenString(''), false);
      assert.strictEqual(verifyAdminSessionTokenString(null), false);
      assert.strictEqual(verifyAdminSessionTokenString(undefined), false);
      assert.strictEqual(verifyAdminSessionTokenString('not_a_valid_token'), false);
    });

    it('cannot be bypassed in middleware via URL encoded manipulation or query strings', async () => {
      const bypassRequests = [
        new NextRequest('http://localhost:3000/admin/orders?admin=true'),
        new NextRequest('http://localhost:3000/admin/orders?bypass=true'),
        new NextRequest('http://localhost:3000/api/admin/orders?bypass=1'),
      ];

      for (const req of bypassRequests) {
        const res = await middleware(req);
        if (req.nextUrl.pathname.startsWith('/api/admin')) {
          assert.strictEqual(res.status, 401, `Middleware permitted bypass on ${req.nextUrl.pathname}`);
        } else {
          assert.ok(
            res.status === 307 || res.status === 302,
            `Middleware permitted bypass on ${req.nextUrl.pathname}`
          );
        }
      }
    });
  });
});
