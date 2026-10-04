import { cookies } from 'next/headers';
import crypto from 'crypto';

const ADMIN_COOKIE_NAME = 'ambika_admin_session';
export const ADMIN_SESSION_MAX_AGE_SECONDS = 12 * 60 * 60; // 12 hours max session lifetime

export function getAdminSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.trim().length < 16) {
    throw new Error(
      '[SECURITY FATAL] Missing or insecure ADMIN_SESSION_SECRET in environment variables (minimum 16 characters required). No fallback permitted.'
    );
  }
  return secret.trim();
}

/**
 * Creates a cryptographically signed, timestamped session token.
 * Format: <expiryTimestamp>.<hmacSignature>
 * Default lifetime: 12 hours (reduced from 7 days).
 */
export function createAdminSessionToken(durationSeconds = ADMIN_SESSION_MAX_AGE_SECONDS): string {
  const expiry = Date.now() + durationSeconds * 1000;
  const secret = getAdminSecret();
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`admin_session:${expiry}`)
    .digest('hex');

  return `${expiry}.${signature}`;
}

/**
 * Validates any admin session token string cryptographically using constant-time comparison.
 */
export function verifyAdminSessionTokenString(token: string | undefined | null): boolean {
  if (!token || !token.includes('.')) {
    return false;
  }

  try {
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

/**
 * Validates the admin session token cryptographically from incoming request cookies or headers.
 * Prevents tampering, replay after expiration, or forged cookies.
 */
export async function verifyAdminAuth(request?: Request): Promise<boolean> {
  try {
    // 1. Check direct Request headers if provided (for API route testing & Bearer / Cookie header support)
    if (request) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7).trim();
        if (verifyAdminSessionTokenString(token)) return true;
      }

      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE_NAME}=([^;]+)`));
        if (match) {
          const cookieVal = decodeURIComponent(match[1]);
          if (verifyAdminSessionTokenString(cookieVal)) return true;
        }
      }
    }

    // 2. Next.js cookies() store
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    return verifyAdminSessionTokenString(token);
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
