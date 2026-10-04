'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected client-side runtime error
    console.error('[UNHANDLED CLIENT ERROR]', error);
  }, [error]);

  const whatsappEscalationUrl = `https://wa.me/919086098457?text=${encodeURIComponent(
    `Namaste Ambika Jewels, I encountered an issue on your website (${error.digest || 'Client Error'}). Can you assist me?`
  )}`;

  return (
    <div className="min-h-screen bg-background text-on-surface pt-28 pb-16 px-4 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 mandala-bg-pattern pointer-events-none opacity-40 z-0" />
      
      <div className="max-w-lg w-full bg-surface-container/90 backdrop-blur-md p-8 sm:p-10 rounded-xs border border-primary/40 shadow-2xl relative z-10 text-center space-y-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center mx-auto text-primary">
          <span className="material-symbols-outlined text-3xl sm:text-4xl">gem</span>
        </div>

        <div className="space-y-2">
          <span className="font-label-caps text-[10px] tracking-[0.25em] text-primary font-bold uppercase block">
            AMBIKA JEWELS &bull; NOTICE
          </span>
          <h1 className="font-headline-md text-2xl sm:text-3xl text-primary font-bold">
            An Unexpected Glitch Occurred
          </h1>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            We apologize for the brief interruption. Your shopping bag and selections are safely preserved.
          </p>
        </div>

        {error.digest && (
          <div className="p-2.5 bg-background border border-outline-variant/30 rounded-xs text-[11px] font-mono text-on-surface-variant/80">
            Error Ref: <span className="text-primary font-bold">{error.digest}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="btn-gold-primary py-3.5 px-6 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            <span>TRY AGAIN</span>
          </button>

          <Link
            href="/"
            className="btn-gold-secondary py-3.5 px-6 text-xs flex items-center justify-center"
          >
            <span>RETURN HOME</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-outline-variant/20">
          <a
            href={whatsappEscalationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-semibold"
          >
            <span className="material-symbols-outlined text-sm">chat</span>
            <span>Connect with Showroom Concierge on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
