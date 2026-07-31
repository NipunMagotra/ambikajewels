'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError('Please enter the admin passcode.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin/pgold');
        router.refresh();
      } else {
        setError(data.message || 'Invalid admin passcode.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background pt-28 pb-16 flex items-center justify-center px-4 mandala-overlay">
      <div className="max-w-md w-full glass-panel p-8 rounded-xs border border-primary/30 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-3">
            <span className="font-headline-md text-2xl tracking-[0.2em] gold-text-gradient font-bold">
              AMBIKA JEWELS
            </span>
          </Link>
          <div className="font-label-caps text-xs tracking-[0.25em] text-primary font-bold">
            ADMINISTRATOR PORTAL
          </div>
          <p className="text-xs text-on-surface-variant/80 mt-2">
            Enter the admin passcode to access P-Gold management & store settings.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-error-container/40 border border-error/50 rounded-xs text-error text-xs text-center flex items-center gap-2 justify-center">
            <span className="material-symbols-outlined text-sm">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[11px] font-label-caps tracking-widest text-on-surface-variant mb-2">
              ADMIN PASSCODE
            </label>
            <div className="relative">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode..."
                className="w-full bg-surface-container/80 border border-outline-variant/50 focus:border-primary px-4 py-3 text-sm text-on-surface rounded-xs focus:outline-none transition-colors pr-10"
                autoFocus
              />
              <span className="material-symbols-outlined absolute right-3 top-3 text-primary/60 text-lg">
                lock
              </span>
            </div>
            <p className="text-[10px] text-on-surface-variant/50 mt-1">
              Default passcode: <code className="text-primary font-mono font-semibold">ambika2026</code>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full gold-bg-gradient py-3 text-xs font-label-caps tracking-[0.25em] font-bold rounded-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                VERIFYING...
              </>
            ) : (
              <>
                <span>ACCESS ADMIN DASHBOARD</span>
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
