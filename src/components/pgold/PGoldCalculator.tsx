'use client';

import { useState, useEffect } from 'react';
import { PGoldSettings } from '@/types/pgold';

interface PGoldCalculatorProps {
  settings: PGoldSettings;
  price24k: number;
  price22k: number;
  selectedWeight?: number | null;
  onBuyTrigger: (amountInr: number, weightGrams: number, purity: '24K' | '22K') => void;
}

export default function PGoldCalculator({
  settings,
  price24k,
  price22k,
  selectedWeight,
  onBuyTrigger
}: PGoldCalculatorProps) {
  const [purity, setPurity] = useState<'24K' | '22K'>('24K');
  const [activeInputMode, setActiveInputMode] = useState<'amount' | 'grams'>('amount');
  const [amountStr, setAmountStr] = useState<string>('5000');
  const [gramsStr, setGramsStr] = useState<string>('');

  const currentRate = purity === '24K' ? price24k : price22k;

  useEffect(() => {
    if (selectedWeight && selectedWeight > 0) {
      setActiveInputMode('grams');
      setGramsStr(selectedWeight.toString());
      const rawPrice = selectedWeight * currentRate;
      const priceWithGst = Math.round(rawPrice * 1.03);
      setAmountStr(priceWithGst.toString());
    }
  }, [selectedWeight, currentRate]);

  useEffect(() => {
    if (activeInputMode === 'amount') {
      const numAmount = parseFloat(amountStr) || 0;
      if (numAmount > 0 && currentRate > 0) {
        const netAmount = numAmount / 1.03;
        const calcGrams = netAmount / currentRate;
        setGramsStr(calcGrams.toFixed(4));
      } else {
        setGramsStr('');
      }
    } else {
      const numGrams = parseFloat(gramsStr) || 0;
      if (numGrams > 0 && currentRate > 0) {
        const rawAmount = numGrams * currentRate;
        const totalAmountWithGst = Math.round(rawAmount * 1.03);
        setAmountStr(totalAmountWithGst.toString());
      } else {
        setAmountStr('');
      }
    }
  }, [amountStr, gramsStr, activeInputMode, currentRate, purity]);

  const numAmount = parseFloat(amountStr) || 0;
  const numGrams = parseFloat(gramsStr) || 0;

  let validationError = '';
  if (numAmount > 0) {
    if (numAmount < settings.min_purchase_amount) {
      validationError = `Minimum purchase amount is ₹${settings.min_purchase_amount.toLocaleString('en-IN')}`;
    } else if (numAmount > settings.max_purchase_amount) {
      validationError = `Maximum purchase amount is ₹${settings.max_purchase_amount.toLocaleString('en-IN')}`;
    }
  }

  const isValid = numAmount >= settings.min_purchase_amount && numAmount <= settings.max_purchase_amount && numGrams > 0;

  const gstAmount = Math.round(numAmount - (numAmount / 1.03));
  const netGoldValue = numAmount - gstAmount;

  const presetAmounts = [500, 1000, 5000, 10000, 25000, 50000];

  const handlePresetClick = (presetVal: number) => {
    setActiveInputMode('amount');
    setAmountStr(presetVal.toString());
  };

  return (
    <div className="bg-surface-container/90 p-6 sm:p-8 rounded-xs border border-primary/50 shadow-2xl relative overflow-hidden">
      {/* Background Gold Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-6 relative z-10">
        {/* Header & Purity Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/40 pb-5">
          <div>
            <div className="font-label-caps text-xs text-primary tracking-widest font-bold">
              INSTANT CALCULATOR
            </div>
            <h3 className="font-headline-md text-xl sm:text-2xl text-white font-bold">
              Calculate & Buy P-Gold Real-time
            </h3>
          </div>

          {/* Purity Switcher */}
          <div className="flex items-center bg-surface-container-high p-1 rounded-xs border border-outline-variant/50 self-start sm:self-auto">
            <button
              onClick={() => setPurity('24K')}
              className={`px-4 py-1.5 text-xs font-label-caps tracking-wider rounded-xs font-bold transition-all ${
                purity === '24K'
                  ? 'gold-bg-gradient shadow-md'
                  : 'text-amber-100/80 hover:text-white'
              }`}
            >
              24K (999 Pure)
            </button>
            <button
              onClick={() => setPurity('22K')}
              className={`px-4 py-1.5 text-xs font-label-caps tracking-wider rounded-xs font-bold transition-all ${
                purity === '22K'
                  ? 'gold-bg-gradient shadow-md'
                  : 'text-amber-100/80 hover:text-white'
              }`}
            >
              22K (916 Hallmark)
            </button>
          </div>
        </div>

        {/* Dual Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Amount Input */}
          <div className="bg-surface-container-high/90 p-5 rounded-xs border border-outline-variant/40 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-label-caps text-primary tracking-widest font-bold">
                ENTER AMOUNT IN RUPEES (₹)
              </label>
              <span className="text-[10px] text-amber-200/80">Total incl. 3% GST</span>
            </div>

            <div className="relative">
              <span className="absolute left-4 top-3 text-primary text-xl font-bold font-mono">₹</span>
              <input
                type="number"
                min={settings.min_purchase_amount}
                max={settings.max_purchase_amount}
                value={amountStr}
                onChange={(e) => {
                  setActiveInputMode('amount');
                  setAmountStr(e.target.value);
                }}
                placeholder="Enter amount..."
                className="w-full bg-surface-container border border-outline-variant/60 focus:border-primary pl-10 pr-4 py-3 text-xl font-bold text-white rounded-xs focus:outline-none font-mono tracking-wide"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePresetClick(preset)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-xs border transition-colors ${
                    amountStr === preset.toString()
                      ? 'border-primary bg-primary/25 text-primary font-bold'
                      : 'border-outline-variant/40 text-amber-100 hover:border-primary/60'
                  }`}
                >
                  ₹{preset.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Grams Input */}
          <div className="bg-surface-container-high/90 p-5 rounded-xs border border-outline-variant/40 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-label-caps text-primary tracking-widest font-bold">
                OR ENTER GOLD WEIGHT (GRAMS)
              </label>
              <span className="text-[10px] text-amber-200/80">Calculated Gold</span>
            </div>

            <div className="relative">
              <input
                type="number"
                step="0.0001"
                min="0.001"
                value={gramsStr}
                onChange={(e) => {
                  setActiveInputMode('grams');
                  setGramsStr(e.target.value);
                }}
                placeholder="Enter grams..."
                className="w-full bg-surface-container border border-outline-variant/60 focus:border-primary pl-4 pr-12 py-3 text-xl font-bold text-white rounded-xs focus:outline-none font-mono tracking-wide"
              />
              <span className="absolute right-4 top-3.5 text-xs text-primary font-bold font-mono">
                g
              </span>
            </div>

            <div className="text-[11px] text-amber-100/90 pt-1 flex items-center justify-between">
              <span>Locked Gold Rate:</span>
              <strong className="text-primary font-mono">₹{currentRate.toLocaleString('en-IN')}/g</strong>
            </div>
          </div>
        </div>

        {/* Validation Warning */}
        {validationError && (
          <div className="p-3 bg-error-container/40 border border-error/60 rounded-xs text-error text-xs flex items-center gap-2 font-semibold">
            <span className="material-symbols-outlined text-base">warning</span>
            <span>{validationError}</span>
          </div>
        )}

        {/* Live Calculation Summary */}
        {numAmount > 0 && numGrams > 0 && (
          <div className="bg-surface-container-high p-4 rounded-xs border border-outline-variant/40 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-amber-200/80 text-[10px] font-label-caps">GOLD ACCUMULATED</div>
              <div className="font-mono text-base text-primary font-bold mt-0.5">{numGrams.toFixed(4)} grams</div>
            </div>

            <div>
              <div className="text-amber-200/80 text-[10px] font-label-caps">NET GOLD VALUE</div>
              <div className="font-mono text-sm text-white font-semibold mt-0.5">₹{netGoldValue.toLocaleString('en-IN')}</div>
            </div>

            <div>
              <div className="text-amber-200/80 text-[10px] font-label-caps">GST (3% APPLICABLE)</div>
              <div className="font-mono text-sm text-white font-semibold mt-0.5">₹{gstAmount.toLocaleString('en-IN')}</div>
            </div>

            <div>
              <div className="text-amber-200/80 text-[10px] font-label-caps">TOTAL PAYABLE</div>
              <div className="font-mono text-base text-emerald-400 font-bold mt-0.5">₹{numAmount.toLocaleString('en-IN')}</div>
            </div>
          </div>
        )}

        {/* Action Button / Disabled Notice */}
        {!settings.is_enabled ? (
          <div className="p-4 bg-surface-container border border-outline-variant/50 text-center rounded-xs space-y-1">
            <div className="text-sm font-bold text-amber-400 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-base">info</span>
              <span>Online P-Gold Purchases Currently Paused</span>
            </div>
            <p className="text-xs text-amber-100/90">
              Live market rate quotes remain active. Please visit our Ambika Jewels showroom in Jammu or call concierge to complete purchases.
            </p>
          </div>
        ) : (
          <button
            onClick={() => onBuyTrigger(numAmount, numGrams, purity)}
            disabled={!isValid}
            className="w-full gold-bg-gradient py-4 text-sm font-label-caps tracking-[0.25em] font-bold rounded-xs hover:opacity-95 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-lg">shopping_bag</span>
            <span>BUY {purity} P-GOLD NOW</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        )}
      </div>
    </div>
  );
}
