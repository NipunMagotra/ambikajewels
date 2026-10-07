'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { siteConfig } from '@/config/siteConfig';
import { WhatsAppButton, CallButton } from '@/components/ui/ContactButtons';
import SearchModal from '@/components/search/SearchModal';

export default function Header() {
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    if (nextIsDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      try {
        localStorage.setItem('ambika_theme', 'dark');
      } catch (e) {}
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('ambika_theme', 'light');
      } catch (e) {}
    }
  };

  // Global Cmd+K or Ctrl+K shortcut to open instant search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
      <header className="fixed top-0 left-0 w-full z-50 bg-[var(--header-bg)] backdrop-blur-md border-b border-[var(--border-subtle)] transition-all">
        {/* Main Minimal Luxury Header */}
        <div className="container mx-auto px-3 sm:px-margin-mobile lg:px-margin-desktop h-16 flex items-center justify-between">
          {/* Left: Mobile Menu Toggle / Desktop Navigation */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-[var(--text-primary)] hover:text-[var(--accent-gold)] min-w-[44px] min-h-[44px] flex items-center justify-center p-2 focus:outline-none cursor-pointer"
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
                  className="text-[11px] font-sans tracking-[0.2em] uppercase font-semibold text-[var(--accent-gold)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1 py-2 cursor-pointer"
                  onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                >
                  CATEGORIES <span className="material-symbols-outlined text-xs">expand_more</span>
                </button>

                {categoriesDropdownOpen && (
                  <div className="absolute top-full left-0 w-72 bg-[var(--bg-card)]/98 backdrop-blur-md border border-[var(--border-subtle)] shadow-2xl p-3 grid grid-cols-1 gap-1 animate-in fade-in slide-in-from-top-2 duration-150 rounded-[2px] z-50">
                    <Link
                      href="/collections"
                      className="px-3 py-2 text-xs font-sans text-[var(--accent-gold)] hover:bg-[var(--bg-surface)] rounded-[2px] font-semibold border-b border-[var(--border-subtle)] mb-1 flex justify-between items-center tracking-wider uppercase"
                      onClick={() => setCategoriesDropdownOpen(false)}
                    >
                      <span>ALL COLLECTIONS</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </Link>
                    {siteConfig.categories.map((cat) => (
                      <Link
                        key={cat}
                        href={`/collections?category=${encodeURIComponent(cat)}`}
                        className="px-3 py-1.5 text-[11px] font-sans text-[var(--text-secondary)] hover:text-[var(--accent-gold)] hover:bg-[var(--bg-surface)] rounded-[2px] transition-colors truncate tracking-wider uppercase"
                        onClick={() => setCategoriesDropdownOpen(false)}
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/collections?category=Bridal Couture" className="text-[11px] font-sans tracking-[0.2em] uppercase text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors font-medium">
                BRIDAL
              </Link>
              <Link href="/collections?category=Diamond Jewellery" className="text-[11px] font-sans tracking-[0.2em] uppercase text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors font-medium">
                DIAMONDS
              </Link>
              <Link href="/collections?category=Gold Jewellery" className="text-[11px] font-sans tracking-[0.2em] uppercase text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors font-medium">
                GOLD
              </Link>
            </nav>
          </div>

          {/* Center: Brand Logo */}
          <Link href="/" className="text-center group mx-2 truncate flex flex-col items-center">
            <span className="font-serif text-lg sm:text-2xl lg:text-3xl tracking-[0.16em] sm:tracking-[0.22em] text-[var(--text-primary)] group-hover:text-[var(--accent-gold)] font-normal leading-none block truncate transition-colors">
              AMBIKA JEWELS
            </span>
            <span className="font-sans text-[7px] sm:text-[8px] tracking-[0.35em] text-[var(--accent-gold)] block mt-1 uppercase font-semibold">
              JAMMU &bull; FINE JEWELLERY
            </span>
          </Link>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
            <nav className="hidden lg:flex items-center gap-5 mr-1">
              <Link href="/services" className="text-[11px] font-sans tracking-[0.2em] uppercase text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors font-medium">
                SERVICES
              </Link>
              <Link href="/collections?category=Dogra Heritage Collection" className="text-[11px] font-sans tracking-[0.2em] uppercase text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors font-medium">
                DOGRA
              </Link>
              <Link href="/about" className="text-[11px] font-sans tracking-[0.2em] uppercase text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors font-medium">
                ABOUT US
              </Link>
            </nav>

            {/* Theme Toggle Button (Light/Dark) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors p-2 cursor-pointer"
              aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <span className="material-symbols-outlined text-lg sm:text-xl">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Search Trigger Button with comfortable 44px touch target */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center gap-1.5 text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors p-2 cursor-pointer"
              aria-label="Search jewellery collections (Cmd+K)"
              title="Search jewellery collections (⌘K)"
            >
              <span className="material-symbols-outlined text-lg sm:text-xl">search</span>
              <span className="hidden md:inline-flex items-center text-[10px] font-mono bg-[var(--bg-surface)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                ⌘K
              </span>
            </button>

            {/* Cart Bag with comfortable 44px touch target */}
            <Link 
              href="/cart" 
              className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center gap-1.5 text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors p-2"
              aria-label="Shopping Bag"
            >
              <div className="relative flex items-center justify-center">
                <span className="material-symbols-outlined text-lg sm:text-xl">shopping_bag</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[var(--accent-gold)] text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-sans font-semibold hidden sm:inline tracking-[0.18em] uppercase">BAG</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Global Instant Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[60]"
          style={{ top: 0, left: 0, right: 0, bottom: 0, position: 'fixed' }}
        >
          {/* Dark Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div
            className="absolute left-0 right-0 bg-[var(--bg-card)] border-b border-[var(--border-subtle)] shadow-2xl flex flex-col overflow-y-auto"
            style={{ top: '64px', maxHeight: 'calc(100dvh - 64px)' }}
          >
            <div className="flex flex-col gap-1 p-5 pb-4">
              <div className="font-sans text-[10px] text-[var(--accent-gold)] tracking-[0.3em] font-semibold border-b border-[var(--border-subtle)] pb-2 uppercase">
                BROWSE COLLECTIONS
              </div>

              <Link
                href="/collections"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-sans tracking-wider text-[var(--accent-gold)] py-3 border-b border-[var(--border-subtle)] flex justify-between items-center font-semibold"
              >
                <span>ALL COLLECTIONS</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>

              {siteConfig.categories.map((category) => (
                <Link
                  key={category}
                  href={`/collections?category=${encodeURIComponent(category)}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-sans tracking-wide text-[var(--text-primary)] hover:text-[var(--accent-gold)] py-2.5 border-b border-[var(--border-subtle)] flex justify-between items-center"
                >
                  <span>{category.toUpperCase()}</span>
                  <span className="material-symbols-outlined text-sm text-[var(--accent-gold)]">chevron_right</span>
                </Link>
              ))}

              <Link
                href="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-sans tracking-wider text-[var(--accent-gold)] py-3 border-b border-[var(--border-subtle)] flex justify-between items-center font-semibold"
              >
                <span>SERVICES &amp; GOLD EXCHANGE</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-sans tracking-wider text-[var(--accent-gold)] py-3 border-b border-[var(--border-subtle)] flex justify-between items-center font-semibold"
              >
                <span>ABOUT US &amp; LEGACY</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </Link>
            </div>

            {/* Quick Concierge Assistance */}
            <div className="p-5 pt-3 border-t border-[var(--border-subtle)] flex flex-col gap-2.5 pb-8 bg-[var(--bg-surface)]">
              <div className="font-sans text-[10px] text-[var(--text-secondary)] tracking-[0.25em] uppercase mb-1">
                JAMMU CONCIERGE
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
