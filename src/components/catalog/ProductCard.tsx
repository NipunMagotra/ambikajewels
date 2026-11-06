'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/types';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import QuickViewModal from './QuickViewModal';

export default function ProductCard({ product }: { product: Product }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { dispatch } = useCart();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const images = (product.images && product.images.length > 0)
    ? product.images
    : ['/hero-clean.png'];

  const primaryImage = images[0];
  const secondaryImage = images.length > 1 ? images[1] : images[0];
  const isSaved = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: primaryImage,
        metal_finish: product.metal_finishes?.[0] || 'Gold',
        slug: product.slug,
        weight_grams: product.weight_grams,
      },
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 1400);
  };

  const handleOpenQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  const badgeText = product.purity || product.badges?.[0] || (product.is_featured ? '22K BIS' : null);

  return (
    <>
      <div
        className="group relative flex flex-col justify-between transition-all duration-300 select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Photography Canvas */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--bg-surface)]">
          <Link href={`/collections/${product.slug || product.id}`} className="block w-full h-full relative">
            {/* Primary Image */}
            <img
              src={primaryImage}
              alt={product.name}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/hero-clean.png';
              }}
              className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                isHovered && secondaryImage !== primaryImage
                  ? 'opacity-0 scale-102'
                  : 'opacity-100 scale-100 group-hover:scale-104'
              }`}
            />

            {/* Secondary Angle Image (Smooth cross-fade on hover) */}
            {secondaryImage !== primaryImage && (
              <img
                src={secondaryImage}
                alt={`${product.name} alternative perspective`}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = primaryImage;
                }}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                  isHovered ? 'opacity-100 scale-104' : 'opacity-0 scale-100'
                }`}
              />
            )}
          </Link>

          {/* Minimalist Purity / Hallmark Badge */}
          {badgeText && (
            <span className="absolute top-3 left-3 bg-[var(--bg-card)]/90 backdrop-blur-xs text-[var(--accent-gold)] font-sans text-[8.5px] px-2 py-0.5 tracking-[0.18em] uppercase font-medium border border-[var(--border-subtle)] rounded-[1px] pointer-events-none">
              {badgeText}
            </span>
          )}

          {/* Wishlist Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[var(--bg-card)]/90 hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] backdrop-blur-xs border border-[var(--border-subtle)] flex items-center justify-center transition-all cursor-pointer shadow-xs"
            aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
            title={isSaved ? 'Saved to Wishlist' : 'Save to Wishlist'}
          >
            <span
              className={`material-symbols-outlined text-[16px] transition-colors ${
                isSaved ? 'text-[var(--accent-burgundy)] fill-1' : ''
              }`}
            >
              favorite
            </span>
          </button>

          {/* Quick View & Quick Add Action Bar (Slide in gracefully from bottom) */}
          <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 z-10">
            <button
              onClick={handleOpenQuickView}
              className="flex-1 py-2 bg-[var(--bg-card)]/95 text-[var(--text-primary)] hover:text-[var(--accent-gold)] font-sans text-[10px] tracking-[0.16em] uppercase font-medium rounded-[1px] transition-colors shadow-xs cursor-pointer"
            >
              QUICK VIEW
            </button>
            <button
              onClick={handleQuickAdd}
              className="px-3 py-2 bg-[var(--text-primary)] text-[var(--bg-main)] hover:bg-[var(--accent-gold)] font-sans text-[10px] tracking-[0.14em] uppercase font-medium rounded-[1px] transition-colors shadow-xs cursor-pointer"
              title="Add to shopping bag"
            >
              {addedToast ? '✓' : '+ BAG'}
            </button>
          </div>
        </div>

        {/* Product Meta Narrative */}
        <div className="pt-3 pb-1 flex flex-col justify-between">
          <div>
            <div className="text-[9px] font-sans tracking-[0.2em] uppercase text-[var(--text-tertiary)] mb-1 truncate font-medium">
              {product.category}
            </div>

            <h3 className="font-serif text-sm sm:text-base text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors line-clamp-1 font-normal tracking-tight">
              <Link href={`/collections/${product.slug || product.id}`}>
                {product.name}
              </Link>
            </h3>

            {product.weight_grams && (
              <div className="text-[10px] font-sans text-[var(--text-tertiary)] mt-0.5 tracking-wider font-light">
                {product.purity ? `${product.purity} • ` : ''}{product.weight_grams}g
              </div>
            )}
          </div>

          <div className="mt-2 flex items-baseline justify-between pt-1.5 border-t border-[var(--border-subtle)]">
            <span className="font-sans text-xs sm:text-sm font-medium text-[var(--text-primary)]">
              {product.display_price || `₹${Math.round(product.price / 100).toLocaleString('en-IN')}`}
            </span>
            <span className="font-sans text-[9px] text-[var(--text-tertiary)] uppercase tracking-wider">
              BIS INCL.
            </span>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
