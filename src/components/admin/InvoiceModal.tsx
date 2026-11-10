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
  customer_email?: string;
  shipping_address: string;
  pincode?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: string;
  payment_method: string;
  payment_status: string;
  razorpay_payment_id?: string;
  bvc_docket_number?: string;
  pan_number?: string;
  created_at: string;
}

interface InvoiceModalProps {
  order: OrderRecord | null;
  onClose: () => void;
}

function numberToWords(num: number): string {
  // Simple Indian numbering denomination words for invoices
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = Math.round(num);
  if (n === 0) return 'Zero Rupees Only';

  function inWords(nVal: number): string {
    let str = '';
    if (nVal > 10000000) {
      str += inWords(Math.floor(nVal / 10000000)) + ' Crore ';
      nVal %= 10000000;
    }
    if (nVal > 100000) {
      str += inWords(Math.floor(nVal / 100000)) + ' Lakh ';
      nVal %= 100000;
    }
    if (nVal > 1000) {
      str += inWords(Math.floor(nVal / 1000)) + ' Thousand ';
      nVal %= 1000;
    }
    if (nVal > 100) {
      str += inWords(Math.floor(nVal / 100)) + ' Hundred ';
      nVal %= 100;
    }
    if (nVal > 0) {
      if (str !== '') str += 'and ';
      if (nVal < 20) {
        str += a[nVal];
      } else {
        str += b[Math.floor(nVal / 10)] + ' ' + a[nVal % 10];
      }
    }
    return str.trim();
  }

  return inWords(n) + ' Rupees Only';
}

export function InvoiceModal({ order, onClose }: InvoiceModalProps) {
  if (!order) return null;

  const totalRupees = Math.round(order.total / 100);
  const subtotalRupees = Math.round(order.subtotal / 100);
  const taxRupees = Math.round(order.tax / 100);
  const cgstRupees = Math.round(taxRupees / 2);
  const sgstRupees = taxRupees - cgstRupees;

  const handlePrint = () => {
    window.print();
  };

  const invoiceDate = new Date(order.created_at).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white text-zinc-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-zinc-200">
        {/* Header Actions (hidden in print) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
          <div className="flex items-center gap-3">
            <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
              GST Tax Invoice (Form GST INV-1)
            </span>
            <span className="text-sm text-zinc-500">Order: {order.order_number}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Invoice
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 rounded-lg text-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* Printable Invoice Document */}
        <div id="printable-invoice" className="p-8 sm:p-12 overflow-y-auto print:p-0 print:overflow-visible text-sm font-sans">
          {/* Top Banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-zinc-800 pb-6 gap-6">
            <div>
              <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-900">
                AMBIKA JEWELS
              </h1>
              <p className="text-xs uppercase tracking-widest text-amber-800 font-semibold mt-1">
                Authentic Dogra Heritage &amp; Fine Jewellery
              </p>
              <p className="text-xs text-zinc-600 mt-2 max-w-sm leading-relaxed">
                {siteConfig.fullAddress}<br />
                Phone: {siteConfig.contact.phone} | WhatsApp: {siteConfig.contact.whatsapp}<br />
                Email: {siteConfig.contact.email}
              </p>
            </div>
            <div className="text-left sm:text-right space-y-1">
              <span className="inline-block px-3 py-1 bg-zinc-900 text-white text-xs font-bold uppercase tracking-wider rounded">
                TAX INVOICE
              </span>
              <p className="text-xs text-zinc-600 pt-1">
                <span className="font-semibold text-zinc-900">Invoice No:</span> INV-{order.order_number.replace('AJ-', '')}
              </p>
              <p className="text-xs text-zinc-600">
                <span className="font-semibold text-zinc-900">Date:</span> {invoiceDate}
              </p>
              <p className="text-xs text-zinc-600">
                <span className="font-semibold text-zinc-900">Place of Supply:</span> 01 - Jammu &amp; Kashmir
              </p>
              <p className="text-xs text-zinc-600">
                <span className="font-semibold text-zinc-900">Reverse Charge:</span> No
              </p>
            </div>
          </div>

          {/* Statutory Registration Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4 border-b border-zinc-200 text-xs">
            <div className="space-y-1 bg-zinc-50 p-4 rounded-lg border border-zinc-200">
              <p className="font-bold text-zinc-900 uppercase tracking-wide">Seller Legal Credentials</p>
              <p><span className="text-zinc-500">Legal Name:</span> <strong className="text-zinc-900">{siteConfig.legalBusinessName} ({siteConfig.founder})</strong></p>
              <p><span className="text-zinc-500">GSTIN:</span> <strong className="text-zinc-900 font-mono">{siteConfig.gstin}</strong></p>
              <p><span className="text-zinc-500">PAN:</span> <strong className="text-zinc-900 font-mono">{siteConfig.pan}</strong></p>
              <p><span className="text-zinc-500">BIS Hallmark License:</span> <strong className="text-zinc-900 font-mono">{siteConfig.bisHallmarkLicense}</strong></p>
            </div>
            <div className="space-y-1 bg-zinc-50 p-4 rounded-lg border border-zinc-200">
              <p className="font-bold text-zinc-900 uppercase tracking-wide">Billed &amp; Shipped To</p>
              <p className="font-semibold text-zinc-900 text-sm">{order.customer_name}</p>
              <p className="text-zinc-600">{order.shipping_address}</p>
              <p className="text-zinc-600">Phone: {order.customer_phone}</p>
              {order.customer_email && <p className="text-zinc-600">Email: {order.customer_email}</p>}
              {order.pan_number && (
                <p className="text-zinc-900 font-mono pt-1">
                  <strong>Customer PAN:</strong> {order.pan_number} (Rule 114B verified)
                </p>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="py-6">
            <table className="w-full text-left text-xs border border-zinc-200">
              <thead>
                <tr className="bg-zinc-100 text-zinc-800 uppercase tracking-wider border-b border-zinc-200 font-semibold">
                  <th className="py-3 px-3 w-10 text-center">#</th>
                  <th className="py-3 px-3">Description of Precious Goods</th>
                  <th className="py-3 px-3 text-center">HSN</th>
                  <th className="py-3 px-3 text-center">Qty</th>
                  <th className="py-3 px-3 text-right">Taxable Value</th>
                  <th className="py-3 px-3 text-right">GST (3%)</th>
                  <th className="py-3 px-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {order.items.map((item, idx) => {
                  const itemTotalRupees = Math.round((item.price * item.quantity) / 100);
                  const itemTaxableRupees = Math.round(itemTotalRupees / 1.03);
                  const itemGstRupees = itemTotalRupees - itemTaxableRupees;

                  return (
                    <tr key={idx} className="hover:bg-zinc-50">
                      <td className="py-3 px-3 text-center font-mono text-zinc-500">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-zinc-900">{item.name}</p>
                        <p className="text-zinc-500 text-[11px]">
                          Finish: {item.metal_finish || '22K Gold'} | Size: {item.selected_size || 'Standard'}
                        </p>
                        <p className="text-amber-800 text-[10px] font-medium mt-0.5">
                          BIS Hallmarked with 6-character HUID | Precious Jewellery
                        </p>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-zinc-600">7113</td>
                      <td className="py-3 px-3 text-center font-mono">{item.quantity}</td>
                      <td className="py-3 px-3 text-right font-mono">₹{itemTaxableRupees.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-right font-mono">₹{itemGstRupees.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-zinc-900">
                        ₹{itemTotalRupees.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Tax Breakdown & Grand Total */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t border-zinc-200 pt-6">
            <div className="space-y-2 max-w-sm text-xs">
              <p className="font-semibold text-zinc-900 uppercase">Amount in Words:</p>
              <p className="text-zinc-700 italic bg-amber-50 p-2.5 rounded border border-amber-200">
                {numberToWords(totalRupees)}
              </p>
              <div className="text-[11px] text-zinc-500 pt-2 space-y-1">
                <p><strong>Payment Status:</strong> {order.payment_status.toUpperCase()} via {order.payment_method}</p>
                {order.razorpay_payment_id && (
                  <p className="font-mono"><strong>Transaction ID:</strong> {order.razorpay_payment_id}</p>
                )}
                {order.bvc_docket_number && (
                  <p className="font-mono"><strong>BVC Logistics Docket:</strong> {order.bvc_docket_number}</p>
                )}
              </div>
            </div>

            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-200">
                <span className="text-zinc-600">Taxable Value:</span>
                <span className="font-mono font-medium text-zinc-900">₹{subtotalRupees.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-200">
                <span className="text-zinc-600">CGST (1.5%):</span>
                <span className="font-mono text-zinc-800">₹{cgstRupees.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-200">
                <span className="text-zinc-600">SGST (1.5%):</span>
                <span className="font-mono text-zinc-800">₹{sgstRupees.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-200">
                <span className="text-zinc-600">Armed Transit &amp; Insurance:</span>
                <span className="font-mono text-emerald-700 font-medium">FREE (BVC)</span>
              </div>
              <div className="flex justify-between py-2 border-t-2 border-zinc-900 text-sm font-bold text-zinc-900">
                <span>Grand Total:</span>
                <span className="font-mono text-base text-amber-700">₹{totalRupees.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Statutory Declarations & Signatures */}
          <div className="mt-8 pt-6 border-t border-zinc-200 grid grid-cols-1 sm:grid-cols-2 gap-8 text-[11px] text-zinc-600">
            <div>
              <p className="font-bold text-zinc-900 uppercase">Declaration &amp; Warranty:</p>
              <ul className="list-disc pl-4 space-y-1 mt-1">
                <li>We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</li>
                <li>All gold items are hallmarked by the Bureau of Indian Standards (BIS) and inscribed with a 6-digit alphanumeric HUID.</li>
                <li>All disputes are subject to the exclusive jurisdiction of the Courts of Jammu (J&amp;K).</li>
              </ul>
            </div>
            <div className="flex flex-col justify-end text-center sm:text-right pt-6 sm:pt-0">
              <p className="font-bold text-zinc-900">For AMBIKA JEWELS</p>
              <div className="h-16 flex items-center justify-end">
                <span className="border-b border-dashed border-zinc-400 w-44 inline-block text-center text-zinc-400 text-[10px] pb-1">
                  Authorised Signatory
                </span>
              </div>
              <p className="text-[10px] text-zinc-500">This is a computer generated invoice.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

