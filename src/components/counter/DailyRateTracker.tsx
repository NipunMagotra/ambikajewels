'use client';

import React, { useState, useEffect } from 'react';
import { DailyRates } from '@/types/counter';
import { derivePurityRatesFrom24k, saveDailyRates } from '@/lib/counterStore';
import {
  Save,
  Zap,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  TrendingUp,
  Globe,
  Info,
} from 'lucide-react';

interface DailyRateTrackerProps {
  rates: DailyRates;
  onRatesUpdated: (newRates: DailyRates) => void;
}

export const DailyRateTracker: React.FC<DailyRateTrackerProps> = ({
  rates,
  onRatesUpdated,
}) => {
  const [formState, setFormState] = useState<DailyRates>(rates);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showRefModal, setShowRefModal] = useState(false);

  // Sync form state when prop rates update
  useEffect(() => {
    setFormState(rates);
  }, [rates]);

  const handleChange = (key: keyof DailyRates, value: string) => {
    const numVal = Math.max(0, Number(value) || 0);
    setFormState((prev) => {
      const next = { ...prev, [key]: numVal };
      // Auto-calculate purity rates if user changes 24K rate
      if (key === 'gold_24k') {
        const derived = derivePurityRatesFrom24k(numVal);
        return {
          ...next,
          gold_22k: derived.gold_22k,
          gold_18k: derived.gold_18k,
          gold_14k: derived.gold_14k,
        };
      }
      return next;
    });
  };

  const handleAutoDerive = () => {
    const derived = derivePurityRatesFrom24k(formState.gold_24k);
    setFormState((prev) => ({
      ...prev,
      gold_22k: derived.gold_22k,
      gold_18k: derived.gold_18k,
      gold_14k: derived.gold_14k,
    }));
  };

  const handleDelta24k = (delta: number) => {
    const new24k = Math.max(0, formState.gold_24k + delta);
    const derived = derivePurityRatesFrom24k(new24k);
    setFormState((prev) => ({
      ...prev,
      gold_24k: new24k,
      gold_22k: derived.gold_22k,
      gold_18k: derived.gold_18k,
      gold_14k: derived.gold_14k,
    }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    try {
      const saved = await saveDailyRates(formState);
      onRatesUpdated(saved);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save rates:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-5 sm:p-6 rounded-xl border border-primary/30 relative overflow-hidden bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container-low">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-primary/20 text-primary border border-primary/40 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Morning Rate Controller
              </span>
              <span className="text-xs text-on-surface-variant font-medium">5-Second Update</span>
            </div>
            <h2 className="text-2xl sm:text-3xl text-primary font-headline-md font-bold">
              Jammu Daily Gold & Silver Rates
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              Set today's verified local Jammu bullion rates (per gram). All counter billing calculations will instantly utilize these live rates.
            </p>
          </div>

          {/* Verification Helper Trigger */}
          <button
            onClick={() => setShowRefModal(true)}
            className="flex items-center gap-2 bg-surface/80 hover:bg-surface border border-outline-variant/50 hover:border-primary/50 text-on-surface px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-sm shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <Globe className="w-4 h-4 text-primary" />
            <span>Check Jammu Market Ref</span>
          </button>
        </div>
      </div>

      {/* Main Rate Input Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Quick Derivation & Delta Controls */}
        <div className="glass-panel p-4 rounded-xl border border-outline-variant/30 bg-surface-container/60 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Quick Rate Presets
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAutoDerive}
                className="text-xs font-semibold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Auto-Derive (22K/18K/14K from 24K)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs text-on-surface-variant shrink-0">Adjust 24K:</span>
            <button
              type="button"
              onClick={() => handleDelta24k(-500)}
              className="text-xs bg-surface border border-outline-variant/40 hover:border-primary/50 px-2.5 py-1 rounded text-on-surface font-mono shrink-0 cursor-pointer"
            >
              -₹500
            </button>
            <button
              type="button"
              onClick={() => handleDelta24k(-100)}
              className="text-xs bg-surface border border-outline-variant/40 hover:border-primary/50 px-2.5 py-1 rounded text-on-surface font-mono shrink-0 cursor-pointer"
            >
              -₹100
            </button>
            <button
              type="button"
              onClick={() => handleDelta24k(100)}
              className="text-xs bg-surface border border-outline-variant/40 hover:border-primary/50 px-2.5 py-1 rounded text-on-surface font-mono shrink-0 cursor-pointer"
            >
              +₹100
            </button>
            <button
              type="button"
              onClick={() => handleDelta24k(500)}
              className="text-xs bg-surface border border-outline-variant/40 hover:border-primary/50 px-2.5 py-1 rounded text-on-surface font-mono shrink-0 cursor-pointer"
            >
              +₹500
            </button>
          </div>
        </div>

        {/* Gold Rates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 24K Gold */}
          <div className="glass-panel p-4 rounded-xl border border-primary/40 bg-surface-container-high/80 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-400">
                24K Gold (999 Pure)
              </label>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 font-semibold px-2 py-0.5 rounded">
                Base Rate
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-lg">
                ₹
              </span>
              <input
                type="number"
                step="1"
                min="0"
                value={formState.gold_24k || ''}
                onChange={(e) => handleChange('gold_24k', e.target.value)}
                className="w-full bg-surface border border-outline-variant/60 focus:border-primary text-on-surface pl-8 pr-12 py-3 rounded-lg text-xl font-bold font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[52px]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant font-semibold">
                /gram
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant">10g = ₹{((formState.gold_24k || 0) * 10).toLocaleString('en-IN')}</p>
          </div>

          {/* 22K Gold */}
          <div className="glass-panel p-4 rounded-xl border border-primary/50 bg-surface-container-high/90 space-y-2 gold-border shadow-md">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-primary">
                22K Gold (916 Hallmark)
              </label>
              <span className="text-[10px] bg-primary/20 text-primary font-semibold px-2 py-0.5 rounded">
                91.6% Pure
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-bold text-lg">
                ₹
              </span>
              <input
                type="number"
                step="1"
                min="0"
                value={formState.gold_22k || ''}
                onChange={(e) => handleChange('gold_22k', e.target.value)}
                className="w-full bg-surface border border-primary/60 focus:border-primary text-primary pl-8 pr-12 py-3 rounded-lg text-xl font-bold font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[52px]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary/80 font-semibold">
                /gram
              </span>
            </div>
            <p className="text-[11px] text-primary/80 font-medium">10g = ₹{((formState.gold_22k || 0) * 10).toLocaleString('en-IN')}</p>
          </div>

          {/* 18K Gold */}
          <div className="glass-panel p-4 rounded-xl border border-outline-variant/40 bg-surface-container-high/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-200">
                18K Gold (750 Hallmark)
              </label>
              <span className="text-[10px] bg-white/10 text-amber-200 font-semibold px-2 py-0.5 rounded">
                75.0% Pure
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-lg">
                ₹
              </span>
              <input
                type="number"
                step="1"
                min="0"
                value={formState.gold_18k || ''}
                onChange={(e) => handleChange('gold_18k', e.target.value)}
                className="w-full bg-surface border border-outline-variant/60 focus:border-primary text-on-surface pl-8 pr-12 py-3 rounded-lg text-xl font-bold font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[52px]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant font-semibold">
                /gram
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant">10g = ₹{((formState.gold_18k || 0) * 10).toLocaleString('en-IN')}</p>
          </div>

          {/* 14K Gold */}
          <div className="glass-panel p-4 rounded-xl border border-outline-variant/40 bg-surface-container-high/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-100">
                14K Gold (585 Hallmark)
              </label>
              <span className="text-[10px] bg-white/10 text-amber-100 font-semibold px-2 py-0.5 rounded">
                58.5% Pure
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-lg">
                ₹
              </span>
              <input
                type="number"
                step="1"
                min="0"
                value={formState.gold_14k || ''}
                onChange={(e) => handleChange('gold_14k', e.target.value)}
                className="w-full bg-surface border border-outline-variant/60 focus:border-primary text-on-surface pl-8 pr-12 py-3 rounded-lg text-xl font-bold font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[52px]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant font-semibold">
                /gram
              </span>
            </div>
            <p className="text-[11px] text-on-surface-variant">10g = ₹{((formState.gold_14k || 0) * 10).toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Silver Rates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pure Silver 999 */}
          <div className="glass-panel p-4 rounded-xl border border-slate-700 bg-surface-container-high/70 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Pure Silver (999 Fine)
              </label>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded border border-slate-600">
                99.9% Pure
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
                ₹
              </span>
              <input
                type="number"
                step="1"
                min="0"
                value={formState.silver_999 || ''}
                onChange={(e) => handleChange('silver_999', e.target.value)}
                className="w-full bg-surface border border-slate-700 focus:border-slate-400 text-slate-100 pl-8 pr-12 py-3 rounded-lg text-xl font-bold font-mono focus:outline-none min-h-[52px]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">
                /gram
              </span>
            </div>
            <p className="text-[11px] text-slate-400">1kg (1000g) = ₹{((formState.silver_999 || 0) * 1000).toLocaleString('en-IN')}</p>
          </div>

          {/* 925 Sterling Silver */}
          <div className="glass-panel p-4 rounded-xl border border-slate-700 bg-surface-container-high/70 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                925 Sterling Silver
              </label>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded border border-slate-600">
                92.5% Pure
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">
                ₹
              </span>
              <input
                type="number"
                step="1"
                min="0"
                value={formState.silver_925 || ''}
                onChange={(e) => handleChange('silver_925', e.target.value)}
                className="w-full bg-surface border border-slate-700 focus:border-slate-400 text-slate-100 pl-8 pr-12 py-3 rounded-lg text-xl font-bold font-mono focus:outline-none min-h-[52px]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">
                /gram
              </span>
            </div>
            <p className="text-[11px] text-slate-400">1kg (1000g) = ₹{((formState.silver_925 || 0) * 1000).toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          {saveSuccess ? (
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold bg-emerald-950/60 border border-emerald-500/40 px-4 py-2.5 rounded-lg w-full sm:w-auto">
              <CheckCircle2 className="w-5 h-5" />
              <span>Today's Morning Rates Saved & Synced!</span>
            </div>
          ) : (
            <div className="text-xs text-on-surface-variant">
              Rates automatically save to cloud and store memory.
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="gold-bg-gradient font-bold text-on-primary-fixed px-8 py-3.5 rounded-xl shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 text-base w-full sm:w-auto min-h-[48px] cursor-pointer"
          >
            <Save className={`w-5 h-5 ${isSaving ? 'animate-spin' : ''}`} />
            <span>{isSaving ? 'Saving Rates...' : 'Save & Publish Morning Rates'}</span>
          </button>
        </div>
      </form>

      {/* One-Click Reference Scraper Modal */}
      {showRefModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-2xl border border-primary/40 max-w-xl w-full space-y-5 bg-surface-container-high">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-primary font-headline-md">
                  Jammu Market Opening Reference Helper
                </h3>
              </div>
              <button
                onClick={() => setShowRefModal(false)}
                className="text-on-surface-variant hover:text-on-surface text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-on-surface-variant">
              Use these direct links to verify today's opening bullion rates in Jammu & Kashmir. Once checked, you can quickly set today's rate above.
            </p>

            <div className="space-y-3">
              <a
                href="https://www.google.com/search?q=gold+rate+today+in+jammu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-surface border border-outline-variant/40 hover:border-primary/50 transition-all group"
              >
                <div>
                  <h4 className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                    Google Search: Today's Jammu Gold Rate
                  </h4>
                  <p className="text-[11px] text-on-surface-variant">
                    Live web reference for 24K and 22K gold rates in Jammu
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-primary shrink-0" />
              </a>

              <a
                href="https://www.bankbazaar.com/gold-rate-jammu.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-surface border border-outline-variant/40 hover:border-primary/50 transition-all group"
              >
                <div>
                  <h4 className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                    BankBazaar Jammu Daily Gold Chart
                  </h4>
                  <p className="text-[11px] text-on-surface-variant">
                    Official daily Jammu city gold & silver updates
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-primary shrink-0" />
              </a>

              <a
                href="https://www.goodreturns.in/gold-rates/jammu.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-surface border border-outline-variant/40 hover:border-primary/50 transition-all group"
              >
                <div>
                  <h4 className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                    GoodReturns Jammu Gold & Silver Board
                  </h4>
                  <p className="text-[11px] text-on-surface-variant">
                    Regional jeweler board reference index
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-primary shrink-0" />
              </a>
            </div>

            <div className="bg-primary/10 border border-primary/30 p-3 rounded-xl flex items-start gap-2.5 text-xs text-on-surface-variant">
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p>
                <strong className="text-primary font-semibold">Goldsmith Tip:</strong> Jammu local jeweler board rates often carry a regional premium of +₹50 to +₹150 per gram over base MCX rates to cover freight and hallmark refining.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowRefModal(false)}
                className="bg-surface-container border border-outline-variant/50 hover:border-primary/50 text-on-surface text-xs font-semibold px-5 py-2.5 rounded-lg cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
