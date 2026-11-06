import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import HeroSection from '@/components/home/HeroSection';
import SignatureCollection from '@/components/home/SignatureCollection';
import CategoryGrid from '@/components/home/CategoryGrid';
import BestSellers from '@/components/home/BestSellers';
import CraftStorySection from '@/components/home/CraftStorySection';
import SignaturePieceSpotlight from '@/components/home/SignaturePieceSpotlight';
import HeritageSection from '@/components/home/HeritageSection';
import JournalSection from '@/components/home/JournalSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockProducts } from '@/data/mockProducts';
import type { Product } from '@/types';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  let displayProducts: Product[] = mockProducts;
  
  if (isSupabaseConfigured) {
    try {
      const { data: featuredProducts } = await supabase
        .from('products')
        .select('*')
        .order('is_featured', { ascending: false })
        .limit(16);
      if (featuredProducts && featuredProducts.length > 0) {
        displayProducts = featuredProducts as Product[];
      }
    } catch (err) {
      console.error('Error fetching featured products from Supabase:', err);
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)] overflow-x-hidden pb-16 lg:pb-0">
        {/* Section 1: Hero */}
        <HeroSection />

        {/* Section 2: Signature Collection (Dogra Heritage Asymmetric Spread) */}
        <SignatureCollection products={displayProducts} />

        {/* Section 3: Shop by Category (Editorial Silhouette Spread) */}
        <CategoryGrid />

        {/* Section 4: Featured Jewellery (Refined Product Grid) */}
        <BestSellers products={displayProducts} />

        {/* Section 5: Craft & Material Story (Macro Details & Permanent Craft) */}
        <CraftStorySection />

        {/* Section 6: Signature Piece (Visual Moment & Masterpiece Spotlight) */}
        <SignaturePieceSpotlight products={displayProducts} />

        {/* Section 7: The Maison / Brand Story (Jammu Dynasty & Karigar Heritage) */}
        <HeritageSection />

        {/* Section 8: Journal / Stories from the Atelier */}
        <JournalSection />

        {/* Section 9: Minimalist Newsletter & Salon Register */}
        <NewsletterSection />
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
