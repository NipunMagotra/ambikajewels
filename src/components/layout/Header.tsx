'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { siteConfig } from '@/config/siteConfig';
import { WhatsAppButton, CallButton } from '@/components/ui/ContactButtons';

export default function Header() {
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-outline-variant/20 transition-all">
      {/* Main Minimal Header */}
      <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop h-16 flex items-center justify-between">
        {/* Left: Mobile Menu Toggle / Desktop Quick Links */}
        <div className="flex items-center gap-4 lg:gap-6">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-primary p-1.5 focus:outline-none"
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
        <Link href="/" className="text-center group mx-2 truncate">
          <span className="font-headline-md text-lg sm:text-2xl lg:text-3xl tracking-[0.12em] sm:tracking-[0.22em] gold-text-gradient font-bold leading-none block truncate">
            AMBIKA JEWELS
          </span>
          <span className="font-label-caps text-[7px] sm:text-[7.5px] tracking-[0.3em] sm:tracking-[0.45em] text-on-surface-variant/70 group-hover:text-primary transition-colors block">
            JAMMU &bull; SINCE 1984
          </span>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 lg:gap-5">
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
                <span className="absolute -top-1 -right-1.5 bg-primary text-on-primary font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-label-caps font-bold hidden sm:inline tracking-widest">BAG</span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-background/80 backdrop-blur-md z-40 flex flex-col justify-between p-6 animate-in fade-in slide-in-from-top-4 duration-200 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <div className="font-label-caps text-[10px] text-primary tracking-[0.3em] font-semibold border-b border-outline-variant/20 pb-2">
              CATEGORIES
            </div>
            <Link
              href="/collections"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-label-caps text-primary hover:text-primary/80 py-2 border-b border-outline-variant/10 flex justify-between items-center font-bold"
            >
              <span>ALL COLLECTIONS</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
            {siteConfig.categories.map((category) => (
              <Link
                key={category}
                href={`/collections?category=${encodeURIComponent(category)}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-label-caps text-on-surface hover:text-primary py-2 border-b border-outline-variant/10 flex justify-between items-center"
              >
                <span>{category.toUpperCase()}</span>
                <span className="material-symbols-outlined text-xs opacity-50">chevron_right</span>
              </Link>
            ))}
          </div>

          {/* Quick Contact Buttons */}
          <div className="mt-8 pt-6 border-t border-outline-variant/30 flex flex-col gap-3">
            <div className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.25em] mb-1">
              CONCIERGE ASSISTANCE
            </div>
            <WhatsAppButton />
            <CallButton />
          </div>
        </div>
      )}
    </header>
  );
}
