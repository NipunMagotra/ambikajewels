import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { mockProducts } from '@/data/mockProducts';

export async function generateMetadata() {
  return {
    title: 'The Dogra Dynasty Heritage Collection Story | Ambika Jewels Jammu',
    description: 'The story and ancestral craft behind the signature Dogra Heritage Collection of Ambika Jewels in Jammu.',
  };
}

export default async function CollectionStoryPage() {
  const dograItems = mockProducts.filter(
    (p) => p.category === 'Dogra Heritage Collection' || p.category === 'Bridal Couture'
  );

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 pb-20 lg:pb-28 bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
        
        {/* Full-Bleed Editorial Hero */}
        <div className="relative min-h-[70vh] sm:min-h-[80vh] flex items-end overflow-hidden pb-12 sm:pb-16 pt-32">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/hero-clean.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10 max-w-4xl text-left">
            <span className="text-[9.5px] font-sans tracking-[0.32em] text-[#E8DCCF] uppercase font-medium block mb-2">
              COLLECTION STORY &bull; ARCHIVE VOL. 01
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-normal tracking-tight mb-4 leading-[1.12]">
              The Dogra Heritage Collection
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[#D8CDC1] max-w-xl font-light leading-relaxed mb-6">
              A tribute to the royal Dogra dynasty of Jammu. Sculpted in pure 22K hallmarked gold with centuries-old umbrella filigree, royal Naman chokers, and seed pearl tassels.
            </p>
            <Link
              href="/collections?category=Dogra%20Heritage%20Collection"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1C1917] hover:bg-[var(--accent-gold)] hover:text-white font-sans text-xs tracking-[0.2em] uppercase font-medium transition-colors"
            >
              SHOP THE COMPLETE ARCHIVE
            </Link>
          </div>
        </div>

        {/* Narrative Chapter 1: The Concept */}
        <section className="py-20 lg:py-28 container mx-auto px-4 sm:px-6 lg:px-12 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4">
              <span className="text-[9.5px] font-sans tracking-[0.26em] uppercase text-[var(--accent-gold)] font-medium block mb-1">
                CHAPTER 01
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)] font-normal">
                The Royal Lineage
              </h2>
            </div>
            <div className="md:col-span-8 space-y-4 text-xs sm:text-sm font-sans text-[var(--text-secondary)] font-light leading-relaxed">
              <p>
                In the courtly heritage of the Dogra dynasty, jewellery was never considered secondary ornamentation. It was an outward seal of sovereign grace, marital devotion, and divine protection.
              </p>
              <p>
                The master karigars of Jammu developed signature motifs found nowhere else in the subcontinent: the umbrella-domed Dogri Jhumki with graduated pearl fringes, the Dogri Naman collar with alternating floral repoussé links, and the multi-strand Dogri Long Haar.
              </p>
            </div>
          </div>
        </section>

        {/* Visual Spread */}
        <section className="py-8 container mx-auto px-4 sm:px-6 lg:px-12 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative aspect-[4/5] overflow-hidden bg-[var(--bg-surface)]">
              <img
                src="/products/kundan-chandbali.png"
                alt="Dogra Royal Jhumki Setting"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono px-2.5 py-1">
                22K BIS HALLMARKED &bull; UMBRELLA FILIGREE
              </div>
            </div>

            <div className="relative aspect-[4/5] overflow-hidden bg-[var(--bg-surface)]">
              <img
                src="/products/royal-kundan.png"
                alt="Royal Kundan Choker Setting"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono px-2.5 py-1">
                UNCUT POLKI &bull; HAND-ENAMELLED MEENAKARI
              </div>
            </div>
          </div>
        </section>

        {/* Featured Pieces in this Collection */}
        <section className="py-20 lg:py-28 container mx-auto px-4 sm:px-6 lg:px-12 max-w-5xl border-t border-[var(--border-subtle)] mt-16">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[9.5px] font-sans tracking-[0.28em] uppercase text-[var(--accent-gold)] font-medium block mb-1">
              THE CREATIONS
            </span>
            <h2 className="font-serif text-3xl text-[var(--text-primary)] font-normal">
              Signature Pieces from the Archive
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dograItems.slice(0, 3).map((item) => (
              <div key={item.id} className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col justify-between group">
                <div>
                  <div className="relative aspect-[4/5] overflow-hidden bg-white/40 mb-3">
                    <Link href={`/collections/${item.slug || item.id}`}>
                      <img src={item.images?.[0] || '/hero-clean.png'} alt={item.name} className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700" />
                    </Link>
                  </div>
                  <span className="text-[9px] font-sans uppercase tracking-widest text-[var(--accent-gold)] block mb-1">
                    {item.purity || '22K Solid Gold'}
                  </span>
                  <h3 className="font-serif text-base text-[var(--text-primary)] mb-1">
                    <Link href={`/collections/${item.slug || item.id}`}>{item.name}</Link>
                  </h3>
                  <div className="font-sans text-sm font-medium text-[var(--text-primary)]">
                    {item.display_price}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border-subtle)]">
                  <Link
                    href={`/collections/${item.slug || item.id}`}
                    className="btn-gold-primary py-2 text-[10px] tracking-wider w-full text-center"
                  >
                    INSPECT HEIRLOOM
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/collections?category=Dogra%20Heritage%20Collection"
              className="btn-gold-secondary py-3.5 px-8 text-xs tracking-widest"
            >
              BROWSE ALL 22K DOGRA CREATIONS &rarr;
            </Link>
          </div>
        </section>

      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

