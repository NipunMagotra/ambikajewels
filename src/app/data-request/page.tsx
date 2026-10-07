'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Link from 'next/link';
import { siteConfig } from '@/config/siteConfig';

export default function DataRequestPage() {
  const [requestType, setRequestType] = useState<'access' | 'correction' | 'erasure'>('access');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseResult, setResponseResult] = useState<{
    success: boolean;
    ticket_id?: string;
    message?: string;
    error?: string;
    statutory_notice?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResponseResult(null);

    try {
      const res = await fetch('/api/data-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType,
          fullName,
          email,
          phone,
          details
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit request');
      }

      setResponseResult(data);
    } catch (err: any) {
      setResponseResult({
        success: false,
        error: err.message || 'An error occurred while submitting your request.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 sm:pt-32 pb-24 lg:pb-section-gap">
        <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop max-w-3xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-label-caps text-[10px] text-on-surface-variant mb-6">
            <Link href="/" className="hover:text-primary">HOME</Link>
            <span>/</span>
            <Link href="/privacy-policy" className="hover:text-primary">PRIVACY</Link>
            <span>/</span>
            <span className="text-primary font-bold">DATA RIGHTS PORTAL</span>
          </div>

          <div className="bg-surface-container border border-outline-variant/30 p-6 sm:p-10 rounded-xs">
            <div className="border-b border-outline-variant/20 pb-4 mb-6">
              <span className="font-label-caps text-xs text-primary font-bold tracking-widest block mb-1">
                DIGITAL PERSONAL DATA PROTECTION ACT, 2023
              </span>
              <h1 className="font-headline-md text-2xl sm:text-3xl text-primary font-bold">
                Data Principal Rights Request Portal
              </h1>
              <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
                Under the DPDP Act 2023, you have the right to request access to your personal data, request correction of inaccurate records, or request erasure of your data.
              </p>
            </div>

            {responseResult && responseResult.success ? (
              <div className="bg-background/90 border border-primary/40 p-6 rounded-xs space-y-4 text-center">
                <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto border border-primary">
                  <span className="material-symbols-outlined text-2xl">check_circle</span>
                </div>
                <h3 className="font-headline-sm text-xl text-primary font-bold">Request Logged Successfully</h3>
                <p className="text-xs font-mono bg-surface-container-high py-2 px-3 inline-block rounded border border-outline-variant/30">
                  Reference Ticket: <strong>{responseResult.ticket_id}</strong>
                </p>
                <p className="text-xs text-on-surface leading-relaxed max-w-lg mx-auto">
                  {responseResult.message}
                </p>
                {responseResult.statutory_notice && (
                  <div className="text-[11px] text-amber-300 bg-amber-950/20 p-3 rounded border border-amber-500/30 text-left">
                    {responseResult.statutory_notice}
                  </div>
                )}
                <button
                  onClick={() => {
                    setResponseResult(null);
                    setDetails('');
                  }}
                  className="font-label-caps text-xs text-primary underline mt-2 block mx-auto"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {responseResult && !responseResult.success && (
                  <div className="p-3 bg-red-950/20 border border-red-500/40 text-red-300 text-xs rounded-xs">
                    {responseResult.error}
                  </div>
                )}

                {/* Step 1: Select Request Type */}
                <div>
                  <label className="font-label-caps text-xs text-primary font-bold block mb-3">
                    1. SELECT ACTION REQUESTED *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className={`p-3.5 border rounded-xs cursor-pointer transition-all flex flex-col justify-between ${
                      requestType === 'access' 
                        ? 'bg-primary-container/20 border-primary text-primary' 
                        : 'bg-surface-container-high border-outline-variant/40 text-on-surface-variant'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <input 
                          type="radio" 
                          name="requestType" 
                          value="access" 
                          checked={requestType === 'access'} 
                          onChange={() => setRequestType('access')} 
                          className="accent-primary"
                        />
                        <span className="font-semibold text-xs text-on-surface">Access My Data</span>
                      </div>
                      <p className="text-[10px] text-on-surface-variant">Request summary of all personal data held.</p>
                    </label>

                    <label className={`p-3.5 border rounded-xs cursor-pointer transition-all flex flex-col justify-between ${
                      requestType === 'correction' 
                        ? 'bg-primary-container/20 border-primary text-primary' 
                        : 'bg-surface-container-high border-outline-variant/40 text-on-surface-variant'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <input 
                          type="radio" 
                          name="requestType" 
                          value="correction" 
                          checked={requestType === 'correction'} 
                          onChange={() => setRequestType('correction')} 
                          className="accent-primary"
                        />
                        <span className="font-semibold text-xs text-on-surface">Correct Details</span>
                      </div>
                      <p className="text-[10px] text-on-surface-variant">Update inaccurate contact or shipping data.</p>
                    </label>

                    <label className={`p-3.5 border rounded-xs cursor-pointer transition-all flex flex-col justify-between ${
                      requestType === 'erasure' 
                        ? 'bg-primary-container/20 border-primary text-primary' 
                        : 'bg-surface-container-high border-outline-variant/40 text-on-surface-variant'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <input 
                          type="radio" 
                          name="requestType" 
                          value="erasure" 
                          checked={requestType === 'erasure'} 
                          onChange={() => setRequestType('erasure')} 
                          className="accent-primary"
                        />
                        <span className="font-semibold text-xs text-on-surface">Erase My Data</span>
                      </div>
                      <p className="text-[10px] text-on-surface-variant">Delete non-statutory records.</p>
                    </label>
                  </div>
                </div>

                {/* Step 2: Customer Identity */}
                <div className="space-y-4">
                  <label className="font-label-caps text-xs text-primary font-bold block">
                    2. VERIFY YOUR IDENTITY
                  </label>

                  <div>
                    <label className="font-label-caps text-[10px] text-on-surface-variant block mb-1">FULL LEGAL NAME *</label>
                    <input 
                      required
                      type="text" 
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Ananya Sharma"
                      className="w-full bg-transparent border-b border-outline focus:border-primary text-on-surface font-body-md text-sm py-2 outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-label-caps text-[10px] text-on-surface-variant block mb-1">REGISTERED EMAIL *</label>
                      <input 
                        required
                        type="email" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="e.g. ananya@example.com"
                        className="w-full bg-transparent border-b border-outline focus:border-primary text-on-surface font-body-md text-sm py-2 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="font-label-caps text-[10px] text-on-surface-variant block mb-1">REGISTERED 10-DIGIT MOBILE NUMBER *</label>
                      <input 
                        required
                        type="tel" 
                        maxLength={10}
                        value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 9876543210"
                        className="w-full bg-transparent border-b border-outline focus:border-primary text-on-surface font-body-md text-sm py-2 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-label-caps text-[10px] text-on-surface-variant block mb-1">SPECIFIC REQUEST DETAILS (OPTIONAL)</label>
                    <textarea 
                      rows={3}
                      value={details}
                      onChange={e => setDetails(e.target.value)}
                      placeholder={requestType === 'correction' ? "Describe the incorrect data and your updated details..." : "Any specific order numbers or instructions..."}
                      className="w-full bg-transparent border-b border-outline focus:border-primary text-on-surface font-body-md text-sm py-2 outline-none transition-colors resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Statutory Caveat */}
                <div className="bg-background/60 p-4 border border-outline-variant/30 rounded-xs text-[11px] text-on-surface-variant leading-relaxed">
                  <strong>Statutory Notice under Indian Law:</strong> Official GST tax invoices, transaction totals, and CBDT PAN records are mandated to be retained for 8 financial years under Section 36 of CGST Act and Section 44AB of Income Tax Act. Such records cannot be deleted prior to the statutory retention expiration.
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-primary text-on-primary font-label-caps text-xs font-bold hover:bg-primary/90 transition-all rounded-xs disabled:opacity-50"
                  >
                    {isSubmitting ? 'LOGGING REQUEST...' : 'SUBMIT PRIVACY REQUEST'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
