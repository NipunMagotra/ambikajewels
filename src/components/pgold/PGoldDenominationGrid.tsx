'use client';

interface LiveGoldSilverRatesGridProps {
  price24k: number;
  price22k: number;
  priceSilver999: number;
  priceSilver925: number;
}

export default function PGoldDenominationGrid({
  price24k,
  price22k,
  priceSilver999,
  priceSilver925
}: LiveGoldSilverRatesGridProps) {
  const g24 = price24k || 8500;
  const g22 = price22k || Math.round(g24 * 0.917);
  const g18 = Math.round(g24 * 0.75);
  const g14 = Math.round(g24 * 0.585);

  const s999 = priceSilver999 || 95;
  const s925 = priceSilver925 || 88;

  const rateCards = [
    { label: '24K Fine Gold (999)', category: 'Bullion / Bars', rateGram: g24, rate10g: g24 * 10, color: 'border-amber-500/50', badge: 'PURE GOLD' },
    { label: '22K Hallmark Gold (916)', category: 'Traditional Jewelry', rateGram: g22, rate10g: g22 * 10, color: 'border-amber-500/40', badge: '916 HALLMARK' },
    { label: '18K Hallmark Gold (750)', category: 'Diamond Settings', rateGram: g18, rate10g: g18 * 10, color: 'border-amber-500/30', badge: '750 HALLMARK' },
    { label: '14K Hallmark Gold (585)', category: 'Everyday Wear', rateGram: g14, rate10g: g14 * 10, color: 'border-amber-500/30', badge: '585 HALLMARK' },
    { label: '999 Fine Silver', category: 'Coins & Pure Silver', rateGram: s999, rate10g: s999 * 10, rateKg: s999 * 1000, color: 'border-slate-400/50', badge: '999 SILVER' },
    { label: '925 Sterling Silver', category: 'Sterling Jewelry & Payal', rateGram: s925, rate10g: s925 * 10, rateKg: s925 * 1000, color: 'border-slate-400/40', badge: '925 STERLING' }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <div className="font-label-caps text-xs text-amber-400 tracking-[0.25em] font-bold">
          INDIAN BULLION & JEWELRY BENCHMARK
        </div>
        <h2 className="font-headline-md text-2xl sm:text-4xl gold-text-gradient font-bold">
          Live Gold & Silver Market Rates
        </h2>
        <p className="text-sm sm:text-base text-amber-50 max-w-xl mx-auto font-normal">
          Real-time per gram, 10g, and kg rates across all gold purities and sterling silver categories.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {rateCards.map((card) => (
          <div
            key={card.label}
            className={`bg-[#221312] p-6 rounded-md border-2 ${card.color} space-y-3 shadow-xl hover:shadow-2xl transition-all`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-label-caps bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded border border-amber-500/40 font-bold">
                {card.badge}
              </span>
              <span className="text-xs text-amber-200 font-medium">
                {card.category}
              </span>
            </div>

            <h3 className="font-headline-md text-lg font-bold text-white">
              {card.label}
            </h3>

            <div className="pt-2 border-t border-amber-500/30 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-amber-200 font-medium">Rate per Gram:</span>
                <span className="font-mono text-xl font-bold text-amber-300">
                  ₹{card.rateGram.toLocaleString('en-IN')}/g
                </span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-xs text-amber-200 font-medium">Rate per 10 Grams:</span>
                <span className="font-mono text-base font-bold text-white">
                  ₹{card.rate10g.toLocaleString('en-IN')}
                </span>
              </div>

              {card.rateKg && (
                <div className="flex justify-between items-baseline pt-1 border-t border-amber-500/20">
                  <span className="text-xs text-amber-200 font-medium">Rate per Kilogram (1kg):</span>
                  <span className="font-mono text-base font-bold text-emerald-400">
                    ₹{card.rateKg.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
