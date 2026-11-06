import Link from 'next/link';

export default function CategoryGrid() {
  const editorialCategories = [
    {
      title: 'RINGS',
      subtitle: 'Solitaires & Filigree Bands',
      href: '/collections?category=Rings',
      image: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'EARRINGS',
      subtitle: 'Dogri Jhumkis & Chandbalis',
      href: '/collections?category=Earrings',
      image: '/products/kundan-chandbali.png',
    },
    {
      title: 'NECKLACES',
      subtitle: 'Haars, Chokers & Chains',
      href: '/collections?category=Necklaces',
      image: '/products/heritage-ruby-haar.png',
    },
    {
      title: 'BRACELETS & KADAS',
      subtitle: 'Dogra Bangles & Solid Kadas',
      href: '/collections?category=Bangles',
      image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'BRIDAL SETS',
      subtitle: 'Complete Trousseau Ensembles',
      href: '/collections?category=Bridal%20Sets',
      image: '/products/royal-kundan.png',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Editorial Title */}
        <div className="text-center max-w-xl mx-auto mb-14 lg:mb-18">
          <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-[var(--accent-gold)] font-medium block mb-2">
            CATEGORIES &bull; 02
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)] font-normal tracking-tight">
            Curated by Silhouette
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] font-light mt-2">
            Explore fine jewellery across regional Dogra heritage motifs, bridal couture, and modern gold designs.
          </p>
        </div>

        {/* Fashion Editorial Category Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {editorialCategories.map((cat, idx) => (
            <Link
              key={cat.title}
              href={cat.href}
              className={`group relative overflow-hidden bg-[var(--bg-card)] transition-all duration-500 block ${
                idx === 4 ? 'col-span-2 md:col-span-1' : ''
              }`}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[var(--bg-main)]">
                <img
                  src={cat.image}
                  alt={cat.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
                {/* Quiet Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Category Typography at bottom */}
                <div className="absolute inset-x-0 bottom-0 p-4 text-center sm:text-left flex flex-col justify-end">
                  <h3 className="font-serif text-base sm:text-lg text-white font-normal tracking-wide group-hover:text-[var(--accent-gold)] transition-colors">
                    {cat.title}
                  </h3>
                  <span className="font-sans text-[9px] text-white/70 tracking-wider uppercase font-light mt-0.5 hidden sm:block">
                    {cat.subtitle}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
