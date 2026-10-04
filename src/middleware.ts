import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE_NAME = 'ambika_admin_session';

/**
 * Validates HMAC-SHA256 session token using the standard Web Crypto API (supported natively in Next.js Edge Runtime).
 */
async function verifyEdgeToken(token: string | undefined): Promise<boolean> {
  if (!token || !token.includes('.')) return false;

  const [expiryStr, sigHex] = token.split('.');
  const expiry = Number(expiryStr);
  if (isNaN(expiry) || Date.now() > expiry) return false;

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret.trim());
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const message = encoder.encode(`admin_session:${expiryStr}`);
    const match = sigHex.match(/.{1,2}/g);
    if (!match) return false;
    const sigBytes = new Uint8Array(match.map((byte) => parseInt(byte, 16)));

    return await crypto.subtle.verify('HMAC', key, sigBytes, message);
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public admin login endpoints
  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    return NextResponse.next();
  }

  // 2. Protect /admin and /api/admin paths
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const sessionToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value ||
      request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const isValid = await verifyEdgeToken(sessionToken);

    if (!isValid) {
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized: Valid admin session required.' },
          { status: 401 }
        );
      }

      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
