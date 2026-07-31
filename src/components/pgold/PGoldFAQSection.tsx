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
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="font-label-caps text-xs text-amber-400 tracking-[0.25em] font-bold">
          GOT QUESTIONS?
        </div>
        <h2 className="font-headline-md text-2xl sm:text-4xl gold-text-gradient font-bold">
          Frequently Asked Questions
        </h2>
        <p className="text-sm sm:text-base text-amber-50 font-normal">
          Everything you need to know about purchasing, safety, storage, and redeeming P-Gold.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;

          return (
            <div
              key={faq.id}
              className="bg-[#221312] rounded-md border-2 border-amber-500/40 overflow-hidden transition-all shadow-lg"
            >
              <button
                onClick={() => toggleAccordion(faq.id)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg text-white hover:text-amber-300 transition-colors focus:outline-none"
              >
                <span>{faq.question}</span>
                <span className="material-symbols-outlined text-amber-400 text-2xl transition-transform duration-200" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  expand_more
                </span>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 text-sm sm:text-base text-amber-50 leading-relaxed border-t border-amber-500/30 animate-in fade-in duration-150 font-normal">
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
