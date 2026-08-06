-- ============================================
-- Ambika Jewels — Supabase Database Schema
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL, -- Price in paise (₹1,45,000 = 14500000)
  display_price TEXT NOT NULL, -- Formatted price string "₹1,45,000"
  category TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  badges TEXT[] DEFAULT '{}', -- ["NEW ARRIVAL", "CERTIFIED", "LIMITED EDITION"]
  metal_finishes TEXT[] DEFAULT '{"Gold"}', -- ["Gold", "Silver", "Rose Gold"]
  stock_status TEXT NOT NULL DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'limited', 'out_of_stock')),
  is_featured BOOLEAN DEFAULT FALSE,
  collection TEXT DEFAULT 'Heritage', -- e.g. "Bridal", "Heritage", "Modern"
  craftsmanship_story TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for catalog queries
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_price ON products(price);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL, -- Human-readable order number like "AJ-20260717-001"
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  items JSONB NOT NULL, -- [{product_id, name, price, quantity, image}]
  subtotal INTEGER NOT NULL, -- in paise
  tax INTEGER NOT NULL DEFAULT 0, -- GST in paise
  shipping INTEGER NOT NULL DEFAULT 0, -- shipping in paise
  total INTEGER NOT NULL, -- in paise
  status TEXT NOT NULL DEFAULT 'pending_confirmation' CHECK (
    status IN ('pending_confirmation', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')
  ),
  payment_method TEXT DEFAULT 'pending', -- 'pending' | 'razorpay' | 'cod' (future)
  payment_id TEXT, -- Razorpay transaction ID (future)
  payment_status TEXT DEFAULT 'unpaid' CHECK (
    payment_status IN ('unpaid', 'paid', 'refunded')
  ),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- ============================================
-- FAQ ITEMS TABLE (for chatbot)
-- ============================================
CREATE TABLE faq_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'general' CHECK (
    category IN ('general', 'shipping', 'returns', 'care', 'about', 'payment')
  ),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_faq_category ON faq_items(category);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Products: readable by everyone, writable by authenticated admin only
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Products are editable by authenticated users"
  ON products FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Orders: insertable by anyone (guest checkout), readable/updatable by admin only
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Orders are viewable by authenticated users"
  ON orders FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Orders are updatable by authenticated users"
  ON orders FOR UPDATE
  USING (auth.role() = 'authenticated');

-- FAQ: readable by everyone, writable by admin
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "FAQ items are viewable by everyone"
  ON faq_items FOR SELECT
  USING (true);

CREATE POLICY "FAQ items are editable by authenticated users"
  ON faq_items FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- FUNCTION: Auto-generate order numbers
-- ============================================
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
  today_count INTEGER;
  date_str TEXT;
BEGIN
  date_str := TO_CHAR(NOW(), 'YYYYMMDD');
  SELECT COUNT(*) + 1 INTO today_count
  FROM orders
  WHERE created_at::DATE = CURRENT_DATE;
  NEW.order_number := 'AJ-' || date_str || '-' || LPAD(today_count::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION generate_order_number();

-- ============================================
-- FUNCTION: Auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- DAILY RATES TABLE (Jammu Gold & Silver Tracker)
-- ============================================
CREATE TABLE IF NOT EXISTS daily_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gold_24k NUMERIC NOT NULL DEFAULT 7850,
  gold_22k NUMERIC NOT NULL DEFAULT 7190,
  gold_18k NUMERIC NOT NULL DEFAULT 5888,
  gold_14k NUMERIC NOT NULL DEFAULT 4592,
  silver_999 NUMERIC NOT NULL DEFAULT 92,
  silver_925 NUMERIC NOT NULL DEFAULT 85,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by TEXT DEFAULT 'Shopkeeper'
);

ALTER TABLE daily_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Daily rates are viewable by everyone"
  ON daily_rates FOR SELECT
  USING (true);

CREATE POLICY "Daily rates are editable by anyone"
  ON daily_rates FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- CUSTOMER SAVINGS GOALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS customer_savings_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  event_name TEXT NOT NULL,
  target_weight_grams NUMERIC DEFAULT 0,
  target_amount_rupees NUMERIC DEFAULT 0,
  target_purity TEXT DEFAULT '22K',
  target_date DATE,
  payments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE customer_savings_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Savings goals are viewable by anyone"
  ON customer_savings_goals FOR SELECT
  USING (true);

CREATE POLICY "Savings goals are editable by anyone"
  ON customer_savings_goals FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE TRIGGER customer_savings_goals_updated_at
  BEFORE UPDATE ON customer_savings_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

