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
  const [selectedFinish, setSelectedFinish] = useState(product.metal_finishes?.[0] || 'Gold');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.images?.[0] || '/hero-clean.png');
  const [showPriceBreakup, setShowPriceBreakup] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const catStr = (product.category || '').toLowerCase();
  const nameStr = (product.name || '').toLowerCase();

  const isRing = catStr.includes('ring') || nameStr.includes('ring');
  const isBangle = catStr.includes('bangle') || 
                   catStr.includes('kada') || 
                   catStr.includes('bracelet') || 
                   nameStr.includes('bangle') || 
                   nameStr.includes('kada') ||
                   nameStr.includes('bracelet');

  const ringSizes = ['10', '11', '12', '13', '14 (Standard)', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];
  const bangleSizes = ['2.2 (2-2/16")', '2.4 (2-4/16")', '2.6 (2-6/16" - Most Popular)', '2.8 (2-8/16")', '2.10 (2-10/16")'];

  const [selectedSize, setSelectedSize] = useState<string>(
    isRing ? '14 (Standard)' : isBangle ? '2.6 (2-6/16" - Most Popular)' : ''
  );
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const totalRupees = Math.round((product.price || 0) / 100);
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
        image: (product.images && product.images[0]) || '/hero-clean.png',
        metal_finish: selectedFinish,
        selected_size: selectedSize || undefined,
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-14">
      {/* Product Image Gallery */}
      <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
        {/* Thumbnails */}
        <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto max-h-[500px] no-scrollbar" role="region" aria-label="Product image thumbnails">
          {(product.images || []).map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveImage(img)}
              aria-label={`View image ${i + 1} of ${product.name}`}
              aria-pressed={activeImage === img}
              className={`w-16 h-16 sm:w-20 sm:h-20 bg-[var(--bg-surface)] border transition-all shrink-0 rounded-[2px] overflow-hidden focus-visible:ring-1 focus-visible:ring-[var(--accent-gold)] focus:outline-none cursor-pointer ${
                activeImage === img ? 'border-[var(--accent-gold)] ring-1 ring-[var(--accent-gold)]' : 'border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/60'
              }`}
            >
              <img 
                src={img} 
                alt={`${product.name} thumbnail ${i + 1}`}
                referrerPolicy="no-referrer"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/hero-clean.png'; }}
                className="w-full h-full object-cover" 
              />
            </button>
          ))}
        </div>

        {/* Main Display Image */}
        <div className="flex-1 bg-[var(--bg-surface)] aspect-[3/4] sm:aspect-square lg:aspect-auto lg:h-[620px] border border-[var(--border-card)] shadow-[var(--card-shadow)] overflow-hidden rounded-[2px] relative">
          <img 
            src={activeImage || '/hero-clean.png'} 
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/hero-clean.png'; }}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
          />
          {purityBadge && (
            <span className="absolute top-3 left-3 bg-[var(--bg-main)]/90 text-[var(--accent-gold)] font-sans text-[8.5px] sm:text-[9.5px] px-2.5 py-1 font-semibold tracking-[0.2em] backdrop-blur-xs border border-[var(--border-card)] rounded-[2px] uppercase">
              {purityBadge}
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col">
        {product.badges && product.badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2.5">
            {product.badges.map(badge => (
              <span key={badge} className="bg-[var(--bg-surface)] text-[var(--accent-gold)] border border-[var(--border-card)] font-sans text-[9px] px-2.5 py-0.5 font-semibold tracking-wider uppercase rounded-[2px]">
                {badge}
              </span>
            ))}
          </div>
        )}
        
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[var(--text-primary)] font-normal mb-2 leading-tight">
          {product.name}
        </h1>
        
        <div className="mb-5 pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex flex-wrap items-baseline gap-2.5">
            <span className="font-serif text-2xl sm:text-3xl text-[var(--accent-gold)] font-medium tracking-wide">
              {product.display_price}
            </span>
            <span className="text-[10px] text-[var(--accent-gold)] font-sans font-semibold tracking-wider bg-[var(--bg-surface)] border border-[var(--border-card)] px-2 py-0.5 rounded-[2px] uppercase">
              Inclusive of all taxes
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] mt-1 font-sans font-light">
            Net retail price inclusive of 3% GST &amp; BIS Hallmarking • Fully insured delivery by BVC Logistics
          </p>

          {/* F4: Hide PDP Price Breakup behind feature flag until dynamic product pricing exists */}
          {Boolean(siteConfig.features.showPdpPriceBreakup && (estimatedMetalValue + estimatedMakingCharge + hallmarkFee + gstRupees === totalRupees)) && (
            <>
              <button
                type="button"
                onClick={() => setShowPriceBreakup(!showPriceBreakup)}
                aria-expanded={showPriceBreakup}
                aria-controls="pdp-price-breakup-details"
                className="mt-3 text-xs text-[var(--accent-gold)] hover:underline font-semibold flex items-center gap-1.5 cursor-pointer transition-colors focus-visible:ring-1 focus-visible:ring-[var(--accent-gold)] focus:outline-none"
              >
                <span className="material-symbols-outlined text-sm" aria-hidden="true">
                  {showPriceBreakup ? 'expand_less' : 'price_change'}
                </span>
                <span>{showPriceBreakup ? 'Hide Price Breakup' : 'View Transparent Price Breakup (Metal + Making + GST)'}</span>
              </button>

              {showPriceBreakup && (
                <div id="pdp-price-breakup-details" role="region" aria-label="Transparent price calculation breakup" className="mt-3 p-3.5 bg-[var(--bg-surface)] border border-[var(--border-card)] rounded-[2px] text-xs space-y-2">
                  <div className="flex justify-between items-center text-[var(--text-secondary)]">
                    <span>Precious Metal ({netWeight.toFixed(2)}g {product.purity || '22K'})</span>
                    <span className="font-mono font-semibold text-[var(--text-primary)]">₹{estimatedMetalValue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-[var(--text-secondary)]">
                    <span>Artisanal Making Charges</span>
                    <span className="font-mono font-semibold text-[var(--text-primary)]">+₹{estimatedMakingCharge.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-[var(--text-secondary)]">
                    <span>BIS Hallmarking Fee</span>
                    <span className="font-mono font-semibold text-[var(--text-primary)]">+₹{hallmarkFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-[var(--text-secondary)] pt-1 border-t border-[var(--border-subtle)]">
                    <span>Taxable Value (Pre-tax)</span>
                    <span className="font-mono text-[var(--text-primary)]">₹{preTaxSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-[var(--text-secondary)]">
                    <span>GST (3% on HSN 7113)</span>
                    <span className="font-mono font-semibold text-[var(--accent-gold)]">+₹{gstRupees.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1.5 border-t border-[var(--border-subtle)] font-bold text-sm text-[var(--accent-gold)]">
                    <span>Final Payable Amount</span>
                    <span className="font-mono">{product.display_price}</span>
                  </div>
                  <p className="text-[10px] text-[var(--text-secondary)]/70 italic pt-1">
                    * Transparent pricing guarantee: No hidden surcharges. Subject to daily live Jammu bullion rates.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="mb-5">
          <h3 className="font-sans text-xs text-[var(--accent-gold)] mb-2 tracking-[0.2em] font-semibold uppercase">THE CRAFTSMANSHIP STORY</h3>
          <p className="font-sans text-xs sm:text-sm text-[var(--text-primary)]/90 whitespace-pre-line leading-relaxed font-light">
            {product.description}
          </p>
          {product.craftsmanship_story && (
            <p className="font-serif text-xs sm:text-sm text-[var(--accent-gold)] whitespace-pre-line mt-2.5 italic border-l-2 border-[var(--accent-gold)]/40 pl-3">
              {product.craftsmanship_story}
            </p>
          )}
        </div>

        {/* Metal Finish */}
        <div className="mb-5">
          <h3 className="font-sans text-xs text-[var(--text-secondary)] mb-2.5 tracking-wider font-semibold uppercase">
            METAL FINISH: <span className="text-[var(--accent-gold)]">{selectedFinish.toUpperCase()}</span>
          </h3>
          <div className="flex gap-3" role="radiogroup" aria-label="Select metal finish">
            {(product.metal_finishes && product.metal_finishes.length > 0 ? product.metal_finishes : ['Gold']).map(finish => (
              <button
                key={finish}
                type="button"
                onClick={() => setSelectedFinish(finish)}
                aria-label={`Select ${finish} metal finish`}
                aria-pressed={selectedFinish === finish}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 focus-visible:ring-1 focus-visible:ring-[var(--accent-gold)] focus:outline-none cursor-pointer ${
                  selectedFinish === finish ? 'border-[var(--accent-gold)] shadow-[0_0_10px_rgba(216,183,90,0.4)]' : 'border-transparent'
                } relative group transition-all`}
                title={finish}
              >
                <span className={`absolute inset-0.5 rounded-full ${
                  finish === 'Gold' ? 'bg-[#FFD700]' : 
                  finish === 'Silver' ? 'bg-[#C0C0C0]' : 
                  'bg-[#B76E79]'
                }`}></span>
              </button>
            ))}
          </div>
        </div>

        {/* Ring / Bangle Size Selector */}
        {(isRing || isBangle) && (
          <div className="mb-5 p-3.5 bg-[var(--bg-card)] border border-[var(--border-card)] shadow-[var(--card-shadow)] rounded-[2px]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-sans text-xs text-[var(--text-secondary)] tracking-wider font-semibold flex items-center gap-1.5 uppercase">
                <span className="material-symbols-outlined text-sm text-[var(--accent-gold)]">straighten</span>
                SELECT {isRing ? 'RING SIZE' : 'BANGLE SIZE'}:
                <span className="text-[var(--accent-gold)] font-bold ml-1">{selectedSize}</span>
              </h3>
              
              <button
                type="button"
                onClick={() => setShowSizeGuide(!showSizeGuide)}
                className="text-[11px] text-[var(--accent-gold)] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">help</span>
                <span>Size Guide</span>
              </button>
            </div>

            {/* Size Options Pills */}
            <div className="flex flex-wrap gap-1.5 mt-2" role="radiogroup" aria-label={`Select ${isRing ? 'ring' : 'bangle'} size`}>
              {(isRing ? ringSizes : bangleSizes).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  aria-pressed={selectedSize === sz}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-[2px] border transition-all cursor-pointer ${
                    selectedSize === sz
                      ? 'border-[var(--accent-gold)] bg-[var(--accent-gold)] text-white shadow-xs'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-gold)]/60 text-[var(--text-secondary)]'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            {/* Size Guide Info Dropdown */}
            {showSizeGuide && (
              <div className="mt-3 p-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[2px] text-xs space-y-1.5 text-[var(--text-secondary)]">
                <p className="font-bold text-[var(--accent-gold)] flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">info</span>
                  {isRing ? 'Indian Standard Ring Size Guide:' : 'Standard Indian Bangle Sizing:'}
                </p>
                {isRing ? (
                  <p className="text-[11px] leading-relaxed font-light">
                    Standard Indian women&apos;s ring sizes usually range from <strong>10 to 14</strong>. Standard men&apos;s ring sizes range from <strong>16 to 22</strong>. Need custom resizing? Our Jammu karigars offer complimentary sizing adjustments after order confirmation on WhatsApp.
                  </p>
                ) : (
                  <p className="text-[11px] leading-relaxed font-light">
                    Bangle sizes represent the inner diameter in inches: <strong>2.2</strong> (2&quot; 2/16 - Small), <strong>2.4</strong> (2&quot; 4/16 - Medium), <strong>2.6</strong> (2&quot; 6/16 - Standard/Most Popular), <strong>2.8</strong> (2&quot; 8/16 - Large).
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Specifications & Compliance Table */}
        <div className="mb-5 border border-[var(--border-card)] bg-[var(--bg-card)] shadow-[var(--card-shadow)] p-4 rounded-[2px]">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 mb-3">
            <h3 className="font-sans text-[10.5px] text-[var(--accent-gold)] tracking-widest font-bold flex items-center gap-1.5 uppercase">
              <span className="material-symbols-outlined text-sm">verified</span>
              PRODUCT SPECIFICATIONS &amp; LEGAL METROLOGY
            </h3>
            <span className="text-[9px] font-sans text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40 px-2 py-0.5 rounded-[2px] border border-emerald-300 dark:border-emerald-800/40 font-semibold tracking-wider uppercase">
              {product.stock_status === 'in_stock' ? 'READY TO DISPATCH' : 'MADE TO ORDER'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-sans">
            <div>
              <span className="text-[10px] text-[var(--text-secondary)]/80 block uppercase tracking-wider">Material &amp; Composition</span>
              <span className="font-medium text-[var(--text-primary)] text-[11px]">{product.material || 'Solid Gold'}</span>
            </div>

            <div>
              <span className="text-[10px] text-[var(--text-secondary)]/80 block uppercase tracking-wider">Purity / Karatage</span>
              <span className="font-medium text-[var(--text-primary)] text-[11px]">{product.purity || '22K (916)'}</span>
            </div>

            <div>
              <span className="text-[10px] text-[var(--text-secondary)]/80 block uppercase tracking-wider">Hallmarking / HUID</span>
              <span className="font-medium text-[var(--text-primary)] text-[11px]">{product.bis_hallmark || 'BIS Assayed & Hallmarked'}</span>
            </div>

            <div>
              <span className="text-[10px] text-[var(--text-secondary)]/80 block uppercase tracking-wider">Net Precious Weight</span>
              <span className="font-medium text-[var(--text-primary)] text-[11px]">{product.weight_grams} grams</span>
            </div>

            <div>
              <span className="text-[10px] text-[var(--text-secondary)]/80 block uppercase tracking-wider">Gross Weight</span>
              <span className="font-medium text-[var(--text-primary)] text-[11px]">{product.gross_weight_grams || product.weight_grams} grams</span>
            </div>

            {product.dimensions && (
              <div>
                <span className="text-[10px] text-[var(--text-secondary)]/80 block uppercase tracking-wider">Dimensions (L × B × H)</span>
                <span className="font-medium text-[var(--text-primary)] text-[11px]">
                  {product.dimensions.length_cm} × {product.dimensions.breadth_cm} × {product.dimensions.height_cm} cm
                </span>
              </div>
            )}

            <div>
              <span className="text-[10px] text-[var(--text-secondary)]/80 block uppercase tracking-wider">HSN Code</span>
              <span className="font-medium text-[var(--text-primary)] text-[11px]">{product.hsn_code} (Precious Jewelry)</span>
            </div>

            <div>
              <span className="text-[10px] text-[var(--text-secondary)]/80 block uppercase tracking-wider">Country of Origin</span>
              <span className="font-medium text-[var(--text-primary)] text-[11px]">{product.country_of_origin}</span>
            </div>

            <div className="col-span-2 pt-1 border-t border-[var(--border-subtle)]">
              <span className="text-[10px] text-[var(--text-secondary)]/80 block uppercase tracking-wider">Seller &amp; Manufacturing Details</span>
              <span className="font-light text-[var(--text-primary)] text-[11px]">{product.seller_details}</span>
            </div>
          </div>
        </div>

        {/* Quantity & Action Buttons */}
        <div className="mt-auto pt-3 border-t border-[var(--border-subtle)] flex flex-col gap-2.5">
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <div className="flex items-center border border-[var(--border-card)] px-3.5 py-2.5 min-w-[120px] justify-between bg-[var(--bg-surface)] rounded-[2px]" role="group" aria-label="Item quantity selector">
              <span className="font-sans text-[10px] text-[var(--text-secondary)] mr-2 uppercase tracking-wider" id="pdp-qty-label">QTY:</span>
              <button 
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Decrease quantity"
                className="text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors text-lg font-bold px-2 cursor-pointer"
              >-</button>
              <span className="font-sans text-sm mx-2 font-bold text-[var(--text-primary)]" aria-labelledby="pdp-qty-label" aria-live="polite" aria-atomic="true">{quantity}</span>
              <button 
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                aria-label="Increase quantity"
                className="text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors text-lg font-bold px-2 cursor-pointer"
              >+</button>
            </div>
            
            <button 
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding || product.stock_status === 'out_of_stock'}
              aria-label={isAdding ? 'Item added to shopping bag' : `Add ${product.name} to shopping bag`}
              className="flex-1 btn-gold-secondary bg-[var(--bg-surface)] text-[var(--accent-gold)] border-[var(--border-card)] text-xs py-3.5 tracking-wider cursor-pointer"
            >
              {isAdding ? '✓ ADDED TO BAG' : product.stock_status === 'out_of_stock' ? 'OUT OF STOCK' : '+ ADD TO BAG'}
            </button>
          </div>
          
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Inquire or purchase this piece directly on WhatsApp with our Jammu showroom concierge"
            className="btn-gold-primary w-full py-3.5 text-xs font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-base" aria-hidden="true">chat_bubble</span>
            {product.stock_status === 'out_of_stock' ? 'OUT OF STOCK' : 'BUY NOW ON WHATSAPP'}
          </a>
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-4 flex items-center justify-around border border-[var(--border-subtle)] p-2.5 bg-[var(--bg-surface)] rounded-[2px]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[var(--accent-gold)] text-base" aria-hidden="true">verified</span>
            <span className="font-sans text-[8.5px] sm:text-[9.5px] text-[var(--text-secondary)] font-medium uppercase tracking-wider">{bottomBadgeText}</span>
          </div>
          <div className="w-[1px] h-5 bg-[var(--border-subtle)]" aria-hidden="true"></div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[var(--accent-gold)] text-base" aria-hidden="true">local_shipping</span>
            <span className="font-sans text-[8.5px] sm:text-[9.5px] text-[var(--text-secondary)] font-medium uppercase tracking-wider">BVC ARMORED TRANSIT</span>
          </div>
          <div className="w-[1px] h-5 bg-[var(--border-subtle)]" aria-hidden="true"></div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[var(--accent-gold)] text-base" aria-hidden="true">assignment_return</span>
            <span className="font-sans text-[8.5px] sm:text-[9.5px] text-[var(--text-secondary)] font-medium uppercase tracking-wider">7-DAY RETURNS</span>
          </div>
        </div>

      </div>
    </div>
  );
}
