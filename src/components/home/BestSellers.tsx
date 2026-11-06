'use client';

import Link from 'next/link';
import ProductCard from '../catalog/ProductCard';
import type { Product } from '@/types';

export default function BestSellers({ products }: { products: Product[] }) {
  if (!products || products.length === 0) {
    return (
      <section className="py-8 sm:py-12 px-4 sm:px-margin-mobile lg:px-margin-desktop">
        <div className="flex flex-row justify-between items-end mb-8 sm:mb-10 gap-3 border-b border-[var(--border-subtle)] pb-4 sm:pb-5">
          <div>
            <span className="font-sans text-[9px] sm:text-[10px] text-[var(--accent-gold)] tracking-[0.35em] uppercase font-semibold block mb-1.5">
              BESPOKE FINE JEWELLERY
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[var(--text-primary)] font-normal tracking-tight">
              Signature Heirlooms &amp; Bridal Couture
            </h2>
            <p className="font-sans text-xs text-[var(--text-secondary)] mt-1 font-light hidden sm:block">
              Authentic 22K Dogri Jhumkis, Royal Naman Sets, and certified diamond creations crafted to order.
            </p>
          </div>
          <Link
            href="/contact"
            className="font-sans text-[10px] sm:text-xs text-[var(--accent-gold)] hover:text-[var(--accent-gold-highlight)] tracking-[0.2em] font-semibold shrink-0 uppercase transition-colors flex items-center gap-1 group py-1"
          >
            <span>SHOWROOM DETAILS</span>
            <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
          </Link>
        </div>

        <div className="text-center py-10 sm:py-14 px-6 rounded-xs bg-[var(--bg-card)] border border-[var(--border-card)] shadow-[var(--card-shadow)] max-w-2xl mx-auto">
          <div className="w-12 h-12 mx-auto mb-3.5 rounded-full bg-[var(--accent-gold)]/10 flex items-center justify-center text-[var(--accent-gold)]">
            <span className="material-symbols-outlined text-2xl">diamond</span>
          </div>
          <h3 className="font-serif text-lg sm:text-xl text-[var(--text-primary)] mb-2 font-normal">
            Bespoke Jammu Artisanship
          </h3>
          <p className="font-sans text-xs text-[var(--text-secondary)] mb-6 max-w-md mx-auto leading-relaxed font-light">
            Our master karigars craft authentic 22K Dogra gold heirlooms and certified solitaire jewellery at our Jammu showroom. Connect with our styling team directly for private viewings, live video walkthroughs, and custom wedding commissions.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="https://wa.me/919086098457?text=Namaste!%20I%20would%20like%20to%20enquire%20about%20Ambika%20Jewels%20bridal%20and%20Dogra%20jewellery."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold-primary text-xs px-5 py-2.5 tracking-wider inline-flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">chat_bubble</span>
              <span>WHATSAPP SHOWROOM</span>
            </a>
            <Link
              href="/contact"
              className="btn-gold-secondary text-xs px-5 py-2.5 tracking-wider inline-flex items-center gap-2"
            >
              <span>VISIT SHOWROOM</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

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
