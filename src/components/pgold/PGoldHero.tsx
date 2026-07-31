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
    <div className="relative overflow-hidden py-16 sm:py-20 border-b border-outline-variant/30 bg-surface-container">
      {/* Background Mandala Pattern */}
      <div className="absolute inset-0 mandala-bg-pattern pointer-events-none z-0" />

      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/40 shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-label-caps tracking-[0.25em] text-primary font-bold">
              100% 24K 999 HALLMARK DIGITAL GOLD
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-headline-md text-3xl sm:text-4xl lg:text-5xl tracking-wide gold-text-gradient font-bold leading-tight">
            {settings.page_title || 'Ambika P-Gold — Pure 24K Digital Gold Accumulation'}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-amber-100/90 max-w-2xl mx-auto leading-relaxed font-light">
            {settings.page_subtitle || 'Start building your digital gold wealth from as little as ₹100. Backed by 100% 24K 999 Hallmark Gold with physical delivery guarantee by Ambika Jewels Jammu.'}
          </p>

          {/* Live Price Ticker Card */}
          <div className="pt-4">
            <div className="inline-grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-5 bg-surface-container/95 rounded-xs border border-primary/50 shadow-2xl max-w-xl mx-auto text-left w-full">
              {/* 24K Rate */}
              <div className="bg-surface-container-high/90 p-4 rounded-xs border border-primary/30 relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-label-caps text-primary tracking-widest font-bold">
                    LIVE 24K (999 PURE)
                  </span>
                  <span className="bg-secondary-container text-on-secondary-container text-[9px] font-bold px-2 py-0.5 rounded-xs">
                    FINE GOLD
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-headline-md text-2xl sm:text-3xl text-primary font-bold font-mono">
                    ₹{price24k.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-amber-200/80 font-semibold">/ gram</span>
                </div>
                <div className="text-[10px] text-amber-200/70 mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-emerald-400">schedule</span>
                  <span>Updated Live • Excl. 3% GST</span>
                </div>
              </div>

              {/* 22K Rate */}
              <div className="bg-surface-container-high/90 p-4 rounded-xs border border-outline-variant/40 relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-label-caps text-amber-200 tracking-widest font-bold">
                    LIVE 22K (916 HALLMARK)
                  </span>
                  <span className="bg-surface-variant text-amber-100 text-[9px] font-bold px-2 py-0.5 rounded-xs">
                    JEWELRY RATE
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-headline-md text-2xl sm:text-3xl text-white font-bold font-mono">
                    ₹{price22k.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-amber-200/80 font-semibold">/ gram</span>
                </div>
                <div className="text-[10px] text-amber-200/70 mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-primary">verified</span>
                  <span>Jammu Market Rate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Highlights */}
          <div className="pt-4 flex flex-wrap justify-center gap-6 sm:gap-10 text-xs font-label-caps text-amber-100/90 font-bold">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">verified</span>
              <span>100% HALLMARK GUARANTEE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">lock</span>
              <span>INSURED VAULT STORAGE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base">store</span>
              <span>REDEEM AT JAMMU SHOWROOM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
