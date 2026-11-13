import { NextResponse } from 'next/server';
import { verifyCustomerAuth, getCustomerProfile, saveCustomerProfile } from '@/lib/customerAuth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await verifyCustomerAuth(request);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Customer session required.' },
        { status: 401 }
      );
    }

    const identifier = session.email || session.phone || session.customerId;
    const profile = await getCustomerProfile(identifier);

    return NextResponse.json({
      success: true,
      customer: session,
      profile
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await verifyCustomerAuth(request);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Customer session required.' },
        { status: 401 }
      );
    }

    const identifier = session.email || session.phone || session.customerId;
    const currentProfile = await getCustomerProfile(identifier);

    const body = await request.json().catch(() => ({}));
    const { fullName, phone, addresses } = body;

    const updatedProfile = {
      ...currentProfile,
      ...(fullName !== undefined ? { fullName: String(fullName).trim() } : {}),
      ...(phone !== undefined ? { phone: String(phone).trim() } : {}),
      ...(Array.isArray(addresses) ? { addresses } : {})
    };

    const saved = await saveCustomerProfile(updatedProfile);

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile: saved
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

