'use client';

import React from 'react';
import { siteConfig } from '@/config/siteConfig';

interface OrderItem {
  product_id?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  metal_finish?: string;
  selected_size?: string;
  weight_grams?: number;
}

interface OrderRecord {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  shipping_address: string;
  pincode?: string;
  items: OrderItem[];
  total: number;
  payment_method: string;
  payment_status: string;
  bvc_docket_number?: string;
  notes?: string;
  created_at: string;
}

interface PackingSlipModalProps {
  order: OrderRecord | null;
  onClose: () => void;
}

export function PackingSlipModal({ order, onClose }: PackingSlipModalProps) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white text-zinc-900 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-zinc-200">
        {/* Modal Controls */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
          <div className="flex items-center gap-3">
            <span className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
              Workshop Dispatch Slip
            </span>
            <span className="text-sm text-zinc-500 font-mono">#{order.order_number}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Packing Slip
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 rounded-lg text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Printable Packing Sheet */}
        <div className="p-8 sm:p-10 overflow-y-auto print:p-0 print:overflow-visible text-sm font-sans">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-zinc-900 pb-5">
            <div>
              <h2 className="font-serif text-2xl font-bold tracking-tight text-zinc-900">
                AMBIKA JEWELS
              </h2>
              <p className="text-xs uppercase tracking-widest text-zinc-600 font-medium">
                DISPATCH &amp; SECURITY PACKING SLIP
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono font-bold text-base text-zinc-900">{order.order_number}</p>
              <p className="text-xs text-zinc-500">Order Date: {formattedDate}</p>
              <p className="text-xs text-emerald-700 font-semibold mt-1">
                Payment: {order.payment_status.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Delivery & Logistics Details */}
          <div className="grid grid-cols-2 gap-6 py-5 border-b border-zinc-200 text-xs">
            <div className="space-y-1">
              <p className="font-bold text-zinc-900 uppercase">Deliver To:</p>
              <p className="text-sm font-semibold text-zinc-900">{order.customer_name}</p>
              <p className="text-zinc-600 leading-relaxed">{order.shipping_address}</p>
              <p className="text-zinc-800 font-medium pt-1">Phone: {order.customer_phone}</p>
            </div>
            <div className="space-y-2 bg-zinc-50 p-3 rounded-lg border border-zinc-200">
              <p className="font-bold text-zinc-900 uppercase">Armed Logistics Partner:</p>
              <p className="text-zinc-700 font-medium">{siteConfig.shipping.courierPartner}</p>
              <p className="text-zinc-600">
                <span className="font-semibold">BVC Airway Bill / Docket:</span>{' '}
                <span className="font-mono font-bold text-zinc-900">{order.bvc_docket_number || 'PENDING DISPATCH'}</span>
              </p>
              <p className="text-[11px] text-amber-800 font-medium">
                100% Transit Insured Vault-to-Doorstep Delivery
              </p>
            </div>
          </div>

          {/* Items Checklist Table */}
          <div className="py-5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900 mb-3">
              Items to Pack ({order.items.reduce((s, i) => s + i.quantity, 0)} total units)
            </h3>
            <table className="w-full text-left text-xs border border-zinc-200">
              <thead>
                <tr className="bg-zinc-100 text-zinc-800 uppercase tracking-wider border-b border-zinc-200">
                  <th className="py-2.5 px-3 w-12 text-center">Verify</th>
                  <th className="py-2.5 px-3">Jewellery Item</th>
                  <th className="py-2.5 px-3 text-center">Size / Finish</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Est. Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50">
                    <td className="py-3 px-3 text-center">
                      <div className="w-4 h-4 border-2 border-zinc-400 rounded inline-block"></div>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-zinc-900">{item.name}</p>
                      <p className="text-[11px] text-zinc-500">HSN: 7113 | Precious Metal</p>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-zinc-700">{item.metal_finish || 'Gold'}</span>
                      {item.selected_size && (
                        <span className="block text-[11px] text-zinc-500">Size {item.selected_size}</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-zinc-900">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-mono text-zinc-600">
                      {item.weight_grams ? `${item.weight_grams} g` : 'Catalog standard'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Inspection & Security Checklist */}
          <div className="mt-4 p-4 bg-zinc-50 rounded-lg border border-zinc-300 text-xs space-y-2">
            <p className="font-bold text-zinc-900 uppercase">Pre-Dispatch Vault Inspection Checklist:</p>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-700">
              <label className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border border-zinc-500 rounded inline-block"></span>
                BIS Hallmarking &amp; 6-digit HUID laser confirmed
              </label>
              <label className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border border-zinc-500 rounded inline-block"></span>
                Jewellery Authenticity Certificate Card placed inside
              </label>
              <label className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border border-zinc-500 rounded inline-block"></span>
                Packaged in luxury Ambika Jewels velvet box
              </label>
              <label className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border border-zinc-500 rounded inline-block"></span>
                BVC Tamper-Proof Security Pouch heat-sealed
              </label>
            </div>
          </div>

          {/* Security Seal Verification */}
          <div className="mt-6 pt-4 border-t border-zinc-200 flex justify-between items-center text-xs">
            <div>
              <p className="text-zinc-500">BVC Security Bag Number:</p>
              <p className="font-mono font-bold text-zinc-900 pt-0.5">_________________________</p>
            </div>
            <div className="text-right">
              <p className="text-zinc-500">Packed By (Staff Name &amp; Signature):</p>
              <p className="font-mono font-bold text-zinc-900 pt-0.5">_________________________</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

