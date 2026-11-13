import { NextResponse } from 'next/server';
import { verifyCustomerOtp, CUSTOMER_COOKIE_NAME } from '@/lib/customerAuth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const identifier = body.identifier || body.email || body.phone;
    const code = body.code || body.otp;

    if (!identifier || typeof identifier !== 'string' || !identifier.trim()) {
      return NextResponse.json(
        { success: false, message: 'Email or mobile identifier is required.' },
        { status: 400 }
      );
    }

    if (!code || typeof code !== 'string' || !code.trim()) {
      return NextResponse.json(
        { success: false, message: '6-digit verification code is required.' },
        { status: 400 }
      );
    }

    const result = await verifyCustomerOtp(identifier, code);
    if (!result.success || !result.token) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: result.message,
      profile: result.profile,
      token: result.token
    });

    // Set secure HTTP-only session cookie (30 days)
    response.cookies.set(CUSTOMER_COOKIE_NAME, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60
    });

    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

