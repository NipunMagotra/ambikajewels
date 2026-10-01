-- ==============================================================================
-- PROPOSAL: Per-Staff Admin Accounts & Tamper-Evident Audit Logging (Phase 3 Item 8)
-- Status: PROPOSAL ONLY — DO NOT APPLY AUTOMATICALLY TO PRODUCTION SUPABASE
-- ==============================================================================

-- 1. Create Staff Accounts Table
CREATE TABLE IF NOT EXISTS public.staff_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'cashier', 'accountant')),
    phone TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on staff_accounts
ALTER TABLE public.staff_accounts ENABLE ROW LEVEL SECURITY;

-- Block anonymous access completely
CREATE POLICY staff_accounts_no_anon ON public.staff_accounts
    FOR ALL TO anon USING (false);

-- Only authenticated service role can read/write staff accounts
CREATE POLICY staff_accounts_service_role_all ON public.staff_accounts
    FOR ALL TO service_role USING (true) WITH CHECK (true);


-- 2. Create Tamper-Evident Admin Audit Log Table
-- Records WHO changed rates, prices, or orders, WHEN, with OLD vs NEW snapshots
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id UUID REFERENCES public.staff_accounts(id) ON DELETE SET NULL,
    staff_email TEXT NOT NULL,
    staff_name TEXT NOT NULL,
    action TEXT NOT NULL,          -- e.g. 'RATES_UPDATED', 'PRODUCT_PRICE_CHANGED', 'ORDER_STATUS_CHANGED', 'ORDER_CANCELLED'
    entity_type TEXT NOT NULL,     -- 'rates', 'products', 'orders', 'auth'
    entity_id TEXT,                -- Target ID (e.g. order UUID, product slug, date)
    old_values JSONB,              -- Snapshot before change
    new_values JSONB,              -- Snapshot after change
    ip_address TEXT,               -- IP address of caller
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index audit logs for rapid querying by entity, staff, and timestamp
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_entity ON public.admin_audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_staff ON public.admin_audit_logs(staff_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON public.admin_audit_logs(created_at DESC);

-- Enable RLS on audit logs
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- IMMUTABILITY GUARANTEE:
-- Audit logs can NEVER be updated or deleted by any user or staff role.
-- Only INSERT is permitted via service_role.
CREATE POLICY admin_audit_logs_no_anon ON public.admin_audit_logs
    FOR ALL TO anon USING (false);

CREATE POLICY admin_audit_logs_service_role_insert ON public.admin_audit_logs
    FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY admin_audit_logs_service_role_select ON public.admin_audit_logs
    FOR SELECT TO service_role USING (true);

-- Explicitly revoke UPDATE and DELETE privileges on admin_audit_logs from all public roles
REVOKE UPDATE, DELETE ON public.admin_audit_logs FROM PUBLIC, anon, authenticated;


-- 3. Initial Seed / Bootstrap Owner Account (Template)
INSERT INTO public.staff_accounts (id, email, full_name, role, is_active)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'owner@ambikajewels.com',
    'Shivani Anand (Owner)',
    'owner',
    true
)
ON CONFLICT (email) DO NOTHING;
