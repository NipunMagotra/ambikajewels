export interface PGoldSettings {
  id?: string;
  price_per_gram_24k: number;
  price_per_gram_22k: number;
  is_enabled: boolean;
  min_purchase_amount: number; // in INR
  max_purchase_amount: number; // in INR
  pricing_mode: 'manual' | 'api';
  api_provider_url: string;
  page_title: string;
  page_subtitle: string;
  banner_image: string;
  content_description: string;
  terms_and_conditions: string;
  updated_at?: string;
}

export interface PGoldFAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PGoldTransaction {
  id: string;
  transaction_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  amount_inr: number;
  weight_grams: number;
  gold_rate_per_gram: number;
  purity: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface PGoldPriceHistory {
  id: string;
  price_per_gram_24k: number;
  price_per_gram_22k: number;
  source: 'manual' | 'api';
  changed_by: string;
  created_at: string;
}

export interface GoldDenomination {
  weightGrams: number;
  label: string;
  price24k: number;
  price22k: number;
}

export interface GoldCalculatorState {
  amountInr: number;
  weightGrams: number;
  purity: '24K' | '22K';
  gstAmount: number;
  netGoldAmount: number;
  isValid: boolean;
  validationError?: string;
}

export interface PGoldOrderPayload {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  amount_inr: number;
  weight_grams: number;
  purity: '24K' | '22K';
}
