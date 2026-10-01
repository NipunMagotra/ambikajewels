import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

describe('Phase 3 Item 8: Per-Staff Admin Accounts & Audit Log Proposal', () => {
  it('verifies that the proposed SQL migration file exists and defines staff accounts & audit logs', () => {
    const migrationPath = path.join(process.cwd(), 'supabase/migrations/proposal_staff_accounts_and_audit_log.sql');
    assert.ok(fs.existsSync(migrationPath), 'SQL migration proposal file must exist');

    const sql = fs.readFileSync(migrationPath, 'utf-8');
    assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS public.staff_accounts'));
    assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS public.admin_audit_logs'));
    assert.ok(sql.includes("role IN ('owner', 'manager', 'cashier', 'accountant')"));
    assert.ok(sql.includes('old_values JSONB'));
    assert.ok(sql.includes('new_values JSONB'));
    assert.ok(sql.includes('REVOKE UPDATE, DELETE ON public.admin_audit_logs FROM PUBLIC, anon, authenticated'));
  });

  it('verifies that the architecture proposal document covers RBAC, token structure, and who changed what', () => {
    const docPath = path.join(process.cwd(), 'docs/PROPOSAL_STAFF_ACCOUNTS_AUDIT_LOG.md');
    assert.ok(fs.existsSync(docPath), 'Architecture proposal document must exist');

    const doc = fs.readFileSync(docPath, 'utf-8');
    assert.ok(doc.includes('Role-Based Access Control (RBAC) Matrix'));
    assert.ok(doc.includes('UPDATE_DAILY_RATES'));
    assert.ok(doc.includes('old_values'));
    assert.ok(doc.includes('new_values'));
    assert.ok(doc.includes('Append-Only Immutability'));
    assert.ok(doc.includes('Cryptographic Token Structure'));
  });
});
