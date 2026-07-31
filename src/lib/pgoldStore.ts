import { supabase, isSupabaseConfigured } from './supabase';
import { PGoldSettings, PGoldFAQ, PGoldTransaction, PGoldPriceHistory } from '@/types/pgold';

// Default P-Gold Settings
export const DEFAULT_PGOLD_SETTINGS: PGoldSettings = {
  price_per_gram_24k: 8500,
  price_per_gram_22k: 7800,
  is_enabled: true,
  min_purchase_amount: 100,
  max_purchase_amount: 500000,
  pricing_mode: 'manual',
  api_provider_url: '',
  page_title: 'Ambika P-Gold — Pure 24K Digital Gold Accumulation',
  page_subtitle: 'Start building your digital gold wealth from as little as ₹100. Backed by 100% 24K 999 Hallmark Gold with physical delivery guarantee by Ambika Jewels Jammu.',
  banner_image: 'https://images.unsplash.com/photo-1611591474238-005fa9194218?q=80&w=1600&auto=format&fit=crop',
  content_description: 'P-Gold allows you to purchase, store, and accumulate 24K 999 Pure Hallmark Gold digitally in real-time. Lock live gold rates starting at just ₹100 and redeem anytime for authentic handcrafted Jammu Dogra heritage jewelry or physical gold bars.',
  terms_and_conditions: `1. Digital Gold Storage & Backing: All digital gold purchased through Ambika P-Gold is 100% backed by physical 24K 999 Pure Hallmark Gold stored securely in insured vault facilities.
2. Pricing & Live Rates: Gold rates are updated continuously based on Indian bullion market benchmark prices. When placing an order, the rate is locked at the moment of payment initialization.
3. Redemption Policy: Accumulated digital gold can be redeemed at any time at the Ambika Jewels showroom (Lower Roop Nagar, Jammu) for 24K/22K physical gold coins or customized Dogra Heritage jewelry.
4. Applicable Taxes: Standard Government of India GST (3%) is applicable on digital gold purchases and is clearly itemized at checkout.
5. Minimum & Maximum Limits: Minimum single purchase amount is ₹100. Maximum single online purchase is subject to KYC and store limits (default ₹5,00,000).
6. Cancellation & Refunds: Due to continuous live rate variations in financial gold bullion markets, confirmed P-Gold orders cannot be cancelled once locked. Accumulated gold remains in your secure digital ledger until redemption.`
};

// Default FAQs
export const DEFAULT_PGOLD_FAQS: PGoldFAQ[] = [
  {
    id: 'faq-1',
    question: 'What is Ambika P-Gold?',
    answer: 'Ambika P-Gold is a digital gold accumulation program by Ambika Jewels Jammu. It lets you purchase 24K (999 pure) hallmark gold in small or large amounts, lock live bullion market rates starting from ₹100, and accumulate gold safely without storage worries.',
    category: 'general',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'faq-2',
    question: 'Is my P-Gold safe and backed by real physical gold?',
    answer: 'Yes! Every gram of P-Gold you buy is 100% backed by physical 24K 999 Hallmark Gold stored safely in secure vault storage under the guarantee of Ambika Jewels Jammu (Estd 2021).',
    category: 'safety',
    sort_order: 2,
    is_active: true,
  },
  {
    id: 'faq-3',
    question: 'How do I redeem my accumulated P-Gold?',
    answer: 'You can redeem your accumulated P-Gold anytime by visiting our Ambika Jewels showroom in Lower Roop Nagar, Jammu. You can exchange your accumulated digital gold balance for 24K gold coins, 22K Dogra Heritage jewelry, or any custom designs.',
    category: 'redemption',
    sort_order: 3,
    is_active: true,
  },
  {
    id: 'faq-4',
    question: 'What is the minimum and maximum amount I can buy?',
    answer: 'You can start buying P-Gold with as little as ₹100 or 0.01g. The default maximum single purchase online is ₹5,00,000. For larger amounts, you can contact our showroom concierge.',
    category: 'pricing',
    sort_order: 4,
    is_active: true,
  },
  {
    id: 'faq-5',
    question: 'Are there any hidden holding or storage charges?',
    answer: 'No, there are zero storage or maintenance fees for keeping your P-Gold digital balance with Ambika Jewels. You pay only for the gold value + applicable 3% GST at purchase.',
    category: 'pricing',
    sort_order: 5,
    is_active: true,
  },
  {
    id: 'faq-6',
    question: 'Can I gift P-Gold or transfer it?',
    answer: 'Yes, you can initiate a gift transfer or purchase P-Gold on behalf of family members for weddings, Dhanteras, or special occasions by providing recipient details at checkout.',
    category: 'general',
    sort_order: 6,
    is_active: true,
  }
];

// In-Memory Fallback State (Singleton for local runtime)
let inMemorySettings: PGoldSettings = { ...DEFAULT_PGOLD_SETTINGS };
let inMemoryFaqs: PGoldFAQ[] = [ ...DEFAULT_PGOLD_FAQS ];
let inMemoryTransactions: PGoldTransaction[] = [];
let inMemoryPriceHistory: PGoldPriceHistory[] = [
  {
    id: 'hist-1',
    price_per_gram_24k: 8500,
    price_per_gram_22k: 7800,
    source: 'manual',
    changed_by: 'Admin',
    created_at: new Date().toISOString()
  }
];

// Data Access Service
export const pgoldStore = {
  async getSettings(): Promise<PGoldSettings> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('pgold_settings')
          .select('*')
          .limit(1)
          .single();

        if (!error && data) {
          return {
            ...DEFAULT_PGOLD_SETTINGS,
            ...data,
            price_per_gram_24k: Number(data.price_per_gram_24k),
            price_per_gram_22k: Number(data.price_per_gram_22k),
            min_purchase_amount: Number(data.min_purchase_amount),
            max_purchase_amount: Number(data.max_purchase_amount),
          };
        }
      } catch (err) {
        console.warn('Supabase fetch failed for pgold_settings, using fallback store:', err);
      }
    }
    return inMemorySettings;
  },

  async updateSettings(newSettings: Partial<PGoldSettings>): Promise<PGoldSettings> {
    const updated = {
      ...inMemorySettings,
      ...newSettings,
      updated_at: new Date().toISOString()
    };

    // Track price history if gold rate changed
    if (
      newSettings.price_per_gram_24k !== undefined &&
      newSettings.price_per_gram_24k !== inMemorySettings.price_per_gram_24k
    ) {
      const historyItem: PGoldPriceHistory = {
        id: `hist-${Date.now()}`,
        price_per_gram_24k: newSettings.price_per_gram_24k,
        price_per_gram_22k: newSettings.price_per_gram_22k ?? Math.round(newSettings.price_per_gram_24k * 0.917),
        source: newSettings.pricing_mode || updated.pricing_mode,
        changed_by: 'Admin',
        created_at: new Date().toISOString()
      };
      inMemoryPriceHistory.unshift(historyItem);

      if (isSupabaseConfigured) {
        try {
          await supabase.from('pgold_price_history').insert([{
            price_per_gram_24k: historyItem.price_per_gram_24k,
            price_per_gram_22k: historyItem.price_per_gram_22k,
            source: historyItem.source,
            changed_by: historyItem.changed_by
          }]);
        } catch (e) {
          console.warn('Failed to save price history to Supabase:', e);
        }
      }
    }

    inMemorySettings = updated;

    if (isSupabaseConfigured) {
      try {
        const { data: existing } = await supabase.from('pgold_settings').select('id').limit(1).single();
        if (existing?.id) {
          await supabase.from('pgold_settings').update(updated).eq('id', existing.id);
        } else {
          await supabase.from('pgold_settings').insert([updated]);
        }
      } catch (err) {
        console.warn('Supabase update failed for pgold_settings, stored in memory:', err);
      }
    }

    return inMemorySettings;
  },

  async getFAQs(): Promise<PGoldFAQ[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('pgold_faqs')
          .select('*')
          .order('sort_order', { ascending: true });

        if (!error && data && data.length > 0) {
          return data as PGoldFAQ[];
        }
      } catch (err) {
        console.warn('Supabase fetch failed for pgold_faqs:', err);
      }
    }
    return inMemoryFaqs.filter(f => f.is_active).sort((a, b) => a.sort_order - b.sort_order);
  },

  async getAllFAQsAdmin(): Promise<PGoldFAQ[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('pgold_faqs')
          .select('*')
          .order('sort_order', { ascending: true });

        if (!error && data) {
          return data as PGoldFAQ[];
        }
      } catch (err) {
        console.warn('Supabase fetch failed for admin faqs:', err);
      }
    }
    return inMemoryFaqs.sort((a, b) => a.sort_order - b.sort_order);
  },

  async saveFAQ(faq: Partial<PGoldFAQ>): Promise<PGoldFAQ> {
    const isNew = !faq.id;
    const item: PGoldFAQ = {
      id: faq.id || `faq-${Date.now()}`,
      question: faq.question || '',
      answer: faq.answer || '',
      category: faq.category || 'general',
      sort_order: faq.sort_order ?? (inMemoryFaqs.length + 1),
      is_active: faq.is_active ?? true,
      created_at: faq.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (isNew) {
      inMemoryFaqs.push(item);
    } else {
      inMemoryFaqs = inMemoryFaqs.map(f => f.id === item.id ? item : f);
    }

    if (isSupabaseConfigured) {
      try {
        if (isNew) {
          const { id, ...rest } = item;
          await supabase.from('pgold_faqs').insert([rest]);
        } else {
          await supabase.from('pgold_faqs').update(item).eq('id', item.id);
        }
      } catch (err) {
        console.warn('Supabase FAQ save failed:', err);
      }
    }

    return item;
  },

  async deleteFAQ(id: string): Promise<boolean> {
    inMemoryFaqs = inMemoryFaqs.filter(f => f.id !== id);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('pgold_faqs').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase FAQ delete failed:', err);
      }
    }

    return true;
  },

  async getPriceHistory(): Promise<PGoldPriceHistory[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('pgold_price_history')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (!error && data && data.length > 0) {
          return data as PGoldPriceHistory[];
        }
      } catch (err) {
        console.warn('Supabase fetch failed for price history:', err);
      }
    }
    return inMemoryPriceHistory;
  },

  async createTransaction(tx: Omit<PGoldTransaction, 'id' | 'transaction_number' | 'created_at' | 'status'>): Promise<PGoldTransaction> {
    const txNumber = `PGOLD-${Date.now().toString().slice(-8)}`;
    const fullTx: PGoldTransaction = {
      id: `tx-${Date.now()}`,
      transaction_number: txNumber,
      status: 'pending',
      created_at: new Date().toISOString(),
      ...tx
    };

    inMemoryTransactions.unshift(fullTx);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('pgold_transactions').insert([{
          transaction_number: fullTx.transaction_number,
          customer_name: fullTx.customer_name,
          customer_phone: fullTx.customer_phone,
          customer_email: fullTx.customer_email,
          amount_inr: fullTx.amount_inr,
          weight_grams: fullTx.weight_grams,
          gold_rate_per_gram: fullTx.gold_rate_per_gram,
          purity: fullTx.purity,
          status: fullTx.status,
          payment_method: fullTx.payment_method,
          razorpay_order_id: fullTx.razorpay_order_id,
          notes: fullTx.notes
        }]);
      } catch (err) {
        console.warn('Supabase transaction insert failed:', err);
      }
    }

    return fullTx;
  },

  async getTransactions(): Promise<PGoldTransaction[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('pgold_transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (!error && data) {
          return data as PGoldTransaction[];
        }
      } catch (err) {
        console.warn('Supabase fetch failed for transactions:', err);
      }
    }
    return inMemoryTransactions;
  }
};
