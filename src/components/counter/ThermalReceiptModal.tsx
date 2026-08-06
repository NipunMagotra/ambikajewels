'use client';

import React from 'react';
import { BillInput, BillBreakdown } from '@/types/counter';
import { Printer, Share2, X, Check, ShieldCheck } from 'lucide-react';

interface ThermalReceiptModalProps {
  bill: BillInput;
  breakdown: BillBreakdown;
  receiptNumber: string;
  onClose: () => void;
}

export const ThermalReceiptModal: React.FC<ThermalReceiptModalProps> = ({
  bill,
  breakdown,
  receiptNumber,
  onClose,
}) => {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      {/* Container - hide non-print elements when printing */}
      <div className="glass-panel max-w-md w-full bg-surface-container-high rounded-2xl border border-primary/40 p-4 sm:p-6 space-y-4 shadow-2xl relative my-auto">
        {/* Modal Header Controls (Hidden during print) */}
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-primary font-headline-md">
              Thermal Receipt Preview
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg text-lg font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PRINTABLE RECEIPT CONTENT CONTAINER */}
        <div
          id="printable-receipt"
          className="bg-white text-black p-5 rounded-lg text-xs font-mono space-y-3 shadow-inner border border-slate-300 print:border-none print:shadow-none print:p-0 print:m-0 print:w-full print:bg-transparent"
        >
          {/* Receipt Header */}
          <div className="text-center space-y-1 border-b border-slate-400 pb-2">
            <h2 className="text-base font-extrabold uppercase tracking-wide">Ambika Jewels</h2>
            <p className="text-[10px] text-slate-700 leading-tight">
              Fine Gold, Silver & Dogra Heritage Fine Jewelry
            </p>
            <p className="text-[10px] text-slate-600">
              Shop No.3, E.W.S Colony, Sec-1, Lower Roop Nagar, Jammu
            </p>
            <p className="text-[10px] font-semibold text-slate-800">
              Ph: +91 9682589725 / +91 9086098457
            </p>
            <div className="inline-block bg-slate-100 text-slate-900 px-2 py-0.5 rounded text-[10px] font-bold mt-1">
              ESTIMATE RECEIPT / CASH MEMO
            </div>
          </div>

          {/* Metadata */}
          <div className="flex justify-between text-[11px] border-b border-slate-300 pb-2">
            <div>
              <p>
                <strong>No:</strong> {receiptNumber}
              </p>
              <p>
                <strong>Customer:</strong> {bill.customerName || 'Walk-in Customer'}
              </p>
              {bill.customerPhone && <p><strong>Ph:</strong> {bill.customerPhone}</p>}
            </div>
            <div className="text-right">
              <p><strong>Date:</strong> {currentDate}</p>
              <p><strong>Time:</strong> {currentTime}</p>
            </div>
          </div>

          {/* Item Table */}
          <div className="space-y-1.5 border-b border-slate-400 pb-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-700 border-b border-slate-200 pb-1">
              <span>ITEM DETAILS</span>
              <span>DETAILS / VAL</span>
            </div>

            <div className="flex justify-between">
              <span>Metal & Purity:</span>
              <span className="font-bold">{bill.metalPurity}</span>
            </div>

            <div className="flex justify-between">
              <span>Gross Weight:</span>
              <span>{bill.grossWeight.toFixed(3)} g</span>
            </div>

            {bill.stoneWeight > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>(-) Stone/Pearl Weight:</span>
                <span>-{bill.stoneWeight.toFixed(3)} g</span>
              </div>
            )}

            <div className="flex justify-between font-bold border-t border-dashed border-slate-300 pt-1">
              <span>Net Metal Weight:</span>
              <span>{breakdown.netWeight.toFixed(3)} g</span>
            </div>

            <div className="flex justify-between text-slate-700">
              <span>Active Jammu Rate:</span>
              <span>₹{breakdown.appliedRatePerGram.toLocaleString('en-IN')}/g</span>
            </div>

            <div className="flex justify-between font-semibold">
              <span>Net Metal Value:</span>
              <span>₹{breakdown.netGoldValue.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Additional Charges & Adjustments */}
          <div className="space-y-1 text-[11px] border-b border-slate-400 pb-2">
            {breakdown.makingCharges > 0 && (
              <div className="flex justify-between">
                <span>Making Charges ({bill.makingType === 'percent' ? `${bill.makingRate}%` : `₹${bill.makingRate}/g`}):</span>
                <span>+₹{breakdown.makingCharges.toLocaleString('en-IN')}</span>
              </div>
            )}

            {breakdown.hallmarkingCharges > 0 && (
              <div className="flex justify-between">
                <span>BIS Hallmarking ({bill.hallmarkCount} pc):</span>
                <span>+₹{breakdown.hallmarkingCharges.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between font-semibold pt-1 border-t border-slate-200">
              <span>Gross Subtotal:</span>
              <span>₹{breakdown.grossSubtotal.toLocaleString('en-IN')}</span>
            </div>

            {bill.includeGst && (
              <div className="flex justify-between text-slate-700">
                <span>GST ({bill.gstRate}%):</span>
                <span>+₹{breakdown.gstAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            {breakdown.oldGoldDeduction > 0 && (
              <div className="flex justify-between text-emerald-800 font-medium">
                <span>(-) Old Gold Trade-In Deduction:</span>
                <span>-₹{breakdown.oldGoldDeduction.toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

          {/* Total Amount Due */}
          <div className="bg-slate-100 p-2.5 rounded border border-slate-400 text-center space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-700 block">TOTAL NET PAYABLE AMOUNT</span>
            <span className="text-lg font-black text-slate-900 block">
              ₹{breakdown.finalAmountDue.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Receipt Footer & Terms */}
          <div className="text-[9px] text-slate-600 text-center space-y-1 pt-1">
            <p>100% BIS Hallmarked Gold Guarantee • Dogra Heritage Craft</p>
            <p className="italic">Thank you for visiting Ambika Jewels!</p>
            <div className="flex justify-between items-end pt-3 text-[10px]">
              <div>Customer Sign</div>
              <div>Authorized Signatory</div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons (Hidden during print) */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 gold-bg-gradient font-bold text-on-primary-fixed py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-primary/20 transition-all text-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Thermal / PDF</span>
          </button>

          <button
            onClick={onClose}
            className="bg-surface border border-outline-variant/50 hover:border-primary/50 text-on-surface py-3 px-4 rounded-xl text-sm font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
