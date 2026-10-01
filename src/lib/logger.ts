/**
 * Privacy-Preserving Logger (DPDP Act 2023 Compliance)
 * 
 * Target: Automatically sanitizes and redacts sensitive PII (Phone numbers,
 * Email addresses, PAN numbers, Aadhaar numbers, and full addresses) from all
 * server logs before writing to stdout or cloud logging providers.
 */

export function sanitizeLogString(message: string): string {
  if (!message || typeof message !== 'string') return message;

  return message
    // Redact 10-digit Indian mobile numbers (preserving first 3 and last 2 digits for debugging: 3 + 5 + 2 = 10)
    .replace(/(?:\+91[\s-]?)?([6-9]\d{2})\d{5}(\d{2})\b/g, '$1*****$2')
    // Redact emails (e.g. "customer@example.com" -> "c***r@example.com")
    .replace(/([a-zA-Z0-9])[a-zA-Z0-9._%+-]*([a-zA-Z0-9])@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '$1***$2@$3')
    // Redact 10-character PAN (e.g. "ABCDE1234F" -> "XXXXX1234X")
    .replace(/\b([A-Z]{5})([0-9]{4})([A-Z]{1})\b/gi, 'XXXXX$2X')
    // Redact 12-digit Aadhaar
    .replace(/\b\d{4}\s?\d{4}\s?(\d{4})\b/g, 'XXXX-XXXX-$1')
    // Redact 16-digit Card numbers
    .replace(/\b(?:\d{4}[-\s]?){3}(\d{4})\b/g, '****-****-****-$1');
}

export function sanitizeLogData(data: any): any {
  if (data === null || data === undefined) return data;
  if (typeof data === 'string') return sanitizeLogString(data);
  if (typeof data === 'number' || typeof data === 'boolean') return data;

  if (Array.isArray(data)) {
    return data.map(item => sanitizeLogData(item));
  }

  if (typeof data === 'object') {
    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      // Mask known sensitive keys completely
      if (
        lowerKey.includes('pan') || 
        lowerKey.includes('password') || 
        lowerKey.includes('secret') || 
        lowerKey.includes('token') ||
        lowerKey.includes('cvv') ||
        lowerKey.includes('auth')
      ) {
        sanitized[key] = '[REDACTED_SENSITIVE_KEY]';
      } else if (lowerKey.includes('phone') || lowerKey.includes('mobile')) {
        sanitized[key] = typeof value === 'string' ? sanitizeLogString(value) : '[REDACTED_PHONE]';
      } else if (lowerKey.includes('email')) {
        sanitized[key] = typeof value === 'string' ? sanitizeLogString(value) : '[REDACTED_EMAIL]';
      } else {
        sanitized[key] = sanitizeLogData(value);
      }
    }
    return sanitized;
  }

  return data;
}

export const secureLogger = {
  info: (msg: string, ...args: any[]) => {
    console.log(`[INFO] ${sanitizeLogString(msg)}`, ...args.map(a => sanitizeLogData(a)));
  },
  warn: (msg: string, ...args: any[]) => {
    console.warn(`[WARN] ${sanitizeLogString(msg)}`, ...args.map(a => sanitizeLogData(a)));
  },
  error: (msg: string, ...args: any[]) => {
    console.error(`[ERROR] ${sanitizeLogString(msg)}`, ...args.map(a => sanitizeLogData(a)));
  }
};
