'use client';

import React, { useState, useEffect } from 'react';
import { DailyRates } from '@/types/counter';
import { getDailyRates, DEFAULT_RATES } from '@/lib/counterStore';
import { RateTickerHeader } from '@/components/counter/RateTickerHeader';
import { DailyRateTracker } from '@/components/counter/DailyRateTracker';
import { BillingCalculator } from '@/components/counter/BillingCalculator';
import { SavingsGoalTracker } from '@/components/counter/SavingsGoalTracker';
import { Flame, Calculator, PiggyBank, Sparkles, ShieldCheck } from 'lucide-react';

export default function AdminCounterDashboardPage() {
  const [rates, setRates] = useState<DailyRates>(DEFAULT_RATES);
  const [activeTab, setActiveTab] = useState<'rates' | 'calculator' | 'goals'>('calculator');
  const [isLoadingRates, setIsLoadingRates] = useState(true);

  useEffect(() => {
    loadLatestRates();
  }, []);

  const loadLatestRates = async () => {
    setIsLoadingRates(true);
    try {
      const latest = await getDailyRates();
      setRates(latest);
    } catch (err) {
      console.error('Error fetching rates:', err);
    } finally {
      setIsLoadingRates(false);
    }
  };

  const handleRatesUpdated = (newRates: DailyRates) => {
    setRates(newRates);
  };

  return (
    <div className="min-h-screen bg-background text-on-background pb-16 pt-20">
      {/* Top Jammu Rate Ticker */}
      <RateTickerHeader
        rates={rates}
        onOpenRateController={() => setActiveTab('rates')}
        isLoading={isLoadingRates}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-center">
          <div className="glass-panel p-1.5 rounded-2xl border border-primary/30 bg-surface-container-high/90 flex items-center gap-1 sm:gap-2 shadow-lg max-w-2xl w-full">
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 sm:px-5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer min-h-[46px] ${
                activeTab === 'calculator'
                  ? 'gold-bg-gradient text-on-primary-fixed shadow-md'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface/50'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>Goldsmith Billing</span>
            </button>

            <button
              onClick={() => setActiveTab('rates')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 sm:px-5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer min-h-[46px] ${
                activeTab === 'rates'
                  ? 'gold-bg-gradient text-on-primary-fixed shadow-md'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface/50'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Morning Rates</span>
            </button>

            <button
              onClick={() => setActiveTab('goals')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 sm:px-5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer min-h-[46px] ${
                activeTab === 'goals'
                  ? 'gold-bg-gradient text-on-primary-fixed shadow-md'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface/50'
              }`}
            >
              <PiggyBank className="w-4 h-4" />
              <span>Gold Savings Goals</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="pt-2">
          {activeTab === 'rates' && (
            <DailyRateTracker rates={rates} onRatesUpdated={handleRatesUpdated} />
          )}

          {activeTab === 'calculator' && <BillingCalculator rates={rates} />}

          {activeTab === 'goals' && <SavingsGoalTracker rates={rates} />}
        </div>
      </main>
    </div>
  );
}
