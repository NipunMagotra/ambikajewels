-- Migration Name: 20261116_tighten_rls_policies.sql
-- Description: Tighten RLS policies on orders, daily_rates, webhook_events, store_settings, customer_savings_goals
-- to restrict mutations and sensitive reads strictly to service_role (custom HMAC session isolation).

-- 1. Orders: Service role only
DROP POLICY IF EXISTS "Orders are manageable by service role and authenticated only" ON public.orders;
DROP POLICY IF EXISTS "Orders are manageable by service role only" ON public.orders;
CREATE POLICY "Orders are manageable by service role only"
  ON public.orders FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Update status check constraint to include 'oversold_manual_review'
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check CHECK (
  status IN ('pending_confirmation', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'paid', 'failed', 'oversold_manual_review')
);

-- Persistent lifecycle timestamp columns for state tracking
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_verified_at TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMPTZ;

-- 2. Order Timeline: Service role only
DROP POLICY IF EXISTS "Timeline viewable by service role and authenticated only" ON public.order_timeline;
DROP POLICY IF EXISTS "Timeline viewable by service role only" ON public.order_timeline;
CREATE POLICY "Timeline viewable by service role only"
  ON public.order_timeline FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 3. Daily Rates: Public SELECT, Service role only for ALL/MUTATION
DROP POLICY IF EXISTS "Daily rates are editable by service role and authenticated only" ON public.daily_rates;
DROP POLICY IF EXISTS "Daily rates are editable by authenticated users only" ON public.daily_rates;
DROP POLICY IF EXISTS "Daily rates are editable by service role only" ON public.daily_rates;
CREATE POLICY "Daily rates are editable by service role only"
  ON public.daily_rates FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Daily rates are viewable by everyone" ON public.daily_rates;
CREATE POLICY "Daily rates are viewable by everyone"
  ON public.daily_rates FOR SELECT
  USING (true);

-- 4. Customer Savings Goals: Service role only
DROP POLICY IF EXISTS "Savings goals accessible by service role and authenticated admin only" ON public.customer_savings_goals;
DROP POLICY IF EXISTS "Savings goals accessible by service role only" ON public.customer_savings_goals;
CREATE POLICY "Savings goals accessible by service role only"
  ON public.customer_savings_goals FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 5. Webhook Events: Service role only
DROP POLICY IF EXISTS "Webhook events manageable by service role only" ON public.webhook_events;
CREATE POLICY "Webhook events manageable by service role only"
  ON public.webhook_events FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 6. Store Settings: Public non-sensitive SELECT, Service role only for private/customer_profile and mutations
DROP POLICY IF EXISTS "Public store settings readable by everyone" ON public.store_settings;
CREATE POLICY "Public store settings readable by everyone"
  ON public.store_settings FOR SELECT
  USING (
    auth.role() = 'service_role' 
    OR (key NOT LIKE 'customer_profile:%' AND key NOT LIKE 'private:%')
  );

DROP POLICY IF EXISTS "Store settings editable by service role and authenticated only" ON public.store_settings;
DROP POLICY IF EXISTS "Store settings editable by service role only" ON public.store_settings;
CREATE POLICY "Store settings editable by service role only"
  ON public.store_settings FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
