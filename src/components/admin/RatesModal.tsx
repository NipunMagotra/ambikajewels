'use client';

import React, { useState, useEffect } from 'react';
import type { DailyRates } from '@/types/counter';
import { Coins, Zap, AlertTriangle, Check, RefreshCw, X, HelpCircle } from 'lucide-react';

interface RatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRates: DailyRates;
  onSaveRates: (newRates: Partial<DailyRates>, confirmLargeChange?: boolean) => Promise<{ success: boolean; requiresConfirmation?: boolean; error?: string }>;
  onRecalculateCatalog: () => Promise<void>;
  isRecalculating: boolean;
}

export function RatesModal({
  isOpen,
  onClose,
  currentRates,
  onSaveRates,
  onRecalculateCatalog,
  isRecalculating
}: RatesModalProps) {
  const [gold24k, setGold24k] = useState(String(currentRates.gold_24k || 8950));
  const [gold22k, setGold22k] = useState(String(currentRates.gold_22k || 8250));
  const [gold18k, setGold18k] = useState(String(currentRates.gold_18k || 6750));
  const [gold14k, setGold14k] = useState(String(currentRates.gold_14k || 5250));
  const [silver999, setSilver999] = useState(String(currentRates.silver_999 || 102));
  const [silver925, setSilver925] = useState(String(currentRates.silver_925 || 94.5));

  const [confirmLargeChange, setConfirmLargeChange] = useState(false);
  const [requiresConfirmation, setRequiresConfirmation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setGold24k(String(currentRates.gold_24k || 8950));
      setGold22k(String(currentRates.gold_22k || 8250));
      setGold18k(String(currentRates.gold_18k || 6750));
      setGold14k(String(currentRates.gold_14k || 5250));
      setSilver999(String(currentRates.silver_999 || 102));
      setSilver925(String(currentRates.silver_925 || 94.5));
      setConfirmLargeChange(false);
      setRequiresConfirmation(false);
      setErrorMsg(null);
      setStatusMsg(null);
    }
  }, [isOpen, currentRates]);

  if (!isOpen) return null;

  const handle24kChange = (val: string) => {
    setGold24k(val);
    const n = parseFloat(val);
    if (!isNaN(n) && n > 0) {
      // Auto-derive standard purities based on market proportions
      setGold22k(String(Math.round(n * (22 / 24))));
      setGold18k(String(Math.round(n * 0.75)));
      setGold14k(String(Math.round(n * 0.585)));
    }
  };

  const handleSilver999Change = (val: string) => {
    setSilver999(val);
    const n = parseFloat(val);
    if (!isNaN(n) && n > 0) {
      setSilver925(String(Math.round(n * 0.925 * 10) / 10));
    }
  };

  const validateInputs = () => {
    const g24 = parseFloat(gold24k);
    const g22 = parseFloat(gold22k);
    const s999 = parseFloat(silver999);
    if (isNaN(g24) || g24 <= 0) return 'Valid 24K Gold rate is required.';
    if (isNaN(g22) || g22 <= 0) return 'Valid 22K Gold rate is required.';
    if (isNaN(s999) || s999 <= 0) return 'Valid 999 Silver rate is required.';
    return null;
  };

  const handleSaveOnly = async () => {
    const valErr = validateInputs();
    if (valErr) {
      setErrorMsg(valErr);
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg(null);
      setStatusMsg(null);

      const payload: Partial<DailyRates> = {
        gold_24k: parseFloat(gold24k),
        gold_22k: parseFloat(gold22k),
        gold_18k: parseFloat(gold18k) || Math.round(parseFloat(gold24k) * 0.75),
        gold_14k: parseFloat(gold14k) || Math.round(parseFloat(gold24k) * 0.585),
        silver_999: parseFloat(silver999),
        silver_925: parseFloat(silver925) || Math.round(parseFloat(silver999) * 0.925)
      };

      const res = await onSaveRates(payload, confirmLargeChange);
      if (res.success) {
        setStatusMsg("Showroom bullion rates saved successfully.");
        setTimeout(() => onClose(), 800);
      } else if (res.requiresConfirmation) {
        setRequiresConfirmation(true);
        setErrorMsg(res.error || 'Rate fluctuation exceeds 10%. Please confirm below.');
      } else {
        setErrorMsg(res.error || 'Failed to update rates.');
      }
    } catch {
      setErrorMsg('Unexpected error while saving rates.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndSyncCatalog = async () => {
    const valErr = validateInputs();
    if (valErr) {
      setErrorMsg(valErr);
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg(null);
      setStatusMsg("Saving morning bullion rates...");

      const payload: Partial<DailyRates> = {
        gold_24k: parseFloat(gold24k),
        gold_22k: parseFloat(gold22k),
        gold_18k: parseFloat(gold18k) || Math.round(parseFloat(gold24k) * 0.75),
        gold_14k: parseFloat(gold14k) || Math.round(parseFloat(gold24k) * 0.585),
        silver_999: parseFloat(silver999),
        silver_925: parseFloat(silver925) || Math.round(parseFloat(silver999) * 0.925)
      };

      const res = await onSaveRates(payload, confirmLargeChange);
      if (!res.success) {
        if (res.requiresConfirmation) {
          setRequiresConfirmation(true);
          setErrorMsg(res.error || 'Rate fluctuation exceeds 10%. Please confirm below.');
        } else {
          setErrorMsg(res.error || 'Failed to update rates.');
        }
        setIsSaving(false);
        return;
      }

      setStatusMsg("Synchronizing online catalog prices with new rates...");
      await onRecalculateCatalog();
      setStatusMsg("Showroom rates & online catalog successfully updated!");
      setTimeout(() => onClose(), 1000);
    } catch {
      setErrorMsg('Unexpected error during catalog synchronization.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--bg-surface)] text-[var(--text-primary)] rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-[var(--border-color)] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)] flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--gold-primary)]/10 text-[var(--gold-primary)] flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[var(--gold-primary)]">
                Today&apos;s Showroom Bullion Rates
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Morning market rates for Jammu showroom &amp; instant web price recalculation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-[var(--text-secondary)] hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                24K Pure Gold (₹/gram) *
              </label>
              <input
                type="number"
                step="1"
                value={gold24k}
                onChange={(e) => handle24kChange(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] font-mono font-bold focus:border-[var(--gold-primary)] outline-none"
                placeholder="e.g. 8950"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                22K Hallmark Gold (₹/gram) *
              </label>
              <input
                type="number"
                step="1"
                value={gold22k}
                onChange={(e) => setGold22k(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--gold-primary)] font-mono font-bold focus:border-[var(--gold-primary)] outline-none"
                placeholder="e.g. 8250"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                18K Diamond Gold (₹/gram)
              </label>
              <input
                type="number"
                step="1"
                value={gold18k}
                onChange={(e) => setGold18k(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] font-mono focus:border-[var(--gold-primary)] outline-none"
                placeholder="e.g. 6750"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                14K Solid Gold (₹/gram)
              </label>
              <input
                type="number"
                step="1"
                value={gold14k}
                onChange={(e) => setGold14k(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] font-mono focus:border-[var(--gold-primary)] outline-none"
                placeholder="e.g. 5250"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                999 Fine Silver (₹/gram) *
              </label>
              <input
                type="number"
                step="0.1"
                value={silver999}
                onChange={(e) => handleSilver999Change(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] font-mono focus:border-[var(--gold-primary)] outline-none"
                placeholder="e.g. 102"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                925 Sterling Silver (₹/gram)
              </label>
              <input
                type="number"
                step="0.1"
                value={silver925}
                onChange={(e) => setSilver925(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] font-mono focus:border-[var(--gold-primary)] outline-none"
                placeholder="e.g. 94.5"
              />
            </div>
          </div>

          <div className="p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-secondary)] flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-[var(--gold-primary)] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Tip:</strong> Entering the 24K rate automatically calculates 22K (91.6%), 18K (75%) and 14K (58.5%). You can override any value manually before saving.
            </p>
          </div>

          {requiresConfirmation && (
            <div className="p-3 bg-amber-950/60 border border-amber-600 rounded-lg text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Large Market Deviation (&gt;10%) Detected</span>
              </div>
              <p className="text-amber-200/80">
                The new 24K rate deviates significantly from the last saved rate. Please confirm this change is intentional.
              </p>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={confirmLargeChange}
                  onChange={(e) => setConfirmLargeChange(e.target.checked)}
                  className="rounded border-amber-500 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-xs font-bold text-amber-200">
                  I confirm today&apos;s bullion rate change is correct.
                </span>
              </label>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-600 rounded-lg text-xs text-red-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {statusMsg && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-600 rounded-lg text-xs text-emerald-200 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[var(--border-color)] bg-[var(--bg-primary)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg text-xs font-medium hover:text-white hover:border-gray-500 transition-colors"
          >
            Cancel
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSaveOnly}
              disabled={isSaving || isRecalculating}
              className="w-full sm:w-auto px-4 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg text-xs font-semibold hover:border-[var(--gold-primary)] transition-all disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Rates Only'}
            </button>

            <button
              type="button"
              onClick={handleSaveAndSyncCatalog}
              disabled={isSaving || isRecalculating}
              className="w-full sm:w-auto px-4 py-2 bg-[var(--gold-primary)] text-black rounded-lg text-xs font-bold hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
            >
              {(isSaving || isRecalculating) ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Syncing Catalog...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-black" />
                  <span>Save &amp; Recalculate Catalog (1-Click)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

