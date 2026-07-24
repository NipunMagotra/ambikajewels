'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { siteConfig } from '@/config/siteConfig';

export default function Header() {
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-outline-variant/20 transition-all">
      {/* Main Minimal Header */}
      <div className="container mx-auto px-margin-mobile lg:px-margin-desktop h-16 flex items-center justify-between">
        {/* Left: Mobile Menu Toggle / Desktop Quick Links */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-primary p-1"
            aria-label="Toggle Navigation"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/collections?category=Bridal Couture" className="text-[11px] font-label-caps tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors">
              BRIDAL
            </Link>
            <Link href="/collections?category=Necklaces" className="text-[11px] font-label-caps tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors">
              NECKLACES
            </Link>
            <Link href="/collections?category=Earrings" className="text-[11px] font-label-caps tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors">
              EARRINGS
            </Link>
          </nav>
        </div>

        {/* Center: Brand Logo */}
        <Link href="/" className="text-center group">
          <span className="font-headline-md text-2xl lg:text-3xl tracking-[0.22em] gold-text-gradient font-bold leading-none block">
            AMBIKA JEWELS
          </span>
          <span className="font-label-caps text-[7.5px] tracking-[0.45em] text-on-surface-variant/70 group-hover:text-primary transition-colors">
            JAMMU &bull; SINCE 1984
          </span>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-5">
          <nav className="hidden lg:flex items-center gap-6 mr-2">
            <Link href="/collections?category=Temple Jewelry" className="text-[11px] font-label-caps tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors">
              TEMPLE
            </Link>
            <Link href="/collections" className="text-[11px] font-label-caps tracking-[0.2em] text-on-surface-variant hover:text-primary transition-colors">
              COLLECTIONS
            </Link>
          </nav>

          <Link href="/cart" className="flex items-center gap-1.5 text-primary hover:opacity-80 transition-opacity p-1">
            <div className="relative">
              <span className="material-symbols-outlined text-xl">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-primary text-on-primary font-bold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-label-caps font-bold hidden sm:inline tracking-widest">BAG</span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container border-b border-outline-variant py-4 px-6 flex flex-col gap-3">
          {siteConfig.categories.map((category) => (
            <Link
              key={category}
              href={`/collections?category=${encodeURIComponent(category)}`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-label-caps text-on-surface hover:text-primary py-1.5 border-b border-outline-variant/10"
            >
              {category.toUpperCase()}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}


