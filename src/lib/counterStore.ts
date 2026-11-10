import { supabase, isSupabaseConfigured } from './supabase';
import { DailyRates } from '@/types/counter';

export const DEFAULT_RATES: DailyRates = {
  gold_24k: 7850,
  gold_22k: 7190,
  gold_18k: 5888,
  gold_14k: 4592,
  silver_999: 92,
  silver_925: 85,
  updated_at: new Date().toISOString(),
  updated_by: 'Morning Set',
};

const LOCAL_RATES_KEY = 'ambika_daily_rates_v1';

/**
 * Derives standard purity rates based on 24K pure gold rate per gram.
 * 22K = 91.6% purity
 * 18K = 75.0% purity
 * 14K = 58.5% purity
 */
export function derivePurityRatesFrom24k(gold24k: number) {
  const safe24k = Math.max(0, gold24k);
  return {
    gold_22k: Math.round(safe24k * 0.916),
    gold_18k: Math.round(safe24k * 0.75),
    gold_14k: Math.round(safe24k * 0.585),
  };
}

/**
 * Fetch daily rates from Supabase with fallback to localStorage and defaults.
 */
export async function getDailyRates(): Promise<DailyRates> {
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_RATES_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed.gold_24k === 'number') {
          // If Supabase is offline or not configured, return cached rate immediately
          if (!isSupabaseConfigured) return parsed;
        }
      } catch (e) {
        console.error('Error parsing cached daily rates:', e);
      }
    }
  }

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('daily_rates')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        const fetched: DailyRates = {
          gold_24k: Number(data.gold_24k),
          gold_22k: Number(data.gold_22k),
          gold_18k: Number(data.gold_18k),
          gold_14k: Number(data.gold_14k),
          silver_999: Number(data.silver_999),
          silver_925: Number(data.silver_925),
          updated_at: data.updated_at || new Date().toISOString(),
          updated_by: data.updated_by || 'Supabase Sync',
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_RATES_KEY, JSON.stringify(fetched));
        }
        return fetched;
      }
    } catch (err) {
      console.warn('Supabase daily_rates fetch warning, falling back to local:', err);
    }
  }

  // Local Storage Fallback
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_RATES_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {}
    }
  }

  return DEFAULT_RATES;
}

/**
 * Persist updated daily rates to both Supabase and localStorage.
 */
export async function saveDailyRates(rates: DailyRates): Promise<DailyRates> {
  const updatedRates: DailyRates = {
    ...rates,
    updated_at: new Date().toISOString(),
  };

  // Always update localStorage instantly
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_RATES_KEY, JSON.stringify(updatedRates));
  }

  // Persist to server via authenticated endpoint (bypasses client-side RLS)
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/admin/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRates)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        console.warn('Server rate sync warning (using localStorage):', data?.error);
      }
    } catch (err) {
      console.warn('Network error saving rates to server:', err);
    }
  }

  return updatedRates;
}
