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
      <main className="min-h-screen pt-28 pb-24 flex items-center justify-center bg-[var(--bg-main)] text-[var(--text-primary)] px-4">
        <div className="max-w-lg w-full text-center bg-[var(--bg-card)] border border-[var(--border-subtle)] p-8 sm:p-12 rounded-[2px] shadow-2xl">
          <span className="font-label-caps text-xs text-[var(--accent-gold)] font-bold tracking-[0.3em] block mb-2">
            PAGE NOT FOUND
          </span>
          <h1 className="font-serif text-6xl sm:text-7xl text-[var(--accent-gold)] font-normal mb-4">
            404
          </h1>
          <h2 className="font-serif text-xl sm:text-2xl text-[var(--text-primary)] mb-3">
            Design Beyond Reach
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] mb-8 leading-relaxed max-w-sm mx-auto">
            The page you are looking for might have been moved, renamed, or is temporarily unavailable. Explore our curated collections below.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="btn-gold-primary text-xs py-3.5 px-6"
            >
              RETURN HOME
            </Link>
            <Link
              href="/collections"
              className="btn-gold-secondary text-xs py-3.5 px-6"
            >
              EXPLORE COLLECTIONS
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] flex justify-center gap-6 text-xs text-[var(--text-secondary)] font-sans">
            <Link href="/track" className="hover:text-[var(--accent-gold)] transition-colors">Track Order</Link>
            <span>&bull;</span>
            <Link href="/contact" className="hover:text-[var(--accent-gold)] transition-colors">Contact Showroom</Link>
            <span>&bull;</span>
            <Link href="/shipping-policy" className="hover:text-[var(--accent-gold)] transition-colors">Shipping Policy</Link>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
