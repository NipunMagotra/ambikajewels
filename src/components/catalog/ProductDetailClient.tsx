'use client';

import { useState } from 'react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { getProductWhatsAppUrl } from '@/lib/whatsapp';
import { siteConfig } from '@/config/siteConfig';

export default function ProductDetailClient({ product }: { product: Product }) {
  const { dispatch } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const galleryImages = (product.images && product.images.length > 0)
    ? product.images
    : ['/hero-clean.png'];

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedFinish, setSelectedFinish] = useState(product.metal_finishes?.[0] || 'Gold');
  const [quantity, setQuantity] = useState(1);
  const [showPriceBreakup, setShowPriceBreakup] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

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

  // Accordion tabs state
  const [openTab, setOpenTab] = useState<'craft' | 'specs' | 'shipping' | 'care' | null>('specs');

  // Transparent Indian jewellery pricing calculation
  const totalRupees = Math.round((product.price || 0) / 100);
  const preTaxSubtotal = Math.round(totalRupees / 1.03);
  const gstRupees = totalRupees - preTaxSubtotal;
  const hallmarkFee = 45;
  const netWeight = product.weight_grams || 10;
  const estimatedMetalValue = Math.min(preTaxSubtotal - hallmarkFee, Math.round(preTaxSubtotal * 0.88));
  const estimatedMakingCharge = Math.max(0, preTaxSubtotal - estimatedMetalValue - hallmarkFee);

  const whatsappUrl = getProductWhatsAppUrl(product, selectedFinish, quantity);
  const isSaved = isInWishlist(product.id);

  const handleAddToCart = () => {
    setIsAdding(true);
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: galleryImages[0],
        metal_finish: selectedFinish,
        selected_size: selectedSize || undefined,
        slug: product.slug,
        weight_grams: product.weight_grams,
        dimensions: product.dimensions
      }
    });
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1200);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const activeImage = galleryImages[activeImageIdx] || galleryImages[0];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Left Column: Editorial Multi-Angle Photography Gallery (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Main Large Visual Stage */}
          <div 
            className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--bg-surface)] cursor-crosshair group select-none"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={activeImage}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-300 ease-out ${
                isZoomed ? 'scale-175' : 'scale-100'
              }`}
              style={
                isZoomed
                  ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` }
                  : undefined
              }
            />

            {/* Macro Stamp */}
            <div className="absolute top-4 left-4 bg-[var(--bg-card)]/90 backdrop-blur-xs text-[var(--accent-gold)] font-sans text-[8.5px] px-2.5 py-1 tracking-[0.2em] uppercase font-medium border border-[var(--border-subtle)] pointer-events-none">
              {product.purity || '22K BIS'} &bull; {product.weight_grams}G
            </div>

            {/* Hover Zoom Hint */}
            <div className="absolute bottom-4 right-4 bg-black/60 text-white/80 text-[9px] font-sans px-2.5 py-1 tracking-wider uppercase pointer-events-none backdrop-blur-xs">
              HOVER TO MAGNIFY
            </div>
          </div>

          {/* Thumbnail Track */}
          {galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  aria-label={`View image ${i + 1} of ${product.name}`}
                  aria-pressed={activeImage === img}
                  className={`relative aspect-[4/5] w-20 sm:w-24 shrink-0 overflow-hidden bg-[var(--bg-surface)] transition-all cursor-pointer border ${
                    activeImageIdx === i
                      ? 'border-[var(--text-primary)] opacity-100'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Craftsmanship Narrative & Heritage Origin */}
          {product.craftsmanship_story && (
            <div className="mt-6 p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <span className="text-[9.5px] font-sans tracking-[0.26em] uppercase text-[var(--accent-gold)] font-medium block mb-2">
                KARIGAR BENCHCRAFT
              </span>
              <p className="font-serif text-lg text-[var(--text-primary)] font-normal leading-relaxed mb-2">
                &ldquo;{product.craftsmanship_story}&rdquo;
              </p>
              <span className="text-[10px] font-sans text-[var(--text-tertiary)] uppercase tracking-wider">
                ORIGIN: JAMMU ATELIER &bull; PRESERVED DOGRA MOTIFS
              </span>
            </div>
          )}

        </div>

        {/* Right Column: Sticky Purchase Atelier Column (5 Cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-6">
          
          {/* Header & Meta */}
          <div>
            <div className="text-[10px] font-sans tracking-[0.28em] uppercase text-[var(--text-tertiary)] mb-2 font-medium">
              {product.category}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)] font-normal tracking-tight mb-3 leading-[1.14]">
              {product.name}
            </h1>

            {/* Price Presentation */}
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-sans text-2xl font-medium text-[var(--text-primary)]">
                {product.display_price || `₹${totalRupees.toLocaleString('en-IN')}`}
              </span>
              <span className="text-[10.5px] font-sans text-[var(--text-tertiary)] uppercase tracking-wider">
                INCLUSIVE OF 3% GST
              </span>
            </div>

            {/* Price Breakup Toggle */}
            <button
              onClick={() => setShowPriceBreakup(!showPriceBreakup)}
              aria-expanded={showPriceBreakup}
              aria-controls="pdp-price-breakup-details"
              className="text-[10.5px] font-sans tracking-wider uppercase text-[var(--accent-gold)] hover:underline underline-offset-4 cursor-pointer mb-4 inline-flex items-center gap-1"
            >
              <span>{showPriceBreakup ? 'Hide transparent price breakup' : 'View transparent price breakup'}</span>
              <span className="material-symbols-outlined text-xs">
                {showPriceBreakup ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {/* Transparent Indian Jewellery Price Breakdown */}
            {showPriceBreakup && (
              <div 
                id="pdp-price-breakup-details"
                role="region"
                aria-label="Transparent Price Breakdown"
                className="p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-sans space-y-2 mb-4 animate-in fade-in duration-200"
              >
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Precious Metal Base ({netWeight}g):</span>
                  <span>₹{estimatedMetalValue.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Making Charges &amp; Artistry:</span>
                  <span>₹{estimatedMakingCharge.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>Government BIS Hallmarking Fee:</span>
                  <span>₹{hallmarkFee}</span>
                </div>
                <div className="flex justify-between text-[var(--text-secondary)]">
                  <span>GST (3% on precious metals):</span>
                  <span>₹{gstRupees.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-[var(--border-subtle)] flex justify-between font-semibold text-[var(--text-primary)]">
                  <span>Total Invoiced Price:</span>
                  <span>₹{totalRupees.toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}

            <p className="font-sans text-xs text-[var(--text-secondary)] font-light leading-relaxed mb-6">
              {product.description}
            </p>
          </div>

          {/* Metal Finish Option */}
          {product.metal_finishes && product.metal_finishes.length > 0 && (
            <div className="pt-4 border-t border-[var(--border-subtle)]">
              <span className="text-[10px] font-sans tracking-widest uppercase text-[var(--text-tertiary)] block mb-2 font-medium">
                PRECIOUS FINISH: {selectedFinish}
              </span>
              <div className="flex gap-2" role="radiogroup" aria-label="Select metal finish">
                {product.metal_finishes.map((finish) => (
                  <button
                    key={finish}
                    type="button"
                    onClick={() => setSelectedFinish(finish)}
                    aria-label={`Select ${finish} metal finish`}
                    aria-pressed={selectedFinish === finish}
                    className={`px-4 py-2 text-[10.5px] font-sans tracking-wider uppercase transition-all cursor-pointer rounded-[1px] ${
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

          {/* Ring / Bangle Sizing Selector */}
          {(isRing || isBangle) && (
            <div className="pt-4 border-t border-[var(--border-subtle)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-sans tracking-widest uppercase text-[var(--text-tertiary)] font-medium">
                  SELECT SIZE ({isRing ? 'INDIAN RING SIZE' : 'BANGLE INNER DIAMETER'}):
                </span>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="text-[10px] font-sans tracking-wider text-[var(--accent-gold)] underline underline-offset-4 cursor-pointer"
                >
                  Size Guide
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5" role="radiogroup">
                {(isRing ? ringSizes : bangleSizes).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-1.5 text-xs font-sans rounded-[1px] border transition-all cursor-pointer ${
                      selectedSize === sz
                        ? 'border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-main)] font-semibold'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              {/* Sizing Help Modal/Box */}
              {showSizeGuide && (
                <div className="mt-3 p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] space-y-1 font-light leading-relaxed">
                  <p className="font-medium text-[var(--text-primary)]">Indian Sizing Standards:</p>
                  {isRing ? (
                    <p>Standard women&apos;s ring sizes range from 10 to 14. Men&apos;s sizes range from 16 to 22. Need bespoke sizing? Our Jammu karigars offer complimentary sizing adjustments upon WhatsApp consultation.</p>
                  ) : (
                    <p>Bangle sizes denote inner diameter in inches: 2.2 (Small), 2.4 (Medium), 2.6 (Standard / Most Popular), 2.8 (Large).</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Quantity & Primary Action Buttons */}
          <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col gap-3">
            <div className="flex items-center gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2.5 rounded-[1px] min-w-[110px] justify-between" role="group" aria-label="Item quantity selector">
                <span className="text-[9.5px] font-sans text-[var(--text-tertiary)] uppercase tracking-wider" id="pdp-qty-label">QTY</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                  className="px-2 text-base text-[var(--text-primary)] hover:text-[var(--accent-gold)] cursor-pointer"
                >
                  -
                </button>
                <span className="font-sans text-xs font-medium text-[var(--text-primary)]" aria-live="polite" aria-atomic="true">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                  className="px-2 text-base text-[var(--text-primary)] hover:text-[var(--accent-gold)] cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add to Bag CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding || product.stock_status === 'out_of_stock'}
                className="flex-1 btn-gold-primary py-3.5 text-xs tracking-[0.2em]"
              >
                {isAdding ? '✓ ADDED TO SHOPPING BAG' : product.stock_status === 'out_of_stock' ? 'OUT OF STOCK' : 'ADD TO BAG'}
              </button>
            </div>

            {/* Direct WhatsApp Concierge & Wishlist Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold-secondary py-3 text-[10.5px] tracking-wider flex items-center justify-center gap-2 hover:text-emerald-600 hover:border-emerald-600"
              >
                <span className="material-symbols-outlined text-sm text-emerald-600">chat</span>
                INQUIRE ON WHATSAPP
              </a>

              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className="btn-gold-secondary py-3 text-[10.5px] tracking-wider flex items-center justify-center gap-2"
              >
                <span className={`material-symbols-outlined text-sm ${isSaved ? 'text-[var(--accent-burgundy)] fill-1' : ''}`}>
                  favorite
                </span>
                {isSaved ? 'SAVED TO WISHLIST' : 'SAVE TO WISHLIST'}
              </button>
            </div>

            {/* Share action */}
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                  }
                }
              }}
              className="text-center text-[10px] font-sans tracking-widest uppercase text-[var(--text-tertiary)] hover:text-[var(--text-primary)] py-1.5 transition-colors cursor-pointer"
            >
              {isCopied ? '✓ LINK COPIED TO CLIPBOARD' : 'SHARE HEIRLOOM WITH FAMILY &rarr;'}
            </button>
          </div>

          {/* Editorial Detail Accordions */}
          <div className="border-t border-[var(--border-subtle)] pt-4 space-y-2">
            
            {/* Specs Accordion */}
            <div className="border-b border-[var(--border-subtle)] pb-2">
              <button
                onClick={() => setOpenTab(openTab === 'specs' ? null : 'specs')}
                className="w-full flex items-center justify-between py-2 text-left text-xs font-sans font-semibold uppercase tracking-wider text-[var(--text-primary)] cursor-pointer"
              >
                <span>SPECIFICATIONS &amp; HALLMARKING</span>
                <span className="material-symbols-outlined text-base">
                  {openTab === 'specs' ? 'remove' : 'add'}
                </span>
              </button>
              {openTab === 'specs' && (
                <div className="py-3 text-xs font-sans space-y-2 text-[var(--text-secondary)]">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[9.5px] text-[var(--text-tertiary)] uppercase block">PURITY</span>
                      <span className="font-medium text-[var(--text-primary)]">{product.purity || '22K Solid Gold'}</span>
                    </div>
                    <div>
                      <span className="text-[9.5px] text-[var(--text-tertiary)] uppercase block">NET WEIGHT</span>
                      <span className="font-medium text-[var(--text-primary)]">{product.weight_grams}g</span>
                    </div>
                    <div>
                      <span className="text-[9.5px] text-[var(--text-tertiary)] uppercase block">HALLMARK LICENSE</span>
                      <span className="font-medium text-[var(--text-primary)]">BIS HALLMARKED (BUREAU OF INDIAN STANDARDS) &bull; {siteConfig.bisHallmarkLicense}</span>
                    </div>
                    <div>
                      <span className="text-[9.5px] text-[var(--text-tertiary)] uppercase block">SECURE LOGISTICS</span>
                      <span className="font-medium text-[var(--text-primary)]">BVC ARMORED TRANSIT</span>
                    </div>
                    <div>
                      <span className="text-[9.5px] text-[var(--text-tertiary)] uppercase block">HSN CODE</span>
                      <span className="font-medium text-[var(--text-primary)]">{product.hsn_code || '7113'}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[var(--text-tertiary)] pt-2 border-t border-[var(--border-subtle)]">
                    In compliance with Bureau of Indian Standards (Hallmarking) Regulations.
                  </p>
                </div>
              )}
            </div>

            {/* Armored Delivery Accordion */}
            <div className="border-b border-[var(--border-subtle)] pb-2">
              <button
                onClick={() => setOpenTab(openTab === 'shipping' ? null : 'shipping')}
                className="w-full flex items-center justify-between py-2 text-left text-xs font-sans font-semibold uppercase tracking-wider text-[var(--text-primary)] cursor-pointer"
              >
                <span>ARMORED DELIVERY &amp; TRANSIT</span>
                <span className="material-symbols-outlined text-base">
                  {openTab === 'shipping' ? 'remove' : 'add'}
                </span>
              </button>
              {openTab === 'shipping' && (
                <div className="py-3 text-xs font-sans space-y-2 text-[var(--text-secondary)] font-light leading-relaxed">
                  <p>All fine jewellery is transported via <strong>BVC Logistics Armored Express</strong> in tamper-evident security satchels. 100% transit insurance covered by Ambika Jewels.</p>
                  <p>Dispatch within 24–48 hours from our Jammu showroom. Delivered in 2–5 business days pan-India with OTP verification on delivery.</p>
                </div>
              )}
            </div>

            {/* Care Guide Accordion */}
            <div className="border-b border-[var(--border-subtle)] pb-2">
              <button
                onClick={() => setOpenTab(openTab === 'care' ? null : 'care')}
                className="w-full flex items-center justify-between py-2 text-left text-xs font-sans font-semibold uppercase tracking-wider text-[var(--text-primary)] cursor-pointer"
              >
                <span>HEIRLOOM CARE &amp; STORAGE</span>
                <span className="material-symbols-outlined text-base">
                  {openTab === 'care' ? 'remove' : 'add'}
                </span>
              </button>
              {openTab === 'care' && (
                <div className="py-3 text-xs font-sans space-y-2 text-[var(--text-secondary)] font-light leading-relaxed">
                  <p>{product.care_instructions || 'Store individually in the provided velvet pouch away from moisture, perfumes, and sanitizers.'}</p>
                  <p>Complimentary annual ultrasonic cleaning and prong inspection available at our Jammu flagship showroom.</p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
