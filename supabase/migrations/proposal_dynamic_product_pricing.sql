-- ==============================================================================
-- PROPOSAL ONLY: Dynamic Product Pricing Schema Migration
-- ==============================================================================
-- DO NOT APPLY AUTOMATICALLY TO PRODUCTION.
-- 
-- Status: Architecture Proposal
-- Target: Supabase PostgreSQL (Ambika Jewels Catalog)
-- Purpose: Introduces structured bullion attributes (net weight, purity, making charges, 
--          stone values, and BIS HUID) to support real-time dynamic pricing tied to 
--          daily bullion rates, eliminating stale hardcoded catalog prices.
-- 
-- Reviewers: Store Owner (Shivani Anand / Lakesh Kumar), Chartered Accountant (CA)
-- ==============================================================================

-- Step 1: Add dynamic jewelry pricing columns to products table
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS net_weight_grams NUMERIC(8,3) CHECK (net_weight_grams >= 0),
  ADD COLUMN IF NOT EXISTS gross_weight_grams NUMERIC(8,3) CHECK (gross_weight_grams >= 0),
  ADD COLUMN IF NOT EXISTS purity VARCHAR(20) CHECK (purity IN ('24K', '22K', '18K', '14K', '925Silver')),
  ADD COLUMN IF NOT EXISTS making_charge_type VARCHAR(10) DEFAULT 'percent' CHECK (making_charge_type IN ('percent', 'flat')),
  ADD COLUMN IF NOT EXISTS making_charge_rate NUMERIC(10,2) DEFAULT 8.00 CHECK (making_charge_rate >= 0),
  ADD COLUMN IF NOT EXISTS stone_weight_grams NUMERIC(8,3) DEFAULT 0.000 CHECK (stone_weight_grams >= 0),
  ADD COLUMN IF NOT EXISTS stone_value_paise BIGINT DEFAULT 0 CHECK (stone_value_paise >= 0),
  ADD COLUMN IF NOT EXISTS hallmark_pieces INT DEFAULT 1 CHECK (hallmark_pieces >= 0),
  ADD COLUMN IF NOT EXISTS huid_code VARCHAR(6) CHECK (huid_code IS NULL OR length(huid_code) = 6),
  ADD COLUMN IF NOT EXISTS hsn_code VARCHAR(8) DEFAULT '7113';

-- Step 2: Comment on columns for schema clarity and compliance
COMMENT ON COLUMN products.net_weight_grams IS 'Net precious metal weight excluding stones and lac (in grams)';
COMMENT ON COLUMN products.gross_weight_grams IS 'Gross total weight including stones and findings (in grams)';
COMMENT ON COLUMN products.purity IS 'Precious metal fineness (24K: 999, 22K: 916, 18K: 750, 14K: 585, 925Silver)';
COMMENT ON COLUMN products.making_charge_type IS 'Calculation model for making charge: percent (% of net metal value) or flat (rupees per gram)';
COMMENT ON COLUMN products.making_charge_rate IS 'Making charge rate (% e.g. 8.0 for 8%, or flat ₹/g e.g. 450.00)';
COMMENT ON COLUMN products.stone_weight_grams IS 'Weight of non-precious components/gems in grams';
COMMENT ON COLUMN products.stone_value_paise IS 'Appraised value of studded gemstones/pearls in paise';
COMMENT ON COLUMN products.hallmark_pieces IS 'Number of hallmarked pieces in this product (default 1)';
COMMENT ON COLUMN products.huid_code IS 'Bureau of Indian Standards (BIS) 6-character alphanumeric laser HUID';
COMMENT ON COLUMN products.hsn_code IS 'Harmonized System of Nomenclature code (7113 for precious jewelry)';

-- Step 3: Optional View for Dynamically Computed Prices
-- This view demonstrates how the application can dynamically join the latest daily_rates
-- with catalog products to compute real-time price quotes.
CREATE OR REPLACE VIEW view_dynamic_product_prices AS
WITH active_rates AS (
  SELECT 
    gold_24k,
    gold_22k,
    gold_18k,
    gold_14k,
    silver_925,
    updated_at
  FROM daily_rates
  ORDER BY updated_at DESC
  LIMIT 1
)
SELECT 
  p.id,
  p.name,
  p.slug,
  p.purity,
  p.net_weight_grams,
  p.gross_weight_grams,
  p.making_charge_type,
  p.making_charge_rate,
  p.stone_value_paise,
  p.hallmark_pieces,
  p.huid_code,
  -- Active metal rate per gram based on product purity
  CASE 
    WHEN p.purity = '24K' THEN r.gold_24k
    WHEN p.purity = '22K' THEN r.gold_22k
    WHEN p.purity = '18K' THEN r.gold_18k
    WHEN p.purity = '14K' THEN r.gold_14k
    WHEN p.purity = '925Silver' THEN r.silver_925
    ELSE r.gold_22k
  END AS live_rate_per_gram,
  -- Computed Net Metal Value in INR (rounded)
  ROUND(
    p.net_weight_grams * 
    CASE 
      WHEN p.purity = '24K' THEN r.gold_24k
      WHEN p.purity = '22K' THEN r.gold_22k
      WHEN p.purity = '18K' THEN r.gold_18k
      WHEN p.purity = '14K' THEN r.gold_14k
      WHEN p.purity = '925Silver' THEN r.silver_925
      ELSE r.gold_22k
    END
  ) AS metal_value_inr,
  -- Computed Making Charges in INR
  ROUND(
    CASE 
      WHEN p.making_charge_type = 'percent' THEN 
        (p.net_weight_grams * 
         CASE 
           WHEN p.purity = '24K' THEN r.gold_24k
           WHEN p.purity = '22K' THEN r.gold_22k
           WHEN p.purity = '18K' THEN r.gold_18k
           WHEN p.purity = '14K' THEN r.gold_14k
           WHEN p.purity = '925Silver' THEN r.silver_925
           ELSE r.gold_22k
         END) * (p.making_charge_rate / 100.0)
      ELSE 
        p.net_weight_grams * p.making_charge_rate
    END
  ) AS making_charges_inr,
  -- Stone Value in INR
  ROUND(COALESCE(p.stone_value_paise, 0) / 100.0) AS stone_value_inr,
  -- BIS Hallmark Fee (₹45 per piece)
  COALESCE(p.hallmark_pieces, 1) * 45 AS hallmark_charges_inr,
  -- 3% GST on (Metal + Making + Stone + Hallmark)
  ROUND(
    (
      ROUND(p.net_weight_grams * CASE WHEN p.purity = '24K' THEN r.gold_24k WHEN p.purity = '22K' THEN r.gold_22k WHEN p.purity = '18K' THEN r.gold_18k WHEN p.purity = '14K' THEN r.gold_14k WHEN p.purity = '925Silver' THEN r.silver_925 ELSE r.gold_22k END) +
      ROUND(CASE WHEN p.making_charge_type = 'percent' THEN (p.net_weight_grams * CASE WHEN p.purity = '24K' THEN r.gold_24k WHEN p.purity = '22K' THEN r.gold_22k WHEN p.purity = '18K' THEN r.gold_18k WHEN p.purity = '14K' THEN r.gold_14k WHEN p.purity = '925Silver' THEN r.silver_925 ELSE r.gold_22k END) * (p.making_charge_rate / 100.0) ELSE p.net_weight_grams * p.making_charge_rate END) +
      ROUND(COALESCE(p.stone_value_paise, 0) / 100.0) +
      (COALESCE(p.hallmark_pieces, 1) * 45)
    ) * 0.03
  ) AS gst_amount_inr,
  r.updated_at AS rates_as_of
FROM products p
CROSS JOIN active_rates r
WHERE p.net_weight_grams IS NOT NULL;

-- ==============================================================================
-- END PROPOSAL
-- ==============================================================================
