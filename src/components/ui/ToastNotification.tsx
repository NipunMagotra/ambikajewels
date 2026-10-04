'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function ToastNotification() {
  const { state, dispatch } = useCart();
  const lastItem = state.lastAddedItem;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (lastItem) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        dispatch({ type: 'CLEAR_TOAST' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [lastItem, dispatch]);

  if (!visible || !lastItem) return null;

  const formatPrice = (paise: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(paise / 100);
  };

  return (
    <aside
      aria-label="Shopping bag notification"
      aria-live="polite"
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full bg-surface-container/95 backdrop-blur-md border border-primary/50 shadow-2xl rounded-xs p-4 animate-in slide-in-from-bottom-5 duration-200"
    >
      <div className="flex items-start gap-3">
        {lastItem.image ? (
          <img
            src={lastItem.image}
            alt={lastItem.name}
            className="w-12 h-12 object-cover rounded-xs border border-primary/30 shrink-0"
          />
        ) : (
          <div className="w-12 h-12 bg-primary/20 rounded-xs flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-xl">shopping_bag</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-label-caps text-primary tracking-wider font-bold uppercase">
              ✓ Added to Shopping Bag
            </span>
            <button
              onClick={() => {
                setVisible(false);
                dispatch({ type: 'CLEAR_TOAST' });
              }}
              className="text-on-surface-variant hover:text-white p-0.5 text-xs"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>

          <h4 className="text-xs font-headline-sm text-on-surface truncate font-semibold mt-0.5">
            {lastItem.name}
          </h4>

          <div className="flex items-center gap-2 mt-1 text-[11px] text-on-surface-variant">
            <span>{formatPrice(lastItem.price)}</span>
            {lastItem.selected_size && (
              <>
                <span>&bull;</span>
                <span className="text-primary font-semibold">{lastItem.selected_size}</span>
              </>
            )}
            <span>&bull;</span>
            <span>Qty: {lastItem.quantity}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-outline-variant/20">
        <Link
          href="/cart"
          onClick={() => setVisible(false)}
          className="text-center py-2 px-3 bg-surface hover:bg-surface-variant text-[11px] font-label-caps font-bold text-on-surface rounded-xs border border-outline-variant/40 transition-colors"
        >
          VIEW BAG
        </Link>
        <Link
          href="/checkout"
          onClick={() => setVisible(false)}
          className="text-center py-2 px-3 gold-bg-gradient text-[11px] font-label-caps font-bold text-black rounded-xs shadow hover:brightness-110 transition-all"
        >
          CHECKOUT &rarr;
        </Link>
      </div>
    </aside>
  );
}
