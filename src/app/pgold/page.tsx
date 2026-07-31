'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import MandalaDivider from '@/components/ui/MandalaDivider';
import PGoldHero from '@/components/pgold/PGoldHero';
import LivePriceChart from '@/components/pgold/LivePriceChart';
import JewelryPriceCalculator from '@/components/pgold/JewelryPriceCalculator';
import PGoldDenominationGrid from '@/components/pgold/PGoldDenominationGrid';
import PGoldHowItWorks from '@/components/pgold/PGoldHowItWorks';
import PGoldFAQSection from '@/components/pgold/PGoldFAQSection';

export default function LiveRatesPage() {
  const [price24k, setPrice24k] = useState<number>(8500);
  const [price22k, setPrice22k] = useState<number>(7800);
  const [priceSilver999, setPriceSilver999] = useState<number>(95);
  const [priceSilver925, setPriceSilver925] = useState<number>(88);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    fetchLiveRates();
  }, []);

  const fetchLiveRates = async () => {
    try {
      const [goldRes, silverRes] = await Promise.all([
        fetch('/api/pgold/price'),
        fetch('/api/silver/price')
      ]);

      const goldData = await goldRes.json();
      const silverData = await silverRes.json();

      if (goldData.success) {
        setPrice24k(goldData.data.price_per_gram_24k);
        setPrice22k(goldData.data.price_per_gram_22k);
        setLastUpdated(goldData.data.timestamp);
      }

      if (silverData.success) {
        setPriceSilver999(silverData.data.price_per_gram_999);
        setPriceSilver925(silverData.data.price_per_gram_925);
      }
    } catch (err) {
      console.warn('Using default live rates:', err);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 bg-background text-on-background">
        {/* 1. Hero Section */}
        <PGoldHero
          price24k={price24k}
          price22k={price22k}
          priceSilver999={priceSilver999}
          lastUpdated={lastUpdated}
        />

        <MandalaDivider />

        <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop py-12 space-y-16">
          {/* 2. Live Interactive Gold & Silver Price Graph */}
          <section id="price-graph">
            <LivePriceChart
              current24k={price24k}
              current22k={price22k}
              currentSilver={priceSilver999}
            />
          </section>

          {/* 3. Jewelry Price Calculator */}
          <section id="jewelry-calculator">
            <JewelryPriceCalculator
              price24k={price24k}
              price22k={price22k}
              priceSilver999={priceSilver999}
              priceSilver925={priceSilver925}
            />
          </section>

          {/* 4. Complete Gold & Silver Rates Grid */}
          <section>
            <PGoldDenominationGrid
              price24k={price24k}
              price22k={price22k}
              priceSilver999={priceSilver999}
              priceSilver925={priceSilver925}
            />
          </section>

          {/* 5. Gold Exchange & Showroom Services */}
          <section>
            <PGoldHowItWorks />
          </section>

          {/* 6. Showroom FAQs */}
          <section>
            <PGoldFAQSection />
          </section>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
