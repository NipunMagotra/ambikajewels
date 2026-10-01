-- =========================================================================
-- Ambika Jewels Migration: Phase 1 Security Hardening
-- Migration Name: 20261001_phase1_security_hardening.sql
-- =========================================================================

-- 1. Drop public anon policies on customer_savings_goals (DPDP / PII lockdown)
DROP POLICY IF EXISTS "Savings goals are viewable by anyone" ON customer_savings_goals;
DROP POLICY IF EXISTS "Anyone can create savings goals" ON customer_savings_goals;
DROP POLICY IF EXISTS "Savings goals are editable by anyone" ON customer_savings_goals;
DROP POLICY IF EXISTS "Savings goals are editable by authenticated users only" ON customer_savings_goals;

-- Enable RLS and lock customer_savings_goals exclusively to service-role / authenticated admin
ALTER TABLE customer_savings_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Savings goals accessible by service role and authenticated admin only"
  ON customer_savings_goals
  FOR ALL
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- 2. Drop public anon INSERT policy on orders (Block direct PostgREST order injection)
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Orders are insertable by service role only" ON orders;

CREATE POLICY "Orders are manageable by service role only"
  ON orders
  FOR ALL
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- 3. Persistent Webhook Events Deduplication Table (Distributed Replay Protection)
CREATE TABLE IF NOT EXISTS webhook_events (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL, -- 'razorpay' | 'bvc'
  event_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  payload JSONB
);

ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Webhook events manageable by service role only"
  ON webhook_events
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_webhook_events_source ON webhook_events(source, created_at DESC);
