export default function VirtualTryOnBanner() {
  return (
    <section className="py-6 sm:py-8 px-4 sm:px-margin-mobile lg:px-margin-desktop my-2 sm:my-4">
      <div className="container mx-auto bg-[var(--bg-card)] border border-[var(--border-card)] p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left rounded-[2px] shadow-[var(--card-shadow)]">
        <div>
          <span className="font-sans text-[9px] sm:text-[10px] text-[var(--accent-gold)] tracking-[0.3em] uppercase font-semibold block mb-1 sm:mb-2">
            CONCIERGE VIDEO SHOPPING
          </span>
          <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl text-[var(--text-primary)] font-normal mb-2">
            Experience Jewellery Live on Video Call
          </h3>
          <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl mx-auto lg:mx-0 font-light">
            Examine craftsmanship up close and consult our expert Karigars live from the comfort of your home.
          </p>
        </div>

        <a
          href="https://wa.me/919086098457?text=Namaste!%20I%20would%20like%20to%20schedule%20a%20virtual%20consultation."
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold-primary w-full sm:w-auto shrink-0"
        >
          <span>BOOK VIDEO CALL</span>
          <span className="material-symbols-outlined text-sm">videocam</span>
        </a>
      </div>
    </section>
  );
}
