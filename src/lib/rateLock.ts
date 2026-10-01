import crypto from 'crypto';
import { siteConfig } from '@/config/siteConfig';

export interface RateSnapshot {
  gold_24k: number;
  gold_22k: number;
  gold_18k: number;
  gold_14k: number;
  silver_925: number;
}

export interface RateLockPayload {
  rates: RateSnapshot;
  issued_at: number;
  expires_at: number;
}

function getRateLockSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ENCRYPTION_SECRET || process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('[SECURITY FATAL] Missing secret key for rate-lock cryptographic signatures.');
    }
    return 'dev_fallback_rate_lock_secret_key_32_chars_123';
  }
  return secret;
}

/**
 * Generates an HMAC-signed server-side rate-lock token.
 * Contains rates snapshot + expiration timestamp.
 */
export function generateRateLockToken(rates: RateSnapshot, durationMinutes?: number): {
  token: string;
  rates: RateSnapshot;
  expires_at: number;
} {
  const minutes = durationMinutes ?? siteConfig.rates.rateLockMinutes ?? 15;
  const now = Date.now();
  const expiresAt = now + minutes * 60 * 1000;

  const payload: RateLockPayload = {
    rates,
    issued_at: now,
    expires_at: expiresAt
  };

  const payloadString = JSON.stringify(payload);
  const payloadBase64 = Buffer.from(payloadString, 'utf8').toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', getRateLockSecret())
    .update(payloadBase64)
    .digest('base64url');

  const token = `${payloadBase64}.${signature}`;

  return {
    token,
    rates,
    expires_at: expiresAt
  };
}

/**
 * Verifies a server-side rate-lock token.
 * Returns valid payload or null if forged or expired.
 */
export function verifyRateLockToken(token: string): {
  valid: boolean;
  expired: boolean;
  payload: RateLockPayload | null;
  error?: string;
} {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    return { valid: false, expired: false, payload: null, error: 'Missing or malformed rate lock token.' };
  }

  const [payloadBase64, signature] = token.split('.');
  if (!payloadBase64 || !signature) {
    return { valid: false, expired: false, payload: null, error: 'Invalid rate lock token format.' };
  }

  const expectedSignature = crypto
    .createHmac('sha256', getRateLockSecret())
    .update(payloadBase64)
    .digest('base64url');

  const bufA = Buffer.from(signature);
  const bufB = Buffer.from(expectedSignature);
  if (bufA.length !== bufB.length || !crypto.timingSafeEqual(bufA, bufB)) {
    return { valid: false, expired: false, payload: null, error: 'Rate lock signature verification failed (tampered token).' };
  }

  try {
    const jsonStr = Buffer.from(payloadBase64, 'base64url').toString('utf8');
    const payload: RateLockPayload = JSON.parse(jsonStr);

    if (Date.now() > payload.expires_at) {
      return { valid: false, expired: true, payload, error: 'Rate lock window has expired.' };
    }

    return { valid: true, expired: false, payload };
  } catch {
    return { valid: false, expired: false, payload: null, error: 'Corrupt rate lock token payload.' };
  }
}
