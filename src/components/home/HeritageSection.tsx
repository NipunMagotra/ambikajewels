import Link from 'next/link';

export default function HeritageSection() {
  return (
    <section className="my-8 sm:my-14 grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-12 px-4 sm:px-margin-mobile lg:px-margin-desktop">
      {/* Image & Master Karigar Quote */}
      <div className="relative order-2 lg:order-1">
        <div className="aspect-[4/3] sm:aspect-square bg-[var(--bg-surface)] overflow-hidden border border-[var(--border-card)] rounded-[2px] shadow-[var(--card-shadow)]">
          <div 
            className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=80')" }}
          />
        </div>
        
        {/* Desktop Absolute Badge */}
        <div className="absolute -bottom-6 -right-6 w-64 bg-[var(--bg-card)] border border-[var(--border-card)] p-5 hidden lg:block shadow-xl rounded-[2px]">
          <p className="font-serif text-sm italic text-[var(--text-primary)] leading-relaxed">
            &ldquo;Every piece of jewellery is a story carved in gold, a memory meant to last for generations.&rdquo;
          </p>
          <p className="font-sans text-[10px] text-[var(--accent-gold)] mt-3 font-semibold tracking-[0.2em] uppercase">
            &mdash; MASTER KARIGAR
          </p>
        </div>

        {/* Mobile Inline Quote */}
        <div className="mt-3 lg:hidden bg-[var(--bg-card)] border border-[var(--border-card)] p-4 text-center rounded-[2px] shadow-sm">
          <p className="font-serif text-xs sm:text-sm italic text-[var(--text-primary)]">
            &ldquo;Every piece of jewellery is a story carved in gold, a memory meant to last for generations.&rdquo;
          </p>
          <p className="font-sans text-[10px] text-[var(--accent-gold)] mt-2 font-semibold tracking-[0.2em] uppercase">
            &mdash; MASTER KARIGAR
          </p>
        </div>
      </div>
      
      {/* Narrative Story */}
      <div className="lg:pl-6 order-1 lg:order-2 text-center lg:text-left">
        <span className="font-sans text-[9px] sm:text-[10px] text-[var(--accent-gold)] tracking-[0.3em] uppercase font-semibold mb-2 block">
          ESTD. 2021
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] font-normal mb-3 sm:mb-4 leading-tight">
          A Legacy of <span className="italic font-normal gold-text-gradient">Authentic Craft</span>
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] mb-4 leading-relaxed font-light max-w-lg mx-auto lg:mx-0">
          Founded in Lower Roop Nagar, Jammu, Ambika Jewels stands as a beacon of purity and craftsmanship. Every piece is handcrafted by master artisans using generations-old Dogra techniques, ensuring a legacy that shines through time.
        </p>

        {/* Heritage Trust Badges */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center my-6 py-4 border-y border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[var(--accent-gold)] text-xl">verified</span>
            <span className="font-sans text-[10px] sm:text-xs text-[var(--text-primary)] tracking-wider uppercase font-semibold">
              100% BIS Hallmarked Gold
            </span>
          </div>
          <div className="hidden sm:block w-[1px] h-4 bg-[var(--border-subtle)]"></div>
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[var(--accent-gold)] text-xl">design_services</span>
            <span className="font-sans text-[10px] sm:text-xs text-[var(--text-primary)] tracking-wider uppercase font-semibold">
              Artisanal Handcrafts
            </span>
          </div>
        </div>

        <div>
          <Link href="/about" className="btn-gold-secondary w-full sm:w-auto text-center inline-block">
            LEARN ABOUT OUR PROCESS
          </Link>
        </div>
      </div>
    </section>
  );
}
