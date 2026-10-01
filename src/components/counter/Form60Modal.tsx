'use client';

import React, { useState } from 'react';
import { Form60Declaration } from '@/types/counter';
import { FileText, X, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Form60ModalProps {
  initialCustomerName?: string;
  onSave: (data: Form60Declaration) => void;
  onClose: () => void;
}

export const Form60Modal: React.FC<Form60ModalProps> = ({
  initialCustomerName = '',
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<Form60Declaration>({
    declarantName: initialCustomerName,
    fatherOrSpouseName: '',
    dateOfBirth: '',
    residentialAddress: '',
    panApplicationStatus: 'not_applied',
    estimatedAgriculturalIncome: 0,
    estimatedOtherIncome: 0,
    verifiedDeclaration: false,
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.declarantName.trim()) {
      setValidationError('Declarant full name is mandatory.');
      return;
    }
    if (!formData.fatherOrSpouseName.trim()) {
      setValidationError("Father's / Spouse's name is mandatory.");
      return;
    }
    if (!formData.residentialAddress.trim()) {
      setValidationError('Complete residential address is mandatory.');
      return;
    }
    if (!formData.verifiedDeclaration) {
      setValidationError('You must verify and accept the statutory declaration.');
      return;
    }

    setValidationError(null);
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="glass-panel max-w-lg w-full bg-surface-container-high rounded-2xl border border-primary/40 p-5 sm:p-6 space-y-4 shadow-2xl relative my-auto">
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <div>
              <h3 className="text-base font-bold text-primary font-headline-md">
                Form 60 Declaration Path
              </h3>
              <p className="text-[10px] text-on-surface-variant">
                For customers not holding a Permanent Account Number (PAN) • CA to confirm
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legal notice banner */}
        <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[11px] text-amber-200 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Statutory Declaration (DRAFT FOR CA/LAWYER REVIEW):</strong> Form 60 is filed by individuals entering into high-value transactions (₹2,00,000+) who do not possess a PAN. Information is retained for statutory audit compliance.
          </span>
        </div>

        {validationError && (
          <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-300">
            {validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-on-surface-variant block mb-1 font-semibold">
              1. Declarant Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.declarantName}
              onChange={(e) => setFormData({ ...formData, declarantName: e.target.value })}
              placeholder="e.g. Ramesh Kumar"
              className="w-full bg-surface border border-outline-variant/50 focus:border-primary text-on-surface px-3 py-2 rounded-lg text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-on-surface-variant block mb-1 font-semibold">
                2. Father / Spouse Name *
              </label>
              <input
                type="text"
                required
                value={formData.fatherOrSpouseName}
                onChange={(e) => setFormData({ ...formData, fatherOrSpouseName: e.target.value })}
                placeholder="Full name of father/spouse"
                className="w-full bg-surface border border-outline-variant/50 focus:border-primary text-on-surface px-3 py-2 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="text-on-surface-variant block mb-1 font-semibold">
                3. Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full bg-surface border border-outline-variant/50 focus:border-primary text-on-surface px-3 py-2 rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-on-surface-variant block mb-1 font-semibold">
              4. Complete Residential Address *
            </label>
            <textarea
              required
              rows={2}
              value={formData.residentialAddress}
              onChange={(e) => setFormData({ ...formData, residentialAddress: e.target.value })}
              placeholder="Flat/House No, Street, Mohalla, City/Village, District, PIN"
              className="w-full bg-surface border border-outline-variant/50 focus:border-primary text-on-surface px-3 py-2 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="text-on-surface-variant block mb-1 font-semibold">
              5. PAN Application Status
            </label>
            <select
              value={formData.panApplicationStatus}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  panApplicationStatus: e.target.value as 'applied' | 'not_applied',
                })
              }
              className="w-full bg-surface border border-outline-variant/50 focus:border-primary text-on-surface px-3 py-2 rounded-lg text-sm"
            >
              <option value="not_applied">Not Applied for PAN</option>
              <option value="applied">Applied for PAN (Acknowledgement Pending)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-on-surface-variant block mb-1">
                Estimated Agri Income (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.estimatedAgriculturalIncome || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimatedAgriculturalIncome: Number(e.target.value) || 0,
                  })
                }
                placeholder="0"
                className="w-full bg-surface border border-outline-variant/50 focus:border-primary text-on-surface px-3 py-2 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="text-on-surface-variant block mb-1">
                Estimated Other Income (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.estimatedOtherIncome || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimatedOtherIncome: Number(e.target.value) || 0,
                  })
                }
                placeholder="0"
                className="w-full bg-surface border border-outline-variant/50 focus:border-primary text-on-surface px-3 py-2 rounded-lg text-sm"
              />
            </div>
          </div>

          <label className="flex items-start gap-2.5 pt-2 cursor-pointer border-t border-outline-variant/30">
            <input
              type="checkbox"
              checked={formData.verifiedDeclaration}
              onChange={(e) =>
                setFormData({ ...formData, verifiedDeclaration: e.target.checked })
              }
              className="mt-0.5 accent-primary h-4 w-4 shrink-0 rounded cursor-pointer"
            />
            <span className="text-[11px] text-on-surface-variant leading-relaxed">
              I hereby declare that what is stated above is true to the best of my knowledge and belief. I do not possess a Permanent Account Number (PAN). <em>(Form 60 Declaration — CA to confirm)</em>
            </span>
          </label>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-surface border border-outline-variant/50 hover:border-primary/50 text-on-surface py-2.5 px-4 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 gold-bg-gradient font-bold text-on-primary-fixed py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md hover:shadow-primary/20 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Attach Form 60</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
