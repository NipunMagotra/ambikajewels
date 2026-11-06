import Link from 'next/link';

export default function CraftStorySection() {
  const craftMoments = [
    {
      num: '01',
      title: '22K Hallmarked Gold & 6-Digit HUID',
      detail: 'Every creation is strictly 916 hallmarked by the Bureau of Indian Standards with an individual laser-inscribed HUID code ensuring pure provenance.',
      image: '/products/kundan-chandbali.png',
    },
    {
      num: '02',
      title: 'Centuries-Old Dogra Karigar Craft',
      detail: 'Intricate umbrella filigree, hand-engraved motifs, and ancestral stone-setting techniques practiced by master goldsmiths across Jammu.',
      image: '/products/heritage-ruby-haar.png',
    },
    {
      num: '03',
      title: 'Certified Natural Solitaires & Polki',
      detail: 'All diamonds are hand-selected, conflict-free, and accompanied by authentic IGI/GIA laboratories certification.',
      image: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=800&q=80',
    },
    {
      num: '04',
      title: 'Bespoke 3D CAD & Vault Packaging',
      detail: 'Every piece is delivered in our signature velvet presentation case with armored transit insurance by BVC Logistics.',
      image: '/products/royal-kundan.png',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Editorial Section Header */}
        <div className="max-w-2xl mb-14 lg:mb-20">
          <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-[var(--accent-gold)] font-medium block mb-2">
            MATERIALITY &amp; ATELIER &bull; 04
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] font-normal tracking-tight mb-4">
            The Anatomy of Craft
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
            True luxury is not an ornament; it is the discipline of gold, stone, and generational knowledge. Here is why an Ambika Jewels creation is built for permanence.
          </p>
        </div>

        {/* 4-Item Grid of Macro Photography & Restrained Copy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {craftMoments.map((item) => (
            <div key={item.num} className="flex flex-col justify-between group">
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--bg-main)] mb-5">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                />
                <div className="absolute top-3 left-3 font-mono text-[10px] text-white/90 bg-black/60 px-2 py-0.5 backdrop-blur-xs">
                  {item.num}
                </div>
              </div>

              <div>
                <h3 className="font-serif text-lg text-[var(--text-primary)] font-normal mb-2 leading-snug">
                  {item.title}
                </h3>
                <p className="font-sans text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quiet Footnote */}
        <div className="mt-14 pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="font-sans text-[11px] text-[var(--text-tertiary)] uppercase tracking-wider">
            GOVERNMENT REGISTERED BIS HALLMARKING &bull; LICENSE NO. HM/C-9990041009
          </span>
          <Link
            href="/authenticity"
            className="text-[10.5px] font-sans tracking-[0.2em] uppercase text-[var(--text-primary)] hover:text-[var(--accent-gold)] font-medium underline underline-offset-4"
          >
            LEARN ABOUT CERTIFICATION &rarr;
          </Link>
        </div>

      </div>
    </section>
  );
}

