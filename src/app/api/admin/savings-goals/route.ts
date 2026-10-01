import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';
import { siteConfig } from '@/config/siteConfig';

/**
 * Authenticated Server Endpoint for Customer Savings Goals (Admin Staff Only)
 * All operations require valid admin session cookie; uses supabaseAdmin service-role key.
 */
export async function GET() {
  try {
    const isAuthed = await verifyAdminAuth();
    if (!isAuthed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!siteConfig.features.savingsGoalsEnabled) {
      return NextResponse.json({
        success: false,
        enabled: false,
        error: 'Savings goals feature is currently disabled pending legal/CA approval.',
        goals: []
      });
    }

    if (!isSupabaseAdminConfigured || !supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Database service unconfigured' }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from('customer_savings_goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[SAVINGS GOALS GET ERROR]', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, enabled: true, goals: data || [] });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAuthed = await verifyAdminAuth();
    if (!isAuthed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!siteConfig.features.savingsGoalsEnabled) {
      return NextResponse.json(
        { success: false, error: 'Cannot create savings goals: Feature disabled pending legal approval.' },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { goal } = body;

    if (!goal || !goal.customerName || !goal.customerPhone) {
      return NextResponse.json({ success: false, error: 'Customer name and phone are required.' }, { status: 400 });
    }

    if (!isSupabaseAdminConfigured || !supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Database service unconfigured' }, { status: 500 });
    }

    const { data, error } = await supabaseAdmin
      .from('customer_savings_goals')
      .upsert({
        id: goal.id,
        customer_name: String(goal.customerName).slice(0, 100),
        customer_phone: String(goal.customerPhone).slice(0, 20),
        event_name: String(goal.eventName || 'Savings Goal').slice(0, 100),
        target_weight_grams: Number(goal.targetWeightGrams || 0),
        target_amount_rupees: Number(goal.targetAmountRupees || 0),
        target_purity: String(goal.targetPurity || '22K'),
        target_date: goal.targetDate || null,
        payments: Array.isArray(goal.payments) ? goal.payments : [],
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('[SAVINGS GOALS POST ERROR]', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, goal: data });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const isAuthed = await verifyAdminAuth();
    if (!isAuthed) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Goal ID required' }, { status: 400 });
    }

    if (!isSupabaseAdminConfigured || !supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Database service unconfigured' }, { status: 500 });
    }

    const { error } = await supabaseAdmin
      .from('customer_savings_goals')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
