'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { getProductWhatsAppUrl } from '@/lib/whatsapp';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { dispatch } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedFinish, setSelectedFinish] = useState<string>('Gold');
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [added, setAdded] = useState(false);

  if (!isOpen || !product) return null;

  const images = (product.images && product.images.length > 0)
    ? product.images
    : ['/hero-clean.png'];

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: images[0],
        metal_finish: selectedFinish || product.metal_finishes?.[0] || 'Gold',
        slug: product.slug,
        weight_grams: product.weight_grams,
      },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const whatsappUrl = getProductWhatsAppUrl(product, selectedFinish);
  const isSaved = isInWishlist(product.id);

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[var(--bg-card)] border border-[var(--border-subtle)] max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-[1px] shadow-2xl relative grid grid-cols-1 md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[var(--bg-card)]/80 hover:bg-[var(--bg-surface)] text-[var(--text-primary)] flex items-center justify-center border border-[var(--border-subtle)] transition-colors cursor-pointer"
          aria-label="Close Preview"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>

        {/* Product Visual */}
        <div className="p-6 bg-[var(--bg-surface)] flex flex-col justify-between">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-white/40">
            <img
              src={images[selectedImageIdx] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-500"
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-12 h-14 shrink-0 overflow-hidden border cursor-pointer transition-all ${
                    selectedImageIdx === idx
                      ? 'border-[var(--text-primary)]'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="text-[9.5px] font-sans tracking-[0.24em] uppercase text-[var(--text-tertiary)] mb-2 font-medium">
              {product.category}
            </div>

            <h2 className="font-serif text-2xl text-[var(--text-primary)] font-normal mb-2 leading-tight">
              {product.name}
            </h2>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="font-sans text-xl font-medium text-[var(--text-primary)]">
                {product.display_price || `₹${Math.round(product.price / 100).toLocaleString('en-IN')}`}
              </span>
              <span className="text-[10px] font-sans text-[var(--text-tertiary)] tracking-wider uppercase">
                (INCL. 3% GST)
              </span>
            </div>

            <p className="font-sans text-xs text-[var(--text-secondary)] line-clamp-3 mb-5 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Purity & Hallmark Specs */}
            <div className="py-3 border-y border-[var(--border-subtle)] grid grid-cols-2 gap-2 text-[11px] font-sans mb-5">
              <div>
                <span className="text-[var(--text-tertiary)] block text-[9.5px] uppercase tracking-wider">PURITY</span>
                <span className="font-medium text-[var(--text-primary)]">{product.purity || '22K BIS Hallmarked'}</span>
              </div>
              <div>
                <span className="text-[var(--text-tertiary)] block text-[9.5px] uppercase tracking-wider">NET WEIGHT</span>
                <span className="font-medium text-[var(--text-primary)]">{product.weight_grams} grams</span>
              </div>
            </div>

            {/* Metal Finish Selection */}
            {product.metal_finishes && product.metal_finishes.length > 0 && (
              <div className="mb-6">
                <span className="text-[9.5px] font-sans text-[var(--text-tertiary)] uppercase tracking-wider block mb-2 font-medium">
                  FINISH: {selectedFinish}
                </span>
                <div className="flex gap-2">
                  {product.metal_finishes.map((finish) => (
                    <button
                      key={finish}
                      onClick={() => setSelectedFinish(finish)}
                      className={`px-3 py-1.5 text-[10px] font-sans tracking-wider uppercase transition-all cursor-pointer ${
                        selectedFinish === finish
                          ? 'bg-[var(--text-primary)] text-[var(--bg-main)] font-semibold'
                          : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                      }`}
                    >
                      {finish}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-2.5 pt-4">
            <button
              onClick={handleAddToCart}
              className="btn-gold-primary w-full py-3 text-[10.5px] tracking-[0.2em]"
            >
              {added ? '✓ ADDED TO SHOPPING BAG' : 'ADD TO BAG'}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => toggleWishlist(product)}
                className="btn-gold-secondary py-2.5 text-[10px] tracking-wider flex items-center justify-center gap-1.5"
              >
                <span className={`material-symbols-outlined text-sm ${isSaved ? 'text-[var(--accent-burgundy)] fill-1' : ''}`}>
                  favorite
                </span>
                {isSaved ? 'SAVED' : 'WISHLIST'}
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold-secondary py-2.5 text-[10px] tracking-wider flex items-center justify-center gap-1.5 hover:text-emerald-600 hover:border-emerald-600"
              >
                <span className="material-symbols-outlined text-sm text-emerald-600">chat</span>
                INQUIRE
              </a>
            </div>

            <Link
              href={`/collections/${product.slug || product.id}`}
              onClick={onClose}
              className="text-center text-[10.5px] font-sans tracking-[0.18em] uppercase text-[var(--text-tertiary)] hover:text-[var(--text-primary)] mt-1 transition-colors underline underline-offset-4"
            >
              VIEW COMPLETE SHOWROOM DETAILS &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

