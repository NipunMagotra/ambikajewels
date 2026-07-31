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
      <div className="glass-panel p-6 sm:p-8 rounded-xs border border-outline-variant/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">gavel</span>
            <h3 className="font-headline-md text-base sm:text-lg text-on-surface font-bold">
              Terms & Conditions — Ambika P-Gold
            </h3>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-label-caps text-primary hover:underline flex items-center gap-1 font-bold"
          >
            <span>{expanded ? 'COLLAPSE TERMS' : 'READ FULL TERMS'}</span>
            <span className="material-symbols-outlined text-sm">
              {expanded ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>

        <div className={`space-y-2 text-xs text-on-surface-variant/80 font-body-md leading-relaxed ${
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
