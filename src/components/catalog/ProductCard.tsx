'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { getProductWhatsAppUrl } from '@/lib/whatsapp';

export default function ProductCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const { dispatch } = useCart();
  const mainImage = product.images?.[0] || '/hero-clean.png';
  const whatsappUrl = getProductWhatsAppUrl(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: mainImage,
        metal_finish: product.metal_finishes?.[0] || 'Gold',
        slug: product.slug,
        weight_grams: product.weight_grams
      }
    });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  const handleWhatsAppBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Purity badge text
  const badgeText = product.purity 
    ? product.purity 
    : product.badges?.[0] || (product.is_featured ? '22K BIS' : null);

  return (
    <div className="group relative bg-[var(--bg-card)] border border-[var(--border-card)] hover:border-[var(--accent-gold)]/70 shadow-[var(--card-shadow)] hover:shadow-lg transition-all duration-300 flex flex-col justify-between rounded-[2px] overflow-hidden">
      {/* Image Presentation */}
      <div className="relative aspect-[3/4] block overflow-hidden bg-[var(--bg-surface)]">
        <Link href={`/collections/${product.slug || product.id}`} className="block w-full h-full">
          <img 
            src={mainImage} 
            alt={product.name}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/hero-clean.png';
            }}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
          />
        </Link>

        {/* Subtle Purity Stamp */}
        {badgeText && (
          <span className="absolute top-2.5 left-2.5 bg-[var(--bg-main)]/95 text-[var(--accent-gold)] font-sans text-[8px] sm:text-[9px] px-2 py-0.5 font-semibold tracking-[0.2em] uppercase backdrop-blur-xs border border-[var(--border-card)] rounded-[1px] shadow-xs">
            {badgeText}
          </span>
        )}

        {/* Wishlist Button with 44px tap target */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 sm:w-9 sm:h-9 bg-[var(--bg-card)]/90 text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors flex items-center justify-center backdrop-blur-xs border border-[var(--border-subtle)] rounded-full cursor-pointer shadow-xs"
          aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
        >
          <span className={`material-symbols-outlined text-base sm:text-lg ${isWishlisted ? 'text-[var(--accent-burgundy)] fill-1' : ''}`}>
            favorite
          </span>
        </button>

        {/* Desktop Quick Actions (Slide up on hover) */}
        <div className="hidden lg:flex absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[var(--bg-card)]/98 via-[var(--bg-card)]/85 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-col gap-1.5 z-10">
          <button
            onClick={handleWhatsAppBuy}
            className="btn-gold-primary py-2.5 text-[10px] w-full shadow-xs"
          >
            <span className="material-symbols-outlined text-sm">chat</span> INQUIRE ON WHATSAPP
          </button>
          <button
            onClick={handleAddToCart}
            className="btn-gold-secondary py-2 text-[10px] w-full bg-[var(--bg-surface)]/95 text-[var(--accent-gold)] border-[var(--border-card)] hover:border-[var(--accent-gold)]"
          >
            {addedAnimation ? '✓ ADDED TO BAG' : '+ ADD TO BAG'}
          </button>
        </div>
      </div>

      {/* Product Details & Mobile Actions */}
      <div className="p-3 sm:p-4 text-center flex flex-col flex-1 justify-between gap-2 bg-[var(--bg-card)]">
        <div>
          {/* Subtle Karat / Net Weight Spec Line */}
          {product.weight_grams && (
            <span className="font-sans text-[9px] text-[var(--text-secondary)]/80 tracking-widest uppercase block mb-0.5">
              Net: {product.weight_grams}g &bull; {product.purity || '22K Gold'}
            </span>
          )}

          <Link href={`/collections/${product.slug || product.id}`} className="block group-hover:text-[var(--accent-gold)] transition-colors">
            <h4 className="font-serif text-sm sm:text-base text-[var(--text-primary)] font-normal leading-snug line-clamp-1 mb-1 tracking-tight">
              {product.name}
            </h4>
          </Link>

          <p className="font-serif text-sm sm:text-base lg:text-lg text-[var(--accent-gold)] font-medium tracking-wide">
            {product.display_price}
          </p>
          <span className="text-[9.5px] text-[var(--text-secondary)]/80 block font-sans tracking-tight mt-0.5">
            Inclusive of 3% GST &bull; BIS Certified
          </span>
        </div>

        {/* Mobile Action Controls */}
        <div className="flex lg:hidden items-center gap-1.5 pt-2 border-t border-[var(--border-subtle)] mt-1">
          <button
            onClick={handleWhatsAppBuy}
            className="flex-1 btn-gold-primary py-2.5 text-[9.5px] px-2"
            title="Inquire via WhatsApp"
          >
            <span className="material-symbols-outlined text-[13px]">chat</span>
            <span>WHATSAPP</span>
          </button>

          <button
            onClick={handleAddToCart}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center btn-gold-secondary bg-[var(--bg-surface)] text-[var(--accent-gold)] border-[var(--border-card)] shrink-0 p-2"
            title="Add to Bag"
            aria-label="Add to Bag"
          >
            <span className="material-symbols-outlined text-base">
              {addedAnimation ? 'check' : 'shopping_bag'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
