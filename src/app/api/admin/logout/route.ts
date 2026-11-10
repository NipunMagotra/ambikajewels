import { NextResponse } from 'next/server';
import { getAdminCookieName, revokeAdminSessionToken } from '@/lib/adminAuth';
import { cookies } from 'next/headers';

export async function POST(request?: Request) {
  try {
    let tokenToRevoke: string | undefined;

    if (request) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        tokenToRevoke = authHeader.slice(7).trim();
      }
      const cookieHeader = request.headers.get('cookie');
      if (!tokenToRevoke && cookieHeader) {
        const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${getAdminCookieName()}=([^;]+)`));
        if (match) {
          tokenToRevoke = decodeURIComponent(match[1]);
        }
      }
    }

    if (!tokenToRevoke) {
      const cookieStore = await cookies();
      tokenToRevoke = cookieStore.get(getAdminCookieName())?.value;
    }

    if (tokenToRevoke) {
      revokeAdminSessionToken(tokenToRevoke);
    }

    const response = NextResponse.json({ success: true, message: 'Admin session successfully revoked and logged out.' });
    response.cookies.set({
      name: getAdminCookieName(),
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0),
      path: '/'
    });
    return response;
  } catch {
    const response = NextResponse.json({ success: true, message: 'Logged out' });
    response.cookies.set({
      name: getAdminCookieName(),
      value: '',
      httpOnly: true,
      expires: new Date(0),
      path: '/'
    });
    return response;
  }
}
