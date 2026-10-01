import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';
import { generateRateLockToken, RateSnapshot } from '@/lib/rateLock';
import { siteConfig } from '@/config/siteConfig';

export async function GET() {
  try {
    let rates: RateSnapshot = {
      gold_24k: 7850,
      gold_22k: 7190,
      gold_18k: 5890,
      gold_14k: 4580,
      silver_925: 98
    };

    const dbClient = isSupabaseAdminConfigured ? supabaseAdmin : (isSupabaseConfigured ? supabase : null);
    if (dbClient) {
      try {
        const { data } = await dbClient
          .from('daily_rates')
          .select('gold_24k, gold_22k, gold_18k, gold_14k, silver_925')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (data) {
          rates = {
            gold_24k: Number(data.gold_24k) || rates.gold_24k,
            gold_22k: Number(data.gold_22k) || rates.gold_22k,
            gold_18k: Number(data.gold_18k) || rates.gold_18k,
            gold_14k: Number(data.gold_14k) || rates.gold_14k,
            silver_925: Number(data.silver_925) || rates.silver_925,
          };
        }
      } catch (dbErr) {
        console.warn('Could not fetch daily rates from DB for rate lock, using defaults:', dbErr);
      }
    }

    const lockResult = generateRateLockToken(rates, siteConfig.rates.rateLockMinutes || 15);

    return NextResponse.json({
      success: true,
      token: lockResult.token,
      rates: lockResult.rates,
      expires_at: lockResult.expires_at,
      duration_minutes: siteConfig.rates.rateLockMinutes || 15
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to generate rate lock token';
    console.error('Rate lock error:', err);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
