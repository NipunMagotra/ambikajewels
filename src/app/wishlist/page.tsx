'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import ProductCard from '@/components/catalog/ProductCard';
import { useWishlist } from '@/context/WishlistContext';
import MandalaDivider from '@/components/ui/MandalaDivider';

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 sm:pt-32 pb-20 lg:pb-16 bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
        <div className="container mx-auto px-3 sm:px-margin-mobile lg:px-margin-desktop max-w-6xl">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <span className="font-sans text-[10px] sm:text-xs text-[var(--accent-gold)] tracking-[0.3em] uppercase block mb-1 font-semibold">
              SAVED HEIRLOOMS
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] font-normal">
              My Wishlist
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] mt-2 font-light">
              Your curated selection of Dogra heritage jewellery and bespoke creations.
            </p>
          </div>

          <MandalaDivider />

          {wishlist.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-[var(--bg-card)] border border-[var(--border-card)] shadow-[var(--card-shadow)] p-8 max-w-lg mx-auto rounded-[2px] my-6">
              <span className="material-symbols-outlined text-4xl text-[var(--accent-gold)] mb-3 block">favorite</span>
              <p className="font-serif text-lg text-[var(--text-primary)] mb-2 font-normal">
                Your wishlist is currently empty.
              </p>
              <p className="font-sans text-xs text-[var(--text-secondary)] mb-6 font-light">
                Save your favourite bridal sets, Dogri jhumkis, and certified solitaire rings while exploring our catalog.
              </p>
              <Link href="/collections" className="btn-gold-primary">
                EXPLORE COLLECTIONS
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 my-6">
              {wishlist.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

