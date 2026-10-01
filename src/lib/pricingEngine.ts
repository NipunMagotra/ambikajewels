import { siteConfig } from '@/config/siteConfig';

export type MetalPurity = '24K' | '22K' | '18K' | '14K' | '925Silver';
export type MakingChargeType = 'percent' | 'flat';

export interface JewelryPricingInput {
  metalPurity: MetalPurity;
  ratePerGram: number; // in INR (e.g. 7190)
  grossWeightGrams: number; // in grams (e.g. 10.0)
  stoneWeightGrams?: number; // in grams (e.g. 0.5)
  stoneValueInr?: number; // in INR (e.g. 1200)
  makingType: MakingChargeType; // 'percent' | 'flat'
  makingRate: number; // e.g. 8 for 8%, or 450 for ₹450/g
  includeHallmark?: boolean; // default true
  hallmarkPieces?: number; // default 1
  hallmarkRatePerPiece?: number; // default ₹45
  includeGst?: boolean; // default true
  gstRate?: number; // default 0.03 (3%)
  oldGoldWeightGrams?: number; // in grams
  oldGoldRatePerGram?: number; // in INR
  // TODO: CA to confirm whether old gold trade-in should be deducted before or after GST
  oldGoldDeductBeforeGst?: boolean;
}

export interface JewelryPricingBreakdown {
  netWeightGrams: number;
  ratePerGram: number;
  netMetalValueInr: number;
  makingChargesInr: number;
  stoneValueInr: number;
  hallmarkingChargesInr: number;
  grossSubtotalInr: number;
  gstAmountInr: number;
  taxableSubtotalInr: number;
  oldGoldDeductionInr: number;
  finalPayableInr: number;
  finalPayablePaise: number;
  inclusiveOfAllTaxesLabel: string;
}

/**
 * Universal Shared Pricing Module
 * Used by online checkout, PDP price breakdown, tax invoices, and showroom counter POS.
 *
 * Guaranteed rounding and mathematical precision:
 * - Net Weight = max(0, grossWeight - stoneWeight)
 * - Net Metal Value = round(netWeight * ratePerGram)
 * - Making Charges = round(netMetalValue * makingRate / 100) or round(netWeight * makingRate)
 * - Hallmarking = round(count * ratePerPiece)
 * - Gross Subtotal = netMetalValue + makingCharges + stoneValue + hallmarking
 * - GST (3%) = round(taxableSubtotal * gstRate)
 * - Final Total = max(0, grossSubtotal + gstAmount - oldGoldDeduction)
 */
export function calculateJewelryPrice(input: JewelryPricingInput): JewelryPricingBreakdown {
  const grossWt = Math.max(0, Number(input.grossWeightGrams) || 0);
  const stoneWt = Math.max(0, Number(input.stoneWeightGrams) || 0);
  const netWt = Math.max(0, grossWt - stoneWt);

  const rate = Math.max(0, Number(input.ratePerGram) || 0);
  const netMetalValue = Math.round(netWt * rate);

  const makingRate = Math.max(0, Number(input.makingRate) || 0);
  let makingCharges = 0;
  if (input.makingType === 'percent') {
    makingCharges = Math.round(netMetalValue * (makingRate / 100));
  } else {
    makingCharges = Math.round(netWt * makingRate);
  }

  const stoneVal = Math.max(0, Math.round(Number(input.stoneValueInr) || 0));

  const includeHallmark = input.includeHallmark !== false;
  const hallmarkCount = Math.max(1, Math.floor(Number(input.hallmarkPieces) || 1));
  const hallmarkUnitFee = Number(input.hallmarkRatePerPiece) || 45;
  const hallmarkCharges = includeHallmark ? Math.round(hallmarkCount * hallmarkUnitFee) : 0;

  const grossSubtotal = netMetalValue + makingCharges + stoneVal + hallmarkCharges;

  // Old Gold Trade-In calculation
  const oldGoldWt = Math.max(0, Number(input.oldGoldWeightGrams) || 0);
  const oldGoldRate = Math.max(0, Number(input.oldGoldRatePerGram) || rate);
  const oldGoldDeduction = Math.round(oldGoldWt * oldGoldRate);

  // TODO: CA to confirm whether GST is on gross outward supply or net margin after old gold barter
  const deductBeforeGst = input.oldGoldDeductBeforeGst ?? siteConfig.tax.oldGoldDeductBeforeGst ?? false;
  const taxableSubtotal = deductBeforeGst ? Math.max(0, grossSubtotal - oldGoldDeduction) : grossSubtotal;

  const includeGst = input.includeGst !== false;
  const gstPercentage = typeof input.gstRate === 'number' ? input.gstRate : siteConfig.tax.gstRate;
  const gstAmount = includeGst ? Math.round(taxableSubtotal * gstPercentage) : 0;

  let finalAmount = 0;
  if (deductBeforeGst) {
    finalAmount = taxableSubtotal + gstAmount;
  } else {
    finalAmount = Math.max(0, grossSubtotal + gstAmount - oldGoldDeduction);
  }

  return {
    netWeightGrams: Math.round(netWt * 1000) / 1000,
    ratePerGram: rate,
    netMetalValueInr: netMetalValue,
    makingChargesInr: makingCharges,
    stoneValueInr: stoneVal,
    hallmarkingChargesInr: hallmarkCharges,
    grossSubtotalInr: grossSubtotal,
    gstAmountInr: gstAmount,
    taxableSubtotalInr: taxableSubtotal,
    oldGoldDeductionInr: oldGoldDeduction,
    finalPayableInr: finalAmount,
    finalPayablePaise: finalAmount * 100,
    inclusiveOfAllTaxesLabel: 'Inclusive of all taxes'
  };
}

export interface GstDestinationSplit {
  type: 'intra_state' | 'inter_state';
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  cgstRateText: string;
  sgstRateText: string;
  igstRateText: string;
  placeOfSupply: string;
  isJammuAndKashmir: boolean;
  notes: string;
}

/**
 * Computes GST split (CGST + SGST vs IGST) based on destination state/pincode.
 * - Intra-State (Jammu & Kashmir -> J&K): CGST 1.5% + SGST 1.5%
 * - Inter-State (Jammu & Kashmir -> Outside J&K): IGST 3.0%
 * Marked: "Confirm GST treatment with CA"
 */
export function getGstSplitByDestination(
  taxPaise: number,
  stateName?: string,
  pincode?: string
): GstDestinationSplit {
  const normState = (stateName || '').toLowerCase().trim();
  const normPin = (pincode || '').trim();

  // J&K GST State Code: 01. Pincodes in J&K start with 18 or 19.
  const isJK =
    normState.includes('jammu') ||
    normState.includes('kashmir') ||
    normState === 'jk' ||
    normState === 'j&k' ||
    normPin.startsWith('18') ||
    normPin.startsWith('19');

  if (isJK || !stateName) {
    const halfTax = Math.floor(taxPaise / 2);
    const remainder = taxPaise - halfTax;
    return {
      type: 'intra_state',
      cgstPaise: halfTax,
      sgstPaise: remainder,
      igstPaise: 0,
      cgstRateText: '1.5%',
      sgstRateText: '1.5%',
      igstRateText: '0%',
      placeOfSupply: 'Jammu & Kashmir (State Code: 01)',
      isJammuAndKashmir: true,
      notes: 'Intra-state supply: CGST (1.5%) + SGST (1.5%). Confirm GST treatment with CA.'
    };
  }

  return {
    type: 'inter_state',
    cgstPaise: 0,
    sgstPaise: 0,
    igstPaise: taxPaise,
    cgstRateText: '0%',
    sgstRateText: '0%',
    igstRateText: '3.0%',
    placeOfSupply: `${stateName.trim()} (Inter-State Supply)`,
    isJammuAndKashmir: false,
    notes: 'Inter-state supply: Integrated GST (3.0%). Confirm GST treatment with CA.'
  };
}

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function convertTwoDigits(num: number): string {
  if (num < 20) return ONES[num];
  const ten = Math.floor(num / 10);
  const rem = num % 10;
  return TENS[ten] + (rem ? ' ' + ONES[rem] : '');
}

function convertThreeDigits(num: number): string {
  const hundred = Math.floor(num / 100);
  const rest = num % 100;
  let str = '';
  if (hundred) str += ONES[hundred] + ' Hundred';
  if (rest) str += (str ? ' ' : '') + convertTwoDigits(rest);
  return str;
}

/**
 * Converts numeric amount to Indian currency words
 * Example: 97850 -> "Rupees Ninety Seven Thousand Eight Hundred Fifty Only"
 */
export function numberToIndianWords(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return 'Rupees Zero Only';

  const intPart = Math.floor(amount);
  const paisePart = Math.round((amount - intPart) * 100);

  const crore = Math.floor(intPart / 10000000);
  let rem = intPart % 10000000;
  const lakh = Math.floor(rem / 100000);
  rem = rem % 100000;
  const thousand = Math.floor(rem / 1000);
  rem = rem % 1000;
  const hundred = rem;

  const parts: string[] = [];
  if (crore) parts.push(convertThreeDigits(crore) + ' Crore');
  if (lakh) parts.push(convertTwoDigits(lakh) + ' Lakh');
  if (thousand) parts.push(convertTwoDigits(thousand) + ' Thousand');
  if (hundred) parts.push(convertThreeDigits(hundred));

  let words = 'Rupees ' + (parts.join(' ') || 'Zero');
  if (paisePart > 0) {
    words += ' and ' + convertTwoDigits(paisePart) + ' Paise';
  }
  return words + ' Only';
}

/**
 * Computes Indian Financial Year (April 1 to March 31).
 * Example:
 * - October 2026 -> '26-27'
 * - February 2027 -> '26-27'
 * - April 2027 -> '27-28'
 */
export function getIndianFinancialYear(date: Date = new Date()): string {
  const month = date.getMonth(); // 0-indexed: 0 = Jan, 3 = Apr
  const year = date.getFullYear();
  const startYear = month >= 3 ? year : year - 1;
  const endYear = startYear + 1;
  const sy = String(startYear).slice(-2);
  const ey = String(endYear).slice(-2);
  return `${sy}-${ey}`;
}


