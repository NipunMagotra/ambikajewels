import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/adminAuth';

export async function GET() {
  const isAuth = await verifyAdminAuth();
  return NextResponse.json({ authenticated: isAuth });
}
