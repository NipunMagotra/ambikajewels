import Link from 'next/link';

export default function JournalSection() {
  const stories = [
    {
      slug: 'the-art-of-the-dogri-jhumki',
      category: 'HERITAGE ARCHIVE',
      title: 'The Art of the Dogri Jhumki: Centuries of Royal Jammu Craft',
      date: 'EDITORIAL',
      readTime: '4 MIN READ',
      image: '/products/dogri-jhumki-hd.jpg',
      excerpt: 'Tracing the architectural umbrella silhouette and delicate seed pearl droplets worn by brides across the Jammu dynasty.',
    },
    {
      slug: 'gold-purity-guide-22k-vs-18k',
      category: 'JEWELLERY GUIDE',
      title: '22K vs 18K Gold: Choosing Metal Purity for Bridal & Everyday Wear',
      date: 'GUIDE',
      readTime: '3 MIN READ',
      image: '/craft-karigar-macro-hd.jpg',
      excerpt: 'A clear patron guide to understanding karat purities, alloy structural strengths, and 6-digit laser HUID verification.',
    },
    {
      slug: 'the-modern-bridal-trousseau',
      category: 'STYLING ESSAY',
      title: 'The Modern Dogra Trousseau: Harmonizing Antique Polki & Natural Diamonds',
      date: 'STYLING',
      readTime: '5 MIN READ',
      image: '/products/royal-kundan-bridal-suite-hd.jpg',
      excerpt: 'How contemporary brides are pairing heirloom haars with delicate modern diamond solitaires for multifaceted ceremonies.',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[var(--bg-main)] border-b border-[var(--border-subtle)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-4">
          <div>
            <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-[var(--accent-gold)] font-medium block mb-2">
              JOURNAL &amp; ESSAYS &bull; 07
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)] font-normal tracking-tight">
              Stories from the Atelier
            </h2>
          </div>
          <div>
            <Link
              href="/journal"
              className="text-[10.5px] font-sans tracking-[0.2em] uppercase text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors font-medium underline underline-offset-6"
            >
              READ ALL ARTICLES &rarr;
            </Link>
          </div>
        </div>

        {/* 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {stories.map((story) => (
            <article key={story.slug} className="group flex flex-col justify-between">
              <div>
                <div className="relative aspect-[16/11] overflow-hidden bg-[var(--bg-surface)] mb-4">
                  <Link href={`/journal/${story.slug}`} className="block w-full h-full">
                    <img
                      src={story.image}
                      alt={story.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                    />
                  </Link>
                </div>

                <div className="flex items-center justify-between text-[9px] font-sans uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-2">
                  <span>{story.category}</span>
                  <span>{story.readTime}</span>
                </div>

                <h3 className="font-serif text-xl text-[var(--text-primary)] group-hover:text-[var(--accent-gold)] transition-colors mb-2 leading-snug">
                  <Link href={`/journal/${story.slug}`}>{story.title}</Link>
                </h3>

                <p className="font-sans text-xs text-[var(--text-secondary)] font-light leading-relaxed mb-4">
                  {story.excerpt}
                </p>
              </div>

              <div>
                <Link
                  href={`/journal/${story.slug}`}
                  className="inline-flex items-center gap-1.5 text-[10px] font-sans tracking-widest uppercase text-[var(--text-primary)] hover:text-[var(--accent-gold)] font-medium pt-2 border-t border-[var(--border-subtle)] w-full"
                >
                  <span>READ ESSAY</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}

