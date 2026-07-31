'use client';

import { useState, useEffect } from 'react';
import PGoldHero from '@/components/pgold/PGoldHero';
import PGoldDenominationGrid from '@/components/pgold/PGoldDenominationGrid';
import PGoldCalculator from '@/components/pgold/PGoldCalculator';
import PGoldHowItWorks from '@/components/pgold/PGoldHowItWorks';
import PGoldFAQSection from '@/components/pgold/PGoldFAQSection';
import PGoldTermsSection from '@/components/pgold/PGoldTermsSection';
import PGoldBuyModal from '@/components/pgold/PGoldBuyModal';
import { PGoldSettings, PGoldFAQ, GoldDenomination } from '@/types/pgold';
import { DEFAULT_PGOLD_SETTINGS, DEFAULT_PGOLD_FAQS } from '@/lib/pgoldStore';

export default function PGoldPage() {
  const [settings, setSettings] = useState<PGoldSettings>(DEFAULT_PGOLD_SETTINGS);
  const [faqs, setFaqs] = useState<PGoldFAQ[]>(DEFAULT_PGOLD_FAQS);
  const [price24k, setPrice24k] = useState<number>(8500);
  const [price22k, setPrice22k] = useState<number>(7800);
  const [denominations, setDenominations] = useState<GoldDenomination[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const [loading, setLoading] = useState(true);
  const [selectedWeight, setSelectedWeight] = useState<number | null>(null);

  // Buy Modal State
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [checkoutParams, setCheckoutParams] = useState<{
    amountInr: number;
    weightGrams: number;
    purity: '24K' | '22K';
  }>({
    amountInr: 5000,
    weightGrams: 0.5543,
    purity: '24K'
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [priceRes, settingsRes, faqsRes] = await Promise.all([
        fetch('/api/pgold/price'),
        fetch('/api/pgold/settings'),
        fetch('/api/pgold/faqs')
      ]);

      const priceData = await priceRes.json();
      const settingsData = await settingsRes.json();
      const faqsData = await faqsRes.json();

      if (priceData.success) {
        setPrice24k(priceData.data.price_per_gram_24k);
        setPrice22k(priceData.data.price_per_gram_22k);
        setDenominations(priceData.data.denominations || []);
        setLastUpdated(priceData.data.timestamp);
      }

      if (settingsData.success) {
        setSettings(settingsData.data);
      }

      if (faqsData.success && faqsData.data?.length > 0) {
        setFaqs(faqsData.data);
      }
    } catch (err) {
      console.warn('Failed to load live P-Gold data, using defaults:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDenomination = (weightGrams: number) => {
    setSelectedWeight(weightGrams);
    // Smooth scroll to calculator section
    const calcElem = document.getElementById('pgold-calculator');
    if (calcElem) {
      calcElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBuyTrigger = (amountInr: number, weightGrams: number, purity: '24K' | '22K') => {
    setCheckoutParams({ amountInr, weightGrams, purity });
    setIsBuyModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-background text-on-background">
      {/* 1. Hero Section */}
      <PGoldHero
        settings={settings}
        price24k={price24k}
        price22k={price22k}
        lastUpdated={lastUpdated}
      />

      <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop py-12 space-y-16">
        {/* 2. Interactive Calculator Section */}
        <section id="pgold-calculator">
          <PGoldCalculator
            settings={settings}
            price24k={price24k}
            price22k={price22k}
            selectedWeight={selectedWeight}
            onBuyTrigger={handleBuyTrigger}
          />
        </section>

        {/* 3. Denomination Grid */}
        {denominations.length > 0 && (
          <section>
            <PGoldDenominationGrid
              denominations={denominations}
              price24k={price24k}
              onSelectDenomination={handleSelectDenomination}
            />
          </section>
        )}

        {/* 4. How P-Gold Works & Benefits */}
        <section>
          <PGoldHowItWorks />
        </section>

        {/* 5. Frequently Asked Questions */}
        <section>
          <PGoldFAQSection faqs={faqs} />
        </section>

        {/* 6. Terms & Conditions */}
        <section>
          <PGoldTermsSection termsText={settings.terms_and_conditions} />
        </section>
      </div>

      {/* 7. Purchase Modal */}
      <PGoldBuyModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        amountInr={checkoutParams.amountInr}
        weightGrams={checkoutParams.weightGrams}
        purity={checkoutParams.purity}
        goldRate={checkoutParams.purity === '22K' ? price22k : price24k}
      />
    </main>
  );
}
