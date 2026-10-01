-- ============================================================================
-- Ambika Jewels - BVC Logistics eSHIP Migration
-- Adds secure tracking, docket numbers, and tamper-evident bag serials
-- ============================================================================

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS bvc_docket_number TEXT,
  ADD COLUMN IF NOT EXISTS bvc_shipment_id TEXT,
  ADD COLUMN IF NOT EXISTS bvc_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS bvc_security_bag_number TEXT,
  ADD COLUMN IF NOT EXISTS bvc_insurance_fee INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS bvc_freight_fee INTEGER DEFAULT 0;

-- Indices for fast webhook lookup and admin dashboard filtering
CREATE INDEX IF NOT EXISTS idx_orders_bvc_docket_number ON orders(bvc_docket_number);
CREATE INDEX IF NOT EXISTS idx_orders_bvc_status ON orders(bvc_status);
