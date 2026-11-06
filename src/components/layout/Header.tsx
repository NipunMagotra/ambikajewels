'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { siteConfig } from '@/config/siteConfig';
import SearchModal from '@/components/search/SearchModal';

export default function Header() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [jewelleryDropdownOpen, setJewelleryDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setJewelleryDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'NEW', href: '/collections?sort=newest' },
    { label: 'JEWELLERY', href: '/collections', hasDropdown: true },
    { label: 'COLLECTIONS', href: '/collections' },
    { label: 'ABOUT', href: '/about' },
  ];

  const jewelleryCategories = [
    { name: 'Dogra Heritage Collection', tag: 'Signature Jammu Heirlooms', href: '/collections?category=Dogra%20Heritage%20Collection' },
    { name: 'Bridal Couture', tag: 'Kundan, Polki & Trousseaus', href: '/collections?category=Bridal%20Couture' },
    { name: 'Diamond Jewellery', tag: 'IGI/GIA Natural Solitaires', href: '/collections?category=Diamond%20Jewellery' },
    { name: 'Gold Jewellery', tag: '22K & 18K Hallmarked Gold', href: '/collections?category=Gold%20Jewellery' },
    { name: 'Silver Jewellery (925)', tag: 'Oxidized Payals & Chokers', href: '/collections?category=Silver%20Jewellery%20(925)' },
    { name: "Men's Accessories", tag: 'Solid Kadas & Cufflinks', href: "/collections?category=Men's%20Accessories" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'h-14 bg-[var(--header-bg)] backdrop-blur-md border-b border-[var(--border-subtle)] shadow-xs'
            : 'h-16 sm:h-18 bg-[var(--header-bg)] backdrop-blur-sm border-b border-[var(--border-subtle)]'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 h-full flex items-center justify-between">
          
          {/* Left: Brand Identity / Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-[var(--text-primary)] hover:text-[var(--accent-gold)] p-1.5 -ml-1.5 focus:outline-none cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>

            <Link href="/" className="group flex flex-col items-start leading-none py-1">
              <span className="font-serif text-lg sm:text-xl lg:text-2xl tracking-[0.18em] text-[var(--text-primary)] group-hover:text-[var(--accent-gold)] transition-colors font-medium">
                AMBIKA JEWELS
              </span>
              <span className="font-sans text-[7px] sm:text-[8px] tracking-[0.35em] text-[var(--text-tertiary)] uppercase font-semibold mt-1">
                JAMMU &bull; ESTD. 1998
              </span>
            </Link>
          </div>

          {/* Center: Primary Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.hasDropdown && setJewelleryDropdownOpen(true)}
                onMouseLeave={() => link.hasDropdown && setJewelleryDropdownOpen(false)}
              >
                <Link
                  href={link.href}
                  className={`text-[11px] font-sans tracking-[0.24em] uppercase transition-colors py-2 flex items-center gap-1 ${
                    pathname === link.href
                      ? 'text-[var(--text-primary)] font-semibold border-b border-[var(--accent-gold)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.hasDropdown && (
                    <span className="material-symbols-outlined text-[14px] text-[var(--text-tertiary)]">
                      expand_more
                    </span>
                  )}
                </Link>

                {/* Dropdown Flyout */}
                {link.hasDropdown && jewelleryDropdownOpen && (
                  <div className="absolute top-full -left-4 w-72 bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xl p-3 grid grid-cols-1 gap-1 animate-in fade-in slide-in-from-top-1 duration-150 rounded-[1px] z-50">
                    <Link
                      href="/collections"
                      className="px-3 py-2 text-[10px] font-sans font-semibold tracking-[0.2em] text-[var(--accent-gold)] hover:bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] mb-1 flex justify-between items-center uppercase"
                      onClick={() => setJewelleryDropdownOpen(false)}
                    >
                      <span>VIEW ALL CREATIONS</span>
                      <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </Link>
                    {jewelleryCategories.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="px-3 py-2 text-left hover:bg-[var(--bg-surface)] rounded-[1px] transition-colors group/item"
                        onClick={() => setJewelleryDropdownOpen(false)}
                      >
                        <div className="text-[11px] font-sans font-medium tracking-[0.14em] uppercase text-[var(--text-primary)] group-hover/item:text-[var(--accent-gold)]">
                          {item.name}
                        </div>
                        <div className="text-[9.5px] font-sans text-[var(--text-tertiary)] tracking-normal mt-0.5 font-light">
                          {item.tag}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right: Functional Utility Actions */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors cursor-pointer rounded-full hover:bg-[var(--bg-surface)]"
              aria-label="Search catalogue (⌘K)"
              title="Search catalogue (⌘K)"
            >
              <span className="material-symbols-outlined text-lg sm:text-xl">search</span>
            </button>

            {/* Account Link */}
            <Link
              href="/account"
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors rounded-full hover:bg-[var(--bg-surface)]"
              aria-label="Client Account"
              title="Client Account & Orders"
            >
              <span className="material-symbols-outlined text-lg sm:text-xl">person</span>
            </Link>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors rounded-full hover:bg-[var(--bg-surface)]"
              aria-label="Wishlist"
              title="Saved Heirlooms"
            >
              <span className="material-symbols-outlined text-lg sm:text-xl">favorite</span>
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1 bg-[var(--text-primary)] text-[var(--bg-main)] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Link */}
            <Link
              href="/cart"
              className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors rounded-full hover:bg-[var(--bg-surface)]"
              aria-label="Shopping Bag"
              title="Shopping Bag"
            >
              <span className="material-symbols-outlined text-lg sm:text-xl">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1 bg-[var(--accent-gold)] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-xs">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors cursor-pointer rounded-full hover:bg-[var(--bg-surface)] ml-1"
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <span className="material-symbols-outlined text-lg">
                {isDark ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[100] lg:hidden bg-black/60 backdrop-blur-xs flex"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-4/5 max-w-sm h-full bg-[var(--bg-main)] border-r border-[var(--border-subtle)] p-6 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[var(--border-subtle)]">
                <div>
                  <span className="font-serif text-lg tracking-[0.16em] text-[var(--text-primary)] font-medium block">
                    AMBIKA JEWELS
                  </span>
                  <span className="font-sans text-[7.5px] tracking-[0.3em] text-[var(--text-tertiary)] uppercase font-semibold">
                    JAMMU &bull; ESTD. 1998
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1.5"
                  aria-label="Close Navigation"
                >
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-1 py-6">
                <Link
                  href="/collections?sort=newest"
                  className="py-2.5 text-xs font-sans tracking-[0.24em] uppercase text-[var(--text-primary)] font-medium hover:text-[var(--accent-gold)]"
                >
                  NEW ARRIVALS
                </Link>
                <Link
                  href="/collections"
                  className="py-2.5 text-xs font-sans tracking-[0.24em] uppercase text-[var(--text-primary)] font-medium hover:text-[var(--accent-gold)]"
                >
                  ALL JEWELLERY
                </Link>
                <div className="pl-3 py-1 flex flex-col gap-1.5 border-l border-[var(--border-subtle)] my-1">
                  {jewelleryCategories.map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      className="py-1 text-[11px] font-sans text-[var(--text-secondary)] hover:text-[var(--accent-gold)] tracking-wider"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/about"
                  className="py-2.5 text-xs font-sans tracking-[0.24em] uppercase text-[var(--text-primary)] font-medium hover:text-[var(--accent-gold)]"
                >
                  ABOUT THE MAISON
                </Link>
                <Link
                  href="/showroom"
                  className="py-2.5 text-xs font-sans tracking-[0.24em] uppercase text-[var(--text-primary)] font-medium hover:text-[var(--accent-gold)]"
                >
                  JAMMU SHOWROOM
                </Link>
                <Link
                  href="/journal"
                  className="py-2.5 text-xs font-sans tracking-[0.24em] uppercase text-[var(--text-primary)] font-medium hover:text-[var(--accent-gold)]"
                >
                  JOURNAL &amp; STORIES
                </Link>
              </nav>

              {/* Utility shortcuts */}
              <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-col gap-2">
                <Link
                  href="/wishlist"
                  className="flex items-center justify-between py-2 text-xs font-sans text-[var(--text-secondary)] hover:text-[var(--text-primary)] uppercase tracking-wider"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">favorite</span>
                    SAVED PIECES
                  </span>
                  <span className="text-[10px] text-[var(--accent-gold)] font-semibold font-mono">
                    {wishlistCount}
                  </span>
                </Link>
                <Link
                  href="/account"
                  className="flex items-center gap-2 py-2 text-xs font-sans text-[var(--text-secondary)] hover:text-[var(--text-primary)] uppercase tracking-wider"
                >
                  <span className="material-symbols-outlined text-base">person</span>
                  ORDER STATUS &amp; ACCOUNT
                </Link>
              </div>
            </div>

            {/* Bottom Concierge */}
            <div className="pt-6 border-t border-[var(--border-subtle)]">
              <a
                href="https://wa.me/919086098457?text=Namaste!%20I%20would%20like%20to%20connect%20with%20an%20Ambika%20Jewels%20concierge."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold-primary w-full py-2.5 text-[10px] tracking-[0.2em]"
              >
                <span className="material-symbols-outlined text-sm">chat</span>
                CONCIERGE WHATSAPP
              </a>
              <div className="text-[9px] font-sans text-[var(--text-tertiary)] text-center mt-3 tracking-wider">
                LOWER ROOP NAGAR &bull; JAMMU
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
