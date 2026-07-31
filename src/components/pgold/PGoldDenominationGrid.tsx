'use client';

import { GoldDenomination } from '@/types/pgold';

interface PGoldDenominationGridProps {
  denominations: GoldDenomination[];
  price24k: number;
  onSelectDenomination: (weightGrams: number) => void;
}

export default function PGoldDenominationGrid({
  denominations,
  price24k,
  onSelectDenomination
}: PGoldDenominationGridProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <div className="font-label-caps text-xs text-amber-400 tracking-[0.25em] font-bold">
          STANDARD WEIGHT PACKS
        </div>
        <h2 className="font-headline-md text-2xl sm:text-4xl gold-text-gradient font-bold">
          Explore Popular 24K Gold Denominations
        </h2>
        <p className="text-sm sm:text-base text-amber-50 max-w-xl mx-auto font-normal">
          Instant locked pricing for standard weights. Click any card to load it into the P-Gold calculator.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {denominations.map((denom) => {
          const rawPrice = denom.weightGrams * price24k;
          const priceWithGst = Math.round(rawPrice * 1.03);

          return (
            <button
              key={denom.label}
              onClick={() => onSelectDenomination(denom.weightGrams)}
              className="bg-[#221312] p-5 rounded-md border-2 border-amber-500/40 hover:border-amber-300 hover:shadow-2xl text-left transition-all group flex flex-col justify-between h-full relative overflow-hidden"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-bold gold-text-gradient">
                    {denom.label}
                  </span>
                  <span className="text-xs font-label-caps bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40 font-bold">
                    24K
                  </span>
                </div>
                <div className="text-xs text-amber-100 font-semibold">
                  Pure Gold Coin
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-amber-500/30 space-y-1">
                <div className="text-sm font-bold text-white font-mono">
                  ₹{priceWithGst.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-amber-200 font-medium">
                  Incl. 3% GST
                </div>

                <div className="pt-3 flex items-center gap-1.5 text-xs font-label-caps text-amber-400 group-hover:translate-x-1 transition-transform font-bold">
                  <span>SELECT</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
