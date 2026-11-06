import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

export const metadata = {
  title: 'Journal & Atelier Essays | Ambika Jewels Jammu',
  description: 'Essays on Jammu Dogra jewellery traditions, 22K gold hallmarking guides, bridal trousseau curation, and karigar benchcraft.',
};

export const ARTICLES = [
  {
    slug: 'the-art-of-the-dogri-jhumki',
    category: 'Dogra Heritage',
    title: 'The Art of the Dogri Jhumki: Centuries of Royal Jammu Craft',
    date: 'OCTOBER 2026',
    readTime: '4 MIN READ',
    image: '/products/kundan-chandbali.png',
    author: 'Ambika Jewels Editorial Atelier',
    excerpt: 'Tracing the architectural umbrella silhouette and delicate seed pearl droplets worn by brides across the Jammu dynasty since the 18th century.',
    content: `The Dogri Jhumki is not simply an ornament; it is an architectural monument in miniature. Distinct from the bell-shaped jhumkas of Rajasthan or the conical silhouettes of Bengal, the authentic Dogri Jhumki sculpted in the Jammu region features a wide, fluted umbrella dome (chhatri) flanked by micro-filigree and suspended seed pearl droplets.

Historically commissioned for Dogra royal brides and noble families of Jammu and Kashmir, these earrings were cast exclusively in high-purity 22-karat gold. The master karigars of Jammu developed specialized wire-drawing techniques, soldering individual golden filaments without crushing the hollow resonance chamber within the dome.

At Ambika Jewels in Lower Roop Nagar, Jammu, our artisans continue to shape authentic Dogri Jhumkis using ancestral dies while engraving each piece with a unique 6-digit laser HUID code for absolute hallmarking authenticity. Whether worn with traditional bridal attire or paired minimally with contemporary silk, the Dogri Jhumki remains an indelible crown of northern Indian fine jewellery heritage.`
  },
  {
    slug: 'gold-purity-guide-22k-vs-18k',
    category: 'Jewellery Guide',
    title: '22K vs 18K Gold: Choosing Metal Purity for Bridal & Everyday Wear',
    date: 'SEPTEMBER 2026',
    readTime: '3 MIN READ',
    image: '/products/minimalist-gold-chain.png',
    author: 'Lakesh Kumar, Counter Operations',
    excerpt: 'A clear patron guide to understanding karat purities, alloy structural strengths, BIS hallmarking standards, and 6-digit laser HUID verification.',
    content: `When investing in fine gold jewellery in India, understanding karatage is both an aesthetic and a financial decision.

22K Gold (916 Purity):
Composed of 91.6% pure gold and 8.4% reinforcing alloys (typically silver and copper), 22-karat gold is the venerable standard for traditional Indian bridal jewellery, Dogra Naman sets, and heirloom coins. It possesses the rich, unmistakable deep warm yellow radiance that fine gold is famed for. It holds intrinsic bullion value and is 100% compliant with mandatory BIS hallmarking across India.

18K Gold (750 Purity):
Composed of 75% pure gold and 25% strengthening alloys, 18-karat gold offers superior tensile strength and surface hardness. For this reason, 18K is the gold purity of choice for setting certified natural diamonds, intricate prong work, and daily-wear rings or tennis bracelets that experience frequent friction.

14K Gold (585 Purity):
Ideal for lightweight modern chains, daily pendants, and contemporary minimalist jewellery that requires maximum structural rigidity at an accessible entry investment point.

At Ambika Jewels, every gold creation—from 22K to 14K—is assayed and hallmarked by the Bureau of Indian Standards with a verifiable 6-digit laser HUID inscription.`
  },
  {
    slug: 'the-modern-bridal-trousseau',
    category: 'Styling Essay',
    title: 'The Modern Dogra Trousseau: Harmonizing Antique Polki & Natural Diamonds',
    date: 'AUGUST 2026',
    readTime: '5 MIN READ',
    image: '/products/royal-kundan.png',
    author: 'Shivani Anand, Founder & Creative Director',
    excerpt: 'How contemporary brides are pairing heirloom haars with delicate modern diamond solitaires for multifaceted ceremonies.',
    content: `The modern Indian wedding is rarely a single monolithic ritual. It is a multi-day ceremony spanning intimate mehendi soirées, auspicious sangeet celebrations, royal pheras, and contemporary receptions.

For the modern bride, building a trousseau is no longer about acquiring matching sets that will sit locked in a vault. It is about versatility, emotional resonance, and timeless curation.

1. The Sacred Phera Ensemble:
Anchor the wedding ceremony with ancestral Dogra gold. A royal 22K Dogri Naman choker paired with authentic Dogri Jhumkis commands dignified regality without feeling artificial or heavy.

2. The Sangeet Statement:
Uncut Polki diamonds set in 22K gold with Russian emerald or ruby accents provide dramatic, incandescent sparkle under evening chandeliers.

3. The Contemporary Reception:
Transition smoothly into certified natural diamond solitaires set in 18K white or rose gold—pieces that can subsequently be worn to formal dinners, anniversary galas, and professional celebrations.

At our private showroom in Jammu, we sit with each bride and her family to map their bridal jewellery wardrobe from heirloom melting to 3D CAD bespoke fabrication.`
  }
];

export default function JournalPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 sm:pt-28 pb-20 lg:pb-28 bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-6xl">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-14 lg:mb-20">
            <span className="font-sans text-[9.5px] text-[var(--accent-gold)] tracking-[0.32em] uppercase block mb-2 font-medium">
              THE ATELIER JOURNAL
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] font-normal tracking-tight mb-3">
              Essays, Guides &amp; Craft
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
              Explorations of Dogra dynasty jewellery heritage, metal metallurgy, bridal trousseau styling, and the art of fine goldsmithing in northern India.
            </p>
          </div>

          {/* Featured Hero Article */}
          <div className="mb-16 lg:mb-20 pb-16 border-b border-[var(--border-subtle)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 relative aspect-[16/10] overflow-hidden bg-[var(--bg-surface)]">
                <Link href={`/journal/${ARTICLES[0].slug}`} className="block w-full h-full">
                  <img
                    src={ARTICLES[0].image}
                    alt={ARTICLES[0].title}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-104"
                  />
                </Link>
              </div>

              <div className="lg:col-span-5 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-[9.5px] font-sans uppercase tracking-[0.22em] text-[var(--accent-gold)] font-medium mb-3">
                  <span>{ARTICLES[0].category}</span>
                  <span>&bull;</span>
                  <span>{ARTICLES[0].readTime}</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors mb-4 font-normal leading-snug">
                  <Link href={`/journal/${ARTICLES[0].slug}`}>{ARTICLES[0].title}</Link>
                </h2>

                <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed mb-6">
                  {ARTICLES[0].excerpt}
                </p>

                <div>
                  <Link
                    href={`/journal/${ARTICLES[0].slug}`}
                    className="btn-gold-primary py-3 px-6 text-xs tracking-[0.2em]"
                  >
                    READ COMPLETE ESSAY
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Remaining Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
            {ARTICLES.slice(1).map((article) => (
              <article key={article.slug} className="group flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[16/11] overflow-hidden bg-[var(--bg-surface)] mb-4">
                    <Link href={`/journal/${article.slug}`}>
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                      />
                    </Link>
                  </div>

                  <div className="flex items-center gap-2 text-[9px] font-sans uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-2">
                    <span>{article.category}</span>
                    <span>&bull;</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="font-serif text-xl text-[var(--text-primary)] group-hover:text-[var(--accent-gold)] transition-colors mb-2 leading-snug">
                    <Link href={`/journal/${article.slug}`}>{article.title}</Link>
                  </h3>

                  <p className="font-sans text-xs text-[var(--text-secondary)] font-light leading-relaxed mb-4">
                    {article.excerpt}
                  </p>
                </div>

                <div>
                  <Link
                    href={`/journal/${article.slug}`}
                    className="inline-flex items-center gap-2 text-[10.5px] font-sans tracking-widest uppercase text-[var(--text-primary)] hover:text-[var(--accent-gold)] font-medium pt-2 border-t border-[var(--border-subtle)] w-full"
                  >
                    <span>READ ESSAY</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>

        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

