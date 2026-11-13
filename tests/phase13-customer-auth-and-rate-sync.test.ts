import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

process.env.ADMIN_SESSION_SECRET = 'ambika_secure_admin_session_secret_2026_key_99';

import { createAdminSessionToken } from '../src/lib/adminAuth';
import {
  sendCustomerOtp,
  verifyCustomerOtp,
  createCustomerSessionToken,
  parseCustomerSessionToken,
  getCustomerProfile,
  saveCustomerProfile
} from '../src/lib/customerAuth';
import { POST as postOtpSend } from '../src/app/api/auth/otp/send/route';
import { POST as postOtpVerify } from '../src/app/api/auth/otp/verify/route';
import { GET as getMe, PATCH as patchMe } from '../src/app/api/auth/me/route';
import { POST as postLogout } from '../src/app/api/auth/logout/route';
import { POST as postRecalculate } from '../src/app/api/admin/rates/recalculate/route';

describe('Phase 13: Customer OTP Auth & Bullion Rate Sync Test Suite', () => {
  const adminToken = createAdminSessionToken();
  const testPhone = '9876543210';
  const testEmail = 'patron.test@example.com';

  // =========================================================================
  // 1. Customer OTP Cryptographic & Storage Tests
  // =========================================================================
  describe('1. Customer OTP Core Verification & Security', () => {
    it('generates a 6-digit numeric OTP and verifies successfully', async () => {
      const sendRes = await sendCustomerOtp(testPhone);
      assert.equal(sendRes.success, true);
      assert.ok(sendRes.testOtp);
      assert.equal(sendRes.testOtp.length, 6);
      assert.match(sendRes.testOtp, /^\d{6}$/);

      // Verify with wrong OTP
      const wrongCheck = await verifyCustomerOtp(testPhone, '000000');
      assert.equal(wrongCheck.success, false);

      // Verify with right OTP
      const rightCheck = await verifyCustomerOtp(testPhone, sendRes.testOtp);
      assert.equal(rightCheck.success, true);
      assert.ok(rightCheck.token);
    });

    it('expires or consumes OTP so it cannot be re-used', async () => {
      const targetPhone = '9876543211';
      const sendRes = await sendCustomerOtp(targetPhone);
      assert.ok(sendRes.testOtp);

      const firstUse = await verifyCustomerOtp(targetPhone, sendRes.testOtp);
      assert.equal(firstUse.success, true);

      // Immediate reuse must fail
      const reuseCheck = await verifyCustomerOtp(targetPhone, sendRes.testOtp);
      assert.equal(reuseCheck.success, false);
    });

    it('creates tamper-proof customer session token and verifies claims', () => {
      const token = createCustomerSessionToken({
        customerId: 'cust_12345',
        phone: testPhone,
        email: testEmail,
        fullName: 'Shivani Verma'
      });

      assert.equal(typeof token, 'string');
      const payload = parseCustomerSessionToken(token);
      assert.ok(payload);
      assert.equal(payload.phone, testPhone);
      assert.equal(payload.email, testEmail);
      assert.equal(payload.fullName, 'Shivani Verma');

      // Tampering signature or payload must fail
      const tampered = token.slice(0, -5) + 'xxxxx';
      assert.equal(parseCustomerSessionToken(tampered), null);
    });
  });

  // =========================================================================
  // 2. Customer Auth HTTP API Endpoints
  // =========================================================================
  describe('2. Customer Auth Endpoints (Send, Verify, Me, Logout)', () => {
    it('sends OTP via API and rejects invalid identifier with 400', async () => {
      // Invalid identifier format
      const badReq = new Request('http://localhost:3000/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: 'abc' })
      });
      const badRes = await postOtpSend(badReq);
      assert.equal(badRes.status, 400);

      // Valid phone request
      const validReq = new Request('http://localhost:3000/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: '9682589725' })
      });
      const validRes = await postOtpSend(validReq);
      assert.equal(validRes.status, 200);
      const data = await validRes.json();
      assert.equal(data.success, true);
    });

    it('verifies OTP via API and sets secure cookie', async () => {
      const phone = '9123456789';
      const sendRes = await sendCustomerOtp(phone);
      assert.ok(sendRes.testOtp);

      const verifyReq = new Request('http://localhost:3000/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: phone, otp: sendRes.testOtp, name: 'Radha Rani' })
      });

      const verifyRes = await postOtpVerify(verifyReq);
      assert.equal(verifyRes.status, 200);
      const data = await verifyRes.json();
      assert.equal(data.success, true);
      assert.ok(data.token);

      // Check cookie header is present
      const setCookie = verifyRes.headers.get('set-cookie');
      assert.ok(setCookie && setCookie.includes('ambika_customer_session'));
    });

    it('handles authenticated /api/auth/me profile retrieval and updates', async () => {
      const sessionToken = createCustomerSessionToken({
        customerId: 'cust_test_me',
        phone: '9988776655',
        fullName: 'Sunita Sharma'
      });

      // GET /api/auth/me without session -> 401
      const anonReq = new Request('http://localhost:3000/api/auth/me');
      const anonRes = await getMe(anonReq);
      assert.equal(anonRes.status, 401);

      // GET /api/auth/me with Authorization Bearer session -> 200
      const authedReq = new Request('http://localhost:3000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });
      const authedRes = await getMe(authedReq);
      assert.equal(authedRes.status, 200);
      const profileData = await authedRes.json();
      assert.equal(profileData.success, true);
      assert.equal(profileData.customer.phone, '9988776655');

      // PATCH /api/auth/me to update address
      const updateReq = new Request('http://localhost:3000/api/auth/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
          fullName: 'Sunita Sharma Jammu',
          addresses: [{
            id: 'addr_1',
            fullName: 'Sunita Sharma',
            phone: '9988776655',
            addressLine: 'Residency Road',
            city: 'Jammu',
            state: 'Jammu & Kashmir',
            pincode: '180001',
            isDefault: true
          }]
        })
      });
      const updateRes = await patchMe(updateReq);
      assert.equal(updateRes.status, 200);
      const updatedData = await updateRes.json();
      assert.equal(updatedData.success, true);
      assert.equal(updatedData.profile.fullName, 'Sunita Sharma Jammu');
    });

    it('clears session cookie on logout', async () => {
      const logoutReq = new Request('http://localhost:3000/api/auth/logout', { method: 'POST' });
      const logoutRes = await postLogout(logoutReq);
      assert.equal(logoutRes.status, 200);
      const cookieHeader = logoutRes.headers.get('set-cookie');
      assert.ok(cookieHeader && cookieHeader.includes('Max-Age=0'));
    });
  });

  // =========================================================================
  // 3. Dynamic Bullion Catalog Recalculation API
  // =========================================================================
  describe('3. Dynamic Bullion Catalog Recalculation Endpoint', () => {
    it('strictly denies unauthenticated POST /api/admin/rates/recalculate with 401', async () => {
      const req = new Request('http://localhost:3000/api/admin/rates/recalculate', {
        method: 'POST'
      });
      const res = await postRecalculate(req);
      assert.equal(res.status, 401);
    });

    it('executes recalculation with admin authentication and updates catalog prices', async () => {
      const req = new Request('http://localhost:3000/api/admin/rates/recalculate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      const res = await postRecalculate(req);
      assert.equal(res.status, 200);
      const data = await res.json();
      assert.equal(data.success, true);
      assert.ok(typeof data.updatedCount === 'number');
    });
  });
});
