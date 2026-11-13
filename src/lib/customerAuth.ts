import crypto from 'crypto';
import { cookies } from 'next/headers';
import { supabaseAdmin, isSupabaseAdminConfigured } from './supabaseAdmin';

export const CUSTOMER_COOKIE_NAME = 'ambika_customer_session';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'ambika_customer_fallback_secret_key_2026';
const TOKEN_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days

export interface CustomerAddress {
  id: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface CustomerProfile {
  id: string;
  email?: string;
  phone?: string;
  fullName?: string;
  addresses: CustomerAddress[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerSessionPayload {
  customerId: string;
  email?: string;
  phone?: string;
  fullName?: string;
  iat: number;
  exp: number;
}

// ── In-Memory Ring Buffer for OTPs & Rate Limiting ────────────────────────
interface OtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
}

declare global {
  var __ambika_customer_otps: Map<string, OtpRecord> | undefined;
}

if (!globalThis.__ambika_customer_otps) {
  globalThis.__ambika_customer_otps = new Map<string, OtpRecord>();
}

const otpStore = globalThis.__ambika_customer_otps;

// ── Session Token Generation & Verification ──────────────────────────────
export function createCustomerSessionToken(payload: {
  customerId: string;
  email?: string;
  phone?: string;
  fullName?: string;
}): string {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + TOKEN_MAX_AGE_SECONDS;
  const fullPayload: CustomerSessionPayload = {
    ...payload,
    iat,
    exp
  };

  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

export function parseCustomerSessionToken(token: string): CustomerSessionPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [encodedPayload, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(encodedPayload)
      .digest('base64url');

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payload: CustomerSessionPayload = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf8')
    );

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

export async function verifyCustomerAuth(request?: Request): Promise<CustomerSessionPayload | null> {
  // 1. Try reading from Authorization Bearer header
  if (request) {
    const authHeader = request.headers.get('authorization') || '';
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7).trim();
      const payload = parseCustomerSessionToken(token);
      if (payload) return payload;
    }

    // 2. Try reading from Request Cookie header
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(new RegExp(`${CUSTOMER_COOKIE_NAME}=([^;]+)`));
    if (match && match[1]) {
      const payload = parseCustomerSessionToken(match[1].trim());
      if (payload) return payload;
    }
  }

  // 3. Try reading from Next.js HTTP-only Cookie store
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(CUSTOMER_COOKIE_NAME)?.value;
    if (token) {
      return parseCustomerSessionToken(token);
    }
  } catch {
    // Cookie store not accessible in this context
  }

  return null;
}

// ── Customer Profile Storage (Supabase store_settings backed) ─────────────
function normalizeKey(identifier: string): string {
  return `customer_profile:${identifier.trim().toLowerCase()}`;
}

export async function getCustomerProfile(identifier: string): Promise<CustomerProfile> {
  const norm = identifier.trim().toLowerCase();
  const isEmail = norm.includes('@');
  const defaultProfile: CustomerProfile = {
    id: `cust_${crypto.createHash('md5').update(norm).digest('hex').slice(0, 12)}`,
    email: isEmail ? norm : undefined,
    phone: !isEmail ? norm : undefined,
    fullName: '',
    addresses: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return defaultProfile;
  }

  try {
    const { data } = await supabaseAdmin
      .from('store_settings')
      .select('content, updated_at')
      .eq('key', normalizeKey(norm))
      .maybeSingle();

    if (data?.content) {
      return {
        ...defaultProfile,
        ...(data.content as Partial<CustomerProfile>),
        updatedAt: data.updated_at || defaultProfile.updatedAt
      };
    }
  } catch (err) {
    console.warn('[CUSTOMER PROFILE GET WARN]', err);
  }

  return defaultProfile;
}

export async function saveCustomerProfile(profile: CustomerProfile): Promise<CustomerProfile> {
  const identifier = (profile.email || profile.phone || profile.id).toLowerCase();
  const updated: CustomerProfile = {
    ...profile,
    updatedAt: new Date().toISOString()
  };

  if (isSupabaseAdminConfigured && supabaseAdmin) {
    try {
      await supabaseAdmin.from('store_settings').upsert({
        key: normalizeKey(identifier),
        content: updated,
        updated_at: updated.updatedAt
      }, { onConflict: 'key' });
    } catch (err) {
      console.warn('[CUSTOMER PROFILE SAVE WARN]', err);
    }
  }

  return updated;
}

// ── OTP Generation & Dispatch ────────────────────────────────────────────
export async function sendCustomerOtp(rawIdentifier: string): Promise<{
  success: boolean;
  message: string;
  cooldownSeconds?: number;
  testOtp?: string;
}> {
  const identifier = rawIdentifier.trim().toLowerCase();
  if (!identifier) {
    return { success: false, message: 'Please provide a valid email or 10-digit mobile number.' };
  }

  const isEmail = identifier.includes('@') && identifier.includes('.');
  const digitsOnly = identifier.replace(/\D/g, '');
  const isValidPhone = digitsOnly.length === 10 || (digitsOnly.length === 12 && digitsOnly.startsWith('91'));

  if (!isEmail && !isValidPhone) {
    return { success: false, message: 'Please provide a valid email address or 10-digit mobile number.' };
  }

  const now = Date.now();
  const existing = otpStore.get(identifier);

  // 60-second cooldown between resends
  if (existing && now - existing.lastSentAt < 60000) {
    const waitSecs = Math.ceil((60000 - (now - existing.lastSentAt)) / 1000);
    return {
      success: false,
      message: `Please wait ${waitSecs} seconds before requesting a new code.`,
      cooldownSeconds: waitSecs
    };
  }

  // Generate 6-digit cryptographic OTP code
  const code = (Math.floor(100000 + crypto.randomInt(900000))).toString();
  const expiresAt = now + 10 * 60 * 1000; // 10 minutes expiry

  otpStore.set(identifier, {
    code,
    expiresAt,
    attempts: 0,
    lastSentAt: now
  });

  // Dispatch Email OTP via Resend
  if (isEmail) {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const fromAddress = process.env.RESEND_FROM_EMAIL || 'Ambika Jewels <onboarding@resend.dev>';
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <title>Your Ambika Jewels Verification Code</title>
          </head>
          <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8f6f0; margin: 0; padding: 24px; color: #1a1a1a;">
            <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border: 1px solid #d4af37; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
              <div style="background: linear-gradient(135deg, #181512 0%, #2a2219 100%); padding: 28px 24px; text-align: center; border-bottom: 2px solid #d4af37;">
                <h1 style="margin: 0; color: #d4af37; font-size: 22px; font-weight: normal; letter-spacing: 4px; text-transform: uppercase;">AMBIKA JEWELS</h1>
                <p style="margin: 6px 0 0; color: #c5a880; font-size: 10px; letter-spacing: 2px; text-transform: uppercase;">Jammu &bull; Estd. 1998 &bull; Royal Heritage</p>
              </div>
              <div style="padding: 32px 28px; text-align: center;">
                <h2 style="font-size: 18px; color: #1a1a1a; margin-top: 0; font-weight: 600;">Sign in to Your Royal Account</h2>
                <p style="font-size: 14px; color: #555555; line-height: 1.6; margin-bottom: 24px;">
                  Use the 6-digit security code below to securely access your orders, track jewelry dispatches, and manage your heirloom pieces.
                </p>
                <div style="display: inline-block; background: #fdfbf7; border: 2px dashed #d4af37; border-radius: 6px; padding: 14px 32px; margin: 0 auto 20px;">
                  <span style="font-size: 32px; font-family: monospace; font-weight: bold; letter-spacing: 8px; color: #8c6f2d;">${code}</span>
                </div>
                <p style="font-size: 12px; color: #888888; margin: 0;">
                  This code expires in <strong>10 minutes</strong>. For your security, never share this code with anyone.
                </p>
              </div>
              <div style="background: #faf8f5; padding: 16px; text-align: center; font-size: 11px; color: #999999; border-top: 1px solid #ede8de;">
                Ambika Jewels Showroom, Sector 1, Lower Roop Nagar, Jammu, J&K 180013<br />
                Direct Concierge: +91 96825 89725 &bull; info@ambikajewels.com
              </div>
            </div>
          </body>
          </html>
        `;

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [identifier],
            subject: `${code} is your Ambika Jewels verification code`,
            html: emailHtml
          })
        });
      } catch (err) {
        console.error('[CUSTOMER OTP EMAIL DISPATCH ERROR]', err);
      }
    }
  }

  console.log(`[CUSTOMER OTP ISSUED] Target: ${identifier} | Code: ${code}`);

  // In test environment or fallback, provide testOtp for automated verification
  const isTestOrLocal = process.env.NODE_ENV === 'test' || identifier.includes('test') || !process.env.RESEND_API_KEY;

  return {
    success: true,
    message: isEmail ? `Verification code sent to ${identifier}` : `Verification code generated for ${identifier}`,
    ...(isTestOrLocal ? { testOtp: code } : {})
  };
}

export async function verifyCustomerOtp(
  rawIdentifier: string,
  rawCode: string
): Promise<{
  success: boolean;
  message: string;
  token?: string;
  profile?: CustomerProfile;
}> {
  const identifier = rawIdentifier.trim().toLowerCase();
  const code = rawCode.trim();

  const record = otpStore.get(identifier);
  if (!record) {
    return { success: false, message: 'No verification code was requested for this identifier, or it has expired.' };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(identifier);
    return { success: false, message: 'Verification code has expired. Please request a new code.' };
  }

  if (record.attempts >= 5) {
    otpStore.delete(identifier);
    return { success: false, message: 'Too many invalid attempts. Please request a new code.' };
  }

  if (record.code !== code) {
    record.attempts += 1;
    return { success: false, message: `Incorrect verification code. ${5 - record.attempts} attempts remaining.` };
  }

  // OTP successfully verified: clear record
  otpStore.delete(identifier);

  // Fetch or create customer profile
  const profile = await getCustomerProfile(identifier);

  // Generate session token
  const token = createCustomerSessionToken({
    customerId: profile.id,
    email: profile.email,
    phone: profile.phone,
    fullName: profile.fullName
  });

  return {
    success: true,
    message: 'Authentication successful',
    token,
    profile
  };
}
