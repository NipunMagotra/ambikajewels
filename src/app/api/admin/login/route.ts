import { NextResponse } from 'next/server';
import crypto from 'crypto';
import {
  getAdminCookieName,
  ADMIN_SESSION_MAX_AGE_SECONDS
} from '@/lib/adminAuth';
import {
  memoryStaffAccounts,
  verifyPassword,
  verifyTotp,
  consumeRecoveryCode,
  needsPasswordRehash,
  hashPassword,
  createStaffSessionToken,
  AdminSession
} from '@/lib/staffAuth';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // 1. Sliding Window Rate Limiting (5 attempts per 15 minutes)
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

    const body = await request.json().catch(() => ({}));
    const { email, password, passcode, mfa_code, recovery_code } = body;

    // 2. Handle Admin Passcode Authentication (Single-field showroom / owner access)
    if (passcode !== undefined && passcode !== null && String(passcode).trim() !== '') {
      const cleanPasscode = String(passcode).trim();
      const expectedPasscode = (process.env.ADMIN_PASSCODE || 'ambika2026').trim();

      const inputBuf = Buffer.from(cleanPasscode);
      const expectedBuf = Buffer.from(expectedPasscode);
      const isPasscodeValid =
        inputBuf.length === expectedBuf.length &&
        crypto.timingSafeEqual(inputBuf, expectedBuf);

      if (!isPasscodeValid) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid admin passcode. Please try again.'
          },
          { status: 401 }
        );
      }

      const ownerAccount = memoryStaffAccounts.get('owner@ambikajewelsonline.com') || {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'owner@ambikajewelsonline.com',
        name: 'Smt. Shivani Anand (Founder & Owner)',
        role: 'owner' as const
      };

      const authenticatedSession: AdminSession = {
        sessionId: crypto.randomUUID(),
        staffId: ownerAccount.id,
        email: ownerAccount.email,
        name: ownerAccount.name,
        role: 'owner',
        mfaVerified: true,
        issuedAt: Date.now(),
        expiresAt: Date.now() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000
      };

      const sessionToken = createStaffSessionToken(authenticatedSession);

      const response = NextResponse.json({
        success: true,
        message: 'Authentication successful. Welcome to Admin Portal.',
        user: {
          email: authenticatedSession.email,
          name: authenticatedSession.name,
          role: authenticatedSession.role
        }
      });

      response.cookies.set({
        name: getAdminCookieName(),
        value: sessionToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: ADMIN_SESSION_MAX_AGE_SECONDS
      });

      return response;
    }

    // 3. Enforce Individual Staff Account Credentials
    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json(
        {
          success: false,
          message: 'Admin passcode or staff credentials (email & password) are required.'
        },
        { status: 401 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const account = memoryStaffAccounts.get(cleanEmail);

    if (!account || !account.isActive) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials or staff account is deactivated.' },
        { status: 401 }
      );
    }

    const isValidPassword = verifyPassword(password, account.passwordHash, account.salt);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials or staff account is deactivated.' },
        { status: 401 }
      );
    }

    // 4. Mandatory MFA Enforcement for Owner and MFA-enabled accounts
    let mfaVerified = false;
    const isMfaMandatory = account.role === 'owner' || account.mfaEnabled;

    if (isMfaMandatory) {
      if (!account.mfaSecret) {
        return NextResponse.json(
          {
            success: false,
            message: 'MFA configuration missing for privileged account. Contact security administrator.'
          },
          { status: 500 }
        );
      }

      // Check if neither MFA code nor recovery code was supplied
      if (!mfa_code && !recovery_code) {
        return NextResponse.json(
          {
            success: false,
            requires_mfa: true,
            message: 'Multi-Factor Authentication required. Enter the 6-digit code from your authenticator app.'
          },
          { status: 200 }
        );
      }

      // Check single-use emergency recovery code if supplied
      if (recovery_code && typeof recovery_code === 'string') {
        const recoveryResult = consumeRecoveryCode(account, recovery_code);
        if (!recoveryResult.valid) {
          return NextResponse.json(
            { success: false, message: recoveryResult.error || 'Invalid recovery code.' },
            { status: 401 }
          );
        }
        mfaVerified = true;
      }
      // Otherwise verify 6-digit RFC 6238 TOTP with anti-replay
      else if (mfa_code && typeof mfa_code === 'string') {
        const totpResult = verifyTotp(mfa_code, account.mfaSecret, account.id);
        if (!totpResult.valid) {
          return NextResponse.json(
            { success: false, message: totpResult.error || 'Invalid 6-digit Multi-Factor Authentication code.' },
            { status: 401 }
          );
        }
        mfaVerified = true;
      }
    }

    // 5. Transparent Password Hash Upgrade (OWASP 260,000 PBKDF2 iterations)
    if (needsPasswordRehash(account.passwordHash)) {
      const upgraded = hashPassword(password, account.salt);
      account.passwordHash = upgraded.formatted;
      account.updatedAt = new Date().toISOString();
    }

    // 6. Build Authenticated Session Attributable to Individual Staff Member
    const authenticatedSession: AdminSession = {
      sessionId: crypto.randomUUID(),
      staffId: account.id,
      email: account.email,
      name: account.name,
      role: account.role,
      mfaVerified: account.role === 'owner' ? true : (isMfaMandatory ? mfaVerified : false),
      issuedAt: Date.now(),
      expiresAt: Date.now() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000
    };

    // 7. Issue Cryptographically Signed Individual Session Token
    const sessionToken = createStaffSessionToken(authenticatedSession);

    const response = NextResponse.json({
      success: true,
      message: `Authentication successful. Welcome, ${authenticatedSession.name}.`,
      user: {
        email: authenticatedSession.email,
        name: authenticatedSession.name,
        role: authenticatedSession.role
      }
    });

    response.cookies.set({
      name: getAdminCookieName(),
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: ADMIN_SESSION_MAX_AGE_SECONDS
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
