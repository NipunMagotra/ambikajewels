'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Link from 'next/link';
import { WhatsAppButton, CallButton } from '@/components/ui/ContactButtons';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';
  const initialToken = searchParams.get('token') || '';

  const [orderId, setOrderId] = useState(initialOrderId);
  const [contact, setContact] = useState('');
  const [token, setToken] = useState(initialToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackingData, setTrackingData] = useState<any>(null);

  const fetchTracking = async (ord: string, cont: string, tok?: string) => {
    if (!ord.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append('orderId', ord.trim().toUpperCase());

      if (tok) {
        params.append('token', tok.trim());
      } else if (cont.includes('@')) {
        params.append('email', cont.trim().toLowerCase());
      } else if (cont.trim()) {
        params.append('phone', cont.trim());
      }

      const res = await fetch(`/api/track?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setTrackingData(data.order);
      } else {
        setError(data.error || 'No consignment found matching these credentials.');
        setTrackingData(null);
      }
    } catch {
      setError('Unable to fetch live tracking details. Please try again.');
      setTrackingData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId && initialToken) {
      fetchTracking(initialOrderId, '', initialToken);
    }
  }, [initialOrderId, initialToken]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(orderId, contact, token);
  };

  return (
    <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 font-label-caps text-[10px] text-on-surface-variant mb-6">
        <Link href="/" className="hover:text-primary">HOME</Link>
        <span>/</span>
        <span className="text-primary font-bold">ORDER TRACKING</span>
      </div>

      <div className="text-center mb-10">
        <span className="font-label-caps text-xs text-primary font-bold tracking-widest block mb-2">
          LIVE CONSIGNMENT TRACKER
        </span>
        <h1 className="font-headline-md text-3xl sm:text-5xl text-primary font-semibold mb-3">
          Track Your Jewellery Delivery
        </h1>
        <p className="font-body-md text-xs sm:text-sm text-on-surface-variant max-w-xl mx-auto">
          Enter your Order Reference Number and verified Phone or Email to view real-time delivery status securely.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-surface-container border border-outline-variant/30 p-6 sm:p-8 rounded-xs mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-label-caps text-[10px] text-on-surface-variant block mb-1.5 font-semibold">
                ORDER NUMBER *
              </label>
              <input 
                type="text" 
                required
                value={orderId}
                onChange={e => setOrderId(e.target.value.toUpperCase())}
                placeholder="e.g. AMB-123456"
                className="w-full bg-background border border-outline px-4 py-3 text-on-surface font-body-md text-sm outline-none focus:border-primary uppercase tracking-wider rounded-xs transition-colors"
              />
            </div>

            <div>
              <label className="font-label-caps text-[10px] text-on-surface-variant block mb-1.5 font-semibold">
                PHONE NUMBER OR EMAIL *
              </label>
              <input 
                type="text" 
                required={!token}
                value={contact}
                onChange={e => setContact(e.target.value)}
                placeholder="e.g. 9876543210 or ananya@example.com"
                className="w-full bg-background border border-outline px-4 py-3 text-on-surface font-body-md text-sm outline-none focus:border-primary rounded-xs transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              disabled={loading || !orderId.trim() || (!contact.trim() && !token)}
              className="btn-gold-primary py-3.5 px-8 text-xs flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50"
            >
              {loading ? (
                <span>TRACKING...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">search</span>
                  <span>TRACK SHIPMENT</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-950/30 border border-red-500/40 text-red-300 text-xs sm:text-sm rounded-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Tracking Result Card */}
      {trackingData && (
        <div className="bg-surface-container border border-outline-variant/30 p-6 sm:p-10 rounded-xs mb-8 animate-in fade-in duration-200">
          
          {/* Header Summary */}
          <div className="border-b border-outline-variant/20 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="font-label-caps text-[10px] text-primary tracking-widest block font-bold mb-1">
                EXPRESS TRACKED TRANSIT
              </span>
              <h2 className="font-headline-sm text-2xl text-on-surface font-bold">
                Order #{trackingData.order_number}
              </h2>
              <p className="font-body-md text-xs text-on-surface-variant mt-1">
                Courier: <strong>{trackingData.courier_partner}</strong> | AWB: <code className="text-primary font-bold">{trackingData.shiprocket_awb}</code>
              </p>
              <p className="font-body-md text-xs text-on-surface-variant mt-0.5">
                Destination: <strong>{trackingData.shipping_address}</strong>
              </p>
            </div>

            <div className="bg-background border border-outline-variant/30 p-4 rounded-xs text-left md:text-right">
              <span className="font-label-caps text-[9px] text-on-surface-variant uppercase tracking-wider block">ESTIMATED DELIVERY</span>
              <span className="font-headline-sm text-lg text-primary font-bold">{trackingData.estimated_delivery}</span>
              <span className="font-label-caps text-[9px] text-green-400 block font-semibold mt-0.5">VERIFIED DISPATCH</span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-outline-variant/30">
            {trackingData.timeline.map((step: any, idx: number) => (
              <div key={idx} className="relative flex items-start gap-4">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 z-10 transition-colors ${
                  step.completed 
                    ? 'bg-primary border-primary text-background' 
                    : step.current 
                    ? 'bg-background border-primary text-primary animate-pulse' 
                    : 'bg-background border-outline-variant text-on-surface-variant/40'
                }`}>
                  <span className="material-symbols-outlined text-sm font-bold">
                    {step.completed ? 'check' : 'radio_button_checked'}
                  </span>
                </div>
                <div className="bg-background border border-outline-variant/20 p-4 rounded-xs flex-1">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 mb-1">
                    <h4 className={`font-headline-sm text-sm font-semibold ${step.completed || step.current ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {step.stage}
                    </h4>
                    <span className="font-label-caps text-[10px] text-on-surface-variant/70">
                      {step.timestamp}
                    </span>
                  </div>
                  <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Inspection Alert */}
          <div className="mt-8 p-4 bg-surface-container-high border border-outline-variant/30 rounded-xs flex items-start gap-3 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5">security</span>
            <div>
              <span className="font-semibold text-on-surface block mb-0.5">Delivery Security Note:</span>
              Please check that the outer tamper-evident security seal on your package is intact before signing the courier receipt or providing OTP.
            </div>
          </div>
        </div>
      )}

      {/* Support Box */}
      <div className="bg-surface-container border border-outline-variant/30 p-6 rounded-xs flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="font-headline-sm text-base text-primary font-semibold mb-1">Need Urgent Dispatch Support?</h3>
          <p className="font-body-md text-xs text-on-surface-variant">
            Contact our Jammu showroom dispatch desk directly for immediate location checks.
          </p>
        </div>
        <div className="flex gap-2.5 shrink-0">
          <WhatsAppButton />
          <CallButton />
        </div>
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 sm:pt-32 pb-24 lg:pb-section-gap">
        <Suspense fallback={
          <div className="container mx-auto px-4 py-20 text-center text-primary font-label-caps text-xs">
            LOADING TRACKING PORTAL...
          </div>
        }>
          <TrackOrderContent />
        </Suspense>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
