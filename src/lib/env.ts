/**
 * Environment Variable Validation & Startup Integrity Enforcement
 *
 * Verifies that no production secret contains a hardcoded or trivial fallback,
 * and enforces strict fail-loud behavior if critical environment variables are absent.
 */

const KNOWN_INSECURE_FALLBACKS = [
  'fallback',
  'secret',
  '123456',
  'ambika-admin',
  'placeholder',
  'changeme',
  'test',
  'dummy',
  'your-secret',
];

interface EnvConfigReport {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateEnvironment(): EnvConfigReport {
  const isProd = process.env.NODE_ENV === 'production';
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Admin Passcode & Session Secret Check
  const adminPasscode = process.env.ADMIN_PASSCODE;
  const adminSecret = process.env.ADMIN_SESSION_SECRET;

  if (adminSecret && KNOWN_INSECURE_FALLBACKS.some((f) => adminSecret.toLowerCase().includes(f))) {
    errors.push('ADMIN_SESSION_SECRET appears to contain an insecure placeholder.');
  }

  if (!adminPasscode) {
    const msg = 'ADMIN_PASSCODE is not defined in environment variables.';
    if (isProd) errors.push(msg);
    else warnings.push(msg);
  } else if (adminPasscode.length < 6) {
    errors.push('ADMIN_PASSCODE is too short (must be at least 6 characters).');
  } else if (KNOWN_INSECURE_FALLBACKS.includes(adminPasscode.toLowerCase())) {
    errors.push(`ADMIN_PASSCODE is set to an insecure common default ('${adminPasscode}').`);
  }

  // 2. Encryption Secret Check (PAN / PII Data Security)
  const encSecret = process.env.ENCRYPTION_SECRET || process.env.RAZORPAY_KEY_SECRET;
  if (!encSecret) {
    const msg = 'ENCRYPTION_SECRET (or fallback RAZORPAY_KEY_SECRET) is missing. PAN encryption cannot function.';
    if (isProd) errors.push(msg);
    else warnings.push(msg);
  } else if (KNOWN_INSECURE_FALLBACKS.some((f) => encSecret.toLowerCase().includes(f))) {
    errors.push('ENCRYPTION_SECRET appears to contain an insecure placeholder.');
  }

  // 3. Razorpay Secrets Check
  const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
  const rzpSecret = process.env.RAZORPAY_KEY_SECRET;
  const rzpWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (isProd) {
    if (!rzpKey) errors.push('NEXT_PUBLIC_RAZORPAY_KEY_ID is missing.');
    if (!rzpSecret) errors.push('RAZORPAY_KEY_SECRET is missing.');
    if (!rzpWebhookSecret) errors.push('RAZORPAY_WEBHOOK_SECRET is missing. Webhooks cannot be validated.');
  } else {
    if (!rzpKey || !rzpSecret) {
      warnings.push('Razorpay credentials missing; mock checkout enabled for local development.');
    }
  }

  // 4. Supabase Service Role Key (Server Only check)
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceRoleKey && typeof window !== 'undefined') {
    errors.push('CRITICAL: SUPABASE_SERVICE_ROLE_KEY leaked into browser context!');
  }

  const isValid = errors.length === 0;

  if (!isValid && isProd) {
    console.error('================================================================');
    console.error('🚨 [FATAL STARTUP ERROR] Application Security Environment Incomplete:');
    errors.forEach((err) => console.error(`  - ${err}`));
    console.error('================================================================');
    throw new Error(`[SECURITY FATAL] Environment validation failed in production:\n${errors.join('\n')}`);
  }

  if (warnings.length > 0 && !isProd) {
    console.warn('[SECURITY NOTICE - DEVELOPMENT] Optional or development warnings:', warnings);
  }

  return { isValid, errors, warnings };
}

// Auto-run validation upon server initialization
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  validateEnvironment();
}
