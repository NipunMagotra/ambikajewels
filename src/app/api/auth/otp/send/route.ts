import { NextResponse } from 'next/server';
import { sendCustomerOtp } from '@/lib/customerAuth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const identifier = body.identifier || body.email || body.phone;

    if (!identifier || typeof identifier !== 'string' || !identifier.trim()) {
      return NextResponse.json(
        { success: false, message: 'Email address or mobile number is required.' },
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

    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
