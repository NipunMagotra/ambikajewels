'use client';

import { useState } from 'react';
import { PGoldFAQ } from '@/types/pgold';

interface PGoldFAQSectionProps {
  faqs: PGoldFAQ[];
}

export default function PGoldFAQSection({ faqs }: PGoldFAQSectionProps) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="space-y-8 py-6">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="font-label-caps text-xs text-primary tracking-[0.25em] font-bold">
          GOT QUESTIONS?
        </div>
        <h2 className="font-headline-md text-2xl sm:text-3xl text-on-surface font-bold">
          Frequently Asked Questions
        </h2>
        <p className="text-xs text-on-surface-variant">
          Everything you need to know about purchasing, safety, storage, and redeeming P-Gold.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <div
              key={faq.id}
              className="glass-panel rounded-xs border border-outline-variant/30 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleAccordion(faq.id)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-on-surface hover:text-primary transition-colors focus:outline-none"
              >
                <span>{faq.question}</span>
                <span className="material-symbols-outlined text-primary text-xl transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  expand_more
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-on-surface-variant/90 leading-relaxed border-t border-outline-variant/20 animate-in fade-in duration-150">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
