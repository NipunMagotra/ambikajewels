'use client';

interface PGoldHeroProps {
  settings?: any;
  price24k: number;
  price22k: number;
  priceSilver999?: number;
  lastUpdated: string;
}

export default function PGoldHero({ price24k, price22k, priceSilver999 }: PGoldHeroProps) {
  const g24 = price24k || 8500;
  const g22 = price22k || Math.round(g24 * 0.917);
  const s999 = priceSilver999 || 95;

  return (
    <div className="relative overflow-hidden py-16 sm:py-24 border-b border-amber-500/30 bg-[#160b0a]">
      {/* Background Mandala Pattern */}
      <div className="absolute inset-0 mandala-bg-pattern pointer-events-none z-0 opacity-10" />

      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-400/50 shadow-lg backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-label-caps tracking-[0.25em] text-amber-300 font-bold">
              LIVE GOLD & SILVER MARKET RATES
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-headline-md text-3xl sm:text-4xl lg:text-5xl tracking-wide gold-text-gradient font-bold leading-tight">
            Ambika Jewels — Live Rates & Jewelry Calculator
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-amber-50 max-w-3xl mx-auto leading-relaxed font-normal">
            Check real-time benchmark rates for 24K, 22K, 18K Gold and 999 Fine Silver. Calculate exact custom jewelry estimates and exchange old gold at 100% value at our Jammu showroom.
          </p>

          {/* Live Price Ticker Cards */}
          <div className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-[#221312] rounded-md border-2 border-amber-500/40 shadow-2xl max-w-3xl mx-auto text-left w-full">
              {/* 24K Gold Rate */}
              <div className="bg-[#2e1917] p-4 rounded-md border border-amber-500/50 relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-label-caps text-amber-400 tracking-widest font-bold">
                    24K PURE GOLD
                  </span>
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold px-2 py-0.5 rounded">
                    999 PURE
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-2xl sm:text-3xl text-amber-300 font-bold">
                    ₹{g24.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-amber-100 font-medium">/ g</span>
                </div>
                <div className="text-[11px] text-amber-200 mt-1 font-medium">
                  ₹{(g24 * 10).toLocaleString('en-IN')} per 10g
                </div>
              </div>

              {/* 22K Gold Rate */}
              <div className="bg-[#2e1917] p-4 rounded-md border border-amber-500/30 relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-label-caps text-amber-200 tracking-widest font-bold">
                    22K JEWELRY GOLD
                  </span>
                  <span className="bg-amber-950 text-amber-300 border border-amber-500/40 text-[9px] font-bold px-2 py-0.5 rounded">
                    916 HALLMARK
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-2xl sm:text-3xl text-white font-bold">
                    ₹{g22.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-amber-100 font-medium">/ g</span>
                </div>
                <div className="text-[11px] text-amber-200 mt-1 font-medium">
                  ₹{(g22 * 10).toLocaleString('en-IN')} per 10g
                </div>
              </div>

              {/* 999 Silver Rate */}
              <div className="bg-[#2e1917] p-4 rounded-md border border-slate-400/40 relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-label-caps text-slate-200 tracking-widest font-bold">
                    999 FINE SILVER
                  </span>
                  <span className="bg-slate-800 text-slate-200 text-[9px] font-bold px-2 py-0.5 rounded">
                    PURE SILVER
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-mono text-2xl sm:text-3xl text-slate-200 font-bold">
                    ₹{s999.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-300 font-medium">/ g</span>
                </div>
                <div className="text-[11px] text-slate-300 mt-1 font-medium">
                  ₹{(s999 * 1000).toLocaleString('en-IN')} per 1kg
                </div>
              </div>
            </div>
          </div>

          {/* Quick Contact Buttons */}
          <div className="pt-6 flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/919086098457?text=Namaste%20Ambika%20Jewels!%20I%20want%20to%20inquire%20about%20live%20gold/silver%20rates%20and%20jewelry%20customization."
              target="_blank"
              rel="noopener noreferrer"
              className="gold-bg-gradient py-3.5 px-8 text-xs sm:text-sm font-label-caps tracking-[0.2em] font-extrabold text-black rounded-md hover:opacity-95 transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">chat_bubble</span>
              <span>WHATSAPP CONCIERGE</span>
            </a>

            <a
              href="tel:+919682589725"
              className="bg-[#221312] border-2 border-amber-500/50 py-3.5 px-8 text-xs sm:text-sm font-label-caps tracking-[0.2em] font-bold text-amber-300 rounded-md hover:border-amber-300 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl">call</span>
              <span>CALL SHOWROOM (+91 9682589725)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
