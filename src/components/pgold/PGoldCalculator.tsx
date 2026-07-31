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
    <div className="bg-[#221312] p-6 sm:p-10 rounded-md border-2 border-amber-500/50 shadow-2xl relative overflow-hidden">
      {/* Background Gold Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-8 relative z-10">
        {/* Header & Purity Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-500/30 pb-6">
          <div>
            <div className="font-label-caps text-xs text-amber-400 tracking-widest font-bold">
              INSTANT CALCULATOR
            </div>
            <h3 className="font-headline-md text-2xl sm:text-3xl text-white font-bold">
              Calculate & Buy P-Gold Real-time
            </h3>
          </div>

          {/* Purity Switcher */}
          <div className="flex items-center bg-[#160b0a] p-1.5 rounded-md border border-amber-500/40 self-start sm:self-auto">
            <button
              onClick={() => setPurity('24K')}
              className={`px-5 py-2 text-xs font-label-caps tracking-wider rounded font-bold transition-all ${
                purity === '24K'
                  ? 'gold-bg-gradient text-black shadow-lg font-extrabold'
                  : 'text-amber-100 hover:text-white'
              }`}
            >
              24K (999 Pure)
            </button>
            <button
              onClick={() => setPurity('22K')}
              className={`px-5 py-2 text-xs font-label-caps tracking-wider rounded font-bold transition-all ${
                purity === '22K'
                  ? 'gold-bg-gradient text-black shadow-lg font-extrabold'
                  : 'text-amber-100 hover:text-white'
              }`}
            >
              22K (916 Hallmark)
            </button>
          </div>
        </div>

        {/* Dual Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Amount Input */}
          <div className="bg-[#2e1917] p-6 rounded-md border border-amber-500/40 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-label-caps text-amber-300 tracking-widest font-bold">
                ENTER AMOUNT IN RUPEES (₹)
              </label>
              <span className="text-xs text-amber-100 font-medium">Total incl. 3% GST</span>
            </div>

            <div className="relative">
              <span className="absolute left-4 top-3.5 text-amber-300 text-2xl font-bold font-mono">₹</span>
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
                className="w-full bg-[#160b0a] border-2 border-amber-500/50 focus:border-amber-300 pl-11 pr-4 py-3.5 text-2xl font-bold text-white rounded-md focus:outline-none font-mono tracking-wide"
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePresetClick(preset)}
                  className={`px-3 py-1.5 text-xs font-mono font-bold rounded border-2 transition-colors ${
                    amountStr === preset.toString()
                      ? 'border-amber-300 bg-amber-500/30 text-amber-300'
                      : 'border-amber-500/30 bg-[#160b0a] text-amber-100 hover:border-amber-300'
                  }`}
                >
                  ₹{preset.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Grams Input */}
          <div className="bg-[#2e1917] p-6 rounded-md border border-amber-500/40 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-label-caps text-amber-300 tracking-widest font-bold">
                OR ENTER GOLD WEIGHT (GRAMS)
              </label>
              <span className="text-xs text-amber-100 font-medium">Calculated Gold</span>
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
                className="w-full bg-[#160b0a] border-2 border-amber-500/50 focus:border-amber-300 pl-4 pr-12 py-3.5 text-2xl font-bold text-white rounded-md focus:outline-none font-mono tracking-wide"
              />
              <span className="absolute right-4 top-4 text-sm text-amber-300 font-bold font-mono">
                g
              </span>
            </div>

            <div className="text-xs text-amber-100 pt-1 flex items-center justify-between font-medium">
              <span>Locked Gold Rate:</span>
              <strong className="text-amber-300 font-mono text-sm">₹{currentRate.toLocaleString('en-IN')}/g</strong>
            </div>
          </div>
        </div>

        {/* Validation Warning */}
        {validationError && (
          <div className="p-4 bg-red-950/80 border-2 border-red-500/80 rounded-md text-red-200 text-xs sm:text-sm flex items-center gap-3 font-semibold">
            <span className="material-symbols-outlined text-lg text-red-400">warning</span>
            <span>{validationError}</span>
          </div>
        )}

        {/* Live Calculation Summary */}
        {numAmount > 0 && numGrams > 0 && (
          <div className="bg-[#160b0a] p-5 rounded-md border-2 border-amber-500/40 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
            <div>
              <div className="text-amber-300 text-xs font-label-caps font-bold">GOLD ACCUMULATED</div>
              <div className="font-mono text-lg text-amber-300 font-bold mt-1">{numGrams.toFixed(4)} grams</div>
            </div>

            <div>
              <div className="text-amber-200 text-xs font-label-caps font-bold">NET GOLD VALUE</div>
              <div className="font-mono text-base text-white font-bold mt-1">₹{netGoldValue.toLocaleString('en-IN')}</div>
            </div>

            <div>
              <div className="text-amber-200 text-xs font-label-caps font-bold">GST (3% APPLICABLE)</div>
              <div className="font-mono text-base text-white font-bold mt-1">₹{gstAmount.toLocaleString('en-IN')}</div>
            </div>

            <div>
              <div className="text-emerald-400 text-xs font-label-caps font-bold">TOTAL PAYABLE</div>
              <div className="font-mono text-lg text-emerald-400 font-bold mt-1">₹{numAmount.toLocaleString('en-IN')}</div>
            </div>
          </div>
        )}

        {/* Action Button / Disabled Notice */}
        {!settings.is_enabled ? (
          <div className="p-5 bg-[#2e1917] border-2 border-amber-500/50 text-center rounded-md space-y-2">
            <div className="text-base font-bold text-amber-300 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">info</span>
              <span>Online P-Gold Purchases Currently Paused</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-100 font-medium max-w-xl mx-auto">
              Live market rate quotes remain active. Please visit our Ambika Jewels showroom in Jammu or call concierge to complete purchases.
            </p>
          </div>
        ) : (
          <button
            onClick={() => onBuyTrigger(numAmount, numGrams, purity)}
            disabled={!isValid}
            className="w-full gold-bg-gradient py-4 text-base font-label-caps tracking-[0.25em] font-extrabold text-black rounded-md hover:opacity-95 transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-xl">shopping_bag</span>
            <span>BUY {purity} P-GOLD NOW</span>
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
        )}
      </div>
    </div>
  );
}
