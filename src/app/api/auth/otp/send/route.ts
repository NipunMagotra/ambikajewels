import { NextResponse } from 'next/server';
import { sendCustomerOtp } from '@/lib/customerAuth';
import { checkRateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // 1. Enforce IP-level rate limiting on OTP requests (5 per 10 minutes)
    try {
      const rateCheck = await checkRateLimit('customerOtpSend', ip);
      if (!rateCheck.success) {
        return NextResponse.json(
          {
            success: false,
            message: 'Too many OTP requests. Please wait a few minutes before trying again.',
            cooldownSeconds: 60
          },
          { status: 429 }
        );
      }
    } catch (rateErr) {
      console.warn('[RATE LIMIT WARN]', rateErr);
    }

    const body = await request.json().catch(() => ({}));
    const identifier = body.identifier || body.email || body.phone;

    if (!identifier || typeof identifier !== 'string' || !identifier.trim()) {
      return NextResponse.json(
        { success: false, message: 'Valid registered email address is required.' },
        { status: 400 }
      );
    }

    const result = await sendCustomerOtp(identifier);
    if (!result.success) {
      const status = result.cooldownSeconds ? 429 : 400;
      return NextResponse.json(
        { success: false, message: result.message, cooldownSeconds: result.cooldownSeconds },
        { status }
      );
    }

    // In production, unconditionally ensure testOtp is never exposed in response
    const { testOtp, ...productionSafeResult } = result;
    const finalResult = process.env.NODE_ENV === 'production' ? productionSafeResult : result;

    return NextResponse.json(finalResult);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
