import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import MandalaDivider from '@/components/ui/MandalaDivider';
import HeroSection from '@/components/home/HeroSection';
import LiveBullionTicker from '@/components/home/LiveBullionTicker';
import CategoryGrid from '@/components/home/CategoryGrid';
import VirtualTryOnBanner from '@/components/home/VirtualTryOnBanner';
import BestSellers from '@/components/home/BestSellers';
import HeritageSection from '@/components/home/HeritageSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Product } from '@/types';
import { siteConfig } from '@/config/siteConfig';
import { mockProducts } from '@/data/mockProducts';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  let displayProducts: Product[] = [];
  
  if (isSupabaseConfigured) {
    const { data: featuredProducts } = await supabase
      .from('products')
      .select('*')
      .limit(8);
    if (featuredProducts && featuredProducts.length > 0) {
      displayProducts = featuredProducts as Product[];
    }
  }

  // Augment with mockProducts if fewer than 4 to keep the 4-column luxury grid complete
  if (displayProducts.length < 4 && siteConfig.features.useMockProductsFallback) {
    const existingIds = new Set(displayProducts.map(p => p.id));
    const fallbacks = mockProducts.filter(p => !existingIds.has(p.id) && p.is_featured);
    displayProducts = [...displayProducts, ...fallbacks].slice(0, 8);
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-on-background overflow-x-hidden pb-20 lg:pb-0">
        <HeroSection />
        <LiveBullionTicker />
        
        <div className="container mx-auto">
          <CategoryGrid />
          <MandalaDivider />
          <BestSellers products={displayProducts} />
          <VirtualTryOnBanner />
          <HeritageSection />
        </div>

        <TestimonialsSection />
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

