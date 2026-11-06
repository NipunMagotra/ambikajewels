'use client';

import { useState } from 'react';
import type { Product } from '@/types';
import FilterBar from './FilterBar';
import ProductCard from './ProductCard';

interface CollectionsGridClientProps {
  products: Product[];
  categoryTitle: string;
}

export default function CollectionsGridClient({
  products,
  categoryTitle,
}: CollectionsGridClientProps) {
  const [gridCols, setGridCols] = useState<number>(4);

  return (
    <>
      <FilterBar gridCols={gridCols} onGridColsChange={setGridCols} />

      {products.length > 0 ? (
        <div
          className={`grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 ${
            gridCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
          }`}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center max-w-md mx-auto bg-[var(--bg-card)] border border-[var(--border-subtle)] p-8 rounded-[1px] my-8">
          <span className="material-symbols-outlined text-3xl text-[var(--accent-gold)] mb-3 block">diamond</span>
          <h3 className="font-serif text-xl text-[var(--text-primary)] mb-2 font-normal">
            Bespoke Creations on Consultation
          </h3>
          <p className="font-sans text-xs text-[var(--text-secondary)] mb-6 leading-relaxed font-light">
            Looking for a specific heirloom design or custom carat specification in {categoryTitle}? Our Jammu atelier crafts bespoke pieces in 22K/18K/14K gold and certified diamonds.
          </p>
          <a
            href="https://wa.me/919086098457?text=Namaste!%20I%20am%20inquiring%20about%20a%20bespoke%20jewellery%20creation%20at%20Ambika%20Jewels."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold-primary"
          >
            INQUIRE ON WHATSAPP
          </a>
        </div>
      )}
    </>
  );
}

