'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { useCart } from '@/context/CartContext';
import { siteConfig } from '@/config/siteConfig';
import { getCartWhatsAppUrl } from '@/lib/whatsapp';

export default function CartPage() {
  const { state, dispatch, cartTotal } = useCart();

  const formatPrice = (paise: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(paise / 100);
  };

  const tax = Math.round(cartTotal * siteConfig.tax.gstRate);
  const isFreeShipping = cartTotal >= siteConfig.shipping.freeThreshold;
  const shipping = isFreeShipping ? 0 : siteConfig.shipping.flatRate;
  const finalTotal = cartTotal + tax + shipping;

  const freeShippingDifference = Math.max(0, siteConfig.shipping.freeThreshold - cartTotal);
  const freeShippingProgress = Math.min(100, Math.round((cartTotal / siteConfig.shipping.freeThreshold) * 100));

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 sm:pt-28 pb-20 lg:pb-28 bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-6xl">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
            <span className="font-sans text-[9.5px] text-[var(--accent-gold)] tracking-[0.32em] uppercase block mb-1.5 font-medium">
              YOUR SELECTIONS &bull; ATELIER BAG
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] font-normal tracking-tight">
              Shopping Bag
            </h1>
          </div>

          {state.items.length === 0 ? (
            <div className="text-center py-16 sm:py-24 bg-[var(--bg-card)] border border-[var(--border-subtle)] p-8 max-w-lg mx-auto rounded-[1px] shadow-xs">
              <span className="material-symbols-outlined text-4xl text-[var(--accent-gold)] mb-3 block font-light">shopping_bag</span>
              <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-2 font-normal">Your shopping bag is empty</h2>
              <p className="font-sans text-xs text-[var(--text-secondary)] mb-6 font-light leading-relaxed">
                Explore our signature Dogra heritage heirlooms, bridal couture, and certified natural diamond creations.
              </p>
              <Link href="/collections" className="btn-gold-primary">
                DISCOVER COLLECTIONS
              </Link>
            </div>
          ) : (
            <>
              {/* Armored Protection & Free Shipping Banner */}
              <div className="mb-8 p-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[1px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-sans">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[var(--accent-gold)] text-xl shrink-0">shield</span>
                  <div>
                    <span className="font-medium text-[var(--text-primary)] block">INTRADAY BULLION RATE PROTECTION GUARANTEE</span>
                    <span className="text-[11px] text-[var(--text-secondary)] font-light">
                      Your order price is strictly locked against bullion market spikes. 100% insured transit via BVC Logistics.
                    </span>
                  </div>
                </div>

                <div className="w-full sm:w-64 shrink-0">
                  <div className="flex justify-between text-[10.5px] text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                    <span>ARMORED DELIVERY:</span>
                    <span className="font-medium text-[var(--text-primary)]">
                      {isFreeShipping ? 'COMPLIMENTARY' : `ADD ${formatPrice(freeShippingDifference)} FOR FREE`}
                    </span>
                  </div>
                  <div className="w-full bg-[var(--border-subtle)] h-1 rounded-full overflow-hidden">
                    <div
                      className="bg-[var(--accent-gold)] h-full transition-all duration-500"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Grid: Cart Items (Left 7 Cols) + Summary (Right 5 Cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                {/* Items List */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  {state.items.map((item, idx) => (
                    <div
                      key={`${item.product_id}-${item.metal_finish}-${item.selected_size}-${idx}`}
                      className="flex gap-4 p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[1px] transition-colors"
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-[4/5] w-20 sm:w-24 shrink-0 overflow-hidden bg-[var(--bg-surface)]">
                        <img
                          src={item.image || '/hero-clean.png'}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/hero-clean.png';
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between py-0.5">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-serif text-base sm:text-lg text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors line-clamp-1 font-normal">
                              <Link href={`/collections/${item.slug || item.product_id}`}>{item.name}</Link>
                            </h3>
                            <button
                              type="button"
                              onClick={() =>
                                dispatch({
                                  type: 'REMOVE_ITEM',
                                  payload: {
                                    product_id: item.product_id,
                                    metal_finish: item.metal_finish,
                                    selected_size: item.selected_size,
                                  } as any,
                                })
                              }
                              className="text-[var(--text-tertiary)] hover:text-red-500 transition-colors p-1"
                              title="Remove piece from bag"
                              aria-label={`Remove ${item.name}`}
                            >
                              <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                          </div>

                          <div className="text-[10px] font-sans text-[var(--text-tertiary)] mt-1 flex flex-wrap items-center gap-2 uppercase tracking-wider">
                            <span>FINISH: {item.metal_finish}</span>
                            {item.selected_size && (
                              <span>&bull; SIZE: {item.selected_size}</span>
                            )}
                            {item.weight_grams && (
                              <span>&bull; {item.weight_grams}G</span>
                            )}
                          </div>
                        </div>

                        {/* Price & Quantity Bar */}
                        <div className="flex items-baseline justify-between mt-3 pt-2 border-t border-[var(--border-subtle)]">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-sans text-[var(--text-tertiary)] uppercase tracking-wider">QTY:</span>
                            <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">{item.quantity}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-sans text-sm sm:text-base font-medium text-[var(--text-primary)]">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-6 rounded-[1px] flex flex-col gap-4">
                  <h3 className="font-sans text-xs text-[var(--text-primary)] uppercase tracking-[0.2em] font-semibold border-b border-[var(--border-subtle)] pb-3">
                    ORDER SUMMARY
                  </h3>

                  <div className="space-y-2.5 text-xs font-sans">
                    <div className="flex justify-between text-[var(--text-secondary)]">
                      <span>Subtotal (Precious Metals):</span>
                      <span className="font-medium text-[var(--text-primary)]">{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between text-[var(--text-secondary)]">
                      <span>Precious Metals GST (3%):</span>
                      <span className="font-medium text-[var(--text-primary)]">{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between text-[var(--text-secondary)]">
                      <span>Armored Transit Insurance (BVC):</span>
                      <span className="font-medium text-[var(--text-primary)]">
                        {isFreeShipping ? 'Complimentary' : formatPrice(shipping)}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-[var(--border-subtle)] flex justify-between items-baseline">
                      <span className="font-serif text-base text-[var(--text-primary)]">Estimated Total:</span>
                      <span className="font-sans text-xl font-medium text-[var(--text-primary)]">
                        {formatPrice(finalTotal)}
                      </span>
                    </div>
                    <span className="block text-[9.5px] text-[var(--text-tertiary)] text-right uppercase tracking-wider">
                      ALL STATUTORY TAXES INCLUDED
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col gap-2.5">
                    <Link
                      href="/checkout"
                      className="btn-gold-primary w-full py-4 text-xs tracking-[0.2em] text-center"
                    >
                      PROCEED TO SECURE CHECKOUT
                    </Link>

                    <a
                      href={getCartWhatsAppUrl(state.items, formatPrice(finalTotal))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold-secondary w-full py-3 text-[11px] tracking-wider text-center flex items-center justify-center gap-2 hover:text-emerald-600 hover:border-emerald-600"
                    >
                      <span className="material-symbols-outlined text-sm text-emerald-600">chat</span>
                      CHECKOUT VIA SHOWROOM WHATSAPP
                    </a>
                  </div>

                  {/* Security reassurance */}
                  <div className="pt-3 text-[10px] font-sans text-[var(--text-tertiary)] space-y-1 text-center">
                    <p>🔒 256-Bit SSL Encrypted Razorpay Gateway</p>
                    <p>📦 Armored Security Satchel with Verification OTP</p>
                  </div>
                </div>

              </div>
            </>
          )}

        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
