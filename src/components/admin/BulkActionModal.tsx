'use client';

import React, { useState } from 'react';
import { siteConfig } from '@/config/siteConfig';

interface BulkActionModalProps {
  isOpen: boolean;
  selectedCount: number;
  onClose: () => void;
  onApply: (updates: {
    pricePercentDelta?: number;
    priceDeltaPaise?: number;
    stock_status?: 'in_stock' | 'limited' | 'out_of_stock';
    category?: string;
  }) => Promise<void>;
  isProcessing: boolean;
}

export function BulkActionModal({
  isOpen,
  selectedCount,
  onClose,
  onApply,
  isProcessing
}: BulkActionModalProps) {
  const [actionType, setActionType] = useState<'price_percent' | 'price_flat' | 'stock' | 'category'>('price_percent');
  const [percentDelta, setPercentDelta] = useState<string>('5');
  const [flatDeltaRupees, setFlatDeltaRupees] = useState<string>('1000');
  const [stockStatus, setStockStatus] = useState<'in_stock' | 'limited' | 'out_of_stock'>('in_stock');
  const [category, setCategory] = useState<string>(siteConfig.categories[0] || 'Necklaces');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (actionType === 'price_percent') {
      const p = parseFloat(percentDelta);
      if (isNaN(p) || p === 0) {
        alert('Please enter a non-zero percentage adjustment.');
        return;
      }
      await onApply({ pricePercentDelta: p });
    } else if (actionType === 'price_flat') {
      const r = parseFloat(flatDeltaRupees);
      if (isNaN(r) || r === 0) {
        alert('Please enter a non-zero rupee adjustment.');
        return;
      }
      await onApply({ priceDeltaPaise: Math.round(r * 100) });
    } else if (actionType === 'stock') {
      await onApply({ stock_status: stockStatus });
    } else if (actionType === 'category') {
      await onApply({ category });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--bg-surface)] text-[var(--text-primary)] rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-[var(--border-color)]">
        <div className="px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)] flex justify-between items-center">
          <div>
            <h3 className="font-serif text-lg font-bold text-[var(--gold-primary)]">
              Bulk Update Products
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Apply changes to <strong className="text-[var(--text-primary)]">{selectedCount}</strong> selected jewellery items.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1 rounded"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
              Select Bulk Operation
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setActionType('price_percent')}
                className={`p-2.5 rounded-lg border text-left font-medium transition-all ${
                  actionType === 'price_percent'
                    ? 'border-[var(--gold-primary)] bg-[var(--gold-primary)]/10 text-[var(--gold-primary)] font-bold'
                    : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]'
                }`}
              >
                % Price Adjust (±%)
              </button>
              <button
                type="button"
                onClick={() => setActionType('price_flat')}
                className={`p-2.5 rounded-lg border text-left font-medium transition-all ${
                  actionType === 'price_flat'
                    ? 'border-[var(--gold-primary)] bg-[var(--gold-primary)]/10 text-[var(--gold-primary)] font-bold'
                    : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]'
                }`}
              >
                ₹ Fixed Adjust (±₹)
              </button>
              <button
                type="button"
                onClick={() => setActionType('stock')}
                className={`p-2.5 rounded-lg border text-left font-medium transition-all ${
                  actionType === 'stock'
                    ? 'border-[var(--gold-primary)] bg-[var(--gold-primary)]/10 text-[var(--gold-primary)] font-bold'
                    : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]'
                }`}
              >
                Stock Availability
              </button>
              <button
                type="button"
                onClick={() => setActionType('category')}
                className={`p-2.5 rounded-lg border text-left font-medium transition-all ${
                  actionType === 'category'
                    ? 'border-[var(--gold-primary)] bg-[var(--gold-primary)]/10 text-[var(--gold-primary)] font-bold'
                    : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]'
                }`}
              >
                Move Category
              </button>
            </div>
          </div>

          {actionType === 'price_percent' && (
            <div className="bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border-color)] space-y-2">
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase">
                Percentage Change (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  value={percentDelta}
                  onChange={e => setPercentDelta(e.target.value)}
                  placeholder="e.g. 5 for +5%, or -5 for -5%"
                  className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg font-mono text-sm"
                />
                <span className="font-bold">%</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Positive number increases prices; negative number applies discount.
              </p>
            </div>
          )}

          {actionType === 'price_flat' && (
            <div className="bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border-color)] space-y-2">
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase">
                Rupee Adjustment (₹)
              </label>
              <div className="flex items-center gap-2">
                <span className="font-bold">₹</span>
                <input
                  type="number"
                  step="100"
                  value={flatDeltaRupees}
                  onChange={e => setFlatDeltaRupees(e.target.value)}
                  placeholder="e.g. 2000 for +₹2,000, or -1000 for -₹1,000"
                  className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg font-mono text-sm"
                />
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Adjusts the price of each selected piece by this flat amount.
              </p>
            </div>
          )}

          {actionType === 'stock' && (
            <div className="bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border-color)] space-y-2">
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase">
                New Stock Status
              </label>
              <select
                value={stockStatus}
                onChange={e => setStockStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-sm"
              >
                <option value="in_stock">🟢 Mark In Stock (Ready to Dispatch)</option>
                <option value="limited">🟡 Mark Limited Stock (1-2 pieces)</option>
                <option value="out_of_stock">🔴 Mark Sold Out / Unavailable</option>
              </select>
            </div>
          )}

          {actionType === 'category' && (
            <div className="bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border-color)] space-y-2">
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase">
                Assign Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg text-sm"
              >
                {siteConfig.categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="Dogra Heritage Collection">Dogra Heritage Collection</option>
              </select>
            </div>
          )}

          <div className="pt-3 border-t border-[var(--border-color)] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-5 py-2 bg-[var(--gold-primary)] hover:opacity-90 text-black font-bold rounded-lg text-xs transition-all shadow"
            >
              {isProcessing ? 'Applying Changes...' : `Apply to ${selectedCount} Pieces`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

