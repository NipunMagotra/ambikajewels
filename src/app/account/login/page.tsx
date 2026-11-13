'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/account';

  const [identifier, setIdentifier] = useState('');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Check if customer is already logged in
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.customer) {
          router.replace(redirectTarget);
        }
      })
      .catch(() => {});
  }, [router, redirectTarget]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your email or 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim() })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStep('otp');
        setMessage(data.message || 'Verification code sent!');
        setResendCooldown(60);
        if (data.testOtp) {
          setOtp(data.testOtp);
        }
      } else {
        setError(data.message || 'Failed to send verification code.');
        if (data.cooldownSeconds) {
          setResendCooldown(data.cooldownSeconds);
        }
      }
    } catch {
      setError('Connection error. Please check your internet and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) {
      setError('Please enter the 6-digit code sent to your email.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), code: otp.trim() })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        router.push(redirectTarget);
        router.refresh();
      } else {
        setError(data.message || 'Invalid or expired verification code.');
      }
    } catch {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[var(--bg-card)] border border-[var(--accent-gold)]/30 rounded-[4px] p-8 shadow-2xl backdrop-blur-md">
      {/* Royal Crest / Brand Badge */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full border border-[var(--accent-gold)]/40 flex items-center justify-center bg-[var(--accent-gold)]/5">
          <span className="material-symbols-outlined text-[var(--accent-gold)] text-2xl">diamond</span>
        </div>
        <h1 className="font-serif text-2xl text-[var(--text-primary)] tracking-wider">
          {step === 'input' ? 'Sign In / Register' : 'Enter Security Code'}
        </h1>
        <p className="font-sans text-xs text-[var(--text-secondary)] mt-1.5 tracking-wide">
          {step === 'input'
            ? 'Access your orders, track dispatches & manage heirloom pieces'
            : `Enter the 6-digit code sent to ${identifier}`}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-950/20 border border-red-500/30 rounded text-red-400 text-xs text-center flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">error</span>
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="mb-6 p-3 bg-emerald-950/20 border border-emerald-500/30 rounded text-emerald-400 text-xs text-center flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          <span>{message}</span>
        </div>
      )}

      {step === 'input' ? (
        <form onSubmit={handleSendOtp} className="space-y-5">
          <div>
            <label className="block text-[11px] font-sans uppercase tracking-wider text-[var(--text-secondary)] font-medium mb-1.5">
              Email Address or Mobile Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="name@example.com or 9876543210"
                required
                autoFocus
                className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] rounded px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none transition-colors"
              />
              <span className="material-symbols-outlined absolute right-3 top-3 text-[var(--text-secondary)] text-lg pointer-events-none">
                mail
              </span>
            </div>
            <p className="text-[10px] text-[var(--text-secondary)] mt-1.5">
              We will send a one-time 6-digit password-free security code.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[var(--accent-gold)] text-black font-sans font-semibold text-xs tracking-widest uppercase hover:bg-[var(--accent-gold)]/90 transition-all rounded shadow-md cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Sending Code...' : 'Get Security Code →'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[11px] font-sans uppercase tracking-wider text-[var(--text-secondary)] font-medium">
                6-Digit Security Code
              </label>
              <button
                type="button"
                onClick={() => {
                  setStep('input');
                  setError(null);
                  setMessage(null);
                }}
                className="text-[10px] text-[var(--accent-gold)] hover:underline cursor-pointer"
              >
                Change identifier
              </button>
            </div>

            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              required
              maxLength={6}
              autoFocus
              className="w-full bg-[var(--bg-surface)] border border-[var(--accent-gold)] rounded px-4 py-3 text-center font-mono text-2xl tracking-[0.4em] text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-gold)]"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full py-3.5 bg-[var(--accent-gold)] text-black font-sans font-semibold text-xs tracking-widest uppercase hover:bg-[var(--accent-gold)]/90 transition-all rounded shadow-md cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify & Continue →'}
          </button>

          <div className="text-center pt-2">
            {resendCooldown > 0 ? (
              <span className="text-[11px] text-[var(--text-secondary)]">
                Resend code in <strong className="text-[var(--text-primary)]">{resendCooldown}s</strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => handleSendOtp()}
                disabled={loading}
                className="text-xs text-[var(--accent-gold)] hover:underline font-medium cursor-pointer"
              >
                Resend Code
              </button>
            )}
          </div>
        </form>
      )}

      {/* Showroom Assurance Footer */}
      <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] text-center text-[10px] text-[var(--text-secondary)] space-y-1">
        <p>🔒 256-Bit Encrypted Session &bull; DPDP Act 2023 Compliant</p>
        <p>Need assistance? Contact our concierge at <a href="tel:+919682589725" className="text-[var(--accent-gold)] underline">+91 96825 89725</a></p>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--bg-surface)] pt-28 pb-20 px-4 flex items-center justify-center">
        <Suspense fallback={<div className="text-center py-20 text-xs">Loading login...</div>}>
          <LoginFormContent />
        </Suspense>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

