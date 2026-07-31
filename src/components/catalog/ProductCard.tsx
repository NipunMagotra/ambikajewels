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
    <div className="group relative bg-[#221312] border-2 border-amber-500/30 hover:border-amber-400 overflow-hidden transition-all duration-300 flex flex-col justify-between rounded-md shadow-xl">
      {/* Image Container */}
      <div className="relative aspect-[3/4] block overflow-hidden bg-[#160b0a]">
        <Link href={`/collections/${product.slug}`} className="block w-full h-full">
          <img 
            src={mainImage} 
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </Link>

        {/* 22K Purity Tag */}
        <span className="absolute top-2 left-2 bg-[#160b0a]/90 text-amber-300 font-label-caps text-[9px] sm:text-[10px] px-2.5 py-1 font-extrabold tracking-widest backdrop-blur-xs border border-amber-500/40 rounded">
          22K BIS
        </span>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-2 right-2 w-8 h-8 bg-[#160b0a]/80 text-amber-100 hover:text-amber-300 transition-colors flex items-center justify-center backdrop-blur-xs border border-amber-500/30 rounded-full"
          aria-label="Wishlist"
        >
          <span className={`material-symbols-outlined text-base ${isWishlisted ? 'text-amber-400 fill-1' : ''}`}>
            favorite
          </span>
        </button>

        {/* Desktop Hover Overlay */}
        <div className="hidden lg:flex absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/95 via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-col gap-2 z-10">
          <button
            onClick={handleWhatsAppBuy}
            className="w-full gold-bg-gradient font-label-caps text-[10px] py-2.5 font-extrabold tracking-wider text-black shadow-md hover:brightness-110 transition-colors flex items-center justify-center gap-1.5 rounded"
          >
            <span className="material-symbols-outlined text-sm">chat</span> BUY ON WHATSAPP
          </button>
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#160b0a] border border-amber-500/50 text-amber-300 font-label-caps text-[10px] py-2 font-bold tracking-wider hover:text-white transition-colors rounded"
          >
            {addedAnimation ? '✓ ADDED TO BAG' : '+ ADD TO BAG'}
          </button>
        </div>
      </div>

      {/* Product Details & Mobile Action Buttons */}
      <div className="p-3 sm:p-4 text-center flex flex-col flex-1 justify-between gap-2.5">
        <div>
          <Link href={`/collections/${product.slug}`} className="block group-hover:text-amber-300 transition-colors">
            <h5 className="font-headline-sm text-xs sm:text-sm lg:text-base text-white mb-1 font-bold line-clamp-1">
              {product.name}
            </h5>
          </Link>

          <p className="font-label-caps text-xs sm:text-sm text-amber-300 font-extrabold tracking-widest font-mono">
            {product.display_price}
          </p>
        </div>

        {/* Mobile Action Buttons (Optimized Touch Responsive Layout) */}
        <div className="flex lg:hidden items-center gap-2 mt-1 pt-2.5 border-t border-amber-500/25">
          <button
            onClick={handleWhatsAppBuy}
            className="flex-1 gold-bg-gradient font-label-caps text-[10px] py-2.5 font-extrabold tracking-wider text-black shadow-md flex items-center justify-center gap-1 rounded active:scale-95 transition-all"
            title="Buy via WhatsApp"
          >
            <span className="material-symbols-outlined text-[14px]">chat</span>
            <span>WHATSAPP</span>
          </button>

          <button
            onClick={handleAddToCart}
            className="px-3 py-2.5 bg-[#160b0a] border-2 border-amber-500/50 text-amber-300 hover:text-white font-label-caps text-[10px] font-bold tracking-wider flex items-center justify-center gap-1 rounded shrink-0 active:scale-95 transition-all"
            title="Add to Bag"
          >
            <span className="material-symbols-outlined text-sm">
              {addedAnimation ? 'check' : 'shopping_bag'}
            </span>
            <span>{addedAnimation ? 'ADDED' : 'BAG'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
