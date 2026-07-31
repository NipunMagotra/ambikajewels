import { cookies } from 'next/headers';

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'ambika2026';
const ADMIN_COOKIE_NAME = 'ambika_admin_session';
const ADMIN_SESSION_SECRET = 'ambika_admin_secret_token_2026';

export async function verifyAdminAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    return token === ADMIN_SESSION_SECRET;
  } catch (error) {
    return false;
  }
}

export function getAdminPasscode(): string {
  return ADMIN_PASSCODE;
}

export function getAdminCookieName(): string {
  return ADMIN_COOKIE_NAME;
}

export function getAdminSecretToken(): string {
  return ADMIN_SESSION_SECRET;
}
