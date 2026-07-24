'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';

import { getProductWhatsAppUrl } from '@/utils/whatsapp';

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const { dispatch } = useCart();
  const [selectedFinish, setSelectedFinish] = useState(product.metal_finishes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [isAdding, setIsAdding] = useState(false);

  const whatsappUrl = getProductWhatsAppUrl(product, selectedFinish, quantity);

  const handleAddToCart = () => {
    setIsAdding(true);
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.images[0],
        metal_finish: selectedFinish
      }
    });
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const handleBuyNowWhatsApp = () => {
    handleAddToCart();
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-stack-lg lg:gap-margin-desktop">
      {/* Image Gallery */}
      <div className="flex flex-col-reverse lg:flex-row gap-4">
        <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-x-hidden custom-scrollbar">
          {product.images.map((img, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`w-20 h-24 lg:w-24 lg:h-28 shrink-0 bg-surface-container border ${activeImage === img ? 'border-primary' : 'border-transparent'} overflow-hidden transition-all`}
            >
              <div 
                className="w-full h-full bg-cover bg-center" 
                style={{ backgroundImage: `url('${img}')` }}
              />
            </button>
          ))}
        </div>
        <div className="flex-1 bg-surface-container aspect-[3/4] lg:aspect-auto lg:h-[700px] border border-outline-variant overflow-hidden">
          <div 
            className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-110 cursor-crosshair" 
            style={{ backgroundImage: `url('${activeImage || '/hero-clean.png'}')` }}
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col">
        {product.badges && product.badges.length > 0 && (
          <div className="flex gap-2 mb-4">
            {product.badges.map(badge => (
              <span key={badge} className="bg-primary-container text-on-primary-container font-label-caps text-label-caps px-2 py-1">
                {badge}
              </span>
            ))}
          </div>
        )}
        
        <h1 className="font-display-lg-mobile lg:font-display-lg text-display-lg-mobile lg:text-display-lg text-primary mb-2">
          {product.name}
        </h1>
        
        <p className="font-headline-sm text-headline-sm text-on-surface-variant mb-stack-lg pb-stack-lg border-b border-outline-variant">
          {product.display_price} <span className="text-body-md font-body-md opacity-50 ml-2">(inclusive of all taxes)</span>
        </p>

        <div className="mb-stack-lg">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4 tracking-widest">THE CRAFTSMANSHIP STORY</h3>
          <p className="font-body-md text-body-md text-on-surface whitespace-pre-line">
            {product.description}
          </p>
          {product.craftsmanship_story && (
            <p className="font-body-md text-body-md text-on-surface whitespace-pre-line mt-4 italic opacity-80">
              {product.craftsmanship_story}
            </p>
          )}
        </div>

        {/* Metal Finish */}
        <div className="mb-stack-md">
          <h3 className="font-label-caps text-label-caps text-on-surface-variant mb-4 tracking-widest">METAL FINISH</h3>
          <div className="flex gap-4">
            {product.metal_finishes.map(finish => (
              <button
                key={finish}
                onClick={() => setSelectedFinish(finish)}
                className={`w-12 h-12 rounded-full border-2 ${selectedFinish === finish ? 'border-primary' : 'border-transparent'} relative group`}
              >
                <span className={`absolute inset-1 rounded-full ${
                  finish === 'Gold' ? 'bg-[#FFD700]' : 
                  finish === 'Silver' ? 'bg-[#C0C0C0]' : 
                  'bg-[#B76E79]'
                }`}></span>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {finish}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quantity & Actions */}
        <div className="mt-auto pt-stack-lg border-t border-outline-variant flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-outline px-4 py-3 min-w-[120px] justify-between">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-on-surface hover:text-primary transition-colors text-xl"
              >-</button>
              <span className="font-label-caps text-label-caps mx-4">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="text-on-surface hover:text-primary transition-colors text-xl"
              >+</button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={isAdding || product.stock_status === 'out_of_stock'}
              className="flex-1 bg-surface-container border border-primary text-primary px-4 py-4 font-label-caps text-label-caps hover:bg-surface-variant transition-all disabled:opacity-50"
            >
              {isAdding ? 'ADDED TO BAG' : product.stock_status === 'out_of_stock' ? 'OUT OF STOCK' : 'ADD TO BAG'}
            </button>
          </div>
          
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full gold-bg-gradient px-4 py-4 font-label-caps text-label-caps hover:brightness-110 transition-all font-bold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">chat_bubble</span>
            {product.stock_status === 'out_of_stock' ? 'OUT OF STOCK' : 'BUY NOW ON WHATSAPP'}
          </a>
        </div>

        <div className="mt-stack-lg flex items-center justify-between border border-outline-variant p-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">verified</span>
            <span className="font-label-caps text-[10px] text-on-surface-variant">BIS HALLMARKED</span>
          </div>
          <div className="w-[1px] h-8 bg-outline-variant"></div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">local_shipping</span>
            <span className="font-label-caps text-[10px] text-on-surface-variant">INSURED SHIPPING</span>
          </div>
        </div>

      </div>
    </div>
  );
}
