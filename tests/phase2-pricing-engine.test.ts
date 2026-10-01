import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateJewelryPrice,
  getGstSplitByDestination,
  numberToIndianWords
} from '../src/lib/pricingEngine';
import { siteConfig } from '../src/config/siteConfig';

test('1. Shared Pricing Module: Standard 22K Gold item with percent making charge', () => {
  // Worked Example 1:
  // Net 10.0g @ ₹7,190/g, 8% making charge, 1 hallmark piece @ ₹45, 3% GST
  const result = calculateJewelryPrice({
    metalPurity: '22K',
    ratePerGram: 7190,
    grossWeightGrams: 10.0,
    stoneWeightGrams: 0.0,
    makingType: 'percent',
    makingRate: 8.0,
    includeHallmark: true,
    hallmarkPieces: 1,
    hallmarkRatePerPiece: 45,
    includeGst: true,
    gstRate: 0.03
  });

  // Net Metal: 10 * 7190 = 71900
  assert.equal(result.netMetalValueInr, 71900);
  // Making Charge (8% of 71900): 5752
  assert.equal(result.makingChargesInr, 5752);
  // Hallmarking: 45
  assert.equal(result.hallmarkingChargesInr, 45);
  // Gross Subtotal: 71900 + 5752 + 45 = 77697
  assert.equal(result.grossSubtotalInr, 77697);
  // 3% GST on 77697 = round(2330.91) = 2331
  assert.equal(result.gstAmountInr, 2331);
  // Final Payable = 77697 + 2331 = 80028
  assert.equal(result.finalPayableInr, 80028);
  assert.equal(result.finalPayablePaise, 8002800);
  assert.equal(result.inclusiveOfAllTaxesLabel, 'Inclusive of all taxes');
});

test('2. Shared Pricing Module: Flat making charge per gram with stone deduction', () => {
  // Worked Example 2:
  // Gross 15.5g, Stone 0.5g -> Net 15.0g @ ₹7,190/g, ₹500/g flat making, ₹3,500 stone value, 1 hallmark @ ₹45, 3% GST
  const result = calculateJewelryPrice({
    metalPurity: '22K',
    ratePerGram: 7190,
    grossWeightGrams: 15.5,
    stoneWeightGrams: 0.5,
    makingType: 'flat',
    makingRate: 500,
    stoneValueInr: 3500,
    includeHallmark: true,
    hallmarkPieces: 1,
    hallmarkRatePerPiece: 45,
    includeGst: true,
    gstRate: 0.03
  });

  assert.equal(result.netWeightGrams, 15.0);
  // Metal: 15.0 * 7190 = 107850
  assert.equal(result.netMetalValueInr, 107850);
  // Flat making: 15.0 * 500 = 7500
  assert.equal(result.makingChargesInr, 7500);
  assert.equal(result.stoneValueInr, 3500);
  assert.equal(result.hallmarkingChargesInr, 45);
  // Subtotal: 107850 + 7500 + 3500 + 45 = 118895
  assert.equal(result.grossSubtotalInr, 118895);
  // 3% GST on 118895 = round(3566.85) = 3567
  assert.equal(result.gstAmountInr, 3567);
  // Final Total: 118895 + 3567 = 122462
  assert.equal(result.finalPayableInr, 122462);
});

test('3. Shared Pricing Module: Old Gold GST Treatment (Preserved current behavior: tax before deduction)', () => {
  // Worked Example 3:
  // Subtotal ₹1,00,000 with ₹20,000 old-gold trade in deduction
  // Per siteConfig.tax.oldGoldDeductBeforeGst = false (TODO: CA to confirm)
  const resultCurrent = calculateJewelryPrice({
    metalPurity: '22K',
    ratePerGram: 10000,
    grossWeightGrams: 10,
    stoneWeightGrams: 0,
    makingType: 'percent',
    makingRate: 0,
    includeHallmark: false,
    oldGoldWeightGrams: 2,
    oldGoldRatePerGram: 10000, // Deduction = 20,000
    oldGoldDeductBeforeGst: false,
    includeGst: true,
    gstRate: 0.03
  });

  assert.equal(resultCurrent.grossSubtotalInr, 100000);
  assert.equal(resultCurrent.oldGoldDeductionInr, 20000);
  // GST calculated on full 100,000 = 3,000
  assert.equal(resultCurrent.gstAmountInr, 3000);
  // Final = 100,000 + 3,000 - 20,000 = 83,000
  assert.equal(resultCurrent.finalPayableInr, 83000);

  // Compare if CA confirms margin scheme (deduct before GST):
  const resultMarginScheme = calculateJewelryPrice({
    metalPurity: '22K',
    ratePerGram: 10000,
    grossWeightGrams: 10,
    stoneWeightGrams: 0,
    makingType: 'percent',
    makingRate: 0,
    includeHallmark: false,
    oldGoldWeightGrams: 2,
    oldGoldRatePerGram: 10000,
    oldGoldDeductBeforeGst: true,
    includeGst: true,
    gstRate: 0.03
  });

  // Taxable subtotal becomes 100,000 - 20,000 = 80,000
  assert.equal(resultMarginScheme.taxableSubtotalInr, 80000);
  // GST becomes 3% of 80,000 = 2,400
  assert.equal(resultMarginScheme.gstAmountInr, 2400);
  // Final = 80,000 + 2,400 = 82,400
  assert.equal(resultMarginScheme.finalPayableInr, 82400);
});

test('4. GST Place of Supply Split: Intra-State (J&K) vs Inter-State', () => {
  const taxPaise = 293550; // ₹2,935.50

  // Case A: Jammu & Kashmir delivery -> Intra-state (CGST 1.5% + SGST 1.5%)
  const jkSplit = getGstSplitByDestination(taxPaise, 'Jammu & Kashmir', '180013');
  assert.equal(jkSplit.type, 'intra_state');
  assert.equal(jkSplit.isJammuAndKashmir, true);
  assert.equal(jkSplit.cgstPaise + jkSplit.sgstPaise, taxPaise);
  assert.equal(jkSplit.igstPaise, 0);
  assert.equal(jkSplit.cgstRateText, '1.5%');
  assert.equal(jkSplit.sgstRateText, '1.5%');
  assert.match(jkSplit.notes, /Confirm GST treatment with CA/);

  // Case B: Outside J&K (Delhi) -> Inter-state (IGST 3.0%)
  const delhiSplit = getGstSplitByDestination(taxPaise, 'Delhi', '110001');
  assert.equal(delhiSplit.type, 'inter_state');
  assert.equal(delhiSplit.isJammuAndKashmir, false);
  assert.equal(delhiSplit.cgstPaise, 0);
  assert.equal(delhiSplit.sgstPaise, 0);
  assert.equal(delhiSplit.igstPaise, taxPaise);
  assert.equal(delhiSplit.igstRateText, '3.0%');
  assert.match(delhiSplit.notes, /Confirm GST treatment with CA/);
});

test('5. Indian Currency Words Conversion', () => {
  assert.equal(
    numberToIndianWords(80028),
    'Rupees Eighty Thousand Twenty Eight Only'
  );
  assert.equal(
    numberToIndianWords(97850),
    'Rupees Ninety Seven Thousand Eight Hundred Fifty Only'
  );
  assert.equal(
    numberToIndianWords(260000),
    'Rupees Two Lakh Sixty Thousand Only'
  );
  assert.equal(
    numberToIndianWords(1050025),
    'Rupees Ten Lakh Fifty Thousand Twenty Five Only'
  );
});
