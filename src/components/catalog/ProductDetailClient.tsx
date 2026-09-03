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
        metal_finish: selectedFinish,
        slug: product.slug
      }
    });
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const getPurityBadge = () => {
    const badges = product.badges || [];
    const name = product.name.toUpperCase();
    const cat = product.category.toUpperCase();

    if (badges.some(b => b.includes('22K')) || name.includes('22K')) return '22K BIS HALLMARKED';
    if (badges.some(b => b.includes('18K')) || name.includes('18K')) {
      return (badges.includes('CERTIFIED DIAMOND') || cat.includes('DIAMOND') || name.includes('DIAMOND'))
        ? '18K CERTIFIED DIAMOND'
        : '18K HALLMARKED GOLD';
    }
    if (badges.some(b => b.includes('14K')) || name.includes('14K')) return '14K HALLMARKED GOLD';
    if (badges.some(b => b.includes('925')) || name.includes('925') || cat.includes('SILVER') || name.includes('SILVER')) return '925 STERLING SILVER';
    if (badges.some(b => b.includes('9K')) || name.includes('9K')) return '9K SOLID GOLD';
    if (badges.some(b => b.includes('BESPOKE'))) return 'BESPOKE CRAFTSMANSHIP';
    return null;
  };

  const purityBadge = getPurityBadge();
  const isSilver = product.category.toLowerCase().includes('silver') || product.name.toLowerCase().includes('silver');
  const isDiamond = product.category.toLowerCase().includes('diamond') || product.name.toLowerCase().includes('diamond');
  const bottomBadgeText = isSilver ? '925 HALLMARKED' : isDiamond ? 'CERTIFIED NATURAL DIAMOND' : '100% BIS HALLMARKED';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
      {/* Product Image Gallery */}
      <div className="flex flex-col-reverse sm:flex-row gap-4">
        {/* Thumbnails */}
        <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[500px] scrollbar-thin">
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(img)}
              className={`w-16 h-16 sm:w-20 sm:h-20 bg-surface-container border transition-all shrink-0 rounded-xs overflow-hidden ${
                activeImage === img ? 'border-primary ring-1 ring-primary' : 'border-outline-variant/40 hover:border-primary/50'
              }`}
            >
              <div 
                className="w-full h-full bg-cover bg-center" 
                style={{ backgroundImage: `url('${img}')` }}
              />
            </button>
          ))}
        </div>

        {/* Main Display Image */}
        <div className="flex-1 bg-surface-container aspect-[3/4] sm:aspect-square lg:aspect-auto lg:h-[650px] border border-outline-variant overflow-hidden rounded-xs relative">
          <div 
            className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105" 
            style={{ backgroundImage: `url('${activeImage || '/hero-clean.png'}')` }}
          />
          {purityBadge && (
            <span className="absolute top-3 left-3 bg-background/85 text-primary font-label-caps text-[9px] px-2.5 py-1 font-semibold tracking-widest backdrop-blur-xs border border-primary/20">
              {purityBadge}
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col">
        {product.badges && product.badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {product.badges.map(badge => (
              <span key={badge} className="bg-primary-container text-on-primary-container font-label-caps text-[10px] px-2.5 py-1 font-semibold">
                {badge}
              </span>
            ))}
          </div>
        )}
        
        <h1 className="font-headline-md text-2xl sm:text-4xl text-primary mb-2">
          {product.name}
        </h1>
        
        <p className="font-headline-sm text-xl sm:text-2xl text-on-surface-variant mb-6 pb-4 border-b border-outline-variant/30 flex items-baseline gap-2">
          <span className="gold-text-gradient font-bold">{product.display_price}</span>
          <span className="text-xs font-body-md text-on-surface-variant/70 font-normal">(Excl. 3% GST & shipping, calculated at checkout)</span>
        </p>

        <div className="mb-6">
          <h3 className="font-label-caps text-xs text-on-surface-variant mb-2 tracking-widest font-semibold">THE CRAFTSMANSHIP STORY</h3>
          <p className="font-body-md text-xs sm:text-sm text-on-surface whitespace-pre-line leading-relaxed">
            {product.description}
          </p>
          {product.craftsmanship_story && (
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant/90 whitespace-pre-line mt-3 italic opacity-90 border-l-2 border-primary/40 pl-3">
              {product.craftsmanship_story}
            </p>
          )}
        </div>

        {/* Metal Finish */}
        <div className="mb-6">
          <h3 className="font-label-caps text-xs text-on-surface-variant mb-3 tracking-widest font-semibold">
            METAL FINISH: <span className="text-primary">{selectedFinish.toUpperCase()}</span>
          </h3>
          <div className="flex gap-4">
            {product.metal_finishes.map(finish => (
              <button
                key={finish}
                onClick={() => setSelectedFinish(finish)}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 ${
                  selectedFinish === finish ? 'border-primary shadow-[0_0_10px_rgba(230,202,101,0.4)]' : 'border-transparent'
                } relative group transition-all`}
                title={finish}
              >
                <span className={`absolute inset-1 rounded-full ${
                  finish === 'Gold' ? 'bg-[#FFD700]' : 
                  finish === 'Silver' ? 'bg-[#C0C0C0]' : 
                  'bg-[#B76E79]'
                }`}></span>
              </button>
            ))}
          </div>
        </div>

        {/* Quantity & Actions */}
        <div className="mt-auto pt-6 border-t border-outline-variant/30 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <div className="flex items-center border border-outline px-4 py-3 min-w-[120px] justify-between bg-surface-container">
              <span className="font-label-caps text-[10px] text-on-surface-variant mr-2">QTY:</span>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-on-surface hover:text-primary transition-colors text-xl font-bold px-2"
              >-</button>
              <span className="font-label-caps text-sm mx-3 font-bold">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="text-on-surface hover:text-primary transition-colors text-xl font-bold px-2"
              >+</button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={isAdding || product.stock_status === 'out_of_stock'}
              className="flex-1 bg-surface-container border border-primary text-primary px-4 py-3.5 font-label-caps text-xs hover:bg-primary/10 transition-all font-bold tracking-wider disabled:opacity-50"
            >
              {isAdding ? '✓ ADDED TO BAG' : product.stock_status === 'out_of_stock' ? 'OUT OF STOCK' : '+ ADD TO BAG'}
            </button>
          </div>
          
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full gold-bg-gradient px-4 py-4 font-label-caps text-xs hover:brightness-110 transition-all font-bold disabled:opacity-50 flex items-center justify-center gap-2 tracking-wider shadow-md"
          >
            <span className="material-symbols-outlined text-base">chat_bubble</span>
            {product.stock_status === 'out_of_stock' ? 'OUT OF STOCK' : 'BUY NOW ON WHATSAPP'}
          </a>
        </div>

        {/* Badges */}
        <div className="mt-6 flex items-center justify-around border border-outline-variant/30 p-3 bg-surface-container/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">verified</span>
            <span className="font-label-caps text-[9px] sm:text-[10px] text-on-surface-variant font-semibold">{bottomBadgeText}</span>
          </div>
          <div className="w-[1px] h-6 bg-outline-variant/40"></div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">local_shipping</span>
            <span className="font-label-caps text-[9px] sm:text-[10px] text-on-surface-variant font-semibold">INSURED SHIPPING</span>
          </div>
        </div>

      </div>
    </div>
  );
}
