'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [requiresMfa, setRequiresMfa] = useState(false);
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter your staff email and password.');
      return;
    }

    if (requiresMfa && !useRecoveryCode && !mfaCode.trim()) {
      setError('Please enter the 6-digit Authenticator code.');
      return;
    }

    if (requiresMfa && useRecoveryCode && !recoveryCode.trim()) {
      setError('Please enter your emergency backup recovery code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload: Record<string, string> = {
        email: email.trim(),
        password: password.trim()
      };

      if (requiresMfa) {
        if (useRecoveryCode) {
          payload.recovery_code = recoveryCode.trim();
        } else {
          payload.mfa_code = mfaCode.trim();
        }
      }

      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const rawTarget =
          (typeof window !== 'undefined' &&
            new URLSearchParams(window.location.search).get('redirect')) ||
          '/admin';
        const target =
          rawTarget.startsWith('/') && !rawTarget.startsWith('//') ? rawTarget : '/admin';
        router.push(target);
        router.refresh();
      } else if (data.requires_mfa) {
        setRequiresMfa(true);
        setError('');
      } else {
        setError(data.message || 'Invalid credentials or login rejected.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-on-background pt-28 pb-16 flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 mandala-bg-pattern pointer-events-none z-0" />
      <div className="max-w-md w-full glass-panel p-8 rounded-xs border border-primary/30 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-3">
            <span className="font-headline-md text-2xl tracking-[0.2em] gold-text-gradient font-bold">
              AMBIKA JEWELS
            </span>
          </Link>
          <div className="font-label-caps text-xs tracking-[0.25em] text-primary font-bold">
            STAFF & OWNER PORTAL
          </div>
          <p className="text-xs text-on-surface-variant/80 mt-2">
            Enter your individual staff credentials. Owner accounts require Multi-Factor Authentication.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-error-container/40 border border-error/50 rounded-xs text-error text-xs text-center flex items-center gap-2 justify-center">
            <span className="material-symbols-outlined text-sm">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-label-caps tracking-widest text-on-surface-variant mb-1">
              STAFF EMAIL ADDRESS
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. owner@ambikajewelsonline.com"
                className="w-full bg-surface-container/80 border border-outline-variant/50 focus:border-primary px-4 py-3 text-sm text-on-surface rounded-xs focus:outline-none transition-colors pr-10"
                autoFocus
                disabled={loading || requiresMfa}
              />
              <span className="material-symbols-outlined absolute right-3 top-3 text-primary/60 text-lg">
                mail
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-label-caps tracking-widest text-on-surface-variant mb-1">
              PASSWORD
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-surface-container/80 border border-outline-variant/50 focus:border-primary px-4 py-3 text-sm text-on-surface rounded-xs focus:outline-none transition-colors pr-10"
                disabled={loading || requiresMfa}
              />
              <span className="material-symbols-outlined absolute right-3 top-3 text-primary/60 text-lg">
                lock
              </span>
            </div>
          </div>

          {requiresMfa && !useRecoveryCode && (
            <div className="pt-2 border-t border-primary/20">
              <label className="block text-[11px] font-label-caps tracking-widest text-primary font-bold mb-1">
                6-DIGIT AUTHENTICATOR CODE (MFA)
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full bg-surface-container/80 border border-primary px-4 py-3 text-lg font-mono tracking-widest text-center text-on-surface rounded-xs focus:outline-none"
                  autoFocus
                />
              </div>
              <div className="text-right mt-1">
                <button
                  type="button"
                  onClick={() => setUseRecoveryCode(true)}
                  className="text-[10px] text-primary hover:underline font-label-caps"
                >
                  Use emergency recovery code instead
                </button>
              </div>
            </div>
          )}

          {requiresMfa && useRecoveryCode && (
            <div className="pt-2 border-t border-primary/20">
              <label className="block text-[11px] font-label-caps tracking-widest text-primary font-bold mb-1">
                EMERGENCY RECOVERY CODE
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={recoveryCode}
                  onChange={(e) => setRecoveryCode(e.target.value)}
                  placeholder="AMB-REC-XXXX-XXXX"
                  className="w-full bg-surface-container/80 border border-primary px-4 py-3 text-sm font-mono tracking-wider text-center text-on-surface rounded-xs focus:outline-none"
                  autoFocus
                />
              </div>
              <div className="text-right mt-1">
                <button
                  type="button"
                  onClick={() => setUseRecoveryCode(false)}
                  className="text-[10px] text-primary hover:underline font-label-caps"
                >
                  Use 6-digit Authenticator code instead
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full gold-bg-gradient py-3 text-xs font-label-caps tracking-[0.25em] font-bold rounded-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                VERIFYING...
              </>
            ) : requiresMfa ? (
              <>
                <span>VERIFY MFA & ENTER</span>
                <span className="material-symbols-outlined text-sm">security</span>
              </>
            ) : (
              <>
                <span>SIGN IN TO PORTAL</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-outline-variant/20 text-center">
          <Link
            href="/"
            className="text-[11px] font-label-caps text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-xs">arrow_back</span>
            <span>RETURN TO STORE FRONT</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
