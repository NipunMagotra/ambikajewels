'use client';

import Link from 'next/link';
import ProductCard from '../catalog/ProductCard';
import type { Product } from '@/types';

export default function BestSellers({ products }: { products: Product[] }) {
  return (
    <section className="py-16 px-margin-mobile lg:px-margin-desktop">
      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4 border-b border-outline-variant/20 pb-4">
        <h3 className="font-headline-md text-3xl lg:text-4xl text-on-surface">
          Best Sellers
        </h3>
        <Link
          href="/collections"
          className="font-label-caps text-xs text-primary hover:underline tracking-[0.2em] font-semibold"
        >
          VIEW ALL PRODUCTS &rarr;
        </Link>
      </div>

      {/* Clean Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}


