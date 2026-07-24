'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 w-full z-40 bg-surface-container border-t border-outline-variant lg:hidden">
      <div className="flex justify-around items-center h-16">
        <Link href="/" className={`flex flex-col items-center justify-center w-full h-full ${pathname === '/' ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined">home</span>
        </Link>
        <Link href="/collections" className={`flex flex-col items-center justify-center w-full h-full ${pathname.startsWith('/collections') ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined">grid_view</span>
        </Link>
        <Link href="/cart" className={`flex flex-col items-center justify-center w-full h-full ${pathname === '/cart' ? 'text-primary' : 'text-on-surface-variant'}`}>
          <div className="relative">
            <span className="material-symbols-outlined">shopping_bag</span>
          </div>
        </Link>
        <Link href="/admin/login" className={`flex flex-col items-center justify-center w-full h-full ${pathname.startsWith('/admin') ? 'text-primary' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined">person</span>
        </Link>
      </div>
    </div>
  );
}
