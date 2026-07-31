-- ============================================
-- Ambika Jewels — P-Gold (Digital Gold) Database Schema
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. P-GOLD SETTINGS TABLE (Single row configuration)
-- ============================================
CREATE TABLE IF NOT EXISTS pgold_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  price_per_gram_24k NUMERIC(10, 2) NOT NULL DEFAULT 8500.00,
  price_per_gram_22k NUMERIC(10, 2) NOT NULL DEFAULT 7800.00,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  min_purchase_amount NUMERIC(10, 2) NOT NULL DEFAULT 100.00, -- in ₹
  max_purchase_amount NUMERIC(10, 2) NOT NULL DEFAULT 500000.00, -- in ₹
  pricing_mode TEXT NOT NULL DEFAULT 'manual' CHECK (pricing_mode IN ('manual', 'api')),
  api_provider_url TEXT DEFAULT '',
  page_title TEXT NOT NULL DEFAULT 'Ambika P-Gold — Digital 24K Pure Gold Accumulation',
  page_subtitle TEXT NOT NULL DEFAULT 'Start building your digital gold wealth from as little as ₹100. Backed by 100% 24K 999 Hallmark Gold with physical delivery guarantee by Ambika Jewels Jammu.',
  banner_image TEXT NOT NULL DEFAULT '/images/pgold-hero.jpg',
  content_description TEXT NOT NULL DEFAULT 'P-Gold allows you to purchase, store, and accumulate 24K 999 Pure Hallmark Gold digitally in real-time. Lock live gold rates starting at just ₹100 and redeem anytime for authentic handcrafted Jammu Dogra heritage jewelry or physical gold bars.',
  terms_and_conditions TEXT NOT NULL DEFAULT '1. All digital gold purchases under Ambika P-Gold are backed by 100% physical 24K 999 Hallmark Gold stored securely.\n2. Gold prices are updated in real-time based on prevailing bullion market rates in India.\n3. Digital gold can be redeemed anytime at Ambika Jewels Showroom (Lower Roop Nagar, Jammu) for physical 24K/22K jewelry or coins.\n4. Applicable GST of 3% as per Govt of India norms is included/added during checkout.\n5. Rates locked during transaction confirmation are final and binding.',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. P-GOLD FAQS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS pgold_faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. P-GOLD TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS pgold_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  amount_inr NUMERIC(12, 2) NOT NULL,
  weight_grams NUMERIC(10, 4) NOT NULL,
  gold_rate_per_gram NUMERIC(10, 2) NOT NULL,
  purity TEXT NOT NULL DEFAULT '24K (999 Pure)',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT DEFAULT 'razorpay',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pgold_tx_status ON pgold_transactions(status);
CREATE INDEX IF NOT EXISTS idx_pgold_tx_phone ON pgold_transactions(customer_phone);

-- ============================================
-- 4. P-GOLD PRICE HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS pgold_price_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  price_per_gram_24k NUMERIC(10, 2) NOT NULL,
  price_per_gram_22k NUMERIC(10, 2) NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'api')),
  changed_by TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pgold_price_created ON pgold_price_history(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================
ALTER TABLE pgold_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pgold_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pgold_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pgold_price_history ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public read pgold_settings" ON pgold_settings FOR SELECT USING (true);
CREATE POLICY "Public read active pgold_faqs" ON pgold_faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Public insert pgold_transactions" ON pgold_transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read pgold_price_history" ON pgold_price_history FOR SELECT USING (true);

-- Authenticated Admin Policies
CREATE POLICY "Admin manage pgold_settings" ON pgold_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage pgold_faqs" ON pgold_faqs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage pgold_transactions" ON pgold_transactions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin manage pgold_price_history" ON pgold_price_history FOR ALL USING (auth.role() = 'authenticated');

-- Trigger to auto update updated_at
CREATE OR REPLACE FUNCTION update_pgold_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_pgold_settings_updated_at
  BEFORE UPDATE ON pgold_settings
  FOR EACH ROW EXECUTE FUNCTION update_pgold_updated_at();

CREATE TRIGGER set_pgold_faqs_updated_at
  BEFORE UPDATE ON pgold_faqs
  FOR EACH ROW EXECUTE FUNCTION update_pgold_updated_at();

CREATE TRIGGER set_pgold_transactions_updated_at
  BEFORE UPDATE ON pgold_transactions
  FOR EACH ROW EXECUTE FUNCTION update_pgold_updated_at();
