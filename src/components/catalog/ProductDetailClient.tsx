'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';
import { getProductWhatsAppUrl } from '@/utils/whatsapp';
import { siteConfig } from '@/config/siteConfig';

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const { dispatch } = useCart();
  const [selectedFinish, setSelectedFinish] = useState(product.metal_finishes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [showPriceBreakup, setShowPriceBreakup] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const totalRupees = Math.round(product.price / 100);
  const preTaxSubtotal = Math.round(totalRupees / 1.03);
  const gstRupees = totalRupees - preTaxSubtotal;
  const hallmarkFee = 45;
  const netWeight = product.weight_grams || 10;
  const estimatedMetalValue = Math.min(preTaxSubtotal - hallmarkFee, Math.round(preTaxSubtotal * 0.88));
  const estimatedMakingCharge = Math.max(0, preTaxSubtotal - estimatedMetalValue - hallmarkFee);

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
        slug: product.slug,
        weight_grams: product.weight_grams,
        dimensions: product.dimensions
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

    const isHallmarked = product.is_hallmarked ?? (product.bis_hallmark?.toLowerCase().includes('hallmark') || badges.some(b => b.includes('BIS')));

    if (badges.some(b => b.includes('22K')) || name.includes('22K')) {
      return isHallmarked ? '22K BIS HALLMARKED' : '22K SOLID GOLD';
    }
    if (badges.some(b => b.includes('18K')) || name.includes('18K')) {
      return (badges.includes('CERTIFIED DIAMOND') || cat.includes('DIAMOND') || name.includes('DIAMOND'))
        ? '18K CERTIFIED DIAMOND'
        : (isHallmarked ? '18K BIS HALLMARKED GOLD' : '18K SOLID GOLD');
    }
    if (badges.some(b => b.includes('14K')) || name.includes('14K')) {
      return isHallmarked ? '14K BIS HALLMARKED GOLD' : '14K SOLID GOLD';
    }
    if (badges.some(b => b.includes('925')) || name.includes('925') || cat.includes('SILVER') || name.includes('SILVER')) {
      return isHallmarked ? '925 STERLING HALLMARKED' : '925 STERLING SILVER';
    }
    if (badges.some(b => b.includes('9K')) || name.includes('9K')) return '9K SOLID GOLD';
    if (badges.some(b => b.includes('BESPOKE'))) return 'BESPOKE CRAFTSMANSHIP';
    return null;
  };

  const purityBadge = getPurityBadge();
  const isSilver = product.category.toLowerCase().includes('silver') || product.name.toLowerCase().includes('silver');
  const isDiamond = product.category.toLowerCase().includes('diamond') || product.name.toLowerCase().includes('diamond');
  const isHallmarked = product.is_hallmarked ?? (product.bis_hallmark?.toLowerCase().includes('hallmark') || product.badges?.some(b => b.includes('BIS')));
  const hasHuid = product.has_huid ?? (product.bis_hallmark?.toLowerCase().includes('huid') || false);

  const bottomBadgeText = isSilver 
    ? (isHallmarked ? '925 STERLING HALLMARKED' : '925 STERLING SILVER') 
    : isDiamond 
      ? 'CERTIFIED NATURAL DIAMOND' 
      : isHallmarked 
        ? (hasHuid ? 'BIS HALLMARKED WITH 6-CHAR ALPHANUMERIC HUID' : 'BIS HALLMARKED (BUREAU OF INDIAN STANDARDS)')
        : 'AUTHENTIC HANDCRAFTED JEWELRY';

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
        
        <div className="mb-6 pb-4 border-b border-outline-variant/30">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="gold-text-gradient font-bold font-headline-sm text-2xl sm:text-3xl">
              {product.display_price}
            </span>
            <span className="text-xs text-primary font-semibold tracking-wide bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
              Inclusive of all taxes
            </span>
          </div>
          <p className="text-[11px] text-on-surface-variant/80 mt-1">
            Net retail price inclusive of 3% GST & BIS Hallmarking • Fully insured delivery by BVC Logistics
          </p>

          {/* F4: Hide PDP Price Breakup behind feature flag until dynamic product pricing exists */}
          {Boolean(siteConfig.features.showPdpPriceBreakup && (estimatedMetalValue + estimatedMakingCharge + hallmarkFee + gstRupees === totalRupees)) && (
            <>
              <button
                type="button"
                onClick={() => setShowPriceBreakup(!showPriceBreakup)}
                className="mt-3 text-xs text-primary hover:text-primary-container font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-sm">
                  {showPriceBreakup ? 'expand_less' : 'price_change'}
                </span>
                <span>{showPriceBreakup ? 'Hide Price Breakup' : 'View Transparent Price Breakup (Metal + Making + GST)'}</span>
              </button>

              {showPriceBreakup && (
                <div className="mt-3 p-3.5 bg-surface-container border border-outline-variant/30 rounded-xs text-xs font-body-md space-y-2">
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Precious Metal ({netWeight.toFixed(2)}g {product.purity || '22K'})</span>
                    <span className="font-mono font-semibold text-on-surface">₹{estimatedMetalValue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>Artisanal Making Charges</span>
                    <span className="font-mono font-semibold text-on-surface">+₹{estimatedMakingCharge.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>BIS Hallmarking Fee</span>
                    <span className="font-mono font-semibold text-on-surface">+₹{hallmarkFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface-variant pt-1 border-t border-outline-variant/20">
                    <span>Taxable Value (Pre-tax)</span>
                    <span className="font-mono text-on-surface">₹{preTaxSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-on-surface-variant">
                    <span>GST (3% on HSN 7113)</span>
                    <span className="font-mono font-semibold text-primary">+₹{gstRupees.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1.5 border-t border-outline-variant/30 font-bold text-sm text-primary">
                    <span>Final Payable Amount</span>
                    <span className="font-mono">{product.display_price}</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant/70 italic pt-1">
                    * Transparent pricing guarantee: No hidden surcharges. Subject to daily live Jammu bullion rates.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

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

        {/* Specifications & Compliance Table */}
        <div className="mb-6 border border-outline-variant/30 bg-surface-container/60 p-4 rounded-xs">
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-2 mb-3">
            <h3 className="font-label-caps text-[11px] text-primary tracking-widest font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">verified</span>
              PRODUCT SPECIFICATIONS & LEGAL METROLOGY
            </h3>
            <span className="text-[9px] font-label-caps text-green-400 bg-green-950/40 px-2 py-0.5 rounded-xs border border-green-800/40 font-semibold">
              {product.stock_status === 'in_stock' ? 'READY TO DISPATCH' : 'MADE TO ORDER'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-body-md">
            <div>
              <span className="text-[10px] text-on-surface-variant/70 block uppercase">Material & Composition</span>
              <span className="font-semibold text-on-surface text-[11px]">{product.material || 'Solid Gold'}</span>
            </div>

            <div>
              <span className="text-[10px] text-on-surface-variant/70 block uppercase">Purity / Karatage</span>
              <span className="font-semibold text-on-surface text-[11px]">{product.purity || '22K (916)'}</span>
            </div>

            <div>
              <span className="text-[10px] text-on-surface-variant/70 block uppercase">Hallmarking / HUID</span>
              <span className="font-semibold text-on-surface text-[11px]">{product.bis_hallmark || 'BIS Assayed & Hallmarked'}</span>
            </div>

            <div>
              <span className="text-[10px] text-on-surface-variant/70 block uppercase">Net Precious Weight</span>
              <span className="font-semibold text-on-surface text-[11px]">{product.weight_grams} grams</span>
            </div>

            <div>
              <span className="text-[10px] text-on-surface-variant/70 block uppercase">Gross Weight</span>
              <span className="font-semibold text-on-surface text-[11px]">{product.gross_weight_grams || product.weight_grams} grams</span>
            </div>

            <div>
              <span className="text-[10px] text-on-surface-variant/70 block uppercase">Dimensions (L × B × H)</span>
              <span className="font-semibold text-on-surface text-[11px]">
                {product.dimensions.length_cm} × {product.dimensions.breadth_cm} × {product.dimensions.height_cm} cm
              </span>
            </div>

            <div>
              <span className="text-[10px] text-on-surface-variant/70 block uppercase">HSN Code</span>
              <span className="font-semibold text-on-surface text-[11px]">{product.hsn_code} (Precious Jewelry)</span>
            </div>

            <div>
              <span className="text-[10px] text-on-surface-variant/70 block uppercase">Country of Origin</span>
              <span className="font-semibold text-on-surface text-[11px]">{product.country_of_origin}</span>
            </div>

            <div className="col-span-2 pt-1 border-t border-outline-variant/20">
              <span className="text-[10px] text-on-surface-variant/70 block uppercase">Seller & Manufacturing Details</span>
              <span className="font-medium text-on-surface text-[11px]">{product.seller_details}</span>
            </div>
          </div>
        </div>

        {/* Quantity & Actions */}
        <div className="mt-auto pt-4 border-t border-outline-variant/30 flex flex-col gap-3">
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
            <span className="font-label-caps text-[9px] sm:text-[10px] text-on-surface-variant font-semibold">SHIPROCKET DELIVERY</span>
          </div>
          <div className="w-[1px] h-6 bg-outline-variant/40"></div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-lg">assignment_return</span>
            <span className="font-label-caps text-[9px] sm:text-[10px] text-on-surface-variant font-semibold">7-DAY RETURNS</span>
          </div>
        </div>

      </div>
    </div>
  );
}
