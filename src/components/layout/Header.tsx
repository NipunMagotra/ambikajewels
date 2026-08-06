'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { siteConfig } from '@/config/siteConfig';
import { WhatsAppButton, CallButton } from '@/components/ui/ContactButtons';

export default function Header() {
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
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
              {/* Mega Dropdown for Categories */}
              <div 
                className="relative"
                onMouseEnter={() => setCategoriesDropdownOpen(true)}
                onMouseLeave={() => setCategoriesDropdownOpen(false)}
              >
                <button 
                  className="text-[11px] font-label-caps tracking-[0.2em] text-primary hover:text-primary/80 transition-colors flex items-center gap-1 font-bold py-2"
                  onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                >
                  CATEGORIES <span className="material-symbols-outlined text-xs">expand_more</span>
                </button>

                {categoriesDropdownOpen && (
                  <div className="absolute top-full left-0 w-72 bg-surface-container/95 backdrop-blur-md border border-outline-variant/30 shadow-2xl p-3 grid grid-cols-1 gap-1 animate-in fade-in slide-in-from-top-2 duration-150 rounded-xs z-50">
                    <Link
                      href="/collections"
                      className="px-3 py-1.5 text-xs font-label-caps text-primary hover:bg-primary/10 rounded-xs font-bold border-b border-outline-variant/20 mb-1 flex justify-between items-center"
                      onClick={() => setCategoriesDropdownOpen(false)}
                    >
                      <span>ALL COLLECTIONS</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </Link>
                    {siteConfig.categories.map((cat) => (
                      <Link
                        key={cat}
                        href={`/collections?category=${encodeURIComponent(cat)}`}
                        className="px-3 py-1.5 text-[11px] font-label-caps text-on-surface-variant hover:text-primary hover:bg-surface-variant/40 rounded-xs transition-colors truncate"
                        onClick={() => setCategoriesDropdownOpen(false)}
                      >
                        {cat.toUpperCase()}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/collections?category=Bridal Couture" className="text-[11px] font-label-caps tracking-[0.2em] text-amber-100 hover:text-primary transition-colors font-semibold">
                BRIDAL
              </Link>
              <Link href="/collections?category=Necklaces %26 Chokers" className="text-[11px] font-label-caps tracking-[0.2em] text-amber-100 hover:text-primary transition-colors font-semibold">
                NECKLACES
              </Link>
              <Link href="/tools" className="text-[11px] font-label-caps tracking-[0.15em] text-primary hover:bg-primary/20 bg-primary/10 border border-primary/30 px-2.5 py-1 rounded transition-colors font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">calculate</span> COUNTER TOOLS
              </Link>
            </nav>
          </div>

          {/* Center: Brand Logo */}
          <Link href="/" className="text-center group mx-2 truncate">
            <span className="font-headline-md text-lg sm:text-2xl lg:text-3xl tracking-[0.12em] sm:tracking-[0.22em] gold-text-gradient font-bold leading-none block truncate">
              AMBIKA JEWELS
            </span>
            <span className="font-label-caps text-[7px] sm:text-[7.5px] tracking-[0.3em] sm:tracking-[0.45em] text-on-surface-variant/70 group-hover:text-primary transition-colors block">
              JAMMU &bull; ESTD 2021
            </span>
          </Link>

          {/* Right: Actions */}
          <div className="flex items-center gap-4 lg:gap-5">
            <nav className="hidden lg:flex items-center gap-6 mr-2">
              <Link href="/services" className="text-[11px] font-label-caps tracking-[0.2em] text-amber-100 hover:text-primary transition-colors font-semibold">
                SERVICES
              </Link>
              <Link href="/collections?category=Dogra %26 Heritage Collection" className="text-[11px] font-label-caps tracking-[0.2em] text-amber-100 hover:text-primary transition-colors font-semibold">
                DOGRA
              </Link>
              <Link href="/about" className="text-[11px] font-label-caps tracking-[0.2em] text-amber-100 hover:text-primary transition-colors font-semibold">
                ABOUT US
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
      </header>

      {/* Mobile Menu Drawer - OUTSIDE header to avoid clipping */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[60]"
          style={{ top: 0, left: 0, right: 0, bottom: 0, position: 'fixed' }}
        >
          {/* Dark Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div
            className="absolute left-0 right-0 bg-background border-b border-amber-500/30 shadow-2xl flex flex-col overflow-y-auto"
            style={{ top: '64px', maxHeight: 'calc(100dvh - 64px)' }}
          >
            <div className="flex flex-col gap-2 p-5 pb-4">

              <div className="font-label-caps text-[10px] text-primary tracking-[0.3em] font-semibold border-b border-outline-variant/20 pb-2 mt-2">
                BROWSE ALL 13+ CATEGORIES
              </div>

              <Link
                href="/collections"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-label-caps text-primary hover:text-primary/80 py-3 border-b border-outline-variant/15 flex justify-between items-center font-bold"
              >
                <span>ALL COLLECTIONS</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>

              {siteConfig.categories.map((category) => (
                <Link
                  key={category}
                  href={`/collections?category=${encodeURIComponent(category)}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-label-caps text-amber-100 hover:text-primary py-2.5 border-b border-outline-variant/10 flex justify-between items-center"
                >
                  <span>{category.toUpperCase()}</span>
                  <span className="material-symbols-outlined text-sm text-amber-200/50">chevron_right</span>
                </Link>
              ))}

              <Link
                href="/tools"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-label-caps text-primary hover:text-primary/80 py-3 border-b border-outline-variant/15 flex justify-between items-center font-bold bg-primary/10 px-3 rounded-md my-1"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">calculate</span>
                  GOLDSMITH COUNTER & RATES
                </span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </Link>
              <Link
                href="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-label-caps text-primary hover:text-primary/80 py-3 border-b border-outline-variant/15 flex justify-between items-center font-bold"
              >
                <span>SERVICES & GOLD EXCHANGE</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-label-caps text-primary hover:text-primary/80 py-3 border-b border-outline-variant/15 flex justify-between items-center font-bold"
              >
                <span>ABOUT US & LEGACY</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </Link>
            </div>

            {/* Quick Contact Buttons */}
            <div className="p-5 pt-4 border-t border-outline-variant/30 flex flex-col gap-3 pb-8">
              <div className="font-label-caps text-[10px] text-on-surface-variant tracking-[0.25em] mb-1">
                CONCIERGE ASSISTANCE
              </div>
              <WhatsAppButton />
              <CallButton />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
