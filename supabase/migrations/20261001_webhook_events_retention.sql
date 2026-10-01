-- =========================================================================
-- Ambika Jewels Migration: Webhook Events Retention & Status Architecture
-- Migration Name: 20261001_webhook_events_retention.sql
-- =========================================================================

-- 1. Ensure webhook_events table has status and minimal non-PII columns
ALTER TABLE webhook_events
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed',
  ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Drop sensitive payload column if present to guarantee no PII is retained
ALTER TABLE webhook_events
  DROP COLUMN IF EXISTS payload;

-- 3. Documented Retention Purge Function (Purges webhook events older than 90 days)
CREATE OR REPLACE FUNCTION purge_old_webhook_events(retention_days INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM webhook_events
  WHERE created_at < NOW() - (retention_days || ' days')::INTERVAL;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
