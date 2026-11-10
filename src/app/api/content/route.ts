import { NextResponse } from 'next/server';
import { getStoreContent } from '@/lib/storeContent';

export const dynamic = 'force-dynamic';

/**
 * GET /api/content
 * Public endpoint serving active store content (announcement banner, hero banner, showroom details)
 */
export async function GET() {
  try {
    const content = await getStoreContent();
    return NextResponse.json({
      success: true,
      content
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 }
    );
  }
}

