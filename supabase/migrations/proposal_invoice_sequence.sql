-- ==============================================================================
-- PROPOSAL ONLY: Dedicated Gapless GST Tax Invoice Sequence Migration
-- ==============================================================================
-- DO NOT APPLY AUTOMATICALLY TO PRODUCTION.
-- 
-- Status: Architecture Proposal
-- Target: Supabase PostgreSQL (Ambika Jewels Orders & Compliance)
-- Compliance Mandate: Under Indian GST Law (Rule 46(b) of CGST Rules), tax invoices
--   must contain consecutive, unique serial numbers not exceeding 16 characters,
--   generated uniquely for a given Financial Year (April 1 to March 31).
-- 
-- Crucial Invariant: Tax invoice numbers are issued ONLY when payment is confirmed 
--   (status = 'paid'). Unpaid / pending / failed orders must NEVER consume an invoice number.
-- 
-- Reviewers: Store Owner (Shivani Anand / Lakesh Kumar), Chartered Accountant (CA)
-- ==============================================================================

-- 1. Table to track sequential numbers per Indian Financial Year (April 1 - March 31)
CREATE TABLE IF NOT EXISTS invoice_sequences (
  financial_year VARCHAR(10) PRIMARY KEY, -- e.g. '26-27'
  last_serial_number BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Add invoice tracking fields to orders table if not already present
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(50) UNIQUE,
  ADD COLUMN IF NOT EXISTS invoice_issued_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS invoice_financial_year VARCHAR(10);

-- 3. Atomic Function to Issue Tax Invoice Number ONLY upon Payment Success
CREATE OR REPLACE FUNCTION issue_order_tax_invoice(
  p_order_id TEXT,
  p_financial_year VARCHAR(10) DEFAULT NULL
)
RETURNS TABLE (
  order_id TEXT,
  invoice_number VARCHAR(50),
  invoice_issued_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order RECORD;
  v_fy VARCHAR(10);
  v_serial BIGINT;
  v_inv_num VARCHAR(50);
  v_issued_at TIMESTAMPTZ := NOW();
BEGIN
  -- A. Fetch order and check payment status
  SELECT id, status, payment_status, orders.invoice_number, orders.invoice_issued_at
  INTO v_order
  FROM orders
  WHERE id = p_order_id OR order_number = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order % not found', p_order_id;
  END IF;

  -- B. Idempotency: Return existing invoice number if already issued
  IF v_order.invoice_number IS NOT NULL THEN
    RETURN QUERY SELECT v_order.id, v_order.invoice_number, v_order.invoice_issued_at;
    RETURN;
  END IF;

  -- C. Enforce Invariant: Invoices can ONLY be issued on successful payment
  IF v_order.status != 'paid' AND v_order.payment_status != 'paid' AND v_order.status != 'confirmed' THEN
    RAISE EXCEPTION 'Cannot issue GST tax invoice for unpaid order (status: %, payment_status: %)', 
      v_order.status, v_order.payment_status;
  END IF;

  -- D. Compute Indian Financial Year (April 1 - March 31) if not explicitly provided
  IF p_financial_year IS NULL OR p_financial_year = '' THEN
    IF EXTRACT(MONTH FROM v_issued_at) >= 4 THEN
      v_fy := TO_CHAR(EXTRACT(YEAR FROM v_issued_at) % 100, 'FM00') || '-' || 
              TO_CHAR((EXTRACT(YEAR FROM v_issued_at) + 1) % 100, 'FM00');
    ELSE
      v_fy := TO_CHAR((EXTRACT(YEAR FROM v_issued_at) - 1) % 100, 'FM00') || '-' || 
              TO_CHAR(EXTRACT(YEAR FROM v_issued_at) % 100, 'FM00');
    END IF;
  ELSE
    v_fy := p_financial_year;
  END IF;

  -- E. Atomic Gapless Sequence Generation per Financial Year
  INSERT INTO invoice_sequences (financial_year, last_serial_number, updated_at)
  VALUES (v_fy, 1, v_issued_at)
  ON CONFLICT (financial_year)
  DO UPDATE SET 
    last_serial_number = invoice_sequences.last_serial_number + 1,
    updated_at = v_issued_at
  RETURNING last_serial_number INTO v_serial;

  -- Format: AJ/{FY}/{4-to-6 digit zero-padded serial} (e.g. AJ/26-27/0001)
  v_inv_num := 'AJ/' || v_fy || '/' || LPAD(v_serial::TEXT, 4, '0');

  -- F. Update Order Record with assigned tax invoice number
  UPDATE orders
  SET 
    invoice_number = v_inv_num,
    invoice_issued_at = v_issued_at,
    invoice_financial_year = v_fy
  WHERE id = v_order.id;

  RETURN QUERY SELECT v_order.id, v_inv_num, v_issued_at;
END;
$$;

COMMENT ON FUNCTION issue_order_tax_invoice IS 'Issues atomic, gapless GST tax invoice numbers exclusively for paid orders per Financial Year (April-March)';
