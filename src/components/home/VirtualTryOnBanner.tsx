export default function VirtualTryOnBanner() {
  return (
    <section className="py-8 sm:py-12 px-4 sm:px-margin-mobile lg:px-margin-desktop my-4 sm:my-8">
      <div className="container mx-auto bg-surface-container border border-outline-variant/30 p-6 sm:p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left rounded-xs">
        <div>
          <span className="font-label-caps text-[9px] sm:text-[10px] text-primary tracking-[0.3em] font-semibold block mb-1 sm:mb-2">
            CONCIERGE VIDEO SHOPPING
          </span>
          <h3 className="font-headline-md text-xl sm:text-2xl lg:text-4xl text-on-surface mb-2">
            Try Jewelry Live On Video Call
          </h3>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant/80 max-w-xl mx-auto lg:mx-0">
            Examine craftsmanship up close and consult our expert Karigars live from the comfort of your home.
          </p>
        </div>

        <a
          href="https://wa.me/919419100000?text=Namaste!%20I%20would%20like%20to%20schedule%20a%20virtual%20consultation."
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto border border-primary px-6 py-3.5 font-label-caps text-[10px] sm:text-[11px] text-primary hover:bg-primary hover:text-on-primary transition-all duration-300 font-bold tracking-[0.2em] shrink-0 text-center"
        >
          BOOK VIDEO CALL &rarr;
        </a>
      </div>
    </section>
  );
}
