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
      <main className="min-h-screen pt-20 sm:pt-24 pb-24 lg:pb-section-gap">
        <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop">
          <div className="text-center mb-6 sm:mb-stack-lg">
            <span className="font-label-caps text-[10px] sm:text-xs text-primary tracking-[0.2em] block mb-2 font-semibold">YOUR SELECTION</span>
            <h1 className="font-headline-md text-3xl sm:text-5xl lg:text-6xl text-primary">
              Shopping Cart
            </h1>
          </div>

          <MandalaDivider />

          {state.items.length === 0 ? (
            <div className="text-center py-16 sm:py-section-gap">
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">Your cart is currently empty.</p>
              <Link href="/collections" className="inline-block bg-primary-container border-[1.5px] border-primary px-8 py-3.5 font-label-caps text-xs text-primary hover:bg-primary hover:text-on-primary transition-all duration-300 font-bold tracking-widest">
                BROWSE COLLECTIONS
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-margin-desktop mt-6 sm:mt-stack-lg">
              
              {/* Cart Items List */}
              <div className="col-span-1 lg:col-span-8 flex flex-col gap-3 sm:gap-stack-md">
                {state.items.map((item, idx) => (
                  <div key={`${item.product_id}-${item.metal_finish}-${idx}`} className="flex gap-3 sm:gap-4 p-3 sm:p-4 border border-outline-variant/30 bg-surface-container rounded-xs">
                    <div className="w-20 h-28 sm:w-28 sm:h-36 shrink-0 bg-surface-container-low border border-outline-variant/30 overflow-hidden">
                      <div 
                        className="w-full h-full bg-cover bg-center" 
                        style={{ backgroundImage: `url('${item.image}')` }}
                      />
                    </div>
                    
                    <div className="flex flex-col flex-1 justify-between py-1">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="font-headline-sm text-sm sm:text-base lg:text-headline-sm text-on-surface hover:text-primary transition-colors line-clamp-2">
                            <Link href={`/collections/${item.product_id}`}>{item.name}</Link>
                          </h3>
                          <p className="font-label-caps text-[9px] sm:text-[10px] text-on-surface-variant mt-1">FINISH: {item.metal_finish.toUpperCase()}</p>
                        </div>
                        <button 
                          onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { product_id: item.product_id, metal_finish: item.metal_finish } })}
                          className="text-on-surface-variant/60 hover:text-error transition-colors p-1"
                          title="Remove item"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                      
                      <div className="flex flex-wrap justify-between items-center gap-2 mt-3 pt-2 border-t border-outline-variant/15">
                        <div className="flex items-center border border-outline/40 px-2 py-1 bg-background">
                          <button 
                            onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { product_id: item.product_id, metal_finish: item.metal_finish, quantity: Math.max(1, item.quantity - 1) } })}
                            className="text-on-surface hover:text-primary px-1.5 text-base font-bold"
                          >-</button>
                          <span className="font-label-caps text-xs mx-2 font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { product_id: item.product_id, metal_finish: item.metal_finish, quantity: item.quantity + 1 } })}
                            className="text-on-surface hover:text-primary px-1.5 text-base font-bold"
                          >+</button>
                        </div>
                        <p className="font-label-caps text-xs sm:text-base text-primary font-bold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="col-span-1 lg:col-span-4">
                <div className="border border-primary/50 bg-surface-container p-5 sm:p-6 lg:p-8 sticky top-24 rounded-xs">
                  <h3 className="font-headline-sm text-lg sm:text-xl text-primary mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-outline-variant text-center">Order Summary</h3>
                  
                  <div className="flex flex-col gap-3 mb-6 font-body-md text-xs sm:text-sm text-on-surface-variant">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className={isFreeShipping ? "text-primary italic" : ""}>
                        {isFreeShipping ? "Complimentary" : formatPrice(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Tax (GST 3%)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-end border-t border-outline-variant pt-4 sm:pt-6 mb-6">
                    <span className="font-headline-sm text-base sm:text-lg text-on-surface font-semibold">Total Amount</span>
                    <span className="font-headline-sm text-xl sm:text-2xl text-primary font-bold">{formatPrice(finalTotal)}</span>
                  </div>
                  
                  <div className="flex flex-col gap-2.5 mb-4">
                    <a 
                      href={getCartWhatsAppUrl(state.items, formatPrice(finalTotal))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center gold-bg-gradient px-4 py-3.5 font-label-caps text-[10px] sm:text-xs hover:brightness-110 transition-all font-bold flex items-center justify-center gap-2 shadow-md"
                    >
                      <span className="material-symbols-outlined text-base">chat_bubble</span> ORDER CART VIA WHATSAPP
                    </a>
                    <Link href="/checkout" className="w-full text-center bg-surface-container border border-primary text-primary px-4 py-3 font-label-caps text-[10px] sm:text-xs hover:bg-surface-variant transition-all font-bold tracking-wider">
                      PROCEED TO CHECKOUT
                    </Link>
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-1.5">
                    <span className="material-symbols-outlined text-primary text-xs sm:text-sm">local_shipping</span>
                    <span className="font-label-caps text-[9px] sm:text-[10px] text-on-surface-variant">FULLY INSURED DELIVERY</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xs sm:text-sm">lock</span>
                    <span className="font-label-caps text-[9px] sm:text-[10px] text-on-surface-variant">SECURE CHECKOUT</span>
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
