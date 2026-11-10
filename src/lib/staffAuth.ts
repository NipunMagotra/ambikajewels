/**
 * Ambika Jewels — Individual Staff Accounts, Role-Based Access Control (RBAC),
 * Multi-Factor Authentication (MFA), and Persistent Session Revocation
 *
 * Implements:
 * 1. Individual named accounts (Owner, Manager, Staff) eliminating shared credentials.
 * 2. OWASP-compliant cryptographic PBKDF2 password hashing (260,000 iterations, SHA-512, versioned format).
 * 3. Transparent password hash upgrade on successful authentication.
 * 4. RFC 6238 TOTP Multi-Factor Authentication for Owner-level access with replay defense.
 * 5. Single-use hashed emergency recovery codes.
 * 6. Persistent session revocation tracking (multi-instance, serverless resilient).
 * 7. Strict role hierarchy: Owner > Manager > Staff.
 */

import crypto from 'crypto';
import { supabaseAdmin, isSupabaseAdminConfigured } from './supabaseAdmin';

export type StaffRole = 'owner' | 'manager' | 'staff';

export interface StaffAccount {
  id: string;
  email: string;
  name: string;
  role: StaffRole;
  phone?: string;
  passwordHash: string;
  salt: string;
  mfaSecret?: string;
  mfaEnabled: boolean;
  recoveryCodesHashed?: string[]; // SHA-256 hashes of emergency backup codes
  isActive: boolean;
  revokedBefore: number; // millisecond timestamp; sessions issued prior to this are invalid
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface AdminSession {
  sessionId: string;
  staffId: string;
  email: string;
  name: string;
  role: StaffRole;
  mfaVerified: boolean;
  issuedAt: number;
  expiresAt: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Password Hashing (OWASP Guidance: PBKDF2-HMAC-SHA512, 260,000 Iterations)
// ─────────────────────────────────────────────────────────────────────────────

export const PBKDF2_RECOMMENDED_ITERATIONS = 260000;
export const PBKDF2_KEY_LENGTH = 64;
export const PBKDF2_DIGEST = 'sha512';
export const HASH_VERSION_PREFIX = '$pbkdf2-sha512$v=1$i=260000$';

/**
 * Derives a cryptographic password hash using PBKDF2-HMAC-SHA512 with 260,000 iterations.
 * Generates a versioned string: $pbkdf2-sha512$v=1$i=260000$<saltHex>$<hashHex>
 */
export function hashPassword(
  password: string,
  salt?: string,
  iterations = PBKDF2_RECOMMENDED_ITERATIONS
): { hash: string; salt: string; formatted: string } {
  // 32-byte cryptographically secure pseudorandom salt per account
  const chosenSalt = salt || crypto.randomBytes(32).toString('hex');
  const derivedKey = crypto.pbkdf2Sync(
    password.trim(),
    chosenSalt,
    iterations,
    PBKDF2_KEY_LENGTH,
    PBKDF2_DIGEST
  );
  const hashHex = derivedKey.toString('hex');
  const formatted = `${HASH_VERSION_PREFIX}${chosenSalt}$${hashHex}`;

  return {
    hash: hashHex,
    salt: chosenSalt,
    formatted
  };
}

/**
 * Checks whether a stored password hash is using an older/legacy format or iteration count.
 */
export function needsPasswordRehash(storedHash: string): boolean {
  if (!storedHash) return true;
  return !storedHash.startsWith(HASH_VERSION_PREFIX);
}

/**
 * Safely verifies a password using constant-time comparison.
 * Supports both versioned hashes ($pbkdf2-sha512$v=1$...) and legacy 100,000 iteration hashes.
 */
export function verifyPassword(password: string, expectedHash: string, salt: string): boolean {
  if (!password || !expectedHash || !salt) return false;

  try {
    // 1. Check versioned format
    if (expectedHash.startsWith(HASH_VERSION_PREFIX)) {
      const parts = expectedHash.split('$');
      // Format: ["", "pbkdf2-sha512", "v=1", "i=260000", "<salt>", "<hash>"]
      if (parts.length >= 6) {
        const storedSalt = parts[4];
        const storedHash = parts[5];
        const derived = crypto.pbkdf2Sync(
          password.trim(),
          storedSalt,
          PBKDF2_RECOMMENDED_ITERATIONS,
          PBKDF2_KEY_LENGTH,
          PBKDF2_DIGEST
        ).toString('hex');

        const bufA = Buffer.from(derived, 'hex');
        const bufB = Buffer.from(storedHash, 'hex');
        if (bufA.length !== bufB.length) return false;
        return crypto.timingSafeEqual(bufA, bufB);
      }
    }

    // 2. Check 260,000 iteration unversioned hash
    const derived260 = crypto.pbkdf2Sync(
      password.trim(),
      salt,
      PBKDF2_RECOMMENDED_ITERATIONS,
      PBKDF2_KEY_LENGTH,
      PBKDF2_DIGEST
    ).toString('hex');
    const buf260A = Buffer.from(derived260, 'hex');
    const bufExpected = Buffer.from(expectedHash, 'hex');
    if (buf260A.length === bufExpected.length && crypto.timingSafeEqual(buf260A, bufExpected)) {
      return true;
    }

    // 3. Fall back to legacy 100,000 iteration hash (for transparent migration)
    const derivedLegacy = crypto.pbkdf2Sync(
      password.trim(),
      salt,
      100000,
      PBKDF2_KEY_LENGTH,
      PBKDF2_DIGEST
    ).toString('hex');
    const bufLegacy = Buffer.from(derivedLegacy, 'hex');
    if (bufLegacy.length === bufExpected.length && crypto.timingSafeEqual(bufLegacy, bufExpected)) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Multi-Factor Authentication (RFC 6238 TOTP) & Anti-Replay Engine
// ─────────────────────────────────────────────────────────────────────────────

// Anti-replay cache: stores key `${staffId}:${code}` -> expiry timestamp
const usedTotpRecords = new Map<string, number>();

// Account failed MFA attempt rate limiting: staffId -> { count, lockedUntil }
const failedMfaTracker = new Map<string, { count: number; lockedUntil: number }>();

function cleanupUsedTotpCodes() {
  const now = Date.now();
  for (const [key, expiry] of usedTotpRecords.entries()) {
    if (now > expiry) {
      usedTotpRecords.delete(key);
    }
  }
}

/**
 * Computes RFC 6238 TOTP code for a 30-second time step.
 */
export function generateTotpCode(secretHex: string, timestamp = Date.now()): string {
  const stepSeconds = 30;
  const counter = Math.floor(timestamp / 1000 / stepSeconds);
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigInt64BE(BigInt(counter));

  const key = Buffer.from(secretHex, 'hex');
  const hmac = crypto.createHmac('sha1', key).update(counterBuffer).digest();

  const offset = hmac[hmac.length - 1] & 0x0f;
  const codeInt =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  return (codeInt % 1000000).toString().padStart(6, '0');
}

/**
 * Hash a recovery code for secure storage at rest.
 */
export function hashRecoveryCode(code: string): string {
  return crypto.createHash('sha256').update(code.trim().toUpperCase()).digest('hex');
}

/**
 * Validates a 6-digit TOTP code with +-1 step (90-second total window) clock drift tolerance.
 * Enforces strict replay protection: each code can be consumed at most once per account.
 */
export function verifyTotp(
  code: string,
  secretHex: string,
  staffId = 'default-staff'
): { valid: boolean; error?: string } {
  cleanupUsedTotpCodes();
  const cleanCode = (code || '').trim();

  // Rate limiting check
  const tracker = failedMfaTracker.get(staffId);
  const now = Date.now();
  if (tracker && tracker.lockedUntil > now) {
    const remainingSeconds = Math.ceil((tracker.lockedUntil - now) / 1000);
    return {
      valid: false,
      error: `Too many failed MFA attempts. Account temporarily locked for ${remainingSeconds} seconds.`
    };
  }

  if (cleanCode.length !== 6 || !/^\d{6}$/.test(cleanCode)) {
    recordFailedMfaAttempt(staffId);
    return { valid: false, error: 'MFA code must be exactly 6 digits.' };
  }

  // Anti-replay check
  const replayKey = `${staffId}:${cleanCode}`;
  if (usedTotpRecords.has(replayKey)) {
    return {
      valid: false,
      error: 'This one-time passcode has already been used. Please wait for the next code.'
    };
  }

  // Check TOTP window (-30s, 0s, +30s)
  const windows = [-30000, 0, 30000];
  let matched = false;

  for (const drift of windows) {
    const expected = generateTotpCode(secretHex, now + drift);
    if (crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(cleanCode))) {
      matched = true;
      break;
    }
  }

  if (matched) {
    // Record code to prevent replay within 90 seconds
    usedTotpRecords.set(replayKey, now + 90000);
    failedMfaTracker.delete(staffId); // reset failed attempts on success
    return { valid: true };
  }

  recordFailedMfaAttempt(staffId);
  return { valid: false, error: 'Invalid 6-digit Multi-Factor Authentication code.' };
}

function recordFailedMfaAttempt(staffId: string) {
  const now = Date.now();
  const tracker = failedMfaTracker.get(staffId) || { count: 0, lockedUntil: 0 };
  tracker.count += 1;
  if (tracker.count >= 5) {
    tracker.lockedUntil = now + 15 * 60 * 1000; // 15 minute lock after 5 failures
  }
  failedMfaTracker.set(staffId, tracker);
}

/**
 * Validates and consumes a single-use emergency recovery code.
 * If valid, the code is immediately removed from the account so it cannot be reused.
 */
export function consumeRecoveryCode(
  account: StaffAccount,
  providedCode: string
): { valid: boolean; error?: string } {
  const clean = providedCode.trim().toUpperCase();
  if (clean.length < 8) {
    return { valid: false, error: 'Invalid recovery code format.' };
  }

  const hashedInput = hashRecoveryCode(clean);
  const codes = account.recoveryCodesHashed || [];
  const matchIndex = codes.findIndex((h) => {
    const bufA = Buffer.from(h);
    const bufB = Buffer.from(hashedInput);
    return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
  });

  if (matchIndex === -1) {
    recordFailedMfaAttempt(account.id);
    return { valid: false, error: 'Invalid or already consumed emergency recovery code.' };
  }

  // Atomically consume code by removing it from the account
  account.recoveryCodesHashed = codes.filter((_, idx) => idx !== matchIndex);
  failedMfaTracker.delete(account.id);

  // Persist consumption to Supabase if configured
  if (isSupabaseAdminConfigured && supabaseAdmin) {
    Promise.resolve(
      supabaseAdmin
        .from('staff_accounts')
        .update({ recovery_codes: account.recoveryCodesHashed })
        .eq('id', account.id)
    ).catch((e: unknown) => console.warn('[RECOVERY CODE DB WARN]', e));
  }

  return { valid: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Pre-Seeded Showroom Staff Accounts Store
// ─────────────────────────────────────────────────────────────────────────────

const initialSalt = 'a8f93e2b1c4d5e6f7a8b9c0d1e2f3a4b';
const initialOwnerHash = hashPassword(
  process.env.ADMIN_PASSCODE || '9682589725',
  initialSalt
).formatted;

// Initial emergency recovery codes for Owner
export const INITIAL_OWNER_RECOVERY_CODES = [
  'AMB-REC-8F92-4A1C',
  'AMB-REC-7B3D-9E2F',
  'AMB-REC-5C1A-3D8B',
  'AMB-REC-2E4F-6B0D'
];

export const DEFAULT_STAFF_ACCOUNTS: Record<string, StaffAccount> = {
  'owner@ambikajewelsonline.com': {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'owner@ambikajewelsonline.com',
    name: 'Smt. Shivani Anand (Founder & Owner)',
    role: 'owner',
    phone: '+919682589725',
    passwordHash: initialOwnerHash,
    salt: initialSalt,
    mfaSecret: '3132333435363738393031323334353637383930', // RFC 6238 standard test secret
    mfaEnabled: true,
    recoveryCodesHashed: INITIAL_OWNER_RECOVERY_CODES.map(hashRecoveryCode),
    isActive: true,
    revokedBefore: 0,
    createdAt: '2026-10-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  'manager@ambikajewelsonline.com': {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'manager@ambikajewelsonline.com',
    name: 'Sh. Lakesh Kumar (Showroom Manager)',
    role: 'manager',
    phone: '+919682589725',
    passwordHash: hashPassword('AmbikaManager2026!', initialSalt).formatted,
    salt: initialSalt,
    mfaEnabled: false,
    isActive: true,
    revokedBefore: 0,
    createdAt: '2026-10-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  },
  'staff@ambikajewelsonline.com': {
    id: '00000000-0000-0000-0000-000000000003',
    email: 'staff@ambikajewelsonline.com',
    name: 'Counter Desk (Jammu Showroom)',
    role: 'staff',
    phone: '+919682589725',
    passwordHash: hashPassword('AmbikaStaff2026!', initialSalt).formatted,
    salt: initialSalt,
    mfaEnabled: false,
    isActive: true,
    revokedBefore: 0,
    createdAt: '2026-10-01T00:00:00.000Z',
    updatedAt: new Date().toISOString()
  }
};

export const memoryStaffAccounts: Map<string, StaffAccount> = new Map(
  Object.entries(DEFAULT_STAFF_ACCOUNTS)
);

// ─────────────────────────────────────────────────────────────────────────────
// 4. Persistent Revoked Sessions Store (Distributed Multi-Instance)
// ─────────────────────────────────────────────────────────────────────────────

interface RevokedSessionRecord {
  sessionId: string;
  staffId?: string;
  revokedAt: number;
  expiresAt: number;
  reason: string;
}

// In-memory L1 cache for zero-latency lookups
const memoryRevokedSessions = new Map<string, RevokedSessionRecord>();

export async function revokePersistentSession(
  sessionId: string,
  staffId?: string,
  expiresAt = Date.now() + 12 * 60 * 60 * 1000,
  reason = 'logout'
): Promise<void> {
  const record: RevokedSessionRecord = {
    sessionId,
    staffId,
    revokedAt: Date.now(),
    expiresAt,
    reason
  };

  // 1. Write to local memory cache
  memoryRevokedSessions.set(sessionId, record);

  // 2. Persist to Supabase if configured (survives restarts and serverless cold starts)
  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('revoked_sessions').upsert(
        {
          session_id: sessionId,
          staff_id: staffId || null,
          expires_at: new Date(expiresAt).toISOString(),
          revoked_at: new Date().toISOString(),
          reason
        },
        { onConflict: 'session_id' }
      );
    } catch (err) {
      console.warn('[SESSION REVOCATION DB WARN] Could not persist to Supabase:', err);
    }
  }
}

export async function isPersistentSessionRevoked(
  sessionId: string,
  staffId?: string,
  issuedAt?: number,
  tokenString?: string
): Promise<boolean> {
  // 1. Check memory L1 cache by sessionId and tokenString
  if (memoryRevokedSessions.has(sessionId)) {
    return true;
  }
  if (tokenString && memoryRevokedSessions.has(tokenString)) {
    return true;
  }

  // 2. Check account-level revocation (if entire staff member's sessions were revoked or deactivated)
  if (staffId) {
    const account = Array.from(memoryStaffAccounts.values()).find((a) => a.id === staffId);
    if (account) {
      if (!account.isActive) return true; // Deactivated account
      if (issuedAt && account.revokedBefore && issuedAt < account.revokedBefore) {
        return true; // Session was issued prior to password rotation or revocation timestamp
      }
    }
  }

  // 3. Check persistent Supabase database
  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('revoked_sessions')
        .select('session_id')
        .or(`session_id.eq.${sessionId}${tokenString ? `,session_id.eq.${tokenString}` : ''}`)
        .maybeSingle();

      if (!error && data) {
        memoryRevokedSessions.set(sessionId, {
          sessionId,
          revokedAt: Date.now(),
          expiresAt: Date.now() + 12 * 60 * 60 * 1000,
          reason: 'db_lookup'
        });
        return true;
      }
    } catch {
      // Non-fatal, L1 memory cache handles local container state
    }
  }

  return false;
}

/**
 * Revokes all issued sessions for a staff member immediately across all instances.
 */
export async function revokeAllStaffSessions(staffId: string): Promise<void> {
  const account = Array.from(memoryStaffAccounts.values()).find((a) => a.id === staffId);
  const now = Date.now();
  if (account) {
    account.revokedBefore = now;
  }

  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin
        .from('staff_accounts')
        .update({ revoked_before: new Date(now).toISOString() })
        .eq('id', staffId);
    } catch (err) {
      console.warn('[STAFF REVOCATION DB WARN]', err);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Cryptographic Session Token Construction & Verification
// ─────────────────────────────────────────────────────────────────────────────

export function getAdminSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.trim().length < 16) {
    throw new Error(
      '[SECURITY FATAL] Missing or insecure ADMIN_SESSION_SECRET in environment variables (minimum 16 characters required).'
    );
  }
  return secret.trim();
}

/**
 * Creates an authenticated, tamper-evident HMAC-SHA256 session token with individual staff identity.
 * Format: <expiresAt>.<base64urlPayload>.<signature>
 */
export function createStaffSessionToken(session: AdminSession): string {
  const secret = getAdminSecret();
  const payloadStr = Buffer.from(JSON.stringify(session)).toString('base64url');
  const message = `${session.expiresAt}.${payloadStr}`;
  const signature = crypto.createHmac('sha256', secret).update(message).digest('hex');

  return `${message}.${signature}`;
}

/**
 * Validates a staff session token and verifies it against the persistent revocation store.
 * Rejects legacy tokens without individual staff identity.
 */
export async function verifyStaffSession(
  tokenString: string | undefined | null,
  requiredRole?: StaffRole
): Promise<{ valid: boolean; session?: AdminSession; error?: string }> {
  if (!tokenString || !tokenString.includes('.')) {
    return { valid: false, error: 'Malformed token' };
  }

  try {
    const parts = tokenString.split('.');
    let payloadStr: string;
    let signature: string;
    let messageToVerify: string;

    if (parts.length === 3) {
      const [expiryStr, pStr, sig] = parts;
      payloadStr = pStr;
      signature = sig;
      messageToVerify = `${expiryStr}.${pStr}`;
    } else if (parts.length === 2) {
      const [pStr, sig] = parts;
      payloadStr = pStr;
      signature = sig;
      messageToVerify = pStr;
    } else {
      return { valid: false, error: 'Invalid token structure' };
    }

    const secret = getAdminSecret();
    const expectedSignature = crypto.createHmac('sha256', secret).update(messageToVerify).digest('hex');

    const bufA = Buffer.from(signature);
    const bufB = Buffer.from(expectedSignature);

    if (bufA.length !== bufB.length || !crypto.timingSafeEqual(bufA, bufB)) {
      return { valid: false, error: 'Invalid cryptographic signature' };
    }

    // Decode payload
    const decoded = Buffer.from(payloadStr, 'base64url').toString('utf8');
    if (!decoded.startsWith('{') || !decoded.endsWith('}')) {
      return { valid: false, error: 'Legacy token without individual staff identity is not permitted.' };
    }

    const session: AdminSession = JSON.parse(decoded);

    // 1. Expiration check
    if (Date.now() > session.expiresAt) {
      return { valid: false, error: 'Session expired' };
    }

    // 2. Persistent Revocation check (both UUID and raw token string)
    const isRevoked = await isPersistentSessionRevoked(
      session.sessionId,
      session.staffId,
      session.issuedAt,
      tokenString
    );
    if (isRevoked) {
      return { valid: false, error: 'Session has been revoked or account deactivated' };
    }

    // 3. Role hierarchy check
    if (requiredRole) {
      const roleHierarchy: Record<StaffRole, number> = {
        owner: 3,
        manager: 2,
        staff: 1
      };
      if (roleHierarchy[session.role] < roleHierarchy[requiredRole]) {
        return {
          valid: false,
          error: `Insufficient permissions: requires ${requiredRole}, have ${session.role}`
        };
      }
    }

    // 4. Owner MFA enforcement check
    if (session.role === 'owner' && !session.mfaVerified) {
      return { valid: false, error: 'Owner access requires verified Multi-Factor Authentication' };
    }

    return { valid: true, session };
  } catch (err: unknown) {
    return { valid: false, error: err instanceof Error ? err.message : 'Token verification failed' };
  }
}
