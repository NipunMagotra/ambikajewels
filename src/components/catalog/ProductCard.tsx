'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { getProductWhatsAppUrl } from '@/utils/whatsapp';

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
        metal_finish: product.metal_finishes?.[0] || 'Gold'
      }
    });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleWhatsAppBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="group relative bg-surface-container/40 border border-outline-variant/20 hover:border-primary/50 overflow-hidden transition-all duration-300 flex flex-col justify-between rounded-xs">
      {/* Image Container */}
      <div className="relative aspect-[3/4] block overflow-hidden bg-surface-container-low">
        <Link href={`/collections/${product.slug}`} className="block w-full h-full">
          <div 
            className="w-full h-full bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105" 
            style={{ backgroundImage: `url('${mainImage}')` }}
          />
        </Link>

        {/* 22K Purity Tag */}
        <span className="absolute top-2 left-2 bg-background/85 text-primary font-label-caps text-[8px] sm:text-[9px] px-2 py-0.5 font-semibold tracking-widest backdrop-blur-xs border border-primary/20">
          22K BIS
        </span>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 bg-background/70 text-on-surface hover:text-primary transition-colors flex items-center justify-center backdrop-blur-xs border border-outline-variant/30 rounded-full"
          aria-label="Wishlist"
        >
          <span className={`material-symbols-outlined text-sm sm:text-base ${isWishlisted ? 'text-primary fill-1' : ''}`}>
            favorite
          </span>
        </button>

        {/* Desktop Hover Overlay */}
        <div className="hidden lg:flex absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-background/95 via-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-col gap-1.5 z-10">
          <button
            onClick={handleWhatsAppBuy}
            className="w-full gold-bg-gradient font-label-caps text-[9px] py-2 font-bold tracking-wider shadow-md hover:brightness-110 transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-xs">chat_bubble</span> BUY ON WHATSAPP
          </button>
          <button
            onClick={handleAddToCart}
            className="w-full bg-surface border border-primary/40 text-primary font-label-caps text-[9px] py-1.5 font-bold tracking-wider hover:bg-primary/10 transition-colors"
          >
            {addedAnimation ? '✓ ADDED' : '+ ADD TO BAG'}
          </button>
        </div>
      </div>

      {/* Product Details & Mobile Direct Action Buttons */}
      <div className="p-3 sm:p-4 text-center flex flex-col flex-1 justify-between gap-2">
        <div>
          <Link href={`/collections/${product.slug}`} className="block group-hover:text-primary transition-colors">
            <h5 className="font-headline-sm text-xs sm:text-sm lg:text-base text-on-surface mb-1 font-semibold line-clamp-1">
              {product.name}
            </h5>
          </Link>

          <p className="font-label-caps text-[11px] sm:text-xs text-primary font-bold tracking-widest">
            {product.display_price}
          </p>
        </div>

        {/* Mobile Action Buttons (Visible directly on touch screens) */}
        <div className="flex lg:hidden items-center gap-1.5 mt-1 pt-2 border-t border-outline-variant/15">
          <button
            onClick={handleWhatsAppBuy}
            className="flex-1 gold-bg-gradient font-label-caps text-[8.5px] py-2 font-bold tracking-wider shadow-sm flex items-center justify-center gap-1"
            title="Buy via WhatsApp"
          >
            <span className="material-symbols-outlined text-[12px]">chat_bubble</span>
            <span>WHATSAPP</span>
          </button>

          <button
            onClick={handleAddToCart}
            className="w-8 h-8 bg-surface-container border border-primary/40 text-primary flex items-center justify-center shrink-0 active:scale-95 transition-transform"
            title="Add to Bag"
          >
            <span className="material-symbols-outlined text-sm">
              {addedAnimation ? 'check' : 'add_shopping_bag'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
