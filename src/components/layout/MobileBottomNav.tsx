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
    { label: 'PORTAL', icon: 'person', href: '/admin/login' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container/95 backdrop-blur-md border-t border-outline-variant/30 lg:hidden pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = item.href === '/' 
            ? pathname === '/' 
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors relative ${
                isActive ? 'text-primary' : 'text-on-surface-variant/70 hover:text-on-surface'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 bg-primary rounded-full shadow-[0_0_8px_#e6ca65]" />
              )}
              <div className="relative">
                <span className="material-symbols-outlined text-xl">{item.icon}</span>
                {!!item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-primary text-on-primary font-bold text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="font-label-caps text-[9px] tracking-wider font-semibold">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
