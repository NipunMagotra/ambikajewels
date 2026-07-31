'use client';

import { useState } from 'react';

interface JewelryPriceCalculatorProps {
  price24k: number;
  price22k: number;
  priceSilver999: number;
  priceSilver925: number;
}

export default function JewelryPriceCalculator({
  price24k,
  price22k,
  priceSilver999,
  priceSilver925
}: JewelryPriceCalculatorProps) {
  const [metalType, setMetalType] = useState<'gold_24k' | 'gold_22k' | 'gold_18k' | 'gold_14k' | 'silver_999' | 'silver_925'>('gold_22k');
  const [weightGrams, setWeightGrams] = useState<string>('10');
  const [makingChargesPercent, setMakingChargesPercent] = useState<string>('10');

  // Calculate rate per gram based on selection
  let baseRatePerGram = price22k || 7800;
  let metalLabel = '22K Gold (916 Hallmark)';

  switch (metalType) {
    case 'gold_24k':
      baseRatePerGram = price24k || 8500;
      metalLabel = '24K Gold (999 Pure)';
      break;
    case 'gold_22k':
      baseRatePerGram = price22k || Math.round((price24k || 8500) * 0.917);
      metalLabel = '22K Gold (916 Hallmark)';
      break;
    case 'gold_18k':
      baseRatePerGram = Math.round((price24k || 8500) * 0.75);
      metalLabel = '18K Gold (750 Hallmark)';
      break;
    case 'gold_14k':
      baseRatePerGram = Math.round((price24k || 8500) * 0.585);
      metalLabel = '14K Gold (585 Hallmark)';
      break;
    case 'silver_999':
      baseRatePerGram = priceSilver999 || 95;
      metalLabel = '999 Fine Pure Silver';
      break;
    case 'silver_925':
      baseRatePerGram = priceSilver925 || 88;
      metalLabel = '925 Sterling Silver';
      break;
  }

  const numWeight = parseFloat(weightGrams) || 0;
  const numMakingPercent = parseFloat(makingChargesPercent) || 0;

  const rawMetalCost = numWeight * baseRatePerGram;
  const makingChargesAmount = Math.round(rawMetalCost * (numMakingPercent / 100));
  const subtotalBeforeTax = rawMetalCost + makingChargesAmount;
  const gstAmount = Math.round(subtotalBeforeTax * 0.03); // 3% GST on jewelry
  const totalEstimatedPrice = subtotalBeforeTax + gstAmount;

  // Stepper handlers
  const adjustWeight = (delta: number) => {
    const nextVal = Math.max(0.5, Math.round((numWeight + delta) * 10) / 10);
    setWeightGrams(nextVal.toString());
  };

  const adjustMaking = (delta: number) => {
    const nextVal = Math.max(0, Math.min(50, numMakingPercent + delta));
    setMakingChargesPercent(nextVal.toString());
  };

  const weightPresets = [2, 5, 10, 20, 50, 100];
  const makingPresets = [5, 8, 10, 12, 15, 20];

  const whatsappMessage = `Namaste Ambika Jewels! I calculated a price estimate on your website for ${numWeight}g of ${metalLabel}. Estimated Total: ₹${totalEstimatedPrice.toLocaleString('en-IN')}. Please assist me with ordering/customization.`;

  return (
    <div className="bg-[#221312] p-6 sm:p-10 rounded-md border-2 border-amber-500/50 shadow-2xl space-y-8 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-6 relative z-10">
        {/* Header */}
        <div className="border-b border-amber-500/30 pb-5">
          <div className="font-label-caps text-xs text-amber-400 tracking-widest font-bold">
            TOUCH & SLIDE CALCULATOR
          </div>
          <h3 className="font-headline-md text-2xl sm:text-3xl text-white font-bold">
            Calculate Gold & Silver Jewelry Price
          </h3>
          <p className="text-xs sm:text-sm text-amber-100 mt-1 font-normal">
            Use touch sliders, +/- stepper buttons, or type numbers to calculate exact showroom estimate.
          </p>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Metal Purity Selector */}
          <div className="bg-[#2e1917] p-5 rounded-md border border-amber-500/40 space-y-3">
            <label className="block text-xs font-label-caps text-amber-300 font-bold">
              1. SELECT METAL & PURITY
            </label>
            <select
              value={metalType}
              onChange={(e) => setMetalType(e.target.value as any)}
              className="w-full bg-[#160b0a] border-2 border-amber-500/50 focus:border-amber-300 px-4 py-3.5 text-sm font-bold text-white rounded focus:outline-none cursor-pointer"
            >
              <optgroup label="Gold Purity Options">
                <option value="gold_24k">24K Gold (999 Pure) — ₹{(price24k || 8500).toLocaleString('en-IN')}/g</option>
                <option value="gold_22k">22K Gold (916 Hallmark) — ₹{(price22k || 7800).toLocaleString('en-IN')}/g</option>
                <option value="gold_18k">18K Gold (750 Hallmark) — ₹{Math.round((price24k || 8500) * 0.75).toLocaleString('en-IN')}/g</option>
                <option value="gold_14k">14K Gold (585 Hallmark) — ₹{Math.round((price24k || 8500) * 0.585).toLocaleString('en-IN')}/g</option>
              </optgroup>
              <optgroup label="Silver Purity Options">
                <option value="silver_999">999 Fine Pure Silver — ₹{(priceSilver999 || 95).toLocaleString('en-IN')}/g</option>
                <option value="silver_925">925 Sterling Silver — ₹{(priceSilver925 || 88).toLocaleString('en-IN')}/g</option>
              </optgroup>
            </select>
            <div className="text-xs text-amber-200 font-medium pt-1">
              Selected Rate: <strong className="text-amber-300 font-mono">₹{baseRatePerGram.toLocaleString('en-IN')}/g</strong>
            </div>
          </div>

          {/* 2. Weight Input + Touch Slider & Steppers */}
          <div className="bg-[#2e1917] p-5 rounded-md border border-amber-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-label-caps text-amber-300 font-bold">
                2. JEWELRY WEIGHT (GRAMS)
              </label>
              <span className="text-xs text-amber-200 font-mono font-bold">{numWeight}g</span>
            </div>

            {/* Stepper Input Row */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustWeight(-1)}
                className="w-12 h-12 bg-[#160b0a] border-2 border-amber-500/50 hover:border-amber-300 text-amber-300 hover:text-white rounded-md text-xl font-bold flex items-center justify-center shrink-0 active:scale-95 transition-all shadow"
                aria-label="Decrease weight by 1g"
              >
                &minus;
              </button>

              <div className="relative flex-1">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={weightGrams}
                  onChange={(e) => setWeightGrams(e.target.value)}
                  placeholder="Weight..."
                  className="w-full bg-[#160b0a] border-2 border-amber-500/50 focus:border-amber-300 px-3 py-2.5 text-center text-lg font-bold text-white rounded focus:outline-none font-mono"
                />
                <span className="absolute right-3 top-3 text-xs text-amber-300 font-bold font-mono">
                  g
                </span>
              </div>

              <button
                type="button"
                onClick={() => adjustWeight(1)}
                className="w-12 h-12 bg-[#160b0a] border-2 border-amber-500/50 hover:border-amber-300 text-amber-300 hover:text-white rounded-md text-xl font-bold flex items-center justify-center shrink-0 active:scale-95 transition-all shadow"
                aria-label="Increase weight by 1g"
              >
                &#43;
              </button>
            </div>

            {/* Touch Slider */}
            <div className="space-y-1 pt-1">
              <input
                type="range"
                min="0.5"
                max="100"
                step="0.5"
                value={numWeight || 0.5}
                onChange={(e) => setWeightGrams(e.target.value)}
                className="w-full h-2 bg-[#160b0a] accent-amber-400 rounded-lg cursor-pointer border border-amber-500/30"
              />
              <div className="flex justify-between text-[10px] font-mono text-amber-200">
                <span>0.5g</span>
                <span>50g</span>
                <span>100g</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {weightPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setWeightGrams(preset.toString())}
                  className={`px-2 py-1 text-[11px] font-mono font-bold rounded border transition-colors ${
                    numWeight === preset
                      ? 'border-amber-300 bg-amber-500/30 text-amber-300'
                      : 'border-amber-500/30 bg-[#160b0a] text-amber-100 hover:border-amber-300'
                  }`}
                >
                  {preset}g
                </button>
              ))}
            </div>
          </div>

          {/* 3. Making Charges Input + Touch Slider & Steppers */}
          <div className="bg-[#2e1917] p-5 rounded-md border border-amber-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-label-caps text-amber-300 font-bold">
                3. MAKING CHARGES (%)
              </label>
              <span className="text-xs text-amber-200 font-mono font-bold">{numMakingPercent}%</span>
            </div>

            {/* Stepper Input Row */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => adjustMaking(-1)}
                className="w-12 h-12 bg-[#160b0a] border-2 border-amber-500/50 hover:border-amber-300 text-amber-300 hover:text-white rounded-md text-xl font-bold flex items-center justify-center shrink-0 active:scale-95 transition-all shadow"
                aria-label="Decrease making charges by 1%"
              >
                &minus;
              </button>

              <div className="relative flex-1">
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="50"
                  value={makingChargesPercent}
                  onChange={(e) => setMakingChargesPercent(e.target.value)}
                  placeholder="Making %..."
                  className="w-full bg-[#160b0a] border-2 border-amber-500/50 focus:border-amber-300 px-3 py-2.5 text-center text-lg font-bold text-white rounded focus:outline-none font-mono"
                />
                <span className="absolute right-3 top-3 text-xs text-amber-300 font-bold font-mono">
                  %
                </span>
              </div>

              <button
                type="button"
                onClick={() => adjustMaking(1)}
                className="w-12 h-12 bg-[#160b0a] border-2 border-amber-500/50 hover:border-amber-300 text-amber-300 hover:text-white rounded-md text-xl font-bold flex items-center justify-center shrink-0 active:scale-95 transition-all shadow"
                aria-label="Increase making charges by 1%"
              >
                &#43;
              </button>
            </div>

            {/* Touch Slider */}
            <div className="space-y-1 pt-1">
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={numMakingPercent || 0}
                onChange={(e) => setMakingChargesPercent(e.target.value)}
                className="w-full h-2 bg-[#160b0a] accent-amber-400 rounded-lg cursor-pointer border border-amber-500/30"
              />
              <div className="flex justify-between text-[10px] font-mono text-amber-200">
                <span>0%</span>
                <span>15%</span>
                <span>30%</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {makingPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setMakingChargesPercent(preset.toString())}
                  className={`px-2 py-1 text-[11px] font-mono font-bold rounded border transition-colors ${
                    numMakingPercent === preset
                      ? 'border-amber-300 bg-amber-500/30 text-amber-300'
                      : 'border-amber-500/30 bg-[#160b0a] text-amber-100 hover:border-amber-300'
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculation Result Summary Box */}
        {numWeight > 0 && (
          <div className="bg-[#160b0a] p-6 rounded-md border-2 border-amber-500/50 grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
            <div>
              <div className="text-amber-300 text-xs font-label-caps font-bold">NET METAL VALUE</div>
              <div className="font-mono text-base sm:text-lg text-white font-bold mt-1">₹{rawMetalCost.toLocaleString('en-IN')}</div>
            </div>

            <div>
              <div className="text-amber-200 text-xs font-label-caps font-bold">EST. MAKING CHARGES</div>
              <div className="font-mono text-base sm:text-lg text-white font-bold mt-1">₹{makingChargesAmount.toLocaleString('en-IN')}</div>
            </div>

            <div>
              <div className="text-amber-200 text-xs font-label-caps font-bold">GOVT GST (3%)</div>
              <div className="font-mono text-base sm:text-lg text-white font-bold mt-1">₹{gstAmount.toLocaleString('en-IN')}</div>
            </div>

            <div>
              <div className="text-emerald-400 text-xs font-label-caps font-bold">TOTAL ESTIMATED PRICE</div>
              <div className="font-mono text-xl sm:text-2xl text-emerald-400 font-extrabold mt-1">₹{totalEstimatedPrice.toLocaleString('en-IN')}</div>
            </div>
          </div>
        )}

        {/* Contact Showroom CTA Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <a
            href={`https://wa.me/919086098457?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="gold-bg-gradient py-4 text-xs sm:text-sm font-label-caps tracking-[0.2em] font-extrabold text-black rounded-md hover:opacity-95 transition-all shadow-xl flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">chat_bubble</span>
            <span>INQUIRE / ORDER ON WHATSAPP</span>
          </a>

          <a
            href="tel:+919682589725"
            className="bg-[#2e1917] border-2 border-amber-500/50 py-4 text-xs sm:text-sm font-label-caps tracking-[0.2em] font-bold text-amber-300 rounded-md hover:border-amber-300 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">call</span>
            <span>CALL JAMMU SHOWROOM</span>
          </a>
        </div>
      </div>
    </div>
  );
}
