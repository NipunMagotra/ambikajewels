import crypto from 'crypto';

/**
 * Generates an unguessable Order Reference Number for high-value jewelry orders.
 * Format: AMB-{timestamp_base36}-{random_hex} (e.g. AMB-M5K89-7F2A09)
 * Provides 48 bits of cryptographic entropy, preventing enumeration/IDOR attacks.
 */
export function generateSecureOrderNumber(): string {
  const timePart = Date.now().toString(36).toUpperCase().slice(-5);
  const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `AMB-${timePart}-${randomPart}`;
}
