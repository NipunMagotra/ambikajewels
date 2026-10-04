'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import MandalaDivider from '@/components/ui/MandalaDivider';
import { useCart } from '@/context/CartContext';
import { siteConfig } from '@/config/siteConfig';
import { getCartWhatsAppUrl } from '@/utils/whatsapp';

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

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 sm:pt-24 pb-20 lg:pb-16 bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
        <div className="container mx-auto px-3 sm:px-margin-mobile lg:px-margin-desktop max-w-6xl">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6">
            <span className="font-sans text-[10px] sm:text-xs text-[var(--accent-gold)] tracking-[0.3em] uppercase block mb-1 font-semibold">
              YOUR SELECTION
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] font-normal">
              Shopping Cart
            </h1>
          </div>

          <MandalaDivider />

          {state.items.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-[var(--bg-card)] border border-[var(--border-card)] shadow-[var(--card-shadow)] p-8 max-w-lg mx-auto rounded-[2px]">
              <span className="material-symbols-outlined text-4xl text-[var(--accent-gold)] mb-3 block">shopping_bag</span>
              <p className="font-serif text-lg text-[var(--text-primary)] mb-2 font-normal">Your cart is currently empty.</p>
              <p className="font-sans text-xs text-[var(--text-secondary)] mb-6 font-light">Explore our curated Dogra heritage and bridal couture collections.</p>
              <Link href="/collections" className="btn-gold-primary">
                BROWSE COLLECTIONS
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 mt-4 sm:mt-6">
              
              {/* Cart Items List */}
              <div className="col-span-1 lg:col-span-7 flex flex-col gap-3">
                {state.items.map((item, idx) => (
                  <div key={`${item.product_id}-${item.metal_finish}-${idx}`} className="flex gap-3 sm:gap-4 p-3.5 sm:p-4 border border-[var(--border-card)] bg-[var(--bg-card)] shadow-[var(--card-shadow)] rounded-[2px]">
                    <div className="w-20 h-24 sm:w-24 sm:h-30 shrink-0 bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden rounded-[2px]">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/hero-clean.png'; }}
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    
                    <div className="flex flex-col flex-1 justify-between py-0.5">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="font-serif text-sm sm:text-base text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors line-clamp-1 font-normal">
                            <Link href={`/collections/${item.slug || item.product_id}`}>{item.name}</Link>
                          </h3>
                          <div className="font-sans text-[9.5px] text-[var(--text-secondary)] mt-1 flex flex-wrap items-center gap-2 uppercase tracking-wider">
                            <span>FINISH: {item.metal_finish}</span>
                            {item.selected_size && (
                              <span className="text-[var(--accent-gold)] font-semibold bg-[var(--bg-surface)] border border-[var(--border-subtle)] px-1.5 py-0.2 rounded-[2px]">
                                SIZE: {item.selected_size}
                              </span>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { product_id: item.product_id, metal_finish: item.metal_finish, selected_size: item.selected_size } as any })}
                          className="text-[var(--text-secondary)] hover:text-red-500 transition-colors p-1 cursor-pointer"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap justify-between items-center gap-2 mt-2 pt-2 border-t border-[var(--border-subtle)]">
                        <div className="flex items-center border border-[var(--border-card)] px-2 py-0.5 bg-[var(--bg-surface)] rounded-[2px]">
                          <button 
                            onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { product_id: item.product_id, metal_finish: item.metal_finish, selected_size: item.selected_size, quantity: Math.max(1, item.quantity - 1) } as any })}
                            className="text-[var(--text-primary)] hover:text-[var(--accent-gold)] px-1.5 text-sm font-bold cursor-pointer"
                          >-</button>
                          <span className="font-sans text-xs mx-2 font-bold text-[var(--text-primary)]">{item.quantity}</span>
                          <button 
                            onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { product_id: item.product_id, metal_finish: item.metal_finish, selected_size: item.selected_size, quantity: item.quantity + 1 } as any })}
                            className="text-[var(--text-primary)] hover:text-[var(--accent-gold)] px-1.5 text-sm font-bold cursor-pointer"
                          >+</button>
                        </div>
                        <p className="font-serif text-sm sm:text-base text-[var(--accent-gold)] font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary (Matching Reference cart.png) */}
              <div className="col-span-1 lg:col-span-5">
                <div className="border border-[var(--border-card)] bg-[var(--bg-card)] shadow-[var(--card-shadow)] p-5 sm:p-6 sticky top-24 rounded-[2px]">
                  <h3 className="font-sans text-xs text-[var(--accent-gold)] mb-4 pb-2.5 border-b border-[var(--border-subtle)] text-center tracking-[0.25em] uppercase font-semibold">
                    ORDER SUMMARY
                  </h3>
                  
                  <div className="flex flex-col gap-2.5 mb-5 font-sans text-xs text-[var(--text-secondary)]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium text-[var(--text-primary)]">{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Shipping</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold tracking-wider uppercase text-[10.5px]">
                        COMPLIMENTARY
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (GST 3%)</span>
                      <span className="font-medium text-[var(--text-primary)]">{formatPrice(tax)}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-dashed border-[var(--border-subtle)] pt-3.5 mb-5">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-sans text-[10px] text-[var(--text-secondary)] tracking-wider uppercase">TOTAL AMOUNT</span>
                      <span className="font-sans text-[9px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/40 px-2 py-0.5 rounded-[2px] font-semibold tracking-wider uppercase">
                        INSURED DELIVERY
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="font-serif text-sm text-[var(--text-primary)]">Final Payable</span>
                      <span className="font-serif text-xl sm:text-2xl text-[var(--accent-gold)] font-medium">{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2.5 mb-4">
                    <Link href="/checkout" className="btn-gold-primary w-full text-center">
                      PROCEED TO CHECKOUT
                    </Link>
                    <a 
                      href={getCartWhatsAppUrl(state.items, formatPrice(finalTotal))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold-secondary w-full text-center bg-[var(--bg-surface)] text-[var(--accent-gold)] border-[var(--border-card)]"
                    >
                      <span className="material-symbols-outlined text-sm">chat_bubble</span>
                      <span>ORDER CART VIA WHATSAPP</span>
                    </a>
                  </div>

                  {/* Trust Cards (From reference screenshot) */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[var(--border-subtle)]">
                    <div className="flex flex-col items-center justify-center p-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[2px] text-center">
                      <span className="material-symbols-outlined text-[var(--accent-gold)] text-lg mb-1">verified</span>
                      <span className="font-sans text-[8.5px] text-[var(--text-secondary)] font-semibold tracking-wider uppercase">BIS HALLMARKED</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[2px] text-center">
                      <span className="material-symbols-outlined text-[var(--accent-gold)] text-lg mb-1">lock</span>
                      <span className="font-sans text-[8.5px] text-[var(--text-secondary)] font-semibold tracking-wider uppercase">SECURE GATEWAY</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
