import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';

export const metadata = {
  title: '404 - Page Not Found | Ambika Jewels',
  description: 'The requested luxury jewelry page could not be located. Browse our Dogra heritage and fine gold collections.',
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-24 flex items-center justify-center bg-background text-on-background px-4">
        <div className="max-w-lg w-full text-center bg-surface-container border border-outline-variant/30 p-8 sm:p-12 rounded-xs shadow-2xl">
          <span className="font-label-caps text-xs text-primary font-bold tracking-[0.3em] block mb-2">
            PAGE NOT FOUND
          </span>
          <h1 className="font-headline-md text-6xl sm:text-7xl gold-text-gradient font-bold mb-4">
            404
          </h1>
          <h2 className="font-headline-sm text-xl sm:text-2xl text-on-surface mb-3">
            Design Beyond Reach
          </h2>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mb-8 leading-relaxed max-w-sm mx-auto">
            The page you are looking for might have been moved, renamed, or is temporarily unavailable. Explore our curated collections below.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="gold-bg-gradient px-6 py-3.5 font-label-caps text-xs text-background font-bold tracking-widest text-center shadow-md hover:brightness-110 transition-all"
            >
              RETURN HOME
            </Link>
            <Link
              href="/collections"
              className="border border-primary px-6 py-3.5 font-label-caps text-xs text-primary font-bold tracking-widest text-center hover:bg-primary/10 transition-all"
            >
              EXPLORE COLLECTIONS
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-outline-variant/20 flex justify-center gap-6 text-xs text-on-surface-variant font-body-md">
            <Link href="/track" className="hover:text-primary transition-colors">Track Order</Link>
            <span>&bull;</span>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact Showroom</Link>
            <span>&bull;</span>
            <Link href="/shipping-policy" className="hover:text-primary transition-colors">Shipping Policy</Link>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
