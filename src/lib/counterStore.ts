import { supabase, isSupabaseConfigured } from './supabase';
import { DailyRates, SavingsGoal, GoalPayment } from '@/types/counter';

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
const LOCAL_GOALS_KEY = 'ambika_savings_goals_v1';

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

/**
 * Fetch all customer savings goals via authenticated admin endpoint.
 */
export async function getSavingsGoals(): Promise<SavingsGoal[]> {
  let localGoals: SavingsGoal[] = [];
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_GOALS_KEY);
    if (cached) {
      try {
        localGoals = JSON.parse(cached);
      } catch (e) {
        console.error('Error parsing local savings goals:', e);
      }
    }

    try {
      const res = await fetch('/api/admin/savings-goals');
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.goals)) {
        const fetchedGoals: SavingsGoal[] = data.goals.map((item: any) => ({
          id: item.id,
          customerName: item.customer_name,
          customerPhone: item.customer_phone,
          eventName: item.event_name,
          targetWeightGrams: Number(item.target_weight_grams || 0),
          targetAmountRupees: Number(item.target_amount_rupees || 0),
          targetPurity: item.target_purity || '22K',
          targetDate: item.target_date || '',
          payments: Array.isArray(item.payments) ? item.payments : [],
          createdAt: item.created_at || new Date().toISOString(),
          updatedAt: item.updated_at || new Date().toISOString(),
        }));

        localStorage.setItem(LOCAL_GOALS_KEY, JSON.stringify(fetchedGoals));
        return fetchedGoals;
      }
    } catch (err) {
      console.warn('Savings goals server fetch error, using local:', err);
    }
  }

  return localGoals;
}

/**
 * Save or update a customer savings goal via authenticated admin endpoint.
 */
export async function saveSavingsGoal(goal: SavingsGoal): Promise<SavingsGoal[]> {
  const currentGoals = await getSavingsGoals();
  const index = currentGoals.findIndex((g) => g.id === goal.id);

  let updatedGoals: SavingsGoal[];
  if (index >= 0) {
    updatedGoals = [...currentGoals];
    updatedGoals[index] = { ...goal, updatedAt: new Date().toISOString() };
  } else {
    updatedGoals = [goal, ...currentGoals];
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_GOALS_KEY, JSON.stringify(updatedGoals));

    try {
      await fetch('/api/admin/savings-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal })
      });
    } catch (err) {
      console.warn('Error saving goal to server endpoint:', err);
    }
  }

  return updatedGoals;
}

/**
 * Delete a customer savings goal via authenticated admin endpoint.
 */
export async function deleteSavingsGoal(id: string): Promise<SavingsGoal[]> {
  const currentGoals = await getSavingsGoals();
  const updatedGoals = currentGoals.filter((g) => g.id !== id);

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_GOALS_KEY, JSON.stringify(updatedGoals));

    try {
      await fetch(`/api/admin/savings-goals?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.warn('Error deleting goal on server endpoint:', err);
    }
  }

  return updatedGoals;
}

/**
 * Add a payment/purchase log to a specific goal.
 */
export async function addGoalPayment(goalId: string, payment: GoalPayment): Promise<SavingsGoal[]> {
  const goals = await getSavingsGoals();
  const goal = goals.find((g) => g.id === goalId);
  if (!goal) return goals;

  const updatedGoal: SavingsGoal = {
    ...goal,
    payments: [...goal.payments, payment],
    updatedAt: new Date().toISOString(),
  };

  return saveSavingsGoal(updatedGoal);
}
