'use client';

import React, { useState } from 'react';
import type { CouponRule } from '@/lib/couponEngine';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (coupon: CouponRule) => Promise<void>;
  isSaving: boolean;
}

export function CouponModal({ isOpen, onClose, onSave, isSaving }: CouponModalProps) {
  const [code, setCode] = useState('');
  const [type, setType] = useState<'flat' | 'percentage'>('flat');
  const [value, setValue] = useState('1000');
  const [minOrderRupees, setMinOrderRupees] = useState('25000');
  const [maxDiscountRupees, setMaxDiscountRupees] = useState('');
  const [validUntil, setValidUntil] = useState('2027-12-31');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      alert('Coupon code is required.');
      return;
    }

    const numVal = parseFloat(value);
    if (isNaN(numVal) || numVal <= 0) {
      alert('Coupon value must be a positive number.');
      return;
    }

    // Convert values: if flat, value is in paise; if percentage, value is number (e.g. 5 for 5%)
    const valInPaiseOrPercent = type === 'flat' ? Math.round(numVal * 100) : numVal;
    const minPaise = Math.round((parseFloat(minOrderRupees) || 0) * 100);
    const maxPaise = maxDiscountRupees ? Math.round(parseFloat(maxDiscountRupees) * 100) : undefined;

    await onSave({
      code: code.trim().toUpperCase(),
      type,
      value: valInPaiseOrPercent,
      minOrderPaise: minPaise,
      maxDiscountPaise: maxPaise,
      validUntil,
      description: description.trim() || `${code.toUpperCase()} Promotion`,
      isActive
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--bg-surface)] text-[var(--text-primary)] rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-[var(--border-color)]">
        <div className="px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-primary)] flex justify-between items-center">
          <div>
            <h3 className="font-serif text-lg font-bold text-[var(--gold-primary)]">
              Create Discount Coupon
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Configure promo codes, minimum spend thresholds, and expiry dates.
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
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
              Coupon Code *
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. DIWALI2026, FESTIVE5000"
              className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg font-mono font-bold text-[var(--gold-primary)] focus:outline-none focus:border-[var(--gold-primary)] text-sm tracking-wide uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                Discount Type
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm"
              >
                <option value="flat">₹ Flat Rupee Off</option>
                <option value="percentage">% Percentage Off</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                {type === 'flat' ? 'Discount Amount (₹) *' : 'Percentage (1-50%) *'}
              </label>
              <input
                type="number"
                step={type === 'flat' ? '100' : '0.5'}
                min="1"
                max={type === 'percentage' ? 50 : undefined}
                required
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder={type === 'flat' ? 'e.g. 5000' : 'e.g. 5'}
                className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg font-mono text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                Min. Order Value (₹)
              </label>
              <input
                type="number"
                step="500"
                min="0"
                value={minOrderRupees}
                onChange={e => setMinOrderRupees(e.target.value)}
                placeholder="e.g. 50000"
                className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
                {type === 'percentage' ? 'Max Cap (₹)' : 'Max Cap (N/A)'}
              </label>
              <input
                type="number"
                step="500"
                disabled={type === 'flat'}
                value={maxDiscountRupees}
                onChange={e => setMaxDiscountRupees(e.target.value)}
                placeholder={type === 'percentage' ? 'e.g. 10000' : 'Not required'}
                className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg font-mono text-sm disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
              Valid Until (Expiry Date) *
            </label>
            <input
              type="date"
              required
              value={validUntil}
              onChange={e => setValidUntil(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1">
              Customer Description
            </label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Festive privilege: ₹5,000 flat savings on orders above ₹50,000."
              className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-sm"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="coupon-active-check"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
              className="w-4 h-4 accent-amber-600 rounded"
            />
            <label htmlFor="coupon-active-check" className="text-xs font-medium cursor-pointer">
              Activate coupon immediately for checkout
            </label>
          </div>

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
              disabled={isSaving}
              className="px-5 py-2 bg-[var(--gold-primary)] hover:opacity-90 text-black font-bold rounded-lg text-xs transition-all shadow"
            >
              {isSaving ? 'Creating Coupon...' : 'Save Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

