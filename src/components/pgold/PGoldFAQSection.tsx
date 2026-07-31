'use client';

import { useState } from 'react';

export default function PGoldFAQSection({ faqs }: { faqs?: any[] }) {
  const defaultFaqs = [
    {
      id: 'faq-1',
      question: 'How are live gold and silver rates updated on this website?',
      answer: 'Our rates are synchronized in real-time with Indian bullion benchmark prices via GoldAPI.io. They represent pure 24K fine gold, 22K 916 hallmark gold, 18K gold, 14K gold, and 999/925 silver per gram.'
    },
    {
      id: 'faq-2',
      question: 'How does the 100% Gold Exchange Program work?',
      answer: 'You can bring any old gold jewelry to our Ambika Jewels showroom in Lower Roop Nagar, Jammu. We test the purity transparently and give you 100% of the current market gold rate towards brand-new jewelry.'
    },
    {
      id: 'faq-3',
      question: 'Can I get a custom 3D CAD design before ordering?',
      answer: 'Yes! Send any photo, Instagram link, or sketch to our WhatsApp (+91 9086098457). Our master karigars will create a 3D digital preview within 2 days for your review before crafting.'
    },
    {
      id: 'faq-4',
      question: 'What purities are available for custom jewelry?',
      answer: 'We craft jewelry in 22K (916), 18K (750), 14K (585), and 9K (375) Hallmarked Gold, as well as Certified Diamonds (GIA & IGI) and 925 Sterling Silver.'
    },
    {
      id: 'faq-5',
      question: 'Do you offer live video shopping for out-of-station customers?',
      answer: 'Yes! We arrange live WhatsApp video consultations so NRI and out-of-station customers can view showroom collections, try on designs virtually, and discuss custom orders with store owner Shivani Anand.'
    }
  ];

  const displayFaqs = faqs && faqs.length > 0 ? faqs : defaultFaqs;
  const [openId, setOpenId] = useState<string | null>(displayFaqs[0]?.id || null);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-8 py-6">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="font-label-caps text-xs text-amber-400 tracking-[0.25em] font-bold">
          COMMON QUESTIONS
        </div>
        <h2 className="font-headline-md text-2xl sm:text-4xl gold-text-gradient font-bold">
          Showroom & Rates FAQ
        </h2>
        <p className="text-sm sm:text-base text-amber-50 font-normal">
          Answers regarding gold rates, purity certification, 3D CAD customization, and gold exchange.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {displayFaqs.map((faq) => {
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
