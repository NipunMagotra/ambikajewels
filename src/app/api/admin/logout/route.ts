import { NextResponse } from 'next/server';
import { getAdminCookieName } from '@/lib/adminAuth';

export async function POST() {
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
