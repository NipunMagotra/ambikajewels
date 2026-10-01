import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { DEFAULT_RATES } from '@/lib/counterStore';
import type { DailyRates } from '@/types/counter';

export async function GET() {
  try {
    const dbClient = isSupabaseAdminConfigured ? supabaseAdmin : (isSupabaseConfigured ? supabase : null);

    if (dbClient) {
      const { data, error } = await dbClient
        .from('daily_rates')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data && !error) {
        const fetchedRates: DailyRates = {
          gold_24k: Number(data.gold_24k),
          gold_22k: Number(data.gold_22k),
          gold_18k: Number(data.gold_18k),
          gold_14k: Number(data.gold_14k),
          silver_999: Number(data.silver_999),
          silver_925: Number(data.silver_925),
          updated_at: data.updated_at || new Date().toISOString(),
          updated_by: data.updated_by || 'Supabase Sync',
        };
        return NextResponse.json({ success: true, rates: fetchedRates });
      }
    }

    return NextResponse.json({ success: true, rates: DEFAULT_RATES });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to fetch rates';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // 1. Authenticate via Admin Session Cookie
    const isAuthed = await verifyAdminAuth();
    if (!isAuthed) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required to update rates.' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const {
      gold_24k,
      gold_22k,
      gold_18k,
      gold_14k,
      silver_999,
      silver_925,
      updated_by
    } = body;

    // 2. Validate Rates (Must be positive numbers)
    const g24 = Number(gold_24k);
    const g22 = Number(gold_22k);
    const g18 = Number(gold_18k);
    const g14 = Number(gold_14k);
    const s999 = Number(silver_999);
    const s925 = Number(silver_925);

    if (!g24 || g24 <= 0 || !g22 || g22 <= 0 || !s999 || s999 <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid rate figures. Rates must be positive numbers.' },
        { status: 400 }
      );
    }

    const payload = {
      gold_24k: g24,
      gold_22k: g22,
      gold_18k: g18 || Math.round(g24 * 0.75),
      gold_14k: g14 || Math.round(g24 * 0.585),
      silver_999: s999,
      silver_925: s925 || Math.round(s999 * 0.925),
      updated_at: new Date().toISOString(),
      updated_by: typeof updated_by === 'string' && updated_by.trim() ? updated_by.trim().slice(0, 50) : 'Admin Desk'
    };

    // 3. Write via supabaseAdmin (Server-Side Service Role Key)
    const dbClient = isSupabaseAdminConfigured ? supabaseAdmin : (isSupabaseConfigured ? supabase : null);

    if (!dbClient) {
      return NextResponse.json(
        { success: false, error: 'Database client unconfigured. Rates saved locally only.' },
        { status: 500 }
      );
    }

    const { data, error } = await dbClient
      .from('daily_rates')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('[ADMIN RATES DB INSERT ERROR]', error);
      return NextResponse.json(
        { success: false, error: `Database persist error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Daily bullion rates updated successfully.',
      rates: data
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Internal server error';
    console.error('[ADMIN RATES ROUTE EXCEPTION]', error);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
