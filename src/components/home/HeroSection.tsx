import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-[82vh] sm:min-h-[88vh] lg:min-h-[92vh] w-full flex items-end lg:items-center overflow-hidden pt-24 pb-14 sm:pb-20 lg:py-32">
      {/* Background Photography & Minimal Vignette */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-top sm:bg-center scale-101 transition-transform duration-1000 ease-out" 
          style={{ backgroundImage: "url('/hero-clean.png')" }}
        />
        {/* Subtle, restrained gradient to preserve jewelry clarity while ensuring text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/85 via-black/45 to-transparent"></div>
        {/* Very soft edge transition into page background */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[var(--bg-main)] to-transparent opacity-80"></div>
      </div>

      {/* Editorial Hero Statement Box */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 z-10 w-full">
        <div className="max-w-2xl text-left">
          
          {/* Atelier Location Stamp */}
          <div className="inline-flex items-center gap-2 mb-4 sm:mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)]"></span>
            <span className="font-sans text-[8.5px] sm:text-[9.5px] tracking-[0.32em] text-[#E8DCCF] uppercase font-medium">
              JAMMU &bull; PRIVATE JEWELLERY SALON &bull; ESTD. 1998
            </span>
          </div>

          {/* Confident Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal mb-4 sm:mb-6 leading-[1.12] tracking-tight">
            Jewellery with a <br className="hidden sm:inline" />
            <span className="italic font-light text-[#F4ECE1]">point of view.</span>
          </h1>

          {/* Restrained Editorial Narrative */}
          <p className="font-sans text-xs sm:text-sm text-[#D8CDC1] mb-8 sm:mb-10 max-w-md font-light leading-relaxed">
            Authentic Dogra dynasty heirlooms, royal bridal couture, and contemporary certified natural diamond creations handcrafted by master Jammu artisans.
          </p>

          {/* Single Focused Primary Action */}
          <div>
            <Link 
              href="/collections" 
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-[#1C1917] hover:bg-[var(--accent-gold)] hover:text-white font-sans text-xs tracking-[0.22em] uppercase font-medium transition-all duration-300 shadow-lg rounded-[1px] cursor-pointer"
            >
              <span>EXPLORE COLLECTION</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
