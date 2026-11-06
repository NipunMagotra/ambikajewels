import Link from 'next/link';
import type { Product } from '@/types';

interface SignaturePieceSpotlightProps {
  products: Product[];
}

export default function SignaturePieceSpotlight({ products }: SignaturePieceSpotlightProps) {
  // Select an exceptional masterpiece, e.g., the Royal Dogri Naman Set or Chandbali
  const masterpiece = products.find((p) => p.slug?.includes('naman') || p.id === 'dg2') || products[0];

  if (!masterpiece) return null;

  return (
    <section className="py-24 lg:py-36 bg-[var(--bg-main)] border-b border-[var(--border-subtle)] relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Large Hero Photography (Left 7 Cols) */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[4/5] sm:aspect-[1/1] overflow-hidden bg-[var(--bg-surface)]">
              <Link href={`/collections/${masterpiece.slug || masterpiece.id}`} className="block w-full h-full">
                <img
                  src={masterpiece.images?.[0] || '/hero-clean.png'}
                  alt={masterpiece.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-103"
                />
              </Link>
            </div>
            
            {/* Subtle Atelier Coordinates */}
            <div className="absolute bottom-4 left-4 font-mono text-[9px] text-[var(--text-tertiary)] uppercase tracking-widest bg-[var(--bg-card)]/80 backdrop-blur-xs px-2.5 py-1">
              ARCHIVE REF &bull; {masterpiece.id.toUpperCase()} &bull; 22K SOLID GOLD
            </div>
          </div>

          {/* Minimal Editorial Text (Right 5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            
            <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-[var(--accent-gold)] font-medium block mb-3">
              PIECE OF THE SEASON &bull; 05
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] font-normal tracking-tight mb-4 leading-[1.15]">
              {masterpiece.name}
            </h2>

            <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed mb-6">
              {masterpiece.description ||
                'A singular triumph of traditional Jammu goldsmithing. Formed from pure 22K hallmarked gold with delicate floral repoussé and matched chandelier droplets.'}
            </p>

            {/* Micro Specs */}
            <div className="py-4 border-y border-[var(--border-subtle)] grid grid-cols-3 gap-3 mb-8 text-left">
              <div>
                <span className="text-[9px] font-sans text-[var(--text-tertiary)] uppercase tracking-wider block">PURITY</span>
                <span className="font-serif text-base text-[var(--text-primary)]">{masterpiece.purity || '22K 916'}</span>
              </div>
              <div>
                <span className="text-[9px] font-sans text-[var(--text-tertiary)] uppercase tracking-wider block">NET WEIGHT</span>
                <span className="font-serif text-base text-[var(--text-primary)]">{masterpiece.weight_grams}g</span>
              </div>
              <div>
                <span className="text-[9px] font-sans text-[var(--text-tertiary)] uppercase tracking-wider block">INVESTMENT</span>
                <span className="font-serif text-base text-[var(--text-primary)]">
                  {masterpiece.display_price || `₹${Math.round(masterpiece.price / 100).toLocaleString('en-IN')}`}
                </span>
              </div>
            </div>

            {/* Refined Action Area */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href={`/collections/${masterpiece.slug || masterpiece.id}`}
                className="btn-gold-primary w-full sm:w-auto text-center"
              >
                VIEW MASTERPIECE DETAILS
              </Link>
              <a
                href={`https://wa.me/919086098457?text=Namaste!%20I%20am%20inquiring%20about%20the%20${encodeURIComponent(masterpiece.name)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold-secondary w-full sm:w-auto text-center flex items-center justify-center gap-2 hover:text-emerald-600 hover:border-emerald-600"
              >
                <span className="material-symbols-outlined text-sm text-emerald-600">chat</span>
                INQUIRE WITH ATELIER
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

