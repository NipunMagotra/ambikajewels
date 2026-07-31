'use client';

import { useState } from 'react';

interface PGoldBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  amountInr: number;
  weightGrams: number;
  purity: '24K' | '22K';
  goldRate: number;
}

export default function PGoldBuyModal({
  isOpen,
  onClose,
  amountInr,
  weightGrams,
  purity,
  goldRate
}: PGoldBuyModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<any | null>(null);

  if (!isOpen) return null;

  const gstAmount = Math.round(amountInr - (amountInr / 1.03));
  const netGoldAmount = amountInr - gstAmount;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Step 1: Create P-Gold order in DB / API
      const res = await fetch('/api/pgold/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: name.trim(),
          customer_phone: phone.trim(),
          customer_email: email.trim(),
          amount_inr: amountInr,
          weight_grams: weightGrams,
          purity
        })
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || 'Failed to create P-Gold order.');
        setLoading(false);
        return;
      }

      const orderData = data.data;

      // Check if Razorpay JS script is loaded or in future-ready mode
      if (typeof window !== 'undefined' && (window as any).Razorpay && orderData.razorpay_key_id && !orderData.is_demo) {
        const options = {
          key: orderData.razorpay_key_id,
          amount: Math.round(amountInr * 100),
          currency: 'INR',
          name: 'Ambika Jewels',
          description: `Purchase of ${weightGrams}g ${purity} P-Gold`,
          image: '/favicon.ico',
          order_id: orderData.razorpay_order_id,
          handler: async function (response: any) {
            // Verify payment
            const verifyRes = await fetch('/api/pgold/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                transaction_id: orderData.transaction_id
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setSuccessData({
                transaction_number: orderData.transaction_number,
                amount: amountInr,
                weight: weightGrams,
                purity
              });
            } else {
              setError('Payment verification failed.');
            }
            setLoading(false);
          },
          prefill: {
            name: name.trim(),
            contact: phone.trim(),
            email: email.trim()
          },
          theme: {
            color: '#e6ca65'
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Simulated / Future-ready mode confirmation
        const verifyRes = await fetch('/api/pgold/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transaction_id: orderData.transaction_id,
            is_demo: true
          })
        });
        const verifyData = await verifyRes.json();

        setSuccessData({
          transaction_number: orderData.transaction_number,
          amount: amountInr,
          weight: weightGrams,
          purity,
          is_demo: true
        });
        setLoading(false);
      }
    } catch (err) {
      console.error('Order checkout error:', err);
      setError('An error occurred while processing your order.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel max-w-lg w-full p-6 sm:p-8 rounded-xs border border-primary/40 space-y-6 animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
          <div>
            <span className="text-[10px] font-label-caps text-primary tracking-widest font-bold">
              SECURE CHECKOUT
            </span>
            <h3 className="font-headline-md text-xl text-on-surface font-bold">
              {successData ? 'Purchase Successful!' : `Buy ${purity} P-Gold`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Success View */}
        {successData ? (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mx-auto shadow-xl">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>

            <div className="space-y-2">
              <h4 className="font-headline-md text-lg text-primary font-bold">
                Gold Accumulation Confirmed!
              </h4>
              <p className="text-xs text-on-surface-variant/90">
                Your P-Gold order has been logged successfully under digital ledger receipt:
              </p>
              <div className="font-mono text-sm font-bold text-on-surface bg-surface-container/80 p-2 rounded-xs inline-block">
                {successData.transaction_number}
              </div>
            </div>

            <div className="bg-surface-container/60 p-4 rounded-xs border border-outline-variant/30 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Accumulated Weight:</span>
                <strong className="text-primary font-mono">{successData.weight} grams ({successData.purity})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Amount Paid:</span>
                <strong className="text-on-surface font-mono">₹{successData.amount.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between border-t border-outline-variant/20 pt-2">
                <span className="text-on-surface-variant">Redemption Venue:</span>
                <span className="text-on-surface font-semibold">Ambika Jewels Jammu Showroom</span>
              </div>
            </div>

            {successData.is_demo && (
              <p className="text-[10px] text-amber-400/90 italic">
                * Note: System is in future-ready payment integration mode. Payment gateways (Razorpay) can be directly linked via environment keys.
              </p>
            )}

            <button
              onClick={onClose}
              className="w-full gold-bg-gradient py-3 text-xs font-label-caps tracking-widest font-bold rounded-xs hover:opacity-90 transition-all"
            >
              DONE & RETURN TO P-GOLD
            </button>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmitOrder} className="space-y-5">
            {/* Order Summary Card */}
            <div className="bg-surface-container/80 p-4 rounded-xs border border-outline-variant/40 space-y-2 text-xs">
              <div className="flex justify-between items-center text-on-surface font-semibold border-b border-outline-variant/20 pb-2">
                <span>P-Gold Package:</span>
                <span className="text-primary font-bold">{purity} (999 Pure)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Gold Rate Locked:</span>
                <span className="font-mono">₹{goldRate.toLocaleString('en-IN')}/g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Net Gold Weight:</span>
                <strong className="text-primary font-mono">{weightGrams} grams</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Govt GST (3%):</span>
                <span className="font-mono">₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-outline-variant/30 text-sm font-bold">
                <span className="text-on-surface">Total Amount:</span>
                <span className="text-emerald-400 font-mono">₹{amountInr.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-error-container/30 border border-error/50 rounded-xs text-error text-xs text-center">
                {error}
              </div>
            )}

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-label-caps text-on-surface-variant font-bold mb-1">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name..."
                  className="w-full bg-surface-container border border-outline-variant/50 focus:border-primary px-3 py-2 text-xs text-on-surface rounded-xs focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-label-caps text-on-surface-variant font-bold mb-1">
                  MOBILE NUMBER *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit phone number..."
                  className="w-full bg-surface-container border border-outline-variant/50 focus:border-primary px-3 py-2 text-xs font-mono text-on-surface rounded-xs focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-label-caps text-on-surface-variant font-bold mb-1">
                  EMAIL ADDRESS (OPTIONAL FOR RECEIPT)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-surface-container border border-outline-variant/50 focus:border-primary px-3 py-2 text-xs text-on-surface rounded-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full gold-bg-gradient py-3.5 text-xs font-label-caps tracking-[0.2em] font-bold rounded-xs hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                  <span>INITIATING PAYMENT...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">lock</span>
                  <span>PROCEED TO PAY ₹{amountInr.toLocaleString('en-IN')}</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-on-surface-variant/70">
              🔒 Safe & Encrypted • Backed by 100% Physical 24K Pure Hallmark Gold
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
