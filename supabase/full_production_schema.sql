-- ==============================================================================
-- AMBIKA JEWELS — BULLETPROOF CONSOLIDATED PRODUCTION DATABASE SETUP
-- ==============================================================================
-- Run this in the Supabase SQL Editor.
-- Drops any outdated partial tables and creates the complete schema cleanly.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. DROP OBSOLETE / PARTIAL TABLES (Ensures fresh, non-conflicting schema)
DROP TABLE IF EXISTS public.order_timeline CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.inventory_reservations CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.daily_rates CASCADE;
DROP TABLE IF EXISTS public.customer_savings_goals CASCADE;
DROP TABLE IF EXISTS public.webhook_events CASCADE;
DROP TABLE IF EXISTS public.coupons CASCADE;
DROP TABLE IF EXISTS public.store_settings CASCADE;
DROP TABLE IF EXISTS public.revoked_sessions CASCADE;
DROP TABLE IF EXISTS public.admin_audit_logs CASCADE;
DROP TABLE IF EXISTS public.staff_accounts CASCADE;
DROP TABLE IF EXISTS public.newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS public.data_subject_requests CASCADE;
DROP TABLE IF EXISTS public.faq_items CASCADE;

-- 3. UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 4. PRODUCTS TABLE
-- ==============================================================================
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL, -- in paise (₹1,45,000 = 14500000)
  display_price TEXT NOT NULL,
  category TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  badges TEXT[] DEFAULT '{}',
  metal_finishes TEXT[] DEFAULT '{"Gold"}',
  stock_status TEXT NOT NULL DEFAULT 'in_stock' CHECK (stock_status IN ('in_stock', 'limited', 'out_of_stock')),
  is_featured BOOLEAN DEFAULT FALSE,
  collection TEXT DEFAULT 'Heritage',
  craftsmanship_story TEXT DEFAULT '',
  net_weight_grams NUMERIC(8,3) DEFAULT 0 CHECK (net_weight_grams >= 0),
  gross_weight_grams NUMERIC(8,3) DEFAULT 0 CHECK (gross_weight_grams >= 0),
  purity VARCHAR(20) DEFAULT '22K' CHECK (purity IN ('24K', '22K', '18K', '14K', '925Silver')),
  making_charge_type VARCHAR(10) DEFAULT 'percent' CHECK (making_charge_type IN ('percent', 'flat')),
  making_charge_rate NUMERIC(10,2) DEFAULT 8.00 CHECK (making_charge_rate >= 0),
  stone_weight_grams NUMERIC(8,3) DEFAULT 0.000 CHECK (stone_weight_grams >= 0),
  stone_value_paise BIGINT DEFAULT 0 CHECK (stone_value_paise >= 0),
  hallmark_pieces INT DEFAULT 1 CHECK (hallmark_pieces >= 0),
  huid_code VARCHAR(6) CHECK (huid_code IS NULL OR length(huid_code) = 6),
  hsn_code VARCHAR(8) DEFAULT '7113',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_featured ON public.products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_price ON public.products(price);
CREATE INDEX idx_products_slug ON public.products(slug);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Products are editable by service role and authenticated only"
  ON public.products FOR ALL
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- ==============================================================================
-- 5. ORDERS TABLE
-- ==============================================================================
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  shipping_address TEXT NOT NULL,
  pincode TEXT,
  items JSONB NOT NULL,
  subtotal INTEGER NOT NULL,
  tax INTEGER NOT NULL DEFAULT 0,
  shipping INTEGER NOT NULL DEFAULT 0,
  discount INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_confirmation' CHECK (
    status IN ('pending_confirmation', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'paid', 'failed')
  ),
  notes TEXT DEFAULT '',
  pan_number TEXT,
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  shipping_provider TEXT DEFAULT 'bvc',
  tracking_awb TEXT,
  bvc_docket_number TEXT,
  bvc_shipment_id TEXT,
  bvc_status TEXT DEFAULT 'pending',
  bvc_security_bag_number TEXT,
  bvc_insurance_fee INTEGER DEFAULT 0,
  bvc_freight_fee INTEGER DEFAULT 0,
  shiprocket_order_id TEXT,
  shiprocket_status TEXT DEFAULT 'pending',
  shiprocket_awb TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX idx_orders_customer_email ON public.orders(customer_email) WHERE customer_email IS NOT NULL;
CREATE INDEX idx_orders_order_number ON public.orders(order_number);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_orders_bvc_docket_number ON public.orders(bvc_docket_number);
CREATE INDEX idx_orders_shipping_provider ON public.orders(shipping_provider);
CREATE INDEX idx_orders_tracking_awb ON public.orders(tracking_awb) WHERE tracking_awb IS NOT NULL;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Orders are manageable by service role and authenticated only"
  ON public.orders FOR ALL
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- ==============================================================================
-- 6. ORDER TIMELINE
-- ==============================================================================
CREATE TABLE public.order_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_timeline_order_id ON public.order_timeline(order_id);

ALTER TABLE public.order_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Timeline viewable by service role and authenticated only"
  ON public.order_timeline FOR ALL
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- ==============================================================================
-- 7. DAILY RATES TABLE
-- ==============================================================================
CREATE TABLE public.daily_rates (
  id SERIAL PRIMARY KEY,
  gold_24k NUMERIC NOT NULL,
  gold_22k NUMERIC NOT NULL,
  gold_18k NUMERIC NOT NULL,
  gold_14k NUMERIC NOT NULL,
  silver_925 NUMERIC NOT NULL,
  silver_fine NUMERIC NOT NULL,
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  updated_by TEXT DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_daily_rates_effective_date ON public.daily_rates(effective_date DESC);

CREATE TRIGGER daily_rates_updated_at
  BEFORE UPDATE ON public.daily_rates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

ALTER TABLE public.daily_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Daily rates are viewable by everyone"
  ON public.daily_rates FOR SELECT
  USING (true);

CREATE POLICY "Daily rates are editable by service role and authenticated only"
  ON public.daily_rates FOR ALL
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

INSERT INTO public.daily_rates (id, gold_24k, gold_22k, gold_18k, gold_14k, silver_925, silver_fine, updated_by)
VALUES (1, 8950, 8250, 6750, 5250, 98, 105, 'initial_setup');

-- ==============================================================================
-- 8. CUSTOMER SAVINGS GOALS TABLE
-- ==============================================================================
CREATE TABLE public.customer_savings_goals (
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

CREATE TRIGGER customer_savings_goals_updated_at
  BEFORE UPDATE ON public.customer_savings_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

ALTER TABLE public.customer_savings_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Savings goals accessible by service role and authenticated admin only"
  ON public.customer_savings_goals FOR ALL
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- ==============================================================================
-- 9. WEBHOOK EVENTS TABLE (Replay Protection)
-- ==============================================================================
CREATE TABLE public.webhook_events (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  event_type TEXT NOT NULL,
  status TEXT DEFAULT 'completed',
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_webhook_events_source ON public.webhook_events(source, created_at DESC);

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Webhook events manageable by service role only"
  ON public.webhook_events FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE OR REPLACE FUNCTION purge_old_webhook_events(retention_days INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.webhook_events
  WHERE created_at < NOW() - (retention_days || ' days')::INTERVAL;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 10. COUPONS TABLE
-- ==============================================================================
CREATE TABLE public.coupons (
  code TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('flat', 'percent')),
  value NUMERIC NOT NULL CHECK (value > 0),
  max_discount_paise BIGINT,
  min_order_paise BIGINT DEFAULT 0,
  valid_until TIMESTAMPTZ,
  description TEXT DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coupons manageable by service role only"
  ON public.coupons FOR ALL
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

INSERT INTO public.coupons (code, type, value, max_discount_paise, min_order_paise, description, is_active)
VALUES 
  ('WELCOME2026', 'percent', 5, 1000000, 2500000, '5% off on orders above ₹25,000 (Max ₹10,000)', true),
  ('DOGRA5000', 'flat', 500000, 500000, 5000000, 'Flat ₹5,000 off on heritage bridal orders above ₹50,000', true);

-- ==============================================================================
-- 11. STORE SETTINGS TABLE
-- ==============================================================================
CREATE TABLE public.store_settings (
  key TEXT PRIMARY KEY,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Store settings readable by everyone"
  ON public.store_settings FOR SELECT
  USING (true);

CREATE POLICY "Store settings editable by service role and authenticated only"
  ON public.store_settings FOR ALL
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- ==============================================================================
-- 12. STAFF ACCOUNTS TABLE
-- ==============================================================================
CREATE TABLE public.staff_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'staff', 'cashier', 'accountant')),
  phone TEXT,
  password_hash TEXT DEFAULT '',
  salt TEXT DEFAULT '',
  mfa_secret TEXT,
  mfa_enabled BOOLEAN NOT NULL DEFAULT false,
  recovery_codes TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  revoked_before TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_staff_accounts_email ON public.staff_accounts(email);
CREATE INDEX idx_staff_accounts_role ON public.staff_accounts(role);

ALTER TABLE public.staff_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff accounts no anon" ON public.staff_accounts
  FOR ALL TO anon USING (false);

CREATE POLICY "Staff accounts service role" ON public.staff_accounts
  FOR ALL TO service_role USING (true) WITH CHECK (true);

INSERT INTO public.staff_accounts (id, email, full_name, role, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'owner@ambikajewels.com',
  'Shivani Anand (Owner)',
  'owner',
  true
);

-- ==============================================================================
-- 13. REVOKED SESSIONS
-- ==============================================================================
CREATE TABLE public.revoked_sessions (
  session_id TEXT PRIMARY KEY,
  staff_id UUID REFERENCES public.staff_accounts(id) ON DELETE CASCADE,
  staff_email TEXT,
  revoked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  reason TEXT DEFAULT 'logout'
);

ALTER TABLE public.revoked_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Revoked sessions no anon" ON public.revoked_sessions
  FOR ALL TO anon USING (false);

CREATE POLICY "Revoked sessions service role" ON public.revoked_sessions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX idx_revoked_sessions_expires_at ON public.revoked_sessions(expires_at);

-- ==============================================================================
-- 14. TAMPER-EVIDENT ADMIN AUDIT LOGS
-- ==============================================================================
CREATE TABLE public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID REFERENCES public.staff_accounts(id) ON DELETE SET NULL,
  staff_email TEXT NOT NULL,
  staff_name TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_audit_logs_entity ON public.admin_audit_logs(entity_type, entity_id);
CREATE INDEX idx_admin_audit_logs_staff ON public.admin_audit_logs(staff_id);
CREATE INDEX idx_admin_audit_logs_created_at ON public.admin_audit_logs(created_at DESC);

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin audit logs no anon" ON public.admin_audit_logs
  FOR ALL TO anon USING (false);

CREATE POLICY "Admin audit logs service role insert" ON public.admin_audit_logs
  FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Admin audit logs service role select" ON public.admin_audit_logs
  FOR SELECT TO service_role USING (true);

REVOKE UPDATE, DELETE ON public.admin_audit_logs FROM PUBLIC, anon, authenticated;

-- ==============================================================================
-- 15. ATOMIC INVENTORY RESERVATIONS
-- ==============================================================================
CREATE TABLE public.inventory_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  order_id TEXT NOT NULL,
  reserved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'reserved' CHECK (status IN ('reserved', 'confirmed', 'released'))
);

ALTER TABLE public.inventory_reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inventory reservations service role" ON public.inventory_reservations
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE UNIQUE INDEX idx_active_inventory_reservation 
  ON public.inventory_reservations(product_id) 
  WHERE (status IN ('reserved', 'confirmed'));

CREATE OR REPLACE FUNCTION public.reserve_inventory_atomic(
  p_product_id UUID,
  p_order_id TEXT,
  p_ttl_seconds INT DEFAULT 900
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_stock_status TEXT;
  v_existing_order TEXT;
BEGIN
  SELECT stock_status INTO v_stock_status
  FROM public.products
  WHERE id = p_product_id
  FOR UPDATE;

  IF v_stock_status = 'out_of_stock' THEN
    RETURN FALSE;
  END IF;

  DELETE FROM public.inventory_reservations
  WHERE product_id = p_product_id
    AND status = 'reserved'
    AND expires_at < NOW();

  SELECT order_id INTO v_existing_order
  FROM public.inventory_reservations
  WHERE product_id = p_product_id
    AND (status = 'confirmed' OR (status = 'reserved' AND expires_at > NOW()))
  LIMIT 1;

  IF FOUND THEN
    IF v_existing_order = p_order_id THEN
      RETURN TRUE;
    END IF;
    RETURN FALSE;
  END IF;

  INSERT INTO public.inventory_reservations (product_id, order_id, reserved_at, expires_at, status)
  VALUES (
    p_product_id,
    p_order_id,
    NOW(),
    NOW() + (p_ttl_seconds || ' seconds')::INTERVAL,
    'reserved'
  );

  RETURN TRUE;
END;
$$;

-- ==============================================================================
-- 16. NEWSLETTER SUBSCRIBERS TABLE
-- ==============================================================================
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Newsletter viewable by service role only"
  ON public.newsletter_subscribers FOR SELECT
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- ==============================================================================
-- 17. DATA SUBJECT PRIVACY REQUESTS (DPDP Act)
-- ==============================================================================
CREATE TABLE public.data_subject_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id TEXT UNIQUE NOT NULL,
  request_type TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  details TEXT DEFAULT '',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER data_subject_requests_updated_at
  BEFORE UPDATE ON public.data_subject_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

ALTER TABLE public.data_subject_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit privacy request"
  ON public.data_subject_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Privacy requests viewable by service role only"
  ON public.data_subject_requests FOR SELECT
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- ==============================================================================
-- 18. FAQ ITEMS (Pre-loaded 15 Verified Store FAQs)
-- ==============================================================================
CREATE TABLE public.faq_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_faq_items_category ON public.faq_items(category);

ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "FAQ items are viewable by everyone"
  ON public.faq_items FOR SELECT
  USING (true);

CREATE POLICY "FAQ items are editable by service role and authenticated only"
  ON public.faq_items FOR ALL
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

INSERT INTO public.faq_items (question, answer, keywords, category, sort_order) VALUES
('Where is Ambika Jewels located?', 'Ambika Jewels is located in Muthi, Jammu, Jammu & Kashmir - 181205. We have been serving our community since 1984.', ARRAY['location', 'address', 'where', 'muthi', 'jammu', 'shop', 'store', 'find'], 'about', 1),
('What are your shop hours?', 'Our store timings are: Monday: 11:00 AM – 12:00 AM (Midnight); Tuesday to Saturday: 12:00 AM – 8:30 AM & 11:00 AM – 12:00 AM; Sunday: 12:00 AM – 8:30 AM.', ARRAY['hours', 'timing', 'open', 'close', 'time', 'when', 'schedule'], 'about', 2),
('How long has Ambika Jewels been in business?', 'Ambika Jewels was founded in 1984 in the heart of Jammu. For over 40 years, we have been dedicated to preserving Dogra heritage jewelry through master craftsmanship.', ARRAY['history', 'founded', 'years', 'old', 'since', 'established', 'about'], 'about', 3),
('Do you offer delivery?', 'Yes! We offer free insured delivery on all orders above ₹50,000 across India. For orders below ₹50,000, a nominal shipping fee of ₹500 applies. All deliveries are fully insured and come with tracking.', ARRAY['delivery', 'shipping', 'ship', 'deliver', 'send', 'courier', 'free'], 'shipping', 4),
('How long does delivery take?', 'Standard delivery takes 5-7 business days across India. For Jammu & Kashmir, delivery is typically 3-5 business days. Express delivery (2-3 days) is available at an additional charge.', ARRAY['delivery', 'time', 'how long', 'days', 'when', 'arrive', 'fast', 'express'], 'shipping', 5),
('Do you ship internationally?', 'Currently, we only ship within India. For international inquiries, please contact us on WhatsApp and we will try to arrange shipping on a case-by-case basis.', ARRAY['international', 'abroad', 'foreign', 'overseas', 'outside india', 'global'], 'shipping', 6),
('What is your return policy?', 'We offer a 7-day return policy on all products in their original condition with tags intact. Custom or personalized pieces are non-returnable. Please contact us on WhatsApp to initiate a return.', ARRAY['return', 'refund', 'exchange', 'back', 'cancel', 'policy'], 'returns', 7),
('Can I exchange a product?', 'Yes, we offer free exchanges within 15 days of delivery. The product must be in its original condition with all tags and packaging intact. Please reach out on WhatsApp to arrange an exchange.', ARRAY['exchange', 'swap', 'replace', 'change', 'different'], 'returns', 8),
('How should I care for my gold jewelry?', 'Store your gold jewelry in a soft pouch or lined box to prevent scratches. Clean with warm soapy water and a soft brush. Avoid exposing to harsh chemicals, perfumes, or chlorine. Remove jewelry before swimming or exercising.', ARRAY['care', 'clean', 'maintain', 'gold', 'polish', 'store', 'storage', 'maintenance'], 'care', 9),
('Do you offer repair and polishing services?', 'Yes! We offer complimentary polishing for all Ambika Jewels pieces. For repairs, our master karigars can restore any piece to its original glory. Visit our store or WhatsApp us for details.', ARRAY['repair', 'polish', 'fix', 'restore', 'broken', 'damage', 'service', 'maintenance'], 'care', 10),
('Is your jewelry hallmarked?', 'Yes, all our gold jewelry is BIS Hallmarked, guaranteeing the purity of gold. Each piece comes with a certificate of authenticity and a hallmark stamp. We use only 22k and 18k gold.', ARRAY['hallmark', 'certified', 'bis', 'purity', 'authentic', 'genuine', 'real', 'certificate', '22k', '18k'], 'care', 11),
('What payment methods do you accept?', 'We accept UPI, Net Banking, Debit/Credit Cards via Razorpay online, and NEFT/RTGS bank transfer. We also accept in-store payment at our Jammu showroom.', ARRAY['payment', 'pay', 'upi', 'card', 'cash', 'cod', 'bank', 'transfer', 'method', 'online'], 'payment', 12),
('Do you offer EMI or installment options?', 'Flexible advance payments and savings options are available. Please reach out via WhatsApp or visit our Jammu showroom to plan custom payment arrangements.', ARRAY['emi', 'installment', 'monthly', 'loan', 'finance', 'credit'], 'payment', 13),
('Do you offer custom jewelry?', 'Absolutely! Custom design is our specialty. Share your vision with us on WhatsApp — a sketch, a photo, or just an idea — and our master karigars will bring it to life. Custom pieces typically take 2-4 weeks.', ARRAY['custom', 'design', 'bespoke', 'personalize', 'make', 'order', 'special'], 'general', 14),
('Do you offer a virtual consultation?', 'Yes! We offer free virtual consultations via WhatsApp video call. Our jewelry experts can help you choose the perfect piece, show you products up close, and answer any questions. Book a slot by messaging us.', ARRAY['virtual', 'consultation', 'video', 'call', 'online', 'whatsapp', 'appointment', 'book'], 'general', 15);
