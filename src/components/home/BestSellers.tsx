import Link from 'next/link';
import type { Product } from '@/types';
import ProductCard from '@/components/catalog/ProductCard';

interface BestSellersProps {
  products: Product[];
}

export default function BestSellers({ products }: BestSellersProps) {
  // Take up to 8 curated featured pieces
  const featured = products && products.length > 0
    ? products.slice(0, 8)
    : [];

  if (featured.length === 0) return null;

  return (
    <section className="py-20 lg:py-28 bg-[var(--bg-main)] border-b border-[var(--border-subtle)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-4">
          <div>
            <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-[var(--accent-gold)] font-medium block mb-2">
              CURATED SELECTIONS &bull; 03
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] font-normal tracking-tight">
              Featured Creations
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[11px] font-sans text-[var(--text-tertiary)] tracking-wider uppercase hidden sm:inline">
              SHOWROOM ATELIER ARCHIVE
            </span>
            <Link
              href="/collections"
              className="text-[11px] font-sans tracking-[0.2em] uppercase text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors font-medium underline underline-offset-6"
            >
              VIEW ALL PIECES &rarr;
            </Link>
          </div>
        </div>

        {/* 4-Column Refined Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
}
