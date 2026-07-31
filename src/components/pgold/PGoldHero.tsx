'use client';

import { PGoldSettings } from '@/types/pgold';

interface PGoldHeroProps {
  settings: PGoldSettings;
  price24k: number;
  price22k: number;
  lastUpdated: string;
}

export default function PGoldHero({ settings, price24k, price22k, lastUpdated }: PGoldHeroProps) {
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
              100% 24K 999 HALLMARK DIGITAL GOLD
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-headline-md text-3xl sm:text-4xl lg:text-5xl tracking-wide gold-text-gradient font-bold leading-tight">
            {settings.page_title || 'Ambika P-Gold — Pure 24K Digital Gold Accumulation'}
          </h1>

          {/* Subtitle - Increased size & crisp white color */}
          <p className="text-base sm:text-lg text-amber-50 max-w-3xl mx-auto leading-relaxed font-normal">
            {settings.page_subtitle || 'Start building your digital gold wealth from as little as ₹100. Backed by 100% 24K 999 Hallmark Gold with physical delivery guarantee by Ambika Jewels Jammu.'}
          </p>

          {/* Live Price Ticker Card */}
          <div className="pt-4">
            <div className="inline-grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 sm:p-6 bg-[#221312] rounded-md border-2 border-amber-500/40 shadow-2xl max-w-xl mx-auto text-left w-full">
              {/* 24K Rate */}
              <div className="bg-[#2e1917] p-5 rounded-md border border-amber-500/50 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-label-caps text-amber-400 tracking-widest font-bold">
                    LIVE 24K (999 PURE)
                  </span>
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-2.5 py-1 rounded">
                    FINE GOLD
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-3xl sm:text-4xl text-amber-300 font-bold">
                    ₹{price24k.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-amber-100 font-medium">/ gram</span>
                </div>
                <div className="text-xs text-amber-200 mt-2 flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-sm text-emerald-400">schedule</span>
                  <span>Updated Live • Excl. 3% GST</span>
                </div>
              </div>

              {/* 22K Rate */}
              <div className="bg-[#2e1917] p-5 rounded-md border border-amber-500/30 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-label-caps text-amber-200 tracking-widest font-bold">
                    LIVE 22K (916 HALLMARK)
                  </span>
                  <span className="bg-amber-950 text-amber-300 border border-amber-500/40 text-xs font-bold px-2.5 py-1 rounded">
                    JEWELRY RATE
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-3xl sm:text-4xl text-white font-bold">
                    ₹{price22k.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-amber-100 font-medium">/ gram</span>
                </div>
                <div className="text-xs text-amber-200 mt-2 flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-sm text-amber-400">verified</span>
                  <span>Jammu Market Rate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Highlights - Bright crisp text */}
          <div className="pt-6 flex flex-wrap justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-label-caps text-amber-100 font-bold">
            <div className="flex items-center gap-2 bg-[#221312] px-4 py-2 rounded border border-amber-500/30">
              <span className="material-symbols-outlined text-amber-400 text-lg">verified</span>
              <span>100% HALLMARK GUARANTEE</span>
            </div>
            <div className="flex items-center gap-2 bg-[#221312] px-4 py-2 rounded border border-amber-500/30">
              <span className="material-symbols-outlined text-amber-400 text-lg">lock</span>
              <span>INSURED VAULT STORAGE</span>
            </div>
            <div className="flex items-center gap-2 bg-[#221312] px-4 py-2 rounded border border-amber-500/30">
              <span className="material-symbols-outlined text-amber-400 text-lg">store</span>
              <span>REDEEM AT JAMMU SHOWROOM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
