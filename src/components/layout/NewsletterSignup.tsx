'use client';

import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setMessage(data.message || 'Thank you for subscribing.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-card)] p-5 sm:p-6 rounded-[2px] mb-8 shadow-xs">
      <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <span className="font-sans text-[9px] text-[var(--accent-gold)] tracking-[0.3em] font-semibold uppercase block mb-1">
            AMBIKA PRIVÉ
          </span>
          <h3 className="font-serif text-lg sm:text-xl text-[var(--text-primary)] font-normal">
            Subscribe for Dogra Couture &amp; Seasonal Previews
          </h3>
          <p className="font-sans text-xs text-[var(--text-secondary)] mt-1 font-light">
            Receive private exhibition invitations, auspicious muhurat updates, and exclusive bridal catalog previews.
          </p>
        </div>

        <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row gap-2 shrink-0">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="px-3.5 py-2.5 bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs rounded-[2px] outline-none focus:border-[var(--accent-gold)] min-w-[240px]"
            aria-label="Email address for newsletter"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="btn-gold-primary py-2.5 px-5 text-[11px] font-semibold tracking-wider shrink-0 cursor-pointer disabled:opacity-50"
          >
            {status === 'loading' ? 'JOINING...' : 'SUBSCRIBE'}
          </button>
        </form>
      </div>
      {message && (
        <p
          className={`text-xs mt-3 text-center ${
            status === 'success' ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-rose-600 dark:text-rose-400'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}

