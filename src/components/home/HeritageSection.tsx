import Link from 'next/link';

export default function HeritageSection() {
  return (
    <section className="py-20 lg:py-32 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Brand Philosophy Narrative (Left 6 Cols) */}
          <div className="lg:col-span-6">
            <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-[var(--accent-gold)] font-medium block mb-3">
              THE MAISON &bull; 06
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] font-normal tracking-tight mb-6 leading-[1.14]">
              Born in Jammu, <br />
              <span className="italic font-light text-[var(--text-secondary)]">Forged for Generations.</span>
            </h2>

            <div className="space-y-4 text-xs sm:text-sm font-sans text-[var(--text-secondary)] font-light leading-relaxed mb-8">
              <p>
                Founded in Jammu by Shivani Anand and guided by representative Lakesh Kumar, Ambika Jewels began with a single conviction: that regional Dogra jewellery traditions belong at the forefront of contemporary fine jewellery.
              </p>
              <p>
                We do not produce disposable ornaments. From multi-purity gold offerings (22K, 18K, 14K, 9K) to authentic 925 sterling silver and conflict-free natural diamonds certified by IGI and GIA, our pieces are fabricated with architectural precision and verified under strict Bureau of Indian Standards hallmarking.
              </p>
              <p>
                Whether redesigning heirloom gold through our private melting studio or crafting bespoke creations via 3D CAD preview, our salon remains an intimate sanctuary of trust.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-6 border-y border-[var(--border-subtle)] mb-8">
              <div>
                <span className="font-serif text-2xl text-[var(--text-primary)] block font-normal">1998</span>
                <span className="font-sans text-[9.5px] text-[var(--text-tertiary)] uppercase tracking-wider">ESTABLISHED IN JAMMU</span>
              </div>
              <div>
                <span className="font-serif text-2xl text-[var(--text-primary)] block font-normal">100% BIS</span>
                <span className="font-sans text-[9.5px] text-[var(--text-tertiary)] uppercase tracking-wider">6-DIGIT HUID HALLMARKING</span>
              </div>
            </div>

            <Link
              href="/about"
              className="btn-gold-primary"
            >
              EXPLORE OUR STORY &amp; SALON
            </Link>
          </div>

          {/* Image-Led Spread (Right 6 Cols) */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative aspect-[3/4] overflow-hidden bg-[var(--bg-main)]">
                <img
                  src="/products/royal-kundan.png"
                  alt="Dogra Royal Kundan Jewelry Craft"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                <span className="text-[9px] font-sans uppercase tracking-widest text-[var(--accent-gold)] block mb-1">
                  PATRON SERVICES
                </span>
                <p className="font-serif text-sm text-[var(--text-primary)]">
                  Live Gold Melting &amp; 3D CAD Virtual Previews
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)]">
                <span className="text-[9px] font-sans uppercase tracking-widest text-[var(--accent-gold)] block mb-1">
                  ARMORED LOGISTICS
                </span>
                <p className="font-serif text-sm text-[var(--text-primary)]">
                  Pan-India Insured Express via BVC Logistics
                </p>
              </div>
              <div className="relative aspect-[3/4] overflow-hidden bg-[var(--bg-main)]">
                <img
                  src="/products/kundan-chandbali.png"
                  alt="Fine Gold Karigar Atelier"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
