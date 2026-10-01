import { cookies } from 'next/headers';
import crypto from 'crypto';

const ADMIN_COOKIE_NAME = 'ambika_admin_session';

function getAdminSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ENCRYPTION_SECRET || process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new Error('[SECURITY FATAL] Missing ADMIN_SESSION_SECRET, ENCRYPTION_SECRET, or RAZORPAY_KEY_SECRET in environment variables.');
  }
  return secret;
}

/**
 * Creates a cryptographically signed, timestamped session token.
 * Format: <expiryTimestamp>.<hmacSignature>
 */
export function createAdminSessionToken(durationSeconds = 7 * 24 * 60 * 60): string {
  const expiry = Date.now() + durationSeconds * 1000;
  const secret = getAdminSecret();
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`admin_session:${expiry}`)
    .digest('hex');

  return `${expiry}.${signature}`;
}

/**
 * Validates the admin session token cryptographically.
 * Prevents tampering, replay after expiration, or forged cookies.
 */
export async function verifyAdminAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!token || !token.includes('.')) {
      return false;
    }

    const [expiryStr, signature] = token.split('.');
    const expiry = Number(expiryStr);

    if (isNaN(expiry) || Date.now() > expiry) {
      return false; // Expired session
    }

    const secret = getAdminSecret();
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`admin_session:${expiry}`)
      .digest('hex');

    const bufA = Buffer.from(signature);
    const bufB = Buffer.from(expectedSignature);

    if (bufA.length !== bufB.length) {
      return false;
    }

    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export function getAdminPasscode(): string {
  return process.env.ADMIN_PASSCODE || '';
}

export function isPasscodeConfigured(): boolean {
  const code = getAdminPasscode();
  return typeof code === 'string' && code.trim().length >= 6;
}

export function getAdminCookieName(): string {
  return ADMIN_COOKIE_NAME;
}
