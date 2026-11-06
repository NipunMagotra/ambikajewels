'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { mockProducts } from '@/data/mockProducts';

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { dispatch } = useCart();

  const handleMoveToBag = (item: any) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        product_id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
        metal_finish: 'Gold',
        slug: item.slug,
      },
    });
    removeFromWishlist(item.id);
  };

  const handleMoveAllToBag = () => {
    items.forEach((item) => {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image: item.image,
          metal_finish: 'Gold',
          slug: item.slug,
        },
      });
    });
    clearWishlist();
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 sm:pt-28 pb-20 lg:pb-28 bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-6xl">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 gap-4 pb-6 border-b border-[var(--border-subtle)]">
            <div>
              <span className="font-sans text-[9.5px] text-[var(--accent-gold)] tracking-[0.32em] uppercase block mb-1.5 font-medium">
                PRIVATE CURATION
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] font-normal tracking-tight">
                Saved Heirlooms
              </h1>
            </div>

            {items.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleMoveAllToBag}
                  className="btn-gold-primary py-2.5 px-5 text-[10.5px] tracking-wider"
                >
                  MOVE ALL TO BAG
                </button>
                <button
                  onClick={clearWishlist}
                  className="btn-gold-secondary py-2.5 px-4 text-[10.5px] tracking-wider"
                >
                  CLEAR
                </button>
              </div>
            )}
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20 bg-[var(--bg-card)] border border-[var(--border-subtle)] p-8 max-w-md mx-auto rounded-[1px] shadow-xs">
              <span className="material-symbols-outlined text-4xl text-[var(--accent-gold)] mb-3 block font-light">favorite</span>
              <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-2 font-normal">Your Wishlist is Empty</h2>
              <p className="font-sans text-xs text-[var(--text-secondary)] mb-6 font-light leading-relaxed">
                Save your favourite Dogra heritage ornaments, bridal couture sets, and certified diamond pieces while browsing.
              </p>
              <Link href="/collections" className="btn-gold-primary">
                DISCOVER COLLECTIONS
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex flex-col justify-between bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[1px] overflow-hidden"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[var(--bg-surface)]">
                    <Link href={`/collections/${item.slug || item.id}`} className="block w-full h-full">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104"
                      />
                    </Link>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-2.5 right-2.5 w-7 h-7 bg-[var(--bg-card)]/90 hover:bg-red-50 text-[var(--text-secondary)] hover:text-red-600 rounded-full flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                      title="Remove from saved"
                      aria-label="Remove from wishlist"
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <span className="text-[9px] font-sans tracking-[0.2em] uppercase text-[var(--text-tertiary)] block mb-1">
                        {item.category}
                      </span>
                      <h3 className="font-serif text-base text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors line-clamp-1 mb-1">
                        <Link href={`/collections/${item.slug || item.id}`}>{item.name}</Link>
                      </h3>
                      <div className="font-sans text-sm font-medium text-[var(--text-primary)] mb-3">
                        {item.display_price}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-2 border-t border-[var(--border-subtle)]">
                      <button
                        onClick={() => handleMoveToBag(item)}
                        className="btn-gold-primary py-2 text-[10px] tracking-wider w-full"
                      >
                        + MOVE TO BAG
                      </button>
                      <a
                        href={`https://wa.me/919086098457?text=Namaste!%20I%20saved%20${encodeURIComponent(item.name)}%20in%20my%20wishlist%20and%20would%20like%20to%20inquire.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-gold-secondary py-2 text-[10px] tracking-wider w-full text-center flex items-center justify-center gap-1.5 hover:text-emerald-600 hover:border-emerald-600"
                      >
                        <span className="material-symbols-outlined text-xs text-emerald-600">chat</span>
                        INQUIRE
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Curated Recommendations */}
          <div className="mt-20 pt-16 border-t border-[var(--border-subtle)]">
            <span className="text-[9.5px] font-sans tracking-[0.28em] uppercase text-[var(--accent-gold)] font-medium block mb-2">
              RECOMMENDED FOR YOU
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)] font-normal tracking-tight mb-8">
              Explore More Creations
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {mockProducts.slice(0, 4).map((p) => (
                <div key={p.id} className="group">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[var(--bg-surface)] mb-3">
                    <Link href={`/collections/${p.slug || p.id}`}>
                      <img src={p.images?.[0] || '/hero-clean.png'} alt={p.name} className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700" />
                    </Link>
                  </div>
                  <h3 className="font-serif text-sm text-[var(--text-primary)] line-clamp-1">
                    <Link href={`/collections/${p.slug || p.id}`}>{p.name}</Link>
                  </h3>
                  <div className="font-sans text-xs font-medium text-[var(--text-primary)] mt-0.5">
                    {p.display_price}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

