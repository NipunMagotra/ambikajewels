import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-[72vh] sm:min-h-[78vh] lg:min-h-[85vh] w-full flex items-end lg:items-center overflow-hidden pt-20 sm:pt-24 pb-10 sm:pb-14 lg:py-24">
      {/* Background Image & Refined Luxury Gradients */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-top sm:bg-center" 
          style={{ backgroundImage: "url('/hero-clean.png')" }}
        />
        {/* Desktop overlay: subtle left-to-right gradient to highlight copy while keeping jewellery visible */}
        <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-black/85 via-black/50 to-transparent"></div>
        {/* Top subtle vignette */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 to-transparent"></div>
        {/* Mobile overlay: starts lighter at the top to display jewellery, transitions darker towards the text */}
        <div className="absolute inset-0 lg:hidden bg-gradient-to-t from-black/90 via-black/70 to-black/20"></div>
        {/* Bottom edge smooth blend into page theme */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--bg-main)] to-transparent"></div>
      </div>

      {/* Main Hero Narrative Box */}
      <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop z-10 w-full">
        <div className="max-w-xl text-center lg:text-left mx-auto lg:mx-0">
          <span className="font-sans text-[9px] sm:text-[10px] text-[var(--accent-gold)] tracking-[0.35em] uppercase font-semibold block mb-2 sm:mb-3">
            JAMMU &bull; FINE JEWELLERY
          </span>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal mb-3 sm:mb-4 leading-[1.12] tracking-tight">
            Authentic Dogra & <br />
            <span className="italic font-normal gold-text-gradient">Heritage Fine Jewellery</span>
          </h1>

          <p className="font-sans text-xs sm:text-sm text-[#EAE0D5] mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0 font-normal leading-relaxed">
            Signature Dogri Jhumkis, Naman Sets, Bridal Couture, 22K–9K Gold, Certified Diamonds, and Gold Exchange.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start items-center max-w-xs sm:max-w-none mx-auto">
            <Link 
              href="/collections" 
              className="btn-gold-primary w-full sm:w-auto"
            >
              VIEW COLLECTIONS
            </Link>

            <a 
              href="https://wa.me/919086098457?text=Namaste!%20I%20would%20like%20to%20book%20a%20virtual%20consultation." 
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold-secondary w-full sm:w-auto backdrop-blur-xs text-white border-white/30 hover:border-[var(--accent-gold)]"
            >
              BOOK VIDEO CALL
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
