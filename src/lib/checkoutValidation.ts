/**
 * Checkout Validation & Indian Statutory Compliance Helpers
 *
 * Provides standardized email typo suggestions, Indian mobile number validation,
 * PAN format checking, and Indian jewelry sizing constants.
 */

export const STANDARD_INDIAN_RING_SIZES = [
  '10', '11', '12', '13', '14 (Standard)', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'
] as const;

export const STANDARD_INDIAN_BANGLE_SIZES = [
  '2.2 (2-2/16")',
  '2.4 (2-4/16")',
  '2.6 (2-6/16" - Most Popular)',
  '2.8 (2-8/16")',
  '2.10 (2-10/16")'
] as const;

/**
 * Detects common typos in popular email domains and returns the corrected email string.
 */
export function getEmailSuggestion(emailStr: string): string | null {
  if (!emailStr || typeof emailStr !== 'string') return null;
  const parts = emailStr.trim().toLowerCase().split('@');
  if (parts.length === 2) {
    const [user, domain] = parts;
    if (!user || !domain) return null;

    const typoDomains: Record<string, string> = {
      'gamil.com': 'gmail.com',
      'gmal.com': 'gmail.com',
      'gmial.com': 'gmail.com',
      'gmaill.com': 'gmail.com',
      'gmai.com': 'gmail.com',
      'yaho.com': 'yahoo.com',
      'yahooo.com': 'yahoo.com',
      'yaho.co.in': 'yahoo.co.in',
      'hotmial.com': 'hotmail.com',
      'hotmai.com': 'hotmail.com',
      'outlok.com': 'outlook.com',
      'outloo.com': 'outlook.com',
      'iclud.com': 'icloud.com',
      'rediffmial.com': 'rediffmail.com',
      'redifmail.com': 'rediffmail.com',
    };

    if (typoDomains[domain]) {
      return `${user}@${typoDomains[domain]}`;
    }
  }
  return null;
}

/**
 * Validates a 10-digit Indian mobile number (optionally with +91 or 0 prefix).
 * Indian mobiles start with 6, 7, 8, or 9.
 */
export function isValidIndianPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s\-()]/g, '');
  const digitsOnly = cleaned.startsWith('+91')
    ? cleaned.slice(3)
    : cleaned.startsWith('91') && cleaned.length === 12
    ? cleaned.slice(2)
    : cleaned.startsWith('0') && cleaned.length === 11
    ? cleaned.slice(1)
    : cleaned;

  return /^[6-9]\d{9}$/.test(digitsOnly);
}

/**
 * Normalizes Indian mobile number to clean 10-digit format.
 */
export function normalizeIndianPhone(phone: string): string {
  const cleaned = (phone || '').replace(/[\s\-()]/g, '');
  if (cleaned.startsWith('+91')) return cleaned.slice(3);
  if (cleaned.startsWith('91') && cleaned.length === 12) return cleaned.slice(2);
  if (cleaned.startsWith('0') && cleaned.length === 11) return cleaned.slice(1);
  return cleaned;
}

/**
 * Validates Indian Permanent Account Number (PAN) format:
 * 5 uppercase letters, 4 digits, 1 uppercase letter (e.g., ABCDE1234F).
 */
export function isValidPan(pan: string): boolean {
  if (!pan || typeof pan !== 'string') return false;
  const trimmed = pan.trim().toUpperCase();
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(trimmed);
}

/**
 * Income Tax Act Rule 114B PAN requirement threshold: ₹2,00,000 (in paise = 20,000,000).
 */
export const PAN_THRESHOLD_PAISE = 20000000;

export function isPanRequiredForOrder(amountInPaise: number): boolean {
  return amountInPaise >= PAN_THRESHOLD_PAISE;
}
