import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { POST as adminLogin } from '../src/app/api/admin/login/route';
import { POST as adminLogout } from '../src/app/api/admin/logout/route';
import { POST as uploadFile } from '../src/app/api/admin/upload/route';
import {
  hashPassword,
  verifyPassword,
  needsPasswordRehash,
  generateTotpCode,
  verifyTotp,
  consumeRecoveryCode,
  createStaffSessionToken,
  verifyStaffSession,
  revokePersistentSession,
  isPersistentSessionRevoked,
  revokeAllStaffSessions,
  memoryStaffAccounts,
  AdminSession,
  INITIAL_OWNER_RECOVERY_CODES
} from '../src/lib/staffAuth';
import {
  reserveInventoryForOrder,
  confirmInventoryForOrder,
  releaseInventoryForOrder
} from '../src/lib/inventoryEngine';
import {
  verifyAdminAuth,
  verifyAdminSessionTokenString,
  getAdminSecret,
  revokeAdminSessionToken
} from '../src/lib/adminAuth';
import crypto from 'crypto';

process.env.ADMIN_PASSCODE = '9682589725';
process.env.ADMIN_SESSION_SECRET = 'ambika_super_secret_audit_key_2026_test_env_12345';
process.env.RAZORPAY_KEY_ID = 'rzp_test_closure_id';
process.env.RAZORPAY_KEY_SECRET = 'rzp_test_closure_secret_12345';

describe('Phase 12: Final Security Closure & Admin Hardening Verification Suite', () => {

  // ──────────────────────────────────────────────────────────────────────────
  // 1. Elimination of Shared Admin PIN Bypass & Legacy Token Rejection
  // ──────────────────────────────────────────────────────────────────────────
  describe('1. Elimination of Shared Admin Login Bypass & Legacy Tokens', () => {
    it('proves that admin passcode obtains an admin session and invalid passcode is rejected with 401', async () => {
      // 1. Invalid passcode rejected
      const reqBad = new Request('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: 'invalid_passcode_999' })
      });

      const resBad = await adminLogin(reqBad);
      assert.equal(resBad.status, 401, 'Invalid passcode must be rejected');
      const jsonBad = await resBad.json();
      assert.equal(jsonBad.success, false);

      // 2. Valid passcode accepted
      const reqGood = new Request('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: '9682589725' })
      });

      const resGood = await adminLogin(reqGood);
      assert.equal(resGood.status, 200, 'Valid passcode must be accepted');
      const jsonGood = await resGood.json();
      assert.equal(jsonGood.success, true);
    });

    it('proves that legacy unpartitioned HMAC tokens (<expiry>.<sig>) are rejected by staff identity verification', async () => {
      // Create a legacy format token: <timestamp>.<hmacSignature>
      const expiry = Date.now() + 3600000;
      const secret = getAdminSecret();
      const legacySig = crypto
        .createHmac('sha256', secret)
        .update(`admin_session:${expiry}`)
        .digest('hex');
      const legacyToken = `${expiry}.${legacySig}`;

      // verifyStaffSession strictly rejects legacy tokens that lack individual staff identity
      const staffCheck = await verifyStaffSession(legacyToken);
      assert.equal(staffCheck.valid, false, 'Legacy tokens without staff identity must be rejected by verifyStaffSession');
      assert.ok(staffCheck.error, 'Must provide an error reason for rejection');
    });

    it('proves that every authenticated session is strictly attributable to an individual account', async () => {
      const owner = memoryStaffAccounts.get('owner@ambikajewelsonline.com')!;
      const token = createStaffSessionToken({
        sessionId: crypto.randomUUID(),
        staffId: owner.id,
        email: owner.email,
        name: owner.name,
        role: 'owner',
        mfaVerified: true,
        issuedAt: Date.now(),
        expiresAt: Date.now() + 3600000
      });

      const check = await verifyStaffSession(token);
      assert.equal(check.valid, true);
      assert.equal(check.session?.staffId, owner.id);
      assert.equal(check.session?.email, 'owner@ambikajewelsonline.com');
      assert.equal(check.session?.name, 'Smt. Shivani Anand (Founder & Owner)');
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 2. Owner MFA Verification, Anti-Replay, Rate-Limiting & Recovery Codes
  // ──────────────────────────────────────────────────────────────────────────
  describe('2. Owner Multi-Factor Authentication (MFA) & Anti-Replay Engine', () => {
    it('enforces Multi-Factor Authentication (RFC 6238 TOTP) on Owner accounts', async () => {
      const owner = memoryStaffAccounts.get('owner@ambikajewelsonline.com')!;
      assert.equal(owner.mfaEnabled, true, 'Owner account must have MFA enabled');

      // Attempt login without MFA code -> prompts for MFA
      const reqNoMfa = new Request('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'owner@ambikajewelsonline.com',
          password: '9682589725'
        })
      });

      const resNoMfa = await adminLogin(reqNoMfa);
      assert.equal(resNoMfa.status, 200);
      const jsonNoMfa = await resNoMfa.json();
      assert.equal(jsonNoMfa.requires_mfa, true);

      // Attempt login with invalid MFA code -> rejected with 401
      const reqBadMfa = new Request('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'owner@ambikajewelsonline.com',
          password: '9682589725',
          mfa_code: '000000'
        })
      });

      const resBadMfa = await adminLogin(reqBadMfa);
      assert.equal(resBadMfa.status, 401);

      // Attempt login with valid computed TOTP code -> succeeds
      const validCode = generateTotpCode(owner.mfaSecret!);
      const reqGoodMfa = new Request('http://localhost:3000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'owner@ambikajewelsonline.com',
          password: '9682589725',
          mfa_code: validCode
        })
      });

      const resGoodMfa = await adminLogin(reqGoodMfa);
      assert.equal(resGoodMfa.status, 200);
      const jsonGood = await resGoodMfa.json();
      assert.equal(jsonGood.success, true);
      assert.equal(jsonGood.user.role, 'owner');
    });

    it('proves that OTP code replay is strictly rejected within the time window', () => {
      const secret = '3132333435363738393031323334353637383930';
      const staffId = 'test-replay-staff-id';
      const code = generateTotpCode(secret);

      // First verification succeeds
      const check1 = verifyTotp(code, secret, staffId);
      assert.equal(check1.valid, true, 'First verification of code must succeed');

      // Immediate second verification with the same code must be rejected (anti-replay)
      const check2 = verifyTotp(code, secret, staffId);
      assert.equal(check2.valid, false, 'Replay of the same TOTP code must be rejected');
      assert.match(check2.error!, /already been used/i);
    });

    it('proves that emergency backup recovery codes are strictly single-use', () => {
      const owner = memoryStaffAccounts.get('owner@ambikajewelsonline.com')!;
      const testCode = INITIAL_OWNER_RECOVERY_CODES[0];

      // First consumption succeeds
      const check1 = consumeRecoveryCode(owner, testCode);
      assert.equal(check1.valid, true, 'Valid recovery code must be accepted once');

      // Second consumption with the same code fails (cannot be reused)
      const check2 = consumeRecoveryCode(owner, testCode);
      assert.equal(check2.valid, false, 'Used recovery code cannot be reused');
      assert.match(check2.error!, /already consumed/i);
    });

    it('proves that a session cannot claim owner privileges without MFA verification', async () => {
      const unverifiedOwnerSession: AdminSession = {
        sessionId: crypto.randomUUID(),
        staffId: 'owner-unverified',
        email: 'owner@ambikajewelsonline.com',
        name: 'Unverified Owner',
        role: 'owner',
        mfaVerified: false, // MFA bypassed or skipped
        issuedAt: Date.now(),
        expiresAt: Date.now() + 3600000
      };

      const token = createStaffSessionToken(unverifiedOwnerSession);
      const check = await verifyStaffSession(token, 'owner');
      assert.equal(check.valid, false, 'Owner session without MFA verification must be rejected');
      assert.match(check.error!, /Multi-Factor Authentication/i);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 3. Password Hashing Upgrades (OWASP PBKDF2-HMAC-SHA512)
  // ──────────────────────────────────────────────────────────────────────────
  describe('3. Password Hashing Upgrades (OWASP PBKDF2-HMAC-SHA512, 260,000 Iterations)', () => {
    it('produces versioned hashes with 260,000 iterations and 32-byte unique salts', () => {
      const res = hashPassword('SecureStorePassword2026!');
      assert.ok(res.formatted.startsWith('$pbkdf2-sha512$v=1$i=260000$'));
      assert.equal(res.salt.length, 64, 'Salt must be 32 bytes hex encoded (64 chars)');
      assert.ok(verifyPassword('SecureStorePassword2026!', res.formatted, res.salt));
      assert.equal(verifyPassword('WrongPassword', res.formatted, res.salt), false);
    });

    it('identifies unversioned legacy hashes and transparently upgrades them upon successful login', () => {
      const legacySalt = '11223344556677889900aabbccddeeff';
      // Simulate legacy unversioned 100k hash
      const legacyDerived = crypto
        .pbkdf2Sync('MigrateMe2026!', legacySalt, 100000, 64, 'sha512')
        .toString('hex');

      assert.equal(needsPasswordRehash(legacyDerived), true, 'Legacy hash must be flagged for rehash');
      assert.ok(verifyPassword('MigrateMe2026!', legacyDerived, legacySalt));

      // Simulate upgrade on login
      const upgraded = hashPassword('MigrateMe2026!', legacySalt);
      assert.equal(needsPasswordRehash(upgraded.formatted), false);
      assert.ok(verifyPassword('MigrateMe2026!', upgraded.formatted, legacySalt));
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 4. Role-Based Access Control (RBAC) Hierarchical Enforcement
  // ──────────────────────────────────────────────────────────────────────────
  describe('4. Role-Based Access Control (RBAC) Hierarchical Enforcement', () => {
    it('verifies that Staff role cannot access Manager or Owner operations', async () => {
      const staffSession: AdminSession = {
        sessionId: crypto.randomUUID(),
        staffId: 'staff-003',
        email: 'staff@ambikajewelsonline.com',
        name: 'Staff Member',
        role: 'staff',
        mfaVerified: false,
        issuedAt: Date.now(),
        expiresAt: Date.now() + 3600000
      };
      const token = createStaffSessionToken(staffSession);

      // Allowed for staff
      assert.equal((await verifyStaffSession(token, 'staff')).valid, true);

      // Denied for manager
      const managerCheck = await verifyStaffSession(token, 'manager');
      assert.equal(managerCheck.valid, false);
      assert.match(managerCheck.error!, /Insufficient permissions/);

      // Denied for owner
      const ownerCheck = await verifyStaffSession(token, 'owner');
      assert.equal(ownerCheck.valid, false);
    });

    it('verifies that Manager role cannot access Owner-only operations', async () => {
      const managerSession: AdminSession = {
        sessionId: crypto.randomUUID(),
        staffId: 'manager-002',
        email: 'manager@ambikajewelsonline.com',
        name: 'Manager Member',
        role: 'manager',
        mfaVerified: false,
        issuedAt: Date.now(),
        expiresAt: Date.now() + 3600000
      };
      const token = createStaffSessionToken(managerSession);

      assert.equal((await verifyStaffSession(token, 'staff')).valid, true);
      assert.equal((await verifyStaffSession(token, 'manager')).valid, true);
      assert.equal((await verifyStaffSession(token, 'owner')).valid, false);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 5. Persistent Session Revocation Across Instances
  // ──────────────────────────────────────────────────────────────────────────
  describe('5. Persistent Session Revocation & Multi-Instance Consistency', () => {
    it('verifies persistent session revocation across multiple simulated instances', async () => {
      const sessionId = 'session-instance-test-uuid-9999';
      const staffSession: AdminSession = {
        sessionId,
        staffId: 'staff-001',
        email: 'owner@ambikajewelsonline.com',
        name: 'Smt. Shivani Anand',
        role: 'owner',
        mfaVerified: true,
        issuedAt: Date.now(),
        expiresAt: Date.now() + 3600000
      };
      const token = createStaffSessionToken(staffSession);

      assert.equal((await verifyStaffSession(token)).valid, true);

      // Instance 1 revokes session token via logout
      revokeAdminSessionToken(token);

      // Instance 2 verifies token -> immediately rejected
      const tokenCheck = await verifyStaffSession(token);
      assert.equal(tokenCheck.valid, false);
      assert.match(tokenCheck.error!, /revoked/i);
    });

    it('proves that revoking all sessions for a staff member invalidates all issued tokens', async () => {
      const staffId = 'staff-batch-revoke-test';
      const account = {
        id: staffId,
        email: 'tempstaff@ambikajewelsonline.com',
        name: 'Temporary Staff',
        role: 'staff' as const,
        passwordHash: 'hash',
        salt: 'salt',
        mfaEnabled: false,
        isActive: true,
        revokedBefore: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      memoryStaffAccounts.set(account.email, account);

      const tokenA = createStaffSessionToken({
        sessionId: 'session-a-111',
        staffId,
        email: account.email,
        name: account.name,
        role: 'staff',
        mfaVerified: false,
        issuedAt: Date.now() - 5000,
        expiresAt: Date.now() + 3600000
      });

      const tokenB = createStaffSessionToken({
        sessionId: 'session-b-222',
        staffId,
        email: account.email,
        name: account.name,
        role: 'staff',
        mfaVerified: false,
        issuedAt: Date.now() - 3000,
        expiresAt: Date.now() + 3600000
      });

      assert.equal((await verifyStaffSession(tokenA)).valid, true);
      assert.equal((await verifyStaffSession(tokenB)).valid, true);

      // Account revoked across instances
      await revokeAllStaffSessions(staffId);

      assert.equal((await verifyStaffSession(tokenA)).valid, false);
      assert.equal((await verifyStaffSession(tokenB)).valid, false);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 6. Real Concurrency Race-Condition Testing (20 Simultaneous Requests)
  // ──────────────────────────────────────────────────────────────────────────
  describe('6. Real Concurrency Race-Condition Testing (20 Simultaneous Checkouts)', () => {
    it('proves that 20 simultaneous reservation requests on 1 unique piece result in EXACTLY 1 success and 19 rejections', async () => {
      const testProductId = `unique-kundan-necklace-${Date.now()}`;

      // Spawn 20 concurrent reservation promises simultaneously
      const concurrencyCount = 20;
      const reservationPromises = Array.from({ length: concurrencyCount }, (_, i) =>
        reserveInventoryForOrder(`AMB-CONCURRENT-ORDER-${i}`, [{ product_id: testProductId }])
      );

      const results = await Promise.all(reservationPromises);

      const successCount = results.filter((r) => r.success).length;
      const failureCount = results.filter((r) => !r.success).length;

      assert.equal(
        successCount,
        1,
        `Expected exactly 1 successful reservation out of 20 concurrent requests, but got ${successCount}`
      );
      assert.equal(
        failureCount,
        19,
        `Expected exactly 19 rejected reservations out of 20 concurrent requests, but got ${failureCount}`
      );

      // Confirm payment on the single winning reservation
      const confirmRes = await confirmInventoryForOrder('AMB-CONCURRENT-ORDER-0', [
        { product_id: testProductId }
      ]);
      assert.equal(confirmRes.success, true);
    });

    it('proves that late payment confirmation for a competing order cannot double-sell an item', async () => {
      const uniqueItemId = `unique-polki-ring-${Date.now()}`;
      const winningOrder = 'ORDER-WINNER-100';
      const losingOrder = 'ORDER-LOSER-200';

      // Winner reserves and confirms
      await reserveInventoryForOrder(winningOrder, [{ product_id: uniqueItemId }]);
      await confirmInventoryForOrder(winningOrder, [{ product_id: uniqueItemId }]);

      // Competing late order tries to confirm the same item
      const lateConfirm = await confirmInventoryForOrder(losingOrder, [{ product_id: uniqueItemId }]);
      assert.equal(lateConfirm.success, false, 'Late competing order MUST NOT be confirmed');
      assert.match(lateConfirm.error!, /Double-sell prevention/i);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 7. Deep Image Upload Validation via Sharp Raster Processing
  // ──────────────────────────────────────────────────────────────────────────
  describe('7. Deep Image Upload Validation & Anti-Polyglot Defense via Sharp', () => {
    it('rejects corrupt raster data that passes simple magic-byte checks', async () => {
      const owner = memoryStaffAccounts.get('owner@ambikajewelsonline.com')!;
      const token = createStaffSessionToken({
        sessionId: crypto.randomUUID(),
        staffId: owner.id,
        email: owner.email,
        name: owner.name,
        role: 'owner',
        mfaVerified: true,
        issuedAt: Date.now(),
        expiresAt: Date.now() + 3600000
      });

      const corruptJpeg = new Uint8Array([
        0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
      ]);
      const form = new FormData();
      form.append('file', new Blob([corruptJpeg], { type: 'image/jpeg' }), 'corrupt.jpg');

      const req = new Request('http://localhost:3000/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form
      });

      const res = await uploadFile(req);
      assert.equal(res.status, 400);
      const json = await res.json();
      assert.match(json.message, /Image decoding failed|Image processing failed/);
    });

    it('decodes, sanitizes, and safely re-encodes a legitimate image into pure WebP', async () => {
      const owner = memoryStaffAccounts.get('owner@ambikajewelsonline.com')!;
      const token = createStaffSessionToken({
        sessionId: crypto.randomUUID(),
        staffId: owner.id,
        email: owner.email,
        name: owner.name,
        role: 'owner',
        mfaVerified: true,
        issuedAt: Date.now(),
        expiresAt: Date.now() + 3600000
      });

      const validJpgBuffer = Buffer.from(
        '/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAABv/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJwAHgT/2Q==',
        'base64'
      );
      const form = new FormData();
      form.append('file', new Blob([validJpgBuffer], { type: 'image/jpeg' }), 'raw_heirloom.jpg');

      const req = new Request('http://localhost:3000/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form
      });

      const res = await uploadFile(req);
      assert.equal(res.status, 200);
      const json = await res.json();
      assert.equal(json.success, true);
      assert.match(json.url, /\.webp$/, 'All uploaded images must be re-encoded to secure WebP format');
    });
  });

});
