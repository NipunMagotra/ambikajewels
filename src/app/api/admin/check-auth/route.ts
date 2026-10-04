import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/adminAuth';

export async function GET(request?: Request) {
  const isAuth = await verifyAdminAuth(request);
  return NextResponse.json({ authenticated: isAuth });
}
