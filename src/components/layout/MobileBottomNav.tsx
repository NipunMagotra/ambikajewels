'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const navItems = [
    { label: 'HOME', icon: 'home', href: '/' },
    { label: 'JEWELLERY', icon: 'diamond', href: '/collections' },
    { label: 'WISHLIST', icon: 'favorite', href: '/wishlist', badge: wishlistCount },
    { label: 'BAG', icon: 'shopping_bag', href: '/cart', badge: cartCount },
    { label: 'CONCIERGE', icon: 'chat', href: 'https://wa.me/919086098457', external: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--header-bg)] backdrop-blur-md border-t border-[var(--border-subtle)] lg:hidden pb-safe">
      <div className="flex justify-around items-center h-15 px-1">
        {navItems.map((item) => {
          const isActive = !item.external && (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href));

          if (item.external) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center w-full h-full min-h-[44px] gap-0.5 text-[var(--text-secondary)] hover:text-emerald-600 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
                <span className="font-sans text-[8.5px] tracking-[0.14em] font-medium uppercase mt-0.5">
                  {item.label}
                </span>
              </a>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full min-h-[44px] gap-0.5 transition-colors relative cursor-pointer ${
                isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-6 h-[2px] bg-[var(--accent-gold)]" />
              )}
              <div className="relative flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {!!item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[var(--accent-gold)] text-white font-bold text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`font-sans text-[8.5px] tracking-[0.14em] uppercase mt-0.5 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
