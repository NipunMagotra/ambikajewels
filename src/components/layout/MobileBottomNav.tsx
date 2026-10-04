'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount } = useCart();

  const navItems = [
    { label: 'HOME', icon: 'home', href: '/' },
    { label: 'GALLERY', icon: 'grid_view', href: '/collections' },
    { label: 'BAG', icon: 'shopping_bag', href: '/cart', badge: cartCount },
    { label: 'ABOUT US', icon: 'info', href: '/about' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--header-bg)] backdrop-blur-md border-t border-[var(--border-subtle)] lg:hidden pb-safe">
      <div className="flex justify-around items-center h-16 px-1">
        {navItems.map((item) => {
          const isActive = item.href === '/' 
            ? pathname === '/' 
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full min-h-[44px] gap-1 transition-colors relative cursor-pointer ${
                isActive ? 'text-[var(--accent-gold)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-[2px] bg-[var(--accent-gold)] rounded-full shadow-[0_0_8px_rgba(158,122,35,0.4)]" />
              )}
              <div className="relative flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                {!!item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[var(--accent-gold)] text-white font-bold text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="font-sans text-[9px] tracking-[0.16em] font-semibold uppercase">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
