import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-[76vh] sm:min-h-[82vh] lg:min-h-[88vh] w-full flex items-end lg:items-center overflow-hidden pt-28 sm:pt-32 pb-12 sm:pb-16 lg:py-28">
      {/* Background Image & Refined Luxury Gradients */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-top sm:bg-center scale-102 transition-transform duration-1000 ease-out" 
          style={{ backgroundImage: "url('/hero-clean.png')" }}
        />
        {/* Desktop overlay: subtle left-to-right gradient to highlight copy while keeping jewellery visible */}
        <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
        {/* Top subtle vignette */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 to-transparent"></div>
        {/* Mobile overlay: starts lighter at the top to display jewellery, transitions darker towards the text */}
        <div className="absolute inset-0 lg:hidden bg-gradient-to-t from-black/95 via-black/75 to-black/30"></div>
        {/* Bottom edge smooth blend into page theme */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[var(--bg-main)] to-transparent"></div>
      </div>

      {/* Main Hero Narrative Box */}
      <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop z-10 w-full">
        <div className="max-w-xl text-center lg:text-left mx-auto lg:mx-0">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black/40 backdrop-blur-xs border border-[var(--accent-gold)]/40 rounded-[2px] mb-3 sm:mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)]"></span>
            <span className="font-sans text-[8.5px] sm:text-[9.5px] text-[#E8CC70] tracking-[0.3em] uppercase font-semibold">
              JAMMU ROYAL HERITAGE &bull; ESTD. 1998
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal mb-3 sm:mb-4 leading-[1.12] tracking-tight">
            Authentic Dogra & <br />
            <span className="italic font-normal gold-text-gradient">Heritage Fine Jewellery</span>
          </h1>

          <p className="font-sans text-xs sm:text-sm text-[#EAE0D5] mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0 font-normal leading-relaxed">
            Signature Dogri Jhumkis, Royal Naman Sets, Bridal Trousseaus, 22K to 9K Hallmarked Gold, Certified Natural Diamonds, and Pure Silver Heirlooms.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start items-center max-w-xs sm:max-w-none mx-auto mb-6 sm:mb-8">
            <Link 
              href="/collections" 
              className="btn-gold-primary w-full sm:w-auto text-xs px-6 py-3 tracking-[0.2em]"
            >
              EXPLORE HEIRLOOMS
            </Link>

            <a 
              href="https://wa.me/919086098457?text=Namaste!%20I%20would%20like%20to%20book%20a%20virtual%20consultation." 
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold-secondary w-full sm:w-auto backdrop-blur-xs text-white border-white/40 hover:border-[#E8CC70] text-xs px-6 py-3 tracking-[0.2em]"
            >
              CONSULT KARIGAR
            </a>
          </div>

          {/* Luxury Micro Trust Markers */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/15 max-w-md mx-auto lg:mx-0 text-left">
            <div>
              <span className="block font-serif text-xs sm:text-sm text-[#E8CC70] font-medium">100% BIS</span>
              <span className="block font-sans text-[9px] text-white/70 tracking-wider uppercase">6-Digit HUID</span>
            </div>
            <div>
              <span className="block font-serif text-xs sm:text-sm text-[#E8CC70] font-medium">Dogra Artisans</span>
              <span className="block font-sans text-[9px] text-white/70 tracking-wider uppercase">Handcrafted</span>
            </div>
            <div>
              <span className="block font-serif text-xs sm:text-sm text-[#E8CC70] font-medium">Pan-India Transit</span>
              <span className="block font-sans text-[9px] text-white/70 tracking-wider uppercase">BVC Armored</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
