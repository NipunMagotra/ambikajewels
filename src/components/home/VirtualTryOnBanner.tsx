export default function VirtualTryOnBanner() {
  return (
    <section className="py-8 sm:py-12 px-4 sm:px-margin-mobile lg:px-margin-desktop my-2 sm:my-4">
      <div className="container mx-auto bg-[var(--bg-card)] border border-[var(--border-card)] p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 text-center lg:text-left rounded-[2px] shadow-[var(--card-shadow)] relative overflow-hidden">
        {/* Subtle decorative gold filament background accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[var(--accent-gold)]/10 to-transparent pointer-events-none"></div>

        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[2px] mb-2 sm:mb-3">
            <span className="material-symbols-outlined text-[var(--accent-gold)] text-xs">videocam</span>
            <span className="font-sans text-[8.5px] sm:text-[9.5px] text-[var(--accent-gold)] tracking-[0.3em] uppercase font-semibold">
              VIP CONCIERGE VIDEO SALON
            </span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)] font-normal mb-2.5 tracking-tight">
            Examine Heirlooms Live on One-on-One Video Call
          </h3>
          <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
            Inspect BIS hallmarks up close, verify stone settings in natural light, compare bracelet sizing, and consult directly with our master karigars from Jammu before ordering.
          </p>
        </div>

        <div className="relative z-10 shrink-0 w-full sm:w-auto">
          <a
            href="https://wa.me/919086098457?text=Namaste!%20I%20would%20like%20to%20schedule%20a%20VIP%20virtual%20jewellery%20consultation."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold-primary w-full sm:w-auto text-xs px-6 py-3 tracking-[0.18em]"
          >
            <span>SCHEDULE PRIVATE CALL</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
          <span className="font-sans text-[9px] text-[var(--text-secondary)]/80 block mt-2 text-center uppercase tracking-wider">
            Available 10:30 AM to 8:00 PM IST
          </span>
        </div>
      </div>
    </section>
  );
}
