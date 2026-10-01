import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { DEFAULT_RATES } from '@/lib/counterStore';
import { siteConfig } from '@/config/siteConfig';
import type { DailyRates } from '@/types/counter';

/**
 * Checks whether the current database bullion rate is older than the configured threshold.
 */
export async function verifyBullionRateFreshness(maxHours = siteConfig.rates.maxRateAgeHours): Promise<{
  isFresh: boolean;
  ageHours: number;
  latestRate: DailyRates | null;
}> {
  const dbClient = isSupabaseAdminConfigured ? supabaseAdmin : (isSupabaseConfigured ? supabase : null);
  if (!dbClient) {
    return { isFresh: false, ageHours: 999, latestRate: null };
  }

  try {
    const { data } = await dbClient
      .from('daily_rates')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!data || !data.updated_at) {
      return { isFresh: false, ageHours: 999, latestRate: null };
    }

    const updatedAt = new Date(data.updated_at).getTime();
    const ageHours = (Date.now() - updatedAt) / (1000 * 60 * 60);

    const latestRate: DailyRates = {
      gold_24k: Number(data.gold_24k),
      gold_22k: Number(data.gold_22k),
      gold_18k: Number(data.gold_18k),
      gold_14k: Number(data.gold_14k),
      silver_999: Number(data.silver_999),
      silver_925: Number(data.silver_925),
      updated_at: data.updated_at,
      updated_by: data.updated_by || 'Supabase',
    };

    return {
      isFresh: ageHours <= maxHours,
      ageHours: Math.round(ageHours * 10) / 10,
      latestRate
    };
  } catch {
    return { isFresh: false, ageHours: 999, latestRate: null };
  }
}

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

    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    const body = await request.json().catch(() => ({}));
    const {
      gold_24k,
      gold_22k,
      gold_18k,
      gold_14k,
      silver_999,
      silver_925,
      updated_by,
      confirm_large_change
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

    const dbClient = isSupabaseAdminConfigured ? supabaseAdmin : (isSupabaseConfigured ? supabase : null);

    if (!dbClient) {
      return NextResponse.json(
        { success: false, error: 'Database client unconfigured. Rates saved locally only.' },
        { status: 500 }
      );
    }

    // 3. Rate Sanity Bounds Check (Reject changes > maxDeviationPercent without confirmation)
    const { data: latestExisting } = await dbClient
      .from('daily_rates')
      .select('gold_24k')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestExisting && latestExisting.gold_24k) {
      const prev24k = Number(latestExisting.gold_24k);
      const deviationPercent = Math.abs((g24 - prev24k) / prev24k) * 100;

      if (deviationPercent > siteConfig.rates.maxDeviationPercent && !confirm_large_change) {
        return NextResponse.json(
          {
            success: false,
            error: `Rate change of ${deviationPercent.toFixed(1)}% exceeds the ${siteConfig.rates.maxDeviationPercent}% sanity threshold. Please set confirm_large_change: true to override.`,
            previous_rate_24k: prev24k,
            submitted_rate_24k: g24,
            deviation_percent: Math.round(deviationPercent * 10) / 10
          },
          { status: 400 }
        );
      }
    }

    const modifierLabel = typeof updated_by === 'string' && updated_by.trim()
      ? `${updated_by.trim().slice(0, 30)} [${ip}]`
      : `Staff Desk [${ip}]`;

    const payload = {
      gold_24k: g24,
      gold_22k: g22,
      gold_18k: g18 || Math.round(g24 * 0.75),
      gold_14k: g14 || Math.round(g24 * 0.585),
      silver_999: s999,
      silver_925: s925 || Math.round(s999 * 0.925),
      updated_at: new Date().toISOString(),
      updated_by: modifierLabel
    };

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
