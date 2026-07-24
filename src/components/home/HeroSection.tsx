import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] w-full flex items-center overflow-hidden pt-24 pb-12">
      {/* Background Image & Vignette */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center" 
          style={{ backgroundImage: "url('/hero-clean.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent lg:block hidden"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent lg:hidden block"></div>
      </div>

      {/* Main Narrative Box */}
      <div className="container mx-auto px-margin-mobile lg:px-margin-desktop z-10">
        <div className="max-w-xl text-center lg:text-left">
          <span className="font-label-caps text-[10px] text-primary tracking-[0.35em] block mb-3 font-semibold">
            JAMMU &bull; SINCE 1984
          </span>

          <h1 className="font-headline-md text-4xl sm:text-5xl lg:text-6xl mb-5 leading-[1.1] tracking-tight">
            Authentic Gold & <br />
            <span className="italic font-normal gold-text-gradient">Bridal Jewelry</span>
          </h1>

          <p className="font-body-md text-sm text-on-surface-variant/90 mb-8 max-w-md mx-auto lg:mx-0 font-normal tracking-wide">
            22K Hallmarked Gold, Polki & Kundan Sets.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
            <Link 
              href="/collections" 
              className="w-full sm:w-auto gold-bg-gradient font-label-caps text-[11px] px-8 py-3.5 font-bold tracking-[0.2em] shadow-md hover:brightness-110 transition-all duration-300 text-center"
            >
              VIEW COLLECTIONS
            </Link>

            <a 
              href="https://wa.me/919419100000?text=Namaste!%20I%20would%20like%20to%20book%20a%20virtual%20consultation." 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto border border-primary/50 px-6 py-3.5 font-label-caps text-[11px] text-primary hover:bg-primary/10 transition-all duration-300 text-center bg-background/20"
            >
              BOOK VIDEO CALL
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}



