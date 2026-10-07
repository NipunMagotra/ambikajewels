'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface RateData {
  gold_24k: number;
  gold_22k: number;
  gold_18k: number;
  silver_925: number;
}

export default function LiveBullionTicker() {
  const [rates, setRates] = useState<RateData>({
    gold_24k: 7850,
    gold_22k: 7190,
    gold_18k: 5890,
    silver_925: 98,
  });
  const [lastUpdated, setLastUpdated] = useState<string>('Today');

  useEffect(() => {
    async function loadRates() {
      try {
        const res = await fetch('/api/rates/lock');
        const data = await res.json();
        if (data && data.rates) {
          setRates({
            gold_24k: data.rates.gold_24k || 7850,
            gold_22k: data.rates.gold_22k || 7190,
            gold_18k: data.rates.gold_18k || 5890,
            silver_925: data.rates.silver_925 || 98,
          });
          setLastUpdated('Updated Live');
        }
      } catch {
        // Fallback to initial indicative showroom rates
      }
    }
    loadRates();
  }, []);

  return (
    <section className="py-6 px-4 sm:px-margin-mobile lg:px-margin-desktop -mt-4 mb-4 relative z-20">
      <div className="container mx-auto bg-[var(--bg-card)] border border-[var(--border-card)] shadow-[var(--card-shadow)] p-4 sm:p-6 rounded-[2px]">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
            <span className="font-sans text-[10px] sm:text-xs text-[var(--accent-gold)] tracking-[0.25em] uppercase font-semibold">
              TODAY&apos;S JAMMU BULLION RATES &bull; PER GRAM
            </span>
          </div>

          <div className="flex items-center gap-3 text-[10px] font-sans text-[var(--text-secondary)]">
            <span className="hidden sm:inline">100% BIS Hallmarked Purity (HSN 7113)</span>
            <span className="bg-[var(--bg-surface)] px-2 py-0.5 rounded-[1px] border border-[var(--border-subtle)] font-medium text-[var(--accent-gold)] uppercase tracking-wider">
              {lastUpdated}
            </span>
          </div>
        </div>

        {/* 4 Rate Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* 24K Gold */}
          <div className="p-3 sm:p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[2px] text-center sm:text-left transition-colors hover:border-[var(--accent-gold)]/60">
            <span className="font-sans text-[9px] text-[var(--text-secondary)] tracking-widest uppercase block mb-1">
              24K PURE GOLD (999)
            </span>
            <div className="font-serif text-lg sm:text-2xl text-[var(--text-primary)] font-normal">
              ₹{rates.gold_24k.toLocaleString('en-IN')}
              <span className="font-sans text-[10px] text-[var(--text-secondary)] ml-1">/g</span>
            </div>
            <span className="font-sans text-[8.5px] text-[var(--text-secondary)]/80 block mt-1">
              Standard Bullion Bar
            </span>
          </div>

          {/* 22K Gold (Featured) */}
          <div className="p-3 sm:p-4 bg-[var(--bg-main)] border border-[var(--accent-gold)]/60 rounded-[2px] text-center sm:text-left shadow-xs relative">
            <span className="absolute top-2 right-2 hidden sm:inline-block px-1.5 py-0.2 bg-[var(--accent-gold)] text-white text-[7.5px] font-sans font-bold tracking-widest uppercase rounded-[1px]">
              POPULAR
            </span>
            <span className="font-sans text-[9px] text-[var(--accent-gold)] tracking-widest uppercase font-semibold block mb-1">
              22K BIS HALLMARKED (916)
            </span>
            <div className="font-serif text-lg sm:text-2xl text-[var(--accent-gold)] font-medium">
              ₹{rates.gold_22k.toLocaleString('en-IN')}
              <span className="font-sans text-[10px] text-[var(--text-secondary)] ml-1">/g</span>
            </div>
            <span className="font-sans text-[8.5px] text-[var(--text-secondary)] block mt-1">
              Bridal &amp; Dogra Heirlooms
            </span>
          </div>

          {/* 18K Gold */}
          <div className="p-3 sm:p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[2px] text-center sm:text-left transition-colors hover:border-[var(--accent-gold)]/60">
            <span className="font-sans text-[9px] text-[var(--text-secondary)] tracking-widest uppercase block mb-1">
              18K DIAMOND GOLD (750)
            </span>
            <div className="font-serif text-lg sm:text-2xl text-[var(--text-primary)] font-normal">
              ₹{rates.gold_18k.toLocaleString('en-IN')}
              <span className="font-sans text-[10px] text-[var(--text-secondary)] ml-1">/g</span>
            </div>
            <span className="font-sans text-[8.5px] text-[var(--text-secondary)]/80 block mt-1">
              Solitaires &amp; Fine Jewellery
            </span>
          </div>

          {/* 925 Silver */}
          <div className="p-3 sm:p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[2px] text-center sm:text-left transition-colors hover:border-[var(--accent-gold)]/60">
            <span className="font-sans text-[9px] text-[var(--text-secondary)] tracking-widest uppercase block mb-1">
              925 STERLING SILVER
            </span>
            <div className="font-serif text-lg sm:text-2xl text-[var(--text-primary)] font-normal">
              ₹{rates.silver_925.toLocaleString('en-IN')}
              <span className="font-sans text-[10px] text-[var(--text-secondary)] ml-1">/g</span>
            </div>
            <span className="font-sans text-[8.5px] text-[var(--text-secondary)]/80 block mt-1">
              Payals &amp; Silver Articles
            </span>
          </div>
        </div>

        {/* Footer Guarantee Links */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4 pt-3 border-t border-[var(--border-subtle)] text-xs font-sans">
          <p className="text-[11px] text-[var(--text-secondary)] text-center sm:text-left font-light">
            Bring old gold to our Jammu showroom for instant digital purity appraisal and exchange against new collections.
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <Link 
              href="/services" 
              className="text-[10.5px] text-[var(--accent-gold)] hover:underline font-semibold tracking-wider uppercase flex items-center gap-1"
            >
              <span>GOLD EXCHANGE TERMS</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
