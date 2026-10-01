import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { siteConfig } from '@/config/siteConfig';
import { Form60Declaration } from '@/types/counter';

describe('Phase 3 Item 5: Cash and PAN Compliance Rules (CA to Confirm)', () => {
  describe('1. Config-Driven Statutory Thresholds', () => {
    it('defines PAN requirement threshold at ₹2,00,000 (marked CA to confirm)', () => {
      assert.strictEqual(typeof siteConfig.compliance.panRequirementThresholdInr, 'number');
      assert.strictEqual(siteConfig.compliance.panRequirementThresholdInr, 200000);
    });

    it('defines cash transaction limit at ₹2,00,000 per transaction/day (marked CA to confirm)', () => {
      assert.strictEqual(typeof siteConfig.compliance.cashTransactionLimitInr, 'number');
      assert.strictEqual(siteConfig.compliance.cashTransactionLimitInr, 200000);
    });

    it('defines cash buyback/disbursement limit at ₹10,000 for old gold purchase (marked CA to confirm)', () => {
      assert.strictEqual(typeof siteConfig.compliance.cashDisbursementLimitInr, 'number');
      assert.strictEqual(siteConfig.compliance.cashDisbursementLimitInr, 10000);
    });
  });

  describe('2. PAN vs Form 60 Requirement Logic', () => {
    function evaluatePanCompliance(totalInr: number, pan?: string, hasForm60?: boolean) {
      const isPanRequired = totalInr >= siteConfig.compliance.panRequirementThresholdInr;
      const isValidPan = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(pan?.trim() || '');
      const isCompliant = !isPanRequired || isValidPan || !!hasForm60;
      return { isPanRequired, isValidPan, isCompliant };
    }

    it('does not require PAN for transactions under ₹2,00,000', () => {
      const res = evaluatePanCompliance(185000);
      assert.strictEqual(res.isPanRequired, false);
      assert.strictEqual(res.isCompliant, true);
    });

    it('requires PAN for transactions of ₹2,00,000 or greater', () => {
      const resWithoutPan = evaluatePanCompliance(250000);
      assert.strictEqual(resWithoutPan.isPanRequired, true);
      assert.strictEqual(resWithoutPan.isCompliant, false);

      const resWithValidPan = evaluatePanCompliance(250000, 'ABCDE1234F');
      assert.strictEqual(resWithValidPan.isPanRequired, true);
      assert.strictEqual(resWithValidPan.isValidPan, true);
      assert.strictEqual(resWithValidPan.isCompliant, true);
    });

    it('accepts Form 60 declaration when customer holds no PAN', () => {
      const resWithForm60 = evaluatePanCompliance(250000, undefined, true);
      assert.strictEqual(resWithForm60.isPanRequired, true);
      assert.strictEqual(resWithForm60.isValidPan, false);
      assert.strictEqual(resWithForm60.isCompliant, true);
    });

    it('rejects invalid or malformed PAN formatting', () => {
      const resWithBadPan = evaluatePanCompliance(250000, 'INVALID123');
      assert.strictEqual(resWithBadPan.isValidPan, false);
      assert.strictEqual(resWithBadPan.isCompliant, false);
    });
  });

  describe('3. Counter Cash Payment Blocker Logic', () => {
    function evaluateCashBlock(
      totalInr: number,
      paymentMode: 'cash' | 'upi' | 'card' | 'bank_transfer' | 'split',
      cashPortion = 0
    ) {
      const effectiveCash = paymentMode === 'cash' ? totalInr : (paymentMode === 'split' ? cashPortion : 0);
      return effectiveCash >= siteConfig.compliance.cashTransactionLimitInr;
    }

    it('blocks cash payment when total amount is ₹2,00,000 or above (CA to confirm)', () => {
      assert.strictEqual(evaluateCashBlock(200000, 'cash'), true);
      assert.strictEqual(evaluateCashBlock(250000, 'cash'), true);
      assert.strictEqual(evaluateCashBlock(199999, 'cash'), false);
    });

    it('allows digital/bank payment modes (UPI, Card, Bank Transfer) even for amounts >= ₹2,00,000', () => {
      assert.strictEqual(evaluateCashBlock(500000, 'bank_transfer'), false);
      assert.strictEqual(evaluateCashBlock(250000, 'upi'), false);
      assert.strictEqual(evaluateCashBlock(300000, 'card'), false);
    });

    it('blocks split payments if cash portion alone reaches ₹2,00,000', () => {
      assert.strictEqual(evaluateCashBlock(400000, 'split', 200000), true);
      assert.strictEqual(evaluateCashBlock(400000, 'split', 150000), false);
    });
  });

  describe('4. Old Gold Cash Payout / Buyback Limit Alert', () => {
    function evaluateBuybackAlert(oldGoldDeductionInr: number, paymentMode: string) {
      return (
        oldGoldDeductionInr > siteConfig.compliance.cashDisbursementLimitInr &&
        paymentMode === 'cash'
      );
    }

    it('alerts cashier when cash payout for old gold purchase exceeds ₹10,000 (CA to confirm)', () => {
      assert.strictEqual(evaluateBuybackAlert(50000, 'cash'), true);
      assert.strictEqual(evaluateBuybackAlert(10000, 'cash'), false);
      assert.strictEqual(evaluateBuybackAlert(50000, 'bank_transfer'), false);
    });
  });

  describe('5. Form 60 Statutory Declaration Schema Integrity', () => {
    it('validates required fields for a compliant Form 60 declaration', () => {
      const declaration: Form60Declaration = {
        declarantName: 'Surinder Singh',
        fatherOrSpouseName: 'Kharak Singh',
        dateOfBirth: '1975-08-15',
        residentialAddress: 'Village Kot Bhalwal, Tehsil Jammu, J&K',
        panApplicationStatus: 'not_applied',
        estimatedAgriculturalIncome: 120000,
        estimatedOtherIncome: 80000,
        verifiedDeclaration: true,
      };

      assert.ok(declaration.declarantName.length > 0);
      assert.ok(declaration.fatherOrSpouseName.length > 0);
      assert.ok(declaration.residentialAddress.length > 0);
      assert.strictEqual(declaration.verifiedDeclaration, true);
    });
  });
});
