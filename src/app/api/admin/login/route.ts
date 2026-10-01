import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAdminPasscode, getAdminCookieName, createAdminSessionToken, isPasscodeConfigured, ADMIN_SESSION_MAX_AGE_SECONDS } from '@/lib/adminAuth';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // 1. Shared Upstash Redis Rate Limiting (5 attempts per 15 minutes)
    const rateCheck = await checkRateLimit('adminLogin', ip);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many login attempts. This IP address has been temporarily rate-limited for 15 minutes.'
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { passcode } = body;

    if (!passcode || typeof passcode !== 'string' || !isPasscodeConfigured()) {
      return NextResponse.json(
        { success: false, message: 'Invalid admin credentials or server configuration' },
        { status: 401 }
      );
    }

    const validPasscode = getAdminPasscode();
    const inputBuf = Buffer.from(passcode.trim());
    const validBuf = Buffer.from(validPasscode.trim());

    // 2. Constant-time comparison to prevent timing attacks
    let isMatch = false;
    if (inputBuf.length === validBuf.length) {
      isMatch = crypto.timingSafeEqual(inputBuf, validBuf);
    }

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid admin passcode' },
        { status: 401 }
      );
    }

    // 3. Generate Cryptographically Signed Session Token (12 Hours Max Lifetime)
    const sessionToken = createAdminSessionToken(ADMIN_SESSION_MAX_AGE_SECONDS);

    const response = NextResponse.json({
      success: true,
      message: 'Admin authentication successful'
    });

    response.cookies.set({
      name: getAdminCookieName(),
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ADMIN_SESSION_MAX_AGE_SECONDS // 12 hours
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
