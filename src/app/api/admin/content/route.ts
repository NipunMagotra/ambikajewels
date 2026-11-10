import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { getStoreContent, saveStoreContent } from '@/lib/storeContent';
import { recordAuditLog } from '@/lib/auditLog';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const isAuth = await verifyAdminAuth(request);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

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

export async function POST(request: Request) {
  try {
    const isAuth = await verifyAdminAuth(request);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const oldContent = await getStoreContent();
    const updated = await saveStoreContent(body);

    await recordAuditLog({
      action: 'STORE_CONTENT_UPDATED',
      entityType: 'store_content',
      oldValues: oldContent as unknown as Record<string, unknown>,
      newValues: updated as unknown as Record<string, unknown>,
      request
    });

    return NextResponse.json({
      success: true,
      message: 'Website content updated successfully',
      content: updated
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json(
      { success: false, message: errorMsg },
      { status: 500 }
    );
  }
}

