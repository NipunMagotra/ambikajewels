'use client';

import Link from 'next/link';
import ProductCard from '../catalog/ProductCard';
import type { Product } from '@/types';

export default function BestSellers({ products }: { products: Product[] }) {
  return (
    <section className="py-8 sm:py-12 px-4 sm:px-margin-mobile lg:px-margin-desktop">
      {/* Editorial Header */}
      <div className="flex flex-row justify-between items-end mb-6 sm:mb-8 gap-2 border-b border-[var(--border-subtle)] pb-3 sm:pb-4">
        <div>
          <span className="font-sans text-[9px] sm:text-[10px] text-[var(--accent-gold)] tracking-[0.3em] uppercase font-semibold block mb-1">
            MOST COVETED
          </span>
          <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl text-[var(--text-primary)] font-normal">
            Best Sellers
          </h2>
        </div>
        <Link
          href="/collections"
          className="font-sans text-[10px] sm:text-xs text-[var(--accent-gold)] hover:text-[var(--accent-gold-highlight)] tracking-[0.2em] font-semibold shrink-0 uppercase transition-colors"
        >
          VIEW ALL &rarr;
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
