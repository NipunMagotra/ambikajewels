-- ==============================================================================
-- Ambika Jewels Migration: Individual Staff Accounts, RBAC, Persistent Revocation
-- & Database-Level Atomic Inventory Locking
-- Migration Name: 20261110_staff_accounts_and_revocation.sql
-- ==============================================================================

-- 1. Create Staff Accounts Table (Owner, Manager, Staff)
CREATE TABLE IF NOT EXISTS public.staff_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'staff')),
    phone TEXT,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    mfa_secret TEXT,
    mfa_enabled BOOLEAN NOT NULL DEFAULT false,
    recovery_codes TEXT[] DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    revoked_before TIMESTAMPTZ DEFAULT now(),
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security on staff_accounts
ALTER TABLE public.staff_accounts ENABLE ROW LEVEL SECURITY;

-- Block all anonymous access
CREATE POLICY staff_accounts_no_anon ON public.staff_accounts
    FOR ALL TO anon USING (false);

-- Only authenticated service role can read/write staff accounts
CREATE POLICY staff_accounts_service_role ON public.staff_accounts
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_staff_accounts_email ON public.staff_accounts(email);
CREATE INDEX IF NOT EXISTS idx_staff_accounts_role ON public.staff_accounts(role);


-- 2. Create Persistent Revoked Sessions Table (Distributed Multi-Instance Revocation)
CREATE TABLE IF NOT EXISTS public.revoked_sessions (
    session_id TEXT PRIMARY KEY,
    staff_id UUID REFERENCES public.staff_accounts(id) ON DELETE CASCADE,
    staff_email TEXT,
    revoked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    reason TEXT DEFAULT 'logout' -- 'logout' | 'account_deactivated' | 'password_rotated' | 'admin_revocation'
);

-- Enable RLS on revoked_sessions
ALTER TABLE public.revoked_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY revoked_sessions_no_anon ON public.revoked_sessions
    FOR ALL TO anon USING (false);

CREATE POLICY revoked_sessions_service_role ON public.revoked_sessions
    FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_revoked_sessions_expires_at ON public.revoked_sessions(expires_at);


-- 3. Create Atomic Inventory Reservation Table (Prevents Race-Condition Overselling)
CREATE TABLE IF NOT EXISTS public.inventory_reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    order_id TEXT NOT NULL,
    reserved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'reserved' CHECK (status IN ('reserved', 'confirmed', 'released'))
);

ALTER TABLE public.inventory_reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY inventory_reservations_service_role ON public.inventory_reservations
    FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Ensure only one active reservation ('reserved' or 'confirmed') can exist per product
CREATE UNIQUE INDEX IF NOT EXISTS idx_active_inventory_reservation 
    ON public.inventory_reservations(product_id) 
    WHERE (status IN ('reserved', 'confirmed'));


-- 4. Database-Level Stored Procedure for Atomic Reservation with Row Locking
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
    -- 1. Take row-level lock on the product row (serializes concurrent transactions)
    SELECT stock_status INTO v_stock_status
    FROM public.products
    WHERE id = p_product_id
    FOR UPDATE;

    IF v_stock_status = 'out_of_stock' THEN
        RETURN FALSE;
    END IF;

    -- 2. Prune expired reservations for this product
    DELETE FROM public.inventory_reservations
    WHERE product_id = p_product_id
      AND status = 'reserved'
      AND expires_at < now();

    -- 3. Check for existing active reservation
    SELECT order_id INTO v_existing_order
    FROM public.inventory_reservations
    WHERE product_id = p_product_id
      AND (status = 'confirmed' OR (status = 'reserved' AND expires_at > now()))
    LIMIT 1;

    IF FOUND THEN
        IF v_existing_order = p_order_id THEN
            RETURN TRUE; -- Idempotent retry for the same order
        END IF;
        RETURN FALSE; -- Currently locked by another customer
    END IF;

    -- 4. Insert new reservation
    INSERT INTO public.inventory_reservations (product_id, order_id, reserved_at, expires_at, status)
    VALUES (
        p_product_id,
        p_order_id,
        now(),
        now() + (p_ttl_seconds || ' seconds')::INTERVAL,
        'reserved'
    );

    RETURN TRUE;
END;
$$;
