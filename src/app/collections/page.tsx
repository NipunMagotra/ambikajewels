import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import CollectionsGridClient from '@/components/catalog/CollectionsGridClient';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockProducts } from '@/data/mockProducts';
import type { Product } from '@/types';

export const revalidate = 60; // Revalidate every minute

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const category = params.category as string | undefined;
  const sort = params.sort as string | undefined;
  const purity = params.purity as string | undefined;

  let displayProducts: Product[] = mockProducts;

  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('products').select('*');
      if (category && category !== 'All') {
        const variants = [category];
        if (category.includes('Jewelry')) variants.push(category.replace(/Jewelry/g, 'Jewellery'));
        if (category.includes('Jewellery')) variants.push(category.replace(/Jewellery/g, 'Jewelry'));
        query = query.in('category', variants);
      }
      if (sort === 'price_asc') {
        query = query.order('price', { ascending: true });
      } else if (sort === 'price_desc') {
        query = query.order('price', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }
      const { data: dbProducts } = await query;
      if (dbProducts && dbProducts.length > 0) {
        displayProducts = dbProducts as Product[];
      }
    } catch (e) {
      console.error('Error fetching collection from database, falling back:', e);
    }
  }

  // Filter in-memory if using mockProducts or when purity query is active
  if (category && category !== 'All') {
    displayProducts = displayProducts.filter((p) => {
      const cat = p.category.toLowerCase();
      const target = category.toLowerCase();
      return cat === target || cat.includes(target) || (target.includes('ring') && cat.includes('ring'));
    });
  }

  if (purity && purity !== 'all') {
    displayProducts = displayProducts.filter((p) => {
      const pur = (p.purity || p.material || '').toLowerCase();
      return pur.includes(purity.toLowerCase());
    });
  }

  if (sort === 'price_asc') {
    displayProducts = [...displayProducts].sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    displayProducts = [...displayProducts].sort((a, b) => b.price - a.price);
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 sm:pt-28 pb-20 lg:pb-24 bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12">
          
          {/* Editorial Collection Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="font-sans text-[9.5px] text-[var(--accent-gold)] tracking-[0.32em] uppercase block mb-2 font-medium">
              THE SHOWROOM ATELIER ARCHIVE
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] font-normal tracking-tight mb-3">
              {category || 'All Fine Jewellery'}
            </h1>
            <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] font-light leading-relaxed">
              {category === 'Dogra Heritage Collection'
                ? 'Ancestral Dogra dynasty heirlooms, traditional Dogri Jhumkis, and royal Naman sets cast in 22K hallmarked gold.'
                : category === 'Bridal Couture'
                ? 'Complete bridal ensembles and Polki sets designed for grand celebrations and eternal preservation.'
                : category === 'Diamond Jewellery'
                ? 'Certified natural diamond solitaires, tennis bracelets, and diamond studs with official IGI/GIA credentials.'
                : category === 'Gold Jewellery'
                ? 'Multi-purity solid gold jewellery (22K, 18K, 14K) verified by Bureau of Indian Standards with unique 6-digit laser HUID.'
                : category === 'Silver Jewellery (925)'
                ? 'Artisanal 925 sterling silver payals, antique oxidized chokers, and royal Jammu silver ornaments.'
                : 'Explore authentic Dogra heritage heirlooms, bridal couture, certified natural diamonds, and multi-purity hallmarked gold handcrafted in Jammu.'}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="font-mono text-[10px] text-[var(--text-tertiary)] tracking-widest uppercase">
                {displayProducts.length} CREATIONS IN ATELIER
              </span>
            </div>
          </div>

          {/* Interactive Filter & Product Grid */}
          <CollectionsGridClient
            products={displayProducts}
            categoryTitle={category || 'All Collections'}
          />

        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
