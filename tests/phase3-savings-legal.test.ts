import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { siteConfig } from '@/config/siteConfig';

describe('Phase 3 Item 6: Savings Scheme Disabled, Wording Audit & Legal Checklist', () => {
  it('strictly verifies savings goals feature flag is disabled (OFF)', () => {
    assert.strictEqual(siteConfig.features.savingsGoalsEnabled, false);
  });

  it('verifies that SavingsGoalTracker UI does not use unapproved deposit/interest/return terminology in active labels', () => {
    const filePath = path.join(process.cwd(), 'src/components/counter/SavingsGoalTracker.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');

    // Should NOT have "Total Amount Deposited" or "Rupees Deposited"
    assert.ok(!content.includes('Total Amount Deposited'));
    assert.ok(!content.includes('Rupees Deposited'));
    assert.ok(!content.includes('Log Purchase / Deposit'));
    
    // Should use advance booking / installment terminology
    assert.ok(content.includes('Total Advance Paid'));
    assert.ok(content.includes('Advance Paid:'));
    assert.ok(content.includes('Log Advance Installment / Payment'));
  });

  it('verifies that admin overview does not use deposit terminology', () => {
    const filePath = path.join(process.cwd(), 'src/app/admin/page.tsx');
    const content = fs.readFileSync(filePath, 'utf-8');
    assert.ok(!content.includes('bridal trousseau deposits'));
    assert.ok(content.includes('bridal trousseau advance payments'));
  });

  it('verifies comprehensive legal & CA questions checklist document exists', () => {
    const checklistPath = path.join(process.cwd(), 'docs/LEGAL_SAVINGS_SCHEME_CHECKLIST.md');
    assert.ok(fs.existsSync(checklistPath), 'docs/LEGAL_SAVINGS_SCHEME_CHECKLIST.md must exist');
    const text = fs.readFileSync(checklistPath, 'utf-8');

    assert.ok(text.includes('Banning of Unregulated Deposit Schemes Act, 2019'));
    assert.ok(text.includes('Companies (Acceptance of Deposits) Rules'));
    assert.ok(text.includes('365 days'));
    assert.ok(text.includes('Notification No. 66/2017-Central Tax'));
    assert.ok(text.includes('DRAFT FOR LAWYER & CHARTERED ACCOUNTANT REVIEW'));
    assert.ok(text.includes('[TO BE FILLED BY OWNER]'));
  });
});
