-- =========================================================================
-- Ambika Jewels Migration: Idempotent Orders, Razorpay Constraints & RLS
-- Migration Name: 20261001_idempotent_orders.sql
-- =========================================================================

-- 1. Ensure required columns exist on the orders table
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
  ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS shiprocket_order_id TEXT,
  ADD COLUMN IF NOT EXISTS shiprocket_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS shiprocket_awb TEXT,
  ADD COLUMN IF NOT EXISTS pan_number TEXT;

-- 2. Add UNIQUE constraints on Razorpay Payment ID and Order ID
-- (Allows onConflict: 'razorpay_payment_id', ignoreDuplicates: true in PostgREST/Supabase)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'orders_razorpay_payment_id_key'
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT orders_razorpay_payment_id_key UNIQUE (razorpay_payment_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'orders_razorpay_order_id_key'
  ) THEN
    ALTER TABLE orders ADD CONSTRAINT orders_razorpay_order_id_key UNIQUE (razorpay_order_id);
  END IF;
END $$;

-- Also maintain partial unique indexes for high-speed lookup
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_razorpay_payment_id 
  ON orders (razorpay_payment_id) 
  WHERE razorpay_payment_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_razorpay_order_id 
  ON orders (razorpay_order_id) 
  WHERE razorpay_order_id IS NOT NULL;

-- 3. Row Level Security Policies for `orders`
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Orders are viewable by authenticated users" ON orders;
CREATE POLICY "Orders are viewable by authenticated users"
  ON orders FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Orders are updatable by authenticated users" ON orders;
CREATE POLICY "Orders are updatable by authenticated users"
  ON orders FOR UPDATE
  USING (auth.role() = 'authenticated');

-- 4. Row Level Security Policies for `daily_rates`
-- Security hardening: Prevent unauthenticated mutation of gold & silver rates
ALTER TABLE daily_rates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Daily rates are editable by anyone" ON daily_rates;
DROP POLICY IF EXISTS "Daily rates are editable by authenticated users only" ON daily_rates;
CREATE POLICY "Daily rates are editable by authenticated users only"
  ON daily_rates FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 5. Row Level Security Policies for `customer_savings_goals`
-- Security hardening: Public cannot overwrite or delete other customers' records
ALTER TABLE customer_savings_goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Savings goals are editable by anyone" ON customer_savings_goals;
DROP POLICY IF EXISTS "Anyone can create savings goals" ON customer_savings_goals;
CREATE POLICY "Anyone can create savings goals"
  ON customer_savings_goals FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Savings goals are editable by authenticated users only" ON customer_savings_goals;
CREATE POLICY "Savings goals are editable by authenticated users only"
  ON customer_savings_goals FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
