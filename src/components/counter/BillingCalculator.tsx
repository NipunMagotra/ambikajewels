'use client';

import React, { useState, useMemo } from 'react';
import { DailyRates, BillInput, BillBreakdown } from '@/types/counter';
import { ThermalReceiptModal } from './ThermalReceiptModal';
import { Form60Modal } from './Form60Modal';
import { calculateJewelryPrice } from '@/lib/pricingEngine';
import { siteConfig } from '@/config/siteConfig';
import {
  Calculator,
  Share2,
  Printer,
  Scale,
  Gem,
  Percent,
  Coins,
  ShieldCheck,
  RotateCcw,
  Check,
  User,
  Phone,
  Sparkles,
  ArrowRight,
  FileText,
  AlertTriangle,
  CreditCard,
  Ban,
} from 'lucide-react';

interface BillingCalculatorProps {
  rates: DailyRates;
}

export const BillingCalculator: React.FC<BillingCalculatorProps> = ({ rates }) => {
  const [bill, setBill] = useState<BillInput>({
    customerName: '',
    customerPhone: '',
    customerPan: '',
    hasForm60: false,
    form60Details: null,
    paymentMode: 'cash',
    cashAmountReceived: 0,
    metalPurity: '22K',
    grossWeight: 10.0,
    stoneWeight: 0.0,
    makingType: 'percent',
    makingRate: 8.0,
    includeHallmark: true,
    hallmarkCount: 1,
    hallmarkRate: 45,
    includeGst: true,
    gstRate: 3.0,
    oldGoldWeight: 0.0,
    oldGoldPurityRate: 0.0,
    notes: '',
  });

  const [customRateOverride, setCustomRateOverride] = useState<number | null>(null);
  const [showThermalModal, setShowThermalModal] = useState(false);
  const [showForm60Modal, setShowForm60Modal] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Active per gram rate based on purity selection
  const activeRatePerGram = useMemo(() => {
    if (customRateOverride !== null && customRateOverride > 0) {
      return customRateOverride;
    }
    switch (bill.metalPurity) {
      case '22K':
        return rates.gold_22k;
      case '18K':
        return rates.gold_18k;
      case '14K':
        return rates.gold_14k;
      case '925Silver':
        return rates.silver_925;
      default:
        return rates.gold_22k;
    }
  }, [bill.metalPurity, rates, customRateOverride]);

  // Compute breakdown using ONE SHARED pricing module (pricingEngine.ts)
  const breakdown: BillBreakdown = useMemo(() => {
    const oldGoldRate = bill.oldGoldPurityRate > 0 ? bill.oldGoldPurityRate : rates.gold_22k;

    const pricing = calculateJewelryPrice({
      metalPurity: bill.metalPurity,
      ratePerGram: activeRatePerGram,
      grossWeightGrams: bill.grossWeight,
      stoneWeightGrams: bill.stoneWeight,
      makingType: bill.makingType,
      makingRate: bill.makingRate,
      includeHallmark: bill.includeHallmark,
      hallmarkPieces: bill.hallmarkCount,
      hallmarkRatePerPiece: bill.hallmarkRate,
      includeGst: bill.includeGst,
      gstRate: (bill.gstRate ?? 3) / 100,
      oldGoldWeightGrams: bill.oldGoldWeight,
      oldGoldRatePerGram: oldGoldRate,
      // Keep current behavior: tax calculated before old-gold deduction (TODO: CA to confirm)
      oldGoldDeductBeforeGst: siteConfig.tax.oldGoldDeductBeforeGst
    });

    return {
      netWeight: pricing.netWeightGrams,
      appliedRatePerGram: pricing.ratePerGram,
      netGoldValue: pricing.netMetalValueInr,
      makingCharges: pricing.makingChargesInr,
      hallmarkingCharges: pricing.hallmarkingChargesInr,
      grossSubtotal: pricing.grossSubtotalInr,
      gstAmount: pricing.gstAmountInr,
      oldGoldDeduction: pricing.oldGoldDeductionInr,
      finalAmountDue: pricing.finalPayableInr,
    };
  }, [bill, activeRatePerGram, rates.gold_22k]);

  // Compliance rules (Config-driven thresholds, CA to confirm)
  const isPanRequired = breakdown.finalAmountDue >= siteConfig.compliance.panRequirementThresholdInr;
  const isPanValid = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(bill.customerPan?.trim() || '');
  const isPanSatisfied = !isPanRequired || isPanValid || !!bill.hasForm60;

  const effectiveCashAmount = bill.paymentMode === 'cash'
    ? breakdown.finalAmountDue
    : (bill.paymentMode === 'split' ? (bill.cashAmountReceived || 0) : 0);

  // Cash limit: payments >= 2,00,000 in cash per day are restricted under Indian tax laws (CA to confirm)
  const isCashBlocked = effectiveCashAmount >= siteConfig.compliance.cashTransactionLimitInr;

  // Buyback limit: cash payouts > 10,000 for old gold purchase (CA to confirm)
  const isOldGoldCashAlert = bill.oldGoldWeight > 0 && breakdown.oldGoldDeduction > siteConfig.compliance.cashDisbursementLimitInr && (bill.paymentMode === 'cash' || effectiveCashAmount > 0);

  const handleInputChange = (field: keyof BillInput, value: any) => {
    setBill((prev) => ({ ...prev, [field]: value }));
  };

  const [receiptNumber, setReceiptNumber] = useState('AJ-ESTIMATE');

  React.useEffect(() => {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setReceiptNumber(`AJ-${dateStr}-${randomSuffix}`);
  }, []);

  // Format WhatsApp Text Bill Summary
  const formatWhatsAppText = () => {
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    let text = bill.includeGst
      ? `*AMBIKA JEWELS — TAX INVOICE / CASH MEMO*\n`
      : `*AMBIKA JEWELS — ESTIMATE QUOTE*\n*⚠️ ESTIMATE ONLY — NOT A TAX INVOICE / CANNOT BE USED AS A BILL*\n`;
    text += `Lower Roop Nagar, Jammu | Ph: +91 9682589725\n`;
    text += `----------------------------------------\n`;
    if (bill.customerName) text += `*Customer:* ${bill.customerName}\n`;
    if (bill.customerPan) text += `*Customer PAN:* ${bill.customerPan.toUpperCase()}\n`;
    if (bill.hasForm60) text += `*PAN Status:* Form 60 Declaration Attached\n`;
    if (bill.paymentMode) text += `*Payment Mode:* ${bill.paymentMode.toUpperCase()}\n`;
    text += `*Date:* ${dateStr}\n`;
    text += `*Metal & Purity:* ${bill.metalPurity}\n`;
    text += `*Gross Wt:* ${bill.grossWeight.toFixed(3)}g\n`;
    if (bill.stoneWeight > 0) text += `*Stone Wt:* -${bill.stoneWeight.toFixed(3)}g\n`;
    text += `*Net Wt:* ${breakdown.netWeight.toFixed(3)}g\n`;
    text += `*Gold Rate:* ₹${breakdown.appliedRatePerGram.toLocaleString('en-IN')}/g\n`;
    text += `*Net Gold Value:* ₹${breakdown.netGoldValue.toLocaleString('en-IN')}\n`;

    if (breakdown.makingCharges > 0) {
      text += `*Making Charges:* +₹${breakdown.makingCharges.toLocaleString('en-IN')}\n`;
    }
    if (breakdown.hallmarkingCharges > 0) {
      text += `*BIS Hallmarking:* +₹${breakdown.hallmarkingCharges.toLocaleString('en-IN')}\n`;
    }
    text += `*Subtotal:* ₹${breakdown.grossSubtotal.toLocaleString('en-IN')}\n`;

    if (bill.includeGst) {
      text += `*GST (3%):* +₹${breakdown.gstAmount.toLocaleString('en-IN')}\n`;
    }
    if (breakdown.oldGoldDeduction > 0) {
      text += `*Old Gold Exchange:* -₹${breakdown.oldGoldDeduction.toLocaleString('en-IN')}\n`;
    }

    text += `----------------------------------------\n`;
    text += `*TOTAL AMOUNT DUE:* ₹${breakdown.finalAmountDue.toLocaleString('en-IN')}\n`;
    text += `----------------------------------------\n`;
    if (!bill.includeGst) {
      text += `*DISCLAIMER:* This document is an estimate only and CANNOT be used as a tax invoice, bill of sale, or commercial proof of purchase under Indian GST laws.\n`;
    }
    text += `Thank you for shopping with Ambika Jewels!`;

    return text;
  };

  const handleWhatsAppShare = () => {
    if (isCashBlocked) return;
    const rawText = formatWhatsAppText();
    const encodedText = encodeURIComponent(rawText);

    let url = `https://wa.me/?text=${encodedText}`;
    if (bill.customerPhone) {
      const cleanPhone = bill.customerPhone.replace(/\D/g, '');
      const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
      url = `https://wa.me/${fullPhone}?text=${encodedText}`;
    }

    window.open(url, '_blank');
  };

  const handleResetForm = () => {
    setBill({
      customerName: '',
      customerPhone: '',
      customerPan: '',
      hasForm60: false,
      form60Details: null,
      paymentMode: 'cash',
      cashAmountReceived: 0,
      metalPurity: '22K',
      grossWeight: 10.0,
      stoneWeight: 0.0,
      makingType: 'percent',
      makingRate: 8.0,
      includeHallmark: true,
      hallmarkCount: 1,
      hallmarkRate: 45,
      includeGst: true,
      gstRate: 3.0,
      oldGoldWeight: 0.0,
      oldGoldPurityRate: 0.0,
      notes: '',
    });
    setCustomRateOverride(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-primary/20 text-primary border border-primary/40 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Counter Billing Tool
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl text-primary font-headline-md font-bold mt-1">
            Goldsmith Billing & Receipt Generator
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Fast thumb-typing billing calculator with instant WhatsApp share and thermal receipt printing.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetForm}
          className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary bg-surface border border-outline-variant/40 hover:border-primary/40 px-3 py-2 rounded-lg transition-all shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Calculator</span>
        </button>
      </div>

      {/* Main Grid: Inputs on Left, Computation Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Inputs (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Customer Metadata & Compliance */}
          <div className="glass-panel p-4 rounded-xl border border-outline-variant/30 space-y-4 bg-surface-container/60">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4" />
                Customer & Payment Details
              </h3>
              {isPanRequired && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 border ${
                  isPanSatisfied 
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300' 
                    : 'bg-amber-950/60 border-amber-500/60 text-amber-300 animate-pulse'
                }`}>
                  <AlertTriangle className="w-3 h-3" />
                  PAN / Form 60 Required (₹2L+)
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-on-surface-variant block mb-1">Customer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={bill.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  className="w-full bg-surface border border-outline-variant/50 focus:border-primary text-on-surface px-3 py-2 rounded-lg text-sm min-h-[44px] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-on-surface-variant block mb-1">Phone Number (for WhatsApp)</label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={bill.customerPhone}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                  className="w-full bg-surface border border-outline-variant/50 focus:border-primary text-on-surface px-3 py-2 rounded-lg text-sm min-h-[44px] focus:outline-none"
                />
              </div>
            </div>

            {/* PAN & Form 60 Row */}
            <div className="pt-2 border-t border-outline-variant/20 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs text-on-surface-variant font-medium flex items-center gap-1">
                  <span>Customer PAN {isPanRequired ? <strong className="text-amber-400">*</strong> : '(Optional)'}</span>
                  <span className="text-[10px] text-on-surface-variant/70">(CA to confirm)</span>
                </label>

                {!bill.hasForm60 ? (
                  <button
                    type="button"
                    onClick={() => setShowForm60Modal(true)}
                    className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>No PAN? File Form 60 Declaration</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Form 60 Attached
                    </span>
                    <button
                      type="button"
                      onClick={() => setBill(prev => ({ ...prev, hasForm60: false, form60Details: null }))}
                      className="text-[10px] text-red-400 hover:underline cursor-pointer"
                    >
                      (Remove)
                    </button>
                  </div>
                )}
              </div>

              {!bill.hasForm60 && (
                <div className="relative">
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="e.g. ABCDE1234F"
                    value={bill.customerPan || ''}
                    onChange={(e) => handleInputChange('customerPan', e.target.value.toUpperCase())}
                    className={`w-full bg-surface border text-on-surface px-3 py-2 rounded-lg text-sm uppercase font-mono tracking-wider focus:outline-none ${
                      isPanRequired && !isPanValid
                        ? 'border-amber-500/70 focus:border-amber-400'
                        : 'border-outline-variant/50 focus:border-primary'
                    }`}
                  />
                  {bill.customerPan && (
                    <span className="absolute right-3 top-2.5 text-xs font-bold">
                      {isPanValid ? (
                        <span className="text-emerald-400 flex items-center gap-0.5"><Check className="w-3.5 h-3.5" /> Valid PAN</span>
                      ) : (
                        <span className="text-amber-400 text-[10px]">10 chars (AAAAA9999A)</span>
                      )}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Payment Mode Selector */}
            <div className="pt-2 border-t border-outline-variant/20 space-y-2">
              <label className="text-xs text-on-surface-variant font-medium block">
                Payment Mode Selection
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { value: 'cash', label: 'Cash' },
                  { value: 'upi', label: 'UPI / QR' },
                  { value: 'card', label: 'Card (POS)' },
                  { value: 'bank_transfer', label: 'Bank (NEFT)' },
                ].map((mode) => {
                  const isSelected = (bill.paymentMode || 'cash') === mode.value;
                  const isThisCashBlocked = mode.value === 'cash' && breakdown.finalAmountDue >= siteConfig.compliance.cashTransactionLimitInr;

                  return (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => handleInputChange('paymentMode', mode.value)}
                      className={`p-2.5 rounded-lg text-xs font-bold transition-all border cursor-pointer text-center flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? isThisCashBlocked
                            ? 'bg-red-950/60 border-red-500 text-red-300'
                            : 'bg-primary/20 border-primary text-primary shadow-sm'
                          : 'bg-surface border-outline-variant/30 text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <span>{mode.label}</span>
                      {isThisCashBlocked && (
                        <span className="text-[9px] text-red-400 uppercase font-mono font-normal">Limit ₹2L</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Metal & Purity Chips */}
          <div className="glass-panel p-4 rounded-xl border border-primary/30 space-y-3 bg-surface-container-high/80">
            <label className="text-xs font-bold text-primary uppercase tracking-wider block">
              1. Metal & Purity Selection
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: '22K Gold (916)', value: '22K', rate: rates.gold_22k, color: 'border-primary' },
                { label: '18K Gold (750)', value: '18K', rate: rates.gold_18k, color: 'border-amber-400' },
                { label: '14K Gold (585)', value: '14K', rate: rates.gold_14k, color: 'border-amber-300' },
                { label: '925 Silver', value: '925Silver', rate: rates.silver_925, color: 'border-slate-400' },
              ].map((p) => {
                const isSelected = bill.metalPurity === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => {
                      handleInputChange('metalPurity', p.value);
                      setCustomRateOverride(null);
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      isSelected
                        ? `${p.color} bg-primary/10 font-bold text-primary shadow-sm`
                        : 'border-outline-variant/30 bg-surface/60 hover:bg-surface text-on-surface-variant'
                    }`}
                  >
                    <span className="text-sm font-extrabold">{p.value}</span>
                    <span className="text-[11px] font-mono opacity-90 mt-0.5">
                      ₹{p.rate.toLocaleString('en-IN')}/g
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Rate Override input */}
            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className="text-on-surface-variant">Active Rate:</span>
              <span className="font-mono font-bold text-primary">₹{activeRatePerGram.toLocaleString('en-IN')}/g</span>
              {customRateOverride !== null && (
                <button
                  type="button"
                  onClick={() => setCustomRateOverride(null)}
                  className="text-[10px] text-amber-400 underline ml-2"
                >
                  Reset to Morning Rate
                </button>
              )}
            </div>
          </div>

          {/* Weights Section: Gross & Stone Deduction */}
          <div className="glass-panel p-4 rounded-xl border border-outline-variant/30 space-y-3 bg-surface-container/60">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-amber-400" />
              2. Weight Details (Grams)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Gross Weight */}
              <div>
                <label className="text-xs text-on-surface font-semibold block mb-1">
                  Gross Weight (g) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder="0.000"
                    value={bill.grossWeight || ''}
                    onChange={(e) => handleInputChange('grossWeight', Number(e.target.value))}
                    className="w-full bg-surface border border-outline-variant/60 focus:border-primary text-on-surface px-3 py-3 rounded-lg text-lg font-bold font-mono focus:outline-none min-h-[50px]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant font-semibold">
                    grams
                  </span>
                </div>
              </div>

              {/* Stone / Pearl Weight Deduction */}
              <div>
                <label className="text-xs text-on-surface-variant block mb-1 flex items-center gap-1">
                  <Gem className="w-3.5 h-3.5 text-blue-400" />
                  Stone/Pearl Deduction (g)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder="0.000"
                    value={bill.stoneWeight || ''}
                    onChange={(e) => handleInputChange('stoneWeight', Number(e.target.value))}
                    className="w-full bg-surface border border-outline-variant/60 focus:border-primary text-on-surface px-3 py-3 rounded-lg text-lg font-bold font-mono focus:outline-none min-h-[50px]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant font-semibold">
                    grams
                  </span>
                </div>
              </div>
            </div>

            {/* Calculated Net Weight Badge */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-container-high border border-primary/30">
              <span className="text-xs font-medium text-on-surface-variant">Net Metal Weight:</span>
              <span className="text-base font-extrabold text-primary font-mono">
                {breakdown.netWeight.toFixed(3)} grams
              </span>
            </div>
          </div>

          {/* Making Charges & Hallmarking */}
          <div className="glass-panel p-4 rounded-xl border border-outline-variant/30 space-y-3 bg-surface-container/60">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-amber-400" />
              3. Making Charges & Hallmarking
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Making Charge Type & Rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-on-surface font-semibold">Making Rate</label>
                  <div className="flex items-center bg-surface border border-outline-variant/40 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => handleInputChange('makingType', 'percent')}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        bill.makingType === 'percent'
                          ? 'bg-primary text-on-primary-fixed'
                          : 'text-on-surface-variant'
                      }`}
                    >
                      % Percent
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('makingType', 'flat')}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        bill.makingType === 'flat'
                          ? 'bg-primary text-on-primary-fixed'
                          : 'text-on-surface-variant'
                      }`}
                    >
                      ₹/gram
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={bill.makingRate || ''}
                    onChange={(e) => handleInputChange('makingRate', Number(e.target.value))}
                    className="w-full bg-surface border border-outline-variant/60 focus:border-primary text-on-surface px-3 py-2.5 rounded-lg text-base font-bold font-mono focus:outline-none min-h-[48px]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant font-bold">
                    {bill.makingType === 'percent' ? '%' : '₹/g'}
                  </span>
                </div>
              </div>

              {/* Hallmarking Presets */}
              <div className="space-y-2">
                <label className="text-xs text-on-surface font-semibold block">BIS Hallmarking</label>
                <div className="flex items-center gap-3 pt-1">
                  <label className="flex items-center gap-2 text-xs text-on-surface cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={bill.includeHallmark}
                      onChange={(e) => handleInputChange('includeHallmark', e.target.checked)}
                      className="w-4 h-4 accent-primary rounded cursor-pointer"
                    />
                    <span>Include Hallmarking (+₹45/pc)</span>
                  </label>
                </div>

                {bill.includeHallmark && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-on-surface-variant">Quantity:</span>
                    <input
                      type="number"
                      min="1"
                      value={bill.hallmarkCount}
                      onChange={(e) => handleInputChange('hallmarkCount', Math.max(1, Number(e.target.value)))}
                      className="w-20 bg-surface border border-outline-variant/50 px-2 py-1 rounded text-xs text-center font-bold font-mono"
                    />
                    <span className="text-xs text-primary font-bold">
                      = +₹{breakdown.hallmarkingCharges}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Old Gold Exchange & GST Toggle */}
          <div className="glass-panel p-4 rounded-xl border border-outline-variant/30 space-y-3 bg-surface-container/60">
            <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-emerald-400" />
              4. Trade-In & Tax Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Old Gold Deduction */}
              <div className="space-y-2">
                <label className="text-xs text-on-surface font-semibold block">Old Gold Trade-In (Weight)</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder="0.000"
                    value={bill.oldGoldWeight || ''}
                    onChange={(e) => handleInputChange('oldGoldWeight', Number(e.target.value))}
                    className="w-full bg-surface border border-outline-variant/60 focus:border-primary text-on-surface px-3 py-2.5 rounded-lg text-base font-bold font-mono focus:outline-none min-h-[48px]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant font-semibold">
                    grams
                  </span>
                </div>

                {bill.oldGoldWeight > 0 && (
                  <div className="text-[11px] text-emerald-400 font-semibold">
                    Trade-In Value: -₹{breakdown.oldGoldDeduction.toLocaleString('en-IN')}
                  </div>
                )}
              </div>

              {/* GST Toggle */}
              <div className="space-y-2">
                <label className="text-xs text-on-surface font-semibold block">GST (3% Standard)</label>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleInputChange('includeGst', !bill.includeGst)}
                    className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all border cursor-pointer w-full text-center ${
                      bill.includeGst
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                        : 'bg-red-950/50 border-red-500/60 text-red-300'
                    }`}
                  >
                    {bill.includeGst ? '✓ GST (3%) Tax Invoice Enabled' : '⚠️ No GST (Unbilled Estimate Quote)'}
                  </button>
                </div>
                {!bill.includeGst && (
                  <div className="mt-2.5 p-2.5 bg-red-950/40 border border-red-500/40 rounded-lg text-xs text-red-200 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-red-300 font-bold uppercase tracking-wider text-[10px]">
                        ESTIMATE ONLY — NOT A TAX INVOICE
                      </strong>
                      <span className="text-[10px] text-red-200/90 leading-tight block mt-0.5">
                        Receipt will be watermarked "ESTIMATE, NOT A TAX INVOICE". Cannot be used as a commercial bill under Indian GST laws.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Computation Breakdown Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-primary/50 bg-gradient-to-b from-surface-container-high via-surface-container to-surface-container-low shadow-xl sticky top-20 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-primary/20 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-primary font-headline-md">
                  Live Bill Breakdown
                </h3>
              </div>
              <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded font-mono">
                {bill.metalPurity}
              </span>
            </div>

            {/* Computation List */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Net Gold Wt ({breakdown.netWeight.toFixed(3)}g × ₹{breakdown.appliedRatePerGram.toLocaleString('en-IN')})</span>
                <span className="font-mono font-semibold text-on-surface">
                  ₹{breakdown.netGoldValue.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center text-on-surface-variant">
                <span>Making Charges ({bill.makingType === 'percent' ? `${bill.makingRate}%` : `₹${bill.makingRate}/g`})</span>
                <span className="font-mono font-semibold text-on-surface">
                  +₹{breakdown.makingCharges.toLocaleString('en-IN')}
                </span>
              </div>

              {breakdown.hallmarkingCharges > 0 && (
                <div className="flex justify-between items-center text-on-surface-variant">
                  <span>BIS Hallmarking ({bill.hallmarkCount} pc)</span>
                  <span className="font-mono font-semibold text-on-surface">
                    +₹{breakdown.hallmarkingCharges.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <div className="border-t border-outline-variant/30 pt-2 flex justify-between items-center font-semibold text-on-surface">
                <span>Gross Subtotal</span>
                <span className="font-mono text-base">₹{breakdown.grossSubtotal.toLocaleString('en-IN')}</span>
              </div>

              {bill.includeGst && (
                <div className="flex justify-between items-center text-amber-300 text-xs">
                  <span>GST ({bill.gstRate}%)</span>
                  <span className="font-mono font-semibold">+₹{breakdown.gstAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {breakdown.oldGoldDeduction > 0 && (
                <div className="flex justify-between items-center text-emerald-400 text-xs">
                  <span>Old Gold Trade-In Deduction</span>
                  <span className="font-mono font-semibold">-₹{breakdown.oldGoldDeduction.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            {/* GRAND TOTAL DUE BOX */}
            <div className="glass-panel p-4 rounded-xl border-2 border-primary bg-primary/10 text-center space-y-1 shadow-inner">
              <span className="text-xs font-bold text-primary uppercase tracking-widest block">
                Final Amount Payable
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-primary gold-text-gradient py-1">
                ₹{breakdown.finalAmountDue.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-on-surface-variant block">
                (Inclusive of all selected charges & taxes)
              </span>
            </div>

            {/* Compliance Alerts & Blocker Banners (CA to confirm) */}
            {isCashBlocked && (
              <div className="p-3 bg-red-950/80 border-2 border-red-500 rounded-xl text-xs text-red-200 space-y-1 animate-pulse">
                <div className="flex items-center gap-1.5 font-bold text-red-300 uppercase tracking-wide text-xs">
                  <Ban className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Cash Payment Blocked (CA to confirm)</span>
                </div>
                <p className="text-[11px] leading-relaxed text-red-200/90">
                  Cash payments of ₹2,00,000 or more per person per day are restricted under Indian tax laws (verify with CA/lawyer). Please switch payment mode to <strong>Bank Transfer (NEFT/RTGS), UPI, or Card</strong>.
                </p>
              </div>
            )}

            {isPanRequired && !isPanSatisfied && (
              <div className="p-3 bg-amber-950/80 border-2 border-amber-500 rounded-xl text-xs text-amber-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-300 uppercase tracking-wide text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>PAN / Form 60 Required (CA to confirm)</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-200/90">
                  Transactions of ₹2,00,000 or more require customer PAN verification or a Form 60 declaration under tax reporting rules (verify with CA/lawyer).
                </p>
              </div>
            )}

            {isOldGoldCashAlert && (
              <div className="p-2.5 bg-blue-950/70 border border-blue-500/40 rounded-xl text-xs text-blue-200">
                <span className="font-semibold block text-[11px]">⚠️ Cash Payout Alert (CA to confirm):</span>
                <span className="text-[10px] text-blue-200/80">
                  Old gold cash payouts exceeding ₹10,000 should be settled via Bank Transfer or Account Payee Cheque.
                </span>
              </div>
            )}

            {/* Action Buttons: WhatsApp & Thermal Print */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                disabled={isCashBlocked}
                onClick={handleWhatsAppShare}
                className={`w-full py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2.5 text-base min-h-[48px] ${
                  isCashBlocked 
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer'
                }`}
              >
                <Share2 className="w-5 h-5" />
                <span>{isCashBlocked ? 'Cash Blocked: Switch Payment Mode' : 'Send WhatsApp Receipt'}</span>
              </button>

              <button
                type="button"
                disabled={isCashBlocked}
                onClick={() => setShowThermalModal(true)}
                className={`w-full py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2.5 text-base min-h-[48px] ${
                  isCashBlocked
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                    : 'gold-bg-gradient font-bold text-on-primary-fixed hover:shadow-primary/20 cursor-pointer'
                }`}
              >
                <Printer className="w-5 h-5" />
                <span>{isCashBlocked ? 'Cash Blocked: Switch Payment Mode' : 'Print Thermal Receipt / PDF'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form 60 Declaration Modal */}
      {showForm60Modal && (
        <Form60Modal
          initialCustomerName={bill.customerName}
          onSave={(data) => {
            setBill((prev) => ({
              ...prev,
              hasForm60: true,
              form60Details: data,
              customerName: prev.customerName || data.declarantName,
            }));
            setShowForm60Modal(false);
          }}
          onClose={() => setShowForm60Modal(false)}
        />
      )}

      {/* Thermal Receipt Modal */}
      {showThermalModal && (
        <ThermalReceiptModal
          bill={bill}
          breakdown={breakdown}
          receiptNumber={receiptNumber}
          onClose={() => setShowThermalModal(false)}
        />
      )}
    </div>
  );
};
