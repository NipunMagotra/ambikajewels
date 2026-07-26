'use client';

import Link from 'next/link';
import ProductCard from '../catalog/ProductCard';
import type { Product } from '@/types';

export default function BestSellers({ products }: { products: Product[] }) {
  return (
    <section className="py-10 sm:py-16 px-4 sm:px-margin-mobile lg:px-margin-desktop">
      {/* Clean Header */}
      <div className="flex flex-row justify-between items-end mb-6 sm:mb-10 gap-2 border-b border-outline-variant/20 pb-3 sm:pb-4">
        <div>
          <span className="font-label-caps text-[9px] sm:text-[10px] text-primary tracking-[0.3em] font-semibold block mb-1">
            MOST LOVED
          </span>
          <h3 className="font-headline-md text-xl sm:text-3xl lg:text-4xl text-on-surface">
            Best Sellers
          </h3>
        </div>
        <Link
          href="/collections"
          className="font-label-caps text-[10px] sm:text-xs text-primary hover:underline tracking-[0.15em] sm:tracking-[0.2em] font-semibold shrink-0"
        >
          VIEW ALL &rarr;
        </Link>
      </div>

      {/* Clean Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
