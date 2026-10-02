-- ============================================================================
-- Ambika Jewels Migration: Shipping Provider Tracking
-- Adds generic shipping_provider and tracking_awb columns to the orders table
-- so the admin dashboard can filter by courier partner (BVC, Shiprocket, etc.)
-- and display a universal AWB tracking number regardless of provider.
-- ============================================================================

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS shipping_provider TEXT DEFAULT 'bvc',
  ADD COLUMN IF NOT EXISTS tracking_awb TEXT;

-- Index for admin dashboard filtering by shipping provider
CREATE INDEX IF NOT EXISTS idx_orders_shipping_provider ON orders(shipping_provider);

-- Index for customer-facing AWB lookups on the /track page
CREATE INDEX IF NOT EXISTS idx_orders_tracking_awb ON orders(tracking_awb) WHERE tracking_awb IS NOT NULL;
