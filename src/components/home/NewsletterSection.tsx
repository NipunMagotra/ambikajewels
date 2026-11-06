'use client';

import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <section className="py-20 lg:py-24 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)]">
      <div className="container mx-auto px-4 sm:px-6 max-w-xl text-center">
        
        <span className="text-[9.5px] font-sans tracking-[0.3em] uppercase text-[var(--accent-gold)] font-medium block mb-2.5">
          PRIVATE DISPATCH &bull; 08
        </span>

        <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)] font-normal tracking-tight mb-3">
          Join the Ambika Salon Register
        </h2>

        <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed mb-8">
          Receive private invitations to preview seasonal Dogra heirlooms, daily bullion rate digests, and bespoke karigar appointments.
        </p>

        {subscribed ? (
          <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[1px] animate-fade-in">
            <span className="material-symbols-outlined text-[var(--accent-gold)] text-2xl block mb-1">check_circle</span>
            <p className="font-serif text-base text-[var(--text-primary)]">You are subscribed to the salon register.</p>
            <p className="font-sans text-[11px] text-[var(--text-secondary)] mt-0.5 font-light">We respect your privacy and never distribute patron data.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-sans text-xs placeholder:text-[var(--text-tertiary)] outline-none focus:border-[var(--text-primary)] rounded-[1px] transition-colors"
            />
            <button
              type="submit"
              className="btn-gold-primary py-3 px-6 text-[10.5px] tracking-[0.2em] whitespace-nowrap"
            >
              SUBSCRIBE
            </button>
          </form>
        )}

      </div>
    </section>
  );
}

