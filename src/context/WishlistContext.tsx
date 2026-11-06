'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '@/types';

export interface WishlistItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  display_price?: string;
  image: string;
  category: string;
  material?: string;
  purity?: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product | WishlistItem) => void;
  addToWishlist: (product: Product | WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ambika_wishlist');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load wishlist:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('ambika_wishlist', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist wishlist:', e);
    }
  }, [items, isLoaded]);

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  const toWishlistItem = (p: Product | WishlistItem): WishlistItem => {
    const mainImg = (p as any).images?.[0] || (p as WishlistItem).image || '/hero-clean.png';
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      display_price: (p as any).display_price || `₹${Math.round(p.price / 100).toLocaleString('en-IN')}`,
      image: mainImg,
      category: p.category,
      material: (p as any).material,
      purity: (p as any).purity,
    };
  };

  const addToWishlist = (product: Product | WishlistItem) => {
    if (isInWishlist(product.id)) return;
    setItems((prev) => [...prev, toWishlistItem(product)]);
  };

  const removeFromWishlist = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const toggleWishlist = (product: Product | WishlistItem) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const clearWishlist = () => {
    setItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        wishlistCount: items.length,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

