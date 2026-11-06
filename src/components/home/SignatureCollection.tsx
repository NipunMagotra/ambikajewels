import Link from 'next/link';
import type { Product } from '@/types';

interface SignatureCollectionProps {
  products: Product[];
}

export default function SignatureCollection({ products }: SignatureCollectionProps) {
  // Curate flagship Dogra pieces: Naman necklace as main hero, Jhumki & Kundan Suite as companions
  const heroPiece = products.find((p) => p.id === 'dg2') || products[0];
  const companionPiece1 = products.find((p) => p.id === 'dg1') || products[1];
  const companionPiece2 = products.find((p) => p.id === 'bri1' || p.id === 'dg3') || products[2];

  if (!heroPiece) return null;

  return (
    <section className="py-20 lg:py-28 border-b border-[var(--border-subtle)] bg-[var(--bg-main)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-4">
          <div className="max-w-xl">
            <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-[var(--accent-gold)] font-medium block mb-2">
              SIGNATURE CURATION &bull; 01
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] font-normal tracking-tight">
              The Dogra Heritage Collection
            </h2>
          </div>
          <div className="max-w-md">
            <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed mb-3">
              Sculpted in pure 22K hallmarked gold. Iconic umbrella filigree, royal Naman chokers, and centuries-old Jammu ceremonial ornaments preserved in modern form.
            </p>
            <Link
              href="/collections?category=Dogra%20Heritage%20Collection"
              className="inline-flex items-center gap-2 text-[10.5px] font-sans tracking-[0.2em] uppercase text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors font-medium underline underline-offset-6"
            >
              DISCOVER FULL HERITAGE ARCHIVE &rarr;
            </Link>
          </div>
        </div>

        {/* Asymmetrical Editorial Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Large Hero Piece (Left 7 Cols) */}
          <div className="lg:col-span-7 group">
            <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] overflow-hidden bg-[var(--bg-surface)]">
              <Link href={`/collections/${heroPiece.slug || heroPiece.id}`} className="block w-full h-full">
                <img
                  src={heroPiece.images?.[0] || '/hero-clean.png'}
                  alt={heroPiece.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-104"
                />
              </Link>
              <div className="absolute top-4 left-4">
                <span className="bg-[var(--bg-card)]/90 backdrop-blur-xs text-[var(--text-primary)] font-sans text-[9px] px-3 py-1 tracking-[0.2em] uppercase font-medium border border-[var(--border-subtle)]">
                  FLAGSHIP HEIRLOOM
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
              <div>
                <span className="text-[9.5px] font-sans tracking-[0.22em] uppercase text-[var(--text-tertiary)] block mb-1">
                  {heroPiece.material || '22K Solid Gold'} &bull; {heroPiece.weight_grams}g Net
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-[var(--text-primary)] group-hover:text-[var(--accent-gold)] transition-colors">
                  <Link href={`/collections/${heroPiece.slug || heroPiece.id}`}>{heroPiece.name}</Link>
                </h3>
              </div>
              <div className="text-right">
                <span className="font-sans text-base sm:text-lg font-medium text-[var(--text-primary)]">
                  {heroPiece.display_price || `₹${Math.round(heroPiece.price / 100).toLocaleString('en-IN')}`}
                </span>
                <span className="block text-[9px] font-sans text-[var(--text-tertiary)] uppercase tracking-wider">
                  6-DIGIT HUID
                </span>
              </div>
            </div>
          </div>

          {/* Two Companion Pieces (Right 5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-8 lg:gap-10">
            
            {/* Companion Piece 1 */}
            {companionPiece1 && (
              <div className="group flex flex-col sm:flex-row lg:flex-col gap-4">
                <div className="relative aspect-[4/5] sm:w-1/2 lg:w-full overflow-hidden bg-[var(--bg-surface)]">
                  <Link href={`/collections/${companionPiece1.slug || companionPiece1.id}`} className="block w-full h-full">
                    <img
                      src={companionPiece1.images?.[0] || '/hero-clean.png'}
                      alt={companionPiece1.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                    />
                  </Link>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-sans tracking-[0.2em] uppercase text-[var(--text-tertiary)] block mb-1">
                      {companionPiece1.purity || '22K Gold'} &bull; {companionPiece1.weight_grams}g
                    </span>
                    <h4 className="font-serif text-lg text-[var(--text-primary)] group-hover:text-[var(--accent-gold)] transition-colors line-clamp-1">
                      <Link href={`/collections/${companionPiece1.slug || companionPiece1.id}`}>{companionPiece1.name}</Link>
                    </h4>
                  </div>
                  <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] flex items-baseline justify-between">
                    <span className="font-sans text-sm font-medium text-[var(--text-primary)]">
                      {companionPiece1.display_price || `₹${Math.round(companionPiece1.price / 100).toLocaleString('en-IN')}`}
                    </span>
                    <Link
                      href={`/collections/${companionPiece1.slug || companionPiece1.id}`}
                      className="text-[10px] font-sans tracking-widest uppercase text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                    >
                      VIEW &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Companion Piece 2 */}
            {companionPiece2 && (
              <div className="group flex flex-col sm:flex-row lg:flex-col gap-4">
                <div className="relative aspect-[4/5] sm:w-1/2 lg:w-full overflow-hidden bg-[var(--bg-surface)]">
                  <Link href={`/collections/${companionPiece2.slug || companionPiece2.id}`} className="block w-full h-full">
                    <img
                      src={companionPiece2.images?.[0] || '/hero-clean.png'}
                      alt={companionPiece2.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                    />
                  </Link>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-sans tracking-[0.2em] uppercase text-[var(--text-tertiary)] block mb-1">
                      {companionPiece2.purity || '22K Gold'} &bull; {companionPiece2.weight_grams}g
                    </span>
                    <h4 className="font-serif text-lg text-[var(--text-primary)] group-hover:text-[var(--accent-gold)] transition-colors line-clamp-1">
                      <Link href={`/collections/${companionPiece2.slug || companionPiece2.id}`}>{companionPiece2.name}</Link>
                    </h4>
                  </div>
                  <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] flex items-baseline justify-between">
                    <span className="font-sans text-sm font-medium text-[var(--text-primary)]">
                      {companionPiece2.display_price || `₹${Math.round(companionPiece2.price / 100).toLocaleString('en-IN')}`}
                    </span>
                    <Link
                      href={`/collections/${companionPiece2.slug || companionPiece2.id}`}
                      className="text-[10px] font-sans tracking-widest uppercase text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                    >
                      VIEW &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}

