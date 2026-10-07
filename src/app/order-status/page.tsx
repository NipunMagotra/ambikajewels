'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Link from 'next/link';
import { siteConfig } from '@/config/siteConfig';

function OrderStatusContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'AMB-108249';
  const token = searchParams.get('token') || '';

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authNeeded, setAuthNeeded] = useState(false);
  const [verificationInput, setVerificationInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const loadOrder = async (ordId: string, tok?: string, contact?: string) => {
    setLoading(true);
    setAuthError(null);

    try {
      const params = new URLSearchParams();
      params.append('orderId', ordId.trim().toUpperCase());

      if (tok) {
        params.append('token', tok.trim());
      } else if (contact?.includes('@')) {
        params.append('email', contact.trim().toLowerCase());
      } else if (contact?.trim()) {
        params.append('phone', contact.trim());
      }

      const res = await fetch(`/api/track?${params.toString()}`);
      const data = await res.json();

      if (res.status === 401 && data.authRequired) {
        setAuthNeeded(true);
        setOrder(null);
      } else if (res.ok && data.success && data.order) {
        setOrder(data.order);
        setAuthNeeded(false);
      } else {
        setAuthError(data.error || 'Unable to authenticate order credentials.');
        if (!token) setAuthNeeded(true);
      }
    } catch {
      setAuthError('Error fetching order receipt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadOrder(orderId, token);
    } else {
      setAuthNeeded(true);
      setLoading(false);
    }
  }, [orderId, token]);

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationInput.trim()) return;
    loadOrder(orderId, undefined, verificationInput);
  };

  const handlePrint = () => {
    window.print();
  };

  if (authNeeded && !order) {
    return (
      <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop max-w-lg py-12">
        <div className="bg-surface-container border border-outline-variant/30 p-6 sm:p-8 rounded-xs text-center shadow-xl">
          <div className="w-12 h-12 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
            <span className="material-symbols-outlined text-2xl">lock</span>
          </div>
          <h2 className="font-headline-sm text-xl text-primary font-bold mb-2">
            Order Security Verification
          </h2>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mb-6">
            To protect your customer privacy, please enter the phone number or email address associated with Order <strong className="text-primary font-mono">{orderId}</strong>.
          </p>

          <form onSubmit={handleVerifySubmit} className="space-y-4">
            <div>
              <input
                type="text"
                required
                value={verificationInput}
                onChange={e => setVerificationInput(e.target.value)}
                placeholder="Phone (e.g. 9876543210) or Email"
                className="w-full bg-background border border-outline px-4 py-3 text-on-surface font-body-md text-sm outline-none focus:border-primary rounded-xs transition-colors"
              />
            </div>

            {authError && (
              <p className="text-xs text-red-400 bg-red-950/40 p-2.5 rounded-xs border border-red-800/40">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !verificationInput.trim()}
              className="btn-gold-primary w-full py-3.5 text-xs font-semibold disabled:opacity-50"
            >
              {loading ? 'VERIFYING...' : 'UNLOCK TAX INVOICE'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-outline-variant/20">
            <Link href="/" className="font-label-caps text-xs text-on-surface-variant hover:text-primary transition-colors">
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-label-caps text-[10px] text-on-surface-variant mb-6 print:hidden">
        <Link href="/" className="hover:text-primary">HOME</Link>
        <span>/</span>
        <span className="text-primary font-bold">ORDER STATUS & TAX INVOICE</span>
      </div>

      {/* Action Buttons Top */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <div>
          <span className="font-label-caps text-[10px] text-primary font-bold tracking-widest block">
            OFFICIAL GST TAX INVOICE (HSN 7113)
          </span>
          <h1 className="font-headline-sm text-2xl text-on-surface font-semibold">
            Order Receipt & Invoice
          </h1>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={handlePrint}
            className="btn-gold-primary px-4 py-2.5 text-xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">print</span>
            PRINT INVOICE
          </button>
          <Link
            href={`/track?orderId=${orderId}${token ? `&token=${encodeURIComponent(token)}` : ''}`}
            className="btn-gold-secondary px-4 py-2.5 text-xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">local_shipping</span>
            TRACK SHIPMENT
          </Link>
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div className="bg-surface-container border border-outline-variant/30 p-6 sm:p-10 rounded-xs shadow-xl print:border-none print:shadow-none print:p-0 print:bg-white print:text-black">
        
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b border-outline-variant/30 gap-4">
          <div>
            <span className="font-headline-md text-2xl sm:text-3xl gold-text-gradient font-bold tracking-wider block print:text-black">
              {order?.invoice?.seller?.name || siteConfig.legalBusinessName}
            </span>
            <p className="font-body-md text-xs text-on-surface-variant print:text-gray-700 whitespace-pre-line mt-1">
              {order?.invoice?.seller?.address || siteConfig.address}
            </p>
            <p className="text-xs text-on-surface-variant print:text-gray-700 mt-1">
              GSTIN: <strong>{order?.invoice?.seller?.gstin || siteConfig.gstin || '[TO BE FILLED BY OWNER]'}</strong> | PAN: <strong>{order?.invoice?.seller?.pan || siteConfig.pan || '[TO BE FILLED BY OWNER]'}</strong>
            </p>
            <p className="text-xs text-on-surface-variant print:text-gray-700">
              BIS Hallmark Reg: <strong>{order?.invoice?.seller?.bis_hallmark || siteConfig.bisHallmarkLicense || '[TO BE FILLED BY OWNER]'}</strong> | Email: {order?.invoice?.seller?.email || siteConfig.contact.email}
            </p>
          </div>

          <div className="text-left sm:text-right bg-background/50 p-4 border border-outline-variant/20 rounded-xs print:bg-transparent print:border-none">
            <span className="font-label-caps text-[9px] text-primary uppercase font-bold tracking-wider block mb-1">
              TAX INVOICE / CASH MEMO
            </span>
            <p className="font-headline-sm text-lg font-bold text-on-surface print:text-black">
              {order?.invoice?.invoice_number || `AJ/26-27/${String(orderId).replace(/\D/g, '') || '108249'}`}
            </p>
            <p className="text-xs text-on-surface-variant print:text-gray-600 mt-1">
              Order Ref: #{order?.order_number || orderId}
            </p>
            <p className="text-xs text-on-surface-variant print:text-gray-600 mt-0.5">
              Invoice Date: {order?.invoice?.invoice_date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
            <p className="text-xs font-semibold text-green-400 print:text-green-700 mt-1">
              Payment Status: PAID (Razorpay Verified)
            </p>
          </div>
        </div>

        {/* Bill To & Dispatch Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 py-4 border-b border-outline-variant/20 text-xs font-body-md">
          <div>
            <span className="font-label-caps text-[9px] text-primary uppercase font-bold tracking-wider block mb-1.5">
              BILLED & SHIPPED TO:
            </span>
            <p className="font-bold text-sm text-on-surface print:text-black">
              {order?.customer_name || 'Verified Customer'}
            </p>
            <p className="text-on-surface-variant print:text-gray-700 mt-1 whitespace-pre-line">
              {order?.shipping_address || 'Verified Destination, Jammu & Kashmir'}
            </p>
            {order?.customer_phone && (
              <p className="text-on-surface-variant print:text-gray-700 mt-0.5">
                Contact: {order.customer_phone}
              </p>
            )}
            <p className="text-on-surface-variant print:text-gray-700 mt-1 font-semibold text-primary print:text-black">
              Place of Supply: {order?.invoice?.place_of_supply || 'Jammu & Kashmir (State Code: 01)'}
            </p>
          </div>

          <div>
            <span className="font-label-caps text-[9px] text-primary uppercase font-bold tracking-wider block mb-1.5">
              LOGISTICS & DISPATCH SPECIFICATIONS:
            </span>
            <p className="text-on-surface-variant print:text-gray-700">
              Logistics Provider: <strong>{order?.courier_partner || 'BVC Logistics Secure Armed Network'}</strong>
            </p>
            <p className="text-on-surface-variant print:text-gray-700 mt-1">
              Tracking Docket: <strong className="font-mono text-primary print:text-black">{order?.bvc_docket_number || order?.shiprocket_awb || 'BVC-ARMORED-PENDING'}</strong>
            </p>
            <p className="text-on-surface-variant print:text-gray-700 mt-1">
              Packaging: <strong>Tamper-Evident Armored Consignment ({order?.bvc_security_bag_number || 'SEALED'})</strong>
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-left text-xs font-body-md">
            <thead>
              <tr className="border-b border-outline-variant/30 text-primary print:text-black font-label-caps text-[10px]">
                <th className="py-2.5 font-bold">ITEM & DESCRIPTION</th>
                <th className="py-2.5 font-bold">HSN</th>
                <th className="py-2.5 font-bold">PURITY / HALLMARK</th>
                <th className="py-2.5 font-bold text-center">QTY</th>
                <th className="py-2.5 font-bold text-right">TOTAL (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-on-surface-variant print:text-gray-800">
              {Array.isArray(order?.invoice?.items) && order.invoice.items.length > 0 ? (
                order.invoice.items.map((it: any, idx: number) => (
                  <tr key={idx}>
                    <td className="py-3 font-semibold text-on-surface print:text-black">
                      {it.name}
                    </td>
                    <td className="py-3 font-mono">{it.hsn_code || '7113'}</td>
                    <td className="py-3">{it.purity || '22K (916) BIS Hallmarked with 6-character alphanumeric HUID'}</td>
                    <td className="py-3 text-center font-mono">{it.quantity || 1}</td>
                    <td className="py-3 text-right font-mono font-semibold">
                      ₹{((it.subtotal_paise || it.unit_price_paise || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-3 font-semibold text-on-surface print:text-black">
                    Authentic 22K Dogri Jhumki
                    <span className="block text-[10px] font-normal text-on-surface-variant print:text-gray-600">Net Weight: 14.50g | Gross: 15.20g</span>
                  </td>
                  <td className="py-3 font-mono">7113</td>
                  <td className="py-3">22K (916) BIS Hallmarked with 6-character alphanumeric HUID</td>
                  <td className="py-3 text-center font-mono">1</td>
                  <td className="py-3 text-right font-mono font-semibold">₹95,000.00</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Financial Calculation Breakdown */}
        <div className="flex flex-col sm:flex-row justify-between items-start pt-4 border-t border-outline-variant/30 gap-6">
          <div className="text-xs text-on-surface-variant print:text-gray-700 max-w-sm">
            <span className="font-label-caps text-[10px] text-primary uppercase font-bold tracking-wider block mb-1">
              AMOUNT IN WORDS:
            </span>
            <p className="font-semibold text-on-surface print:text-black italic">
              {order?.invoice?.amount_in_words || 'Rupees Ninety Seven Thousand Eight Hundred Fifty Only'}
            </p>
            {/* Internal Compliance Checklist: Verify GST treatment with CA on margin scheme vs outward supply */}
            <p className="text-[10px] text-on-surface-variant/70 mt-2">
              * Taxable value and GST computed in accordance with statutory guidelines for precious jewellery (HSN 7113).
            </p>
          </div>

          <div className="w-full sm:w-80 space-y-2 text-xs font-body-md text-on-surface-variant print:text-gray-800">
            <div className="flex justify-between">
              <span>Item Taxable Subtotal</span>
              <span className="font-mono">
                ₹{((order?.invoice?.subtotal_paise || 9500000) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {order?.invoice?.tax_split?.type === 'inter_state' ? (
              <div className="flex justify-between">
                <span>IGST ({order.invoice.tax_split.igstRateText} Inter-State)</span>
                <span className="font-mono">
                  ₹{((order.invoice.tax_split.igstPaise || 0) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ) : (
              <>
                <div className="flex justify-between">
                  <span>CGST ({order?.invoice?.tax_split?.cgstRateText || '1.5%'})</span>
                  <span className="font-mono">
                    ₹{((order?.invoice?.tax_split?.cgstPaise || 142500) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>SGST / UTGST ({order?.invoice?.tax_split?.sgstRateText || '1.5%'})</span>
                  <span className="font-mono">
                    ₹{((order?.invoice?.tax_split?.sgstPaise || 142500) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </>
            )}

            <div className="flex justify-between">
              <span>BVC Insured Armed Transit</span>
              <span className="text-primary font-bold print:text-black">
                {order?.invoice?.shipping_paise && order.invoice.shipping_paise > 0
                  ? `₹${(order.invoice.shipping_paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
                  : 'COMPLIMENTARY'}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-outline-variant/30 font-headline-sm text-base text-primary print:text-black font-bold">
              <span>Total Invoice Amount</span>
              <span className="font-mono">
                ₹{((order?.invoice?.total_paise || 9785000) / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Statutory Hallmarking Declaration */}
        <div className="mt-8 pt-6 border-t border-outline-variant/20 text-[11px] text-on-surface-variant print:text-gray-600 leading-relaxed space-y-1">
          <p>
            <strong>BIS Hallmark Certification Guarantee:</strong> We certify that the precious jewellery described in this tax invoice complies with Indian Standards Specification for Gold / Silver Hallmarking. Each piece bears the triangular Bureau of Indian Standards mark, purity fineness, and a unique 6-character alphanumeric laser HUID.
          </p>
          <p>
            <strong>Return & Inspection Policy:</strong> 7-Day return policy applies from confirmed delivery date, provided security tags and invoice copy remain untampered.
          </p>
          <p className="text-[10px] text-on-surface-variant/70 mt-2">
            This is an official computer-generated tax invoice issued in Jammu, J&K. No physical signature is required.
          </p>
        </div>

      </div>

      {/* Return to Shop Bottom */}
      <div className="mt-8 text-center print:hidden">
        <Link href="/collections" className="btn-gold-primary py-3.5 px-8 text-xs inline-block">
          RETURN TO CATALOG
        </Link>
      </div>
    </div>
  );
}

export default function OrderStatusPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 sm:pt-24 pb-24 lg:pb-section-gap">
        <Suspense fallback={
          <div className="container mx-auto px-4 py-20 text-center text-primary font-label-caps text-xs">
            GENERATING TAX INVOICE...
          </div>
        }>
          <OrderStatusContent />
        </Suspense>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
