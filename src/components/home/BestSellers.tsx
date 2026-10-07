'use client';

import Link from 'next/link';
import ProductCard from '../catalog/ProductCard';
import type { Product } from '@/types';

export default function BestSellers({ products }: { products: Product[] }) {
  return (
    <section className="py-8 sm:py-12 px-4 sm:px-margin-mobile lg:px-margin-desktop">
      {/* Editorial Header */}
      <div className="flex flex-row justify-between items-end mb-8 sm:mb-10 gap-3 border-b border-[var(--border-subtle)] pb-4 sm:pb-5">
        <div>
          <span className="font-sans text-[9px] sm:text-[10px] text-[var(--accent-gold)] tracking-[0.35em] uppercase font-semibold block mb-1.5">
            COVETED MASTERPIECES
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[var(--text-primary)] font-normal tracking-tight">
            Best Sellers &amp; Signature Heirlooms
          </h2>
          <p className="font-sans text-xs text-[var(--text-secondary)] mt-1 font-light hidden sm:block">
            Our most requested bridal sets, 22K Dogri jhumkis, and certified solitaire designs.
          </p>
        </div>
        <Link
          href="/collections"
          className="font-sans text-[10px] sm:text-xs text-[var(--accent-gold)] hover:text-[var(--accent-gold-highlight)] tracking-[0.2em] font-semibold shrink-0 uppercase transition-colors flex items-center gap-1 group py-1"
        >
          <span>VIEW ALL DESIGNS</span>
          <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
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
