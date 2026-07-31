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
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#221312] max-w-lg w-full p-6 sm:p-8 rounded-md border-2 border-amber-500/50 space-y-6 animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden shadow-2xl">
        {/* Glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-4">
          <div>
            <span className="text-xs font-label-caps text-amber-400 tracking-widest font-bold">
              SECURE CHECKOUT
            </span>
            <h3 className="font-headline-md text-xl sm:text-2xl text-white font-bold">
              {successData ? 'Purchase Successful!' : `Buy ${purity} P-Gold`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-amber-200 hover:text-white text-3xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Success View */}
        {successData ? (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 bg-emerald-950 text-emerald-300 border-2 border-emerald-500/50 rounded-full flex items-center justify-center mx-auto shadow-xl">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>

            <div className="space-y-2">
              <h4 className="font-headline-md text-xl text-amber-300 font-bold">
                Gold Accumulation Confirmed!
              </h4>
              <p className="text-sm text-amber-50 font-normal">
                Your P-Gold order has been logged successfully under digital ledger receipt:
              </p>
              <div className="font-mono text-base font-bold text-white bg-[#160b0a] p-3 rounded border border-amber-500/40 inline-block">
                {successData.transaction_number}
              </div>
            </div>

            <div className="bg-[#160b0a] p-5 rounded border border-amber-500/40 text-sm text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-amber-200">Accumulated Weight:</span>
                <strong className="text-amber-300 font-mono text-base">{successData.weight} grams ({successData.purity})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-200">Amount Paid:</span>
                <strong className="text-white font-mono text-base">₹{successData.amount.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between border-t border-amber-500/30 pt-3">
                <span className="text-amber-200">Redemption Venue:</span>
                <span className="text-white font-semibold">Ambika Jewels Jammu Showroom</span>
              </div>
            </div>

            {successData.is_demo && (
              <p className="text-xs text-amber-300 italic">
                * Note: System is in future-ready payment integration mode. Payment gateways (Razorpay) can be directly linked via environment keys.
              </p>
            )}

            <button
              onClick={onClose}
              className="w-full gold-bg-gradient py-3.5 text-xs font-label-caps tracking-widest font-extrabold text-black rounded hover:opacity-90 transition-all"
            >
              DONE & RETURN TO P-GOLD
            </button>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmitOrder} className="space-y-6">
            {/* Order Summary Card */}
            <div className="bg-[#160b0a] p-5 rounded-md border border-amber-500/40 space-y-2.5 text-sm">
              <div className="flex justify-between items-center text-white font-bold border-b border-amber-500/30 pb-2">
                <span>P-Gold Package:</span>
                <span className="text-amber-300 font-bold">{purity} (999 Pure)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-200">Gold Rate Locked:</span>
                <span className="font-mono text-white font-semibold">₹{goldRate.toLocaleString('en-IN')}/g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-200">Net Gold Weight:</span>
                <strong className="text-amber-300 font-mono">{weightGrams} grams</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-200">Govt GST (3%):</span>
                <span className="font-mono text-white">₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-amber-500/40 text-base font-bold">
                <span className="text-white">Total Amount:</span>
                <span className="text-emerald-400 font-mono text-lg">₹{amountInr.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-950/90 border-2 border-red-500/80 rounded text-red-200 text-sm text-center font-semibold">
                {error}
              </div>
            )}

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-label-caps text-amber-300 font-bold mb-1.5">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name..."
                  className="w-full bg-[#160b0a] border-2 border-amber-500/40 focus:border-amber-300 px-4 py-3 text-sm font-semibold text-white rounded focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-label-caps text-amber-300 font-bold mb-1.5">
                  MOBILE NUMBER *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit phone number..."
                  className="w-full bg-[#160b0a] border-2 border-amber-500/40 focus:border-amber-300 px-4 py-3 text-sm font-mono font-semibold text-white rounded focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-label-caps text-amber-300 font-bold mb-1.5">
                  EMAIL ADDRESS (OPTIONAL FOR RECEIPT)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-[#160b0a] border-2 border-amber-500/40 focus:border-amber-300 px-4 py-3 text-sm text-white rounded focus:outline-none"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full gold-bg-gradient py-4 text-xs font-label-caps tracking-[0.2em] font-extrabold text-black rounded hover:opacity-95 transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">sync</span>
                  <span>INITIATING PAYMENT...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">lock</span>
                  <span>PROCEED TO PAY ₹{amountInr.toLocaleString('en-IN')}</span>
                </>
              )}
            </button>

            <p className="text-xs text-center text-amber-200 font-medium">
              🔒 Safe & Encrypted • Backed by 100% Physical 24K Pure Hallmark Gold
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
