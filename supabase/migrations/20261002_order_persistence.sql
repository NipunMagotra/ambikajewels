-- ============================================================================
-- Ambika Jewels Migration: Pre-payment order persistence support
-- Adds customer_email and pincode columns that the create-order and verify
-- routes write to, but were previously missing from the schema.
-- ============================================================================

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS customer_email TEXT,
  ADD COLUMN IF NOT EXISTS pincode TEXT;

-- Index for customer lookups on order status/tracking pages
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email) WHERE customer_email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
