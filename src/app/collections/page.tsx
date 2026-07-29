import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import ProductCard from '@/components/catalog/ProductCard';
import FilterBar from '@/components/catalog/FilterBar';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Product } from '@/types';
import { mockProducts } from '@/data/mockProducts';

export const revalidate = 60; // Revalidate every minute

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const category = params.category as string | undefined;
  const sort = params.sort as string | undefined;

  let displayProducts: Product[] = [];

  if (isSupabaseConfigured) {
    let query = supabase.from('products').select('*');
    if (category && category !== 'All') {
      query = query.eq('category', category);
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
  }

  if (displayProducts.length === 0) {
    let filtered = [...mockProducts];
    if (category && category !== 'All') {
      const catLower = category.toLowerCase();
      filtered = filtered.filter(p => {
        const pCat = p.category.toLowerCase();
        const pColl = p.collection.toLowerCase();
        return pCat === catLower || pColl === catLower || pCat.includes(catLower) || catLower.includes(pCat);
      });
    }
    if (sort === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    }
    displayProducts = filtered;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 sm:pt-24 pb-24 lg:pb-section-gap">
        <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop">
          <div className="text-center mb-6 sm:mb-stack-lg">
            <span className="font-label-caps text-[10px] sm:text-xs text-primary tracking-[0.2em] block mb-2 font-semibold">COUTURE COLLECTION</span>
            <h1 className="font-headline-md text-3xl sm:text-5xl lg:text-6xl text-primary">
              {category || 'Timeless Heritage'}
            </h1>
          </div>

          <FilterBar />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-stack-md lg:gap-stack-lg">
            {displayProducts.length > 0 ? (
              displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-20 sm:py-32 text-center text-on-surface-variant font-body-lg">
                No pieces found in this collection currently.
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
