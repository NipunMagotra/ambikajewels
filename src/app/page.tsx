import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import MandalaDivider from '@/components/ui/MandalaDivider';
import HeroSection from '@/components/home/HeroSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import VirtualTryOnBanner from '@/components/home/VirtualTryOnBanner';
import BestSellers from '@/components/home/BestSellers';
import HeritageSection from '@/components/home/HeritageSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Product } from '@/types';
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

  if (displayProducts.length === 0) {
    displayProducts = mockProducts.filter(p => p.is_featured).slice(0, 8);
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-on-background overflow-x-hidden">
        <HeroSection />
        
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

