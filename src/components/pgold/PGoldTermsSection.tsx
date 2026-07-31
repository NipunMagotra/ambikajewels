'use client';

import { useState } from 'react';

interface PGoldTermsSectionProps {
  termsText: string;
}

export default function PGoldTermsSection({ termsText }: PGoldTermsSectionProps) {
  const [expanded, setExpanded] = useState(false);

  if (!termsText) return null;

  const lines = termsText.split('\n').filter(Boolean);

  return (
    <div className="space-y-4 py-4">
      <div className="bg-[#221312] p-6 sm:p-8 rounded-md border-2 border-amber-500/40 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-amber-400 text-2xl">gavel</span>
            <h3 className="font-headline-md text-lg sm:text-xl text-white font-bold">
              Terms & Conditions — Ambika P-Gold
            </h3>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs sm:text-sm font-label-caps text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold bg-[#160b0a] px-3 py-1.5 rounded border border-amber-500/30"
          >
            <span>{expanded ? 'COLLAPSE TERMS' : 'READ FULL TERMS'}</span>
            <span className="material-symbols-outlined text-base">
              {expanded ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>

        <div className={`space-y-3 text-sm sm:text-base text-amber-50 font-normal leading-relaxed ${
          expanded ? '' : 'line-clamp-3'
        }`}>
          {lines.map((line, idx) => (
            <p key={idx}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
