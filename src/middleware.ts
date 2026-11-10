import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE_NAME = 'ambika_admin_session';

/**
 * Validates admin session tokens using standard Web Crypto API supported natively in Next.js Edge Runtime.
 * Supports both individual staff session tokens and legacy HMAC tokens.
 */
async function verifyEdgeToken(token: string | undefined): Promise<boolean> {
  if (!token || !token.includes('.')) return false;

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  const parts = token.split('.');

  // 1. Try decoding as individual staff session token (base64url payload)
  try {
    const payloadStr = parts.length === 3 ? parts[1] : parts[0];
    const sigHex = parts[parts.length - 1];
    const base64 = payloadStr.replace(/-/g, '+').replace(/_/g, '/');
    const jsonStr = atob(base64);

    if (jsonStr.startsWith('{') && jsonStr.endsWith('}')) {
      const payload = JSON.parse(jsonStr);
      if (Date.now() > payload.expiresAt) return false;
      if (payload.role === 'owner' && !payload.mfaVerified) return false;

      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret.trim()),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
      );

      const match = sigHex.match(/.{1,2}/g);
      if (!match) return false;
      const sigBytes = new Uint8Array(match.map((byte) => parseInt(byte, 16)));
      const messageToVerify = parts.length === 3 ? `${parts[0]}.${parts[1]}` : payloadStr;

      return await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(messageToVerify));
    }
  } catch {
    // Fall through to legacy format verification
  }

  // 2. Validate legacy timestamp token: <expiryStr>.<sigHex>
  if (parts.length === 2) {
    const [expiryStr, sigHex] = parts;
    const expiry = Number(expiryStr);
    if (isNaN(expiry) || Date.now() > expiry) return false;

    try {
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret.trim()),
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

  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public admin login endpoints
  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    return NextResponse.next();
  }

  // 2. Protect /admin and /api/admin paths
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const sessionToken =
      request.cookies.get(ADMIN_COOKIE_NAME)?.value ||
      request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const isValid = await verifyEdgeToken(sessionToken);

    if (!isValid) {
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized: Valid individual admin session required.' },
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
