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
  'ambika2026',
  '9682589725',
  'ambikamanager2026!',
  'ambikastaff2026!',
  'placeholder',
  'changeme',
  'test',
  'dummy',
  'your-secret',
];

function isPlaceholder(value: string): boolean {
  const v = value.toLowerCase().trim();
  if (KNOWN_INSECURE_FALLBACKS.includes(v)) return true;
  if (
    v.includes('placeholder') ||
    v.includes('changeme') ||
    v.includes('your-secret') ||
    v.startsWith('your_') ||
    v.startsWith('test_placeholder')
  ) {
    return true;
  }
  return false;
}

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

  if (isProd) {
    if (!adminPasscode || adminPasscode.trim().length < 6) {
      errors.push('ADMIN_PASSCODE is missing or too short in production (minimum 6 characters required).');
    } else if (isPlaceholder(adminPasscode)) {
      errors.push(`ADMIN_PASSCODE is set to an insecure default placeholder ('${adminPasscode}').`);
    }

    if (!adminSecret || adminSecret.trim().length < 16) {
      errors.push('ADMIN_SESSION_SECRET is missing or too short in production (minimum 16 characters required).');
    } else if (isPlaceholder(adminSecret)) {
      errors.push('ADMIN_SESSION_SECRET appears to contain a default placeholder.');
    }
  } else {
    if (adminSecret && adminSecret.length < 16) {
      warnings.push('ADMIN_SESSION_SECRET is too short (minimum 16 characters recommended).');
    }
  }

  // 2. Encryption Secret Check (PAN / PII Data Security)
  // Dedicated PAN encryption secret — strictly isolated from Razorpay credentials
  const panSecret = process.env.PAN_ENCRYPTION_SECRET || process.env.ENCRYPTION_SECRET;
  if (!panSecret || panSecret.trim().length < 16) {
    const msg = 'PAN_ENCRYPTION_SECRET (or ENCRYPTION_SECRET) is missing or too short (minimum 16 characters required). PAN encryption cannot function.';
    if (isProd) errors.push(msg);
    else warnings.push(msg);
  } else if (isPlaceholder(panSecret)) {
    errors.push('PAN_ENCRYPTION_SECRET appears to contain an insecure placeholder.');
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

  // 4. Resend Transactional Email Configuration
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFromEmail = process.env.RESEND_FROM_EMAIL;

  if (isProd) {
    if (!resendApiKey) {
      errors.push('RESEND_API_KEY is missing in production.');
    }
    if (!resendFromEmail) {
      errors.push('RESEND_FROM_EMAIL is missing in production.');
    } else if (resendFromEmail.includes('onboarding@resend.dev')) {
      errors.push('RESEND_FROM_EMAIL must not use onboarding@resend.dev in production. A verified store domain address (e.g. orders@ambikajewelsonline.com) is required.');
    }
  }

  // 4. Supabase Service Role Key (Server Only check)
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceRoleKey && typeof window !== 'undefined') {
    errors.push('CRITICAL: SUPABASE_SERVICE_ROLE_KEY leaked into browser context!');
  }

  // 5. BVC Logistics eSHIP API Credentials Check
  const bvcKey = process.env.BVC_API_KEY;
  const bvcSecret = process.env.BVC_API_SECRET;
  if (!bvcKey || !bvcSecret) {
    warnings.push('BVC Logistics API credentials not configured; simulated armored fulfillment mode active.');
  } else {
    if (isPlaceholder(bvcKey)) {
      errors.push('BVC_API_KEY appears to contain an insecure placeholder.');
    }
    if (isPlaceholder(bvcSecret)) {
      errors.push('BVC_API_SECRET appears to contain an insecure placeholder.');
    }
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
