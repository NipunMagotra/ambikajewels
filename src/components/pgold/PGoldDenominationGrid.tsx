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
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="font-label-caps text-xs text-primary tracking-[0.25em] font-bold">
          STANDARD WEIGHT PACKS
        </div>
        <h2 className="font-headline-md text-2xl sm:text-3xl text-on-surface font-bold">
          Explore Popular 24K Gold Denominations
        </h2>
        <p className="text-xs text-on-surface-variant max-w-xl mx-auto">
          Instant locked pricing for standard weights. Click any card to load it into the P-Gold calculator.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {denominations.map((denom) => {
          const rawPrice = denom.weightGrams * price24k;
          const priceWithGst = Math.round(rawPrice * 1.03);

          return (
            <button
              key={denom.label}
              onClick={() => onSelectDenomination(denom.weightGrams)}
              className="glass-panel p-4 rounded-xs border border-outline-variant/30 hover-gold-wire text-left transition-all group flex flex-col justify-between h-full relative overflow-hidden"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xl font-bold gold-text-gradient">
                    {denom.label}
                  </span>
                  <span className="text-[9px] font-label-caps bg-primary/10 text-primary px-1.5 py-0.5 rounded-xs border border-primary/20">
                    24K
                  </span>
                </div>
                <div className="text-[11px] text-on-surface-variant font-semibold">
                  Pure Gold Coin
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-outline-variant/20 space-y-1">
                <div className="text-xs font-bold text-on-surface font-mono">
                  ₹{priceWithGst.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-on-surface-variant/70">
                  Incl. 3% GST
                </div>

                <div className="pt-2 flex items-center gap-1 text-[10px] font-label-caps text-primary group-hover:translate-x-1 transition-transform font-bold">
                  <span>SELECT</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
