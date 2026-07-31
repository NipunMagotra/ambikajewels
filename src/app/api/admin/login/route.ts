import { NextResponse } from 'next/server';
import { getAdminPasscode, getAdminCookieName, getAdminSecretToken } from '@/lib/adminAuth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { passcode } = body;

    if (!passcode || typeof passcode !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Passcode is required' },
        { status: 400 }
      );
    }

    const validPasscode = getAdminPasscode();
    if (passcode.trim() !== validPasscode) {
      return NextResponse.json(
        { success: false, message: 'Invalid admin passcode' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Admin authentication successful'
    });

    response.cookies.set({
      name: getAdminCookieName(),
      value: getAdminSecretToken(),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
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
