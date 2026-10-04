import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import ProductCard from '@/components/catalog/ProductCard';
import FilterBar from '@/components/catalog/FilterBar';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Product } from '@/types';
import { siteConfig } from '@/config/siteConfig';
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

  // F5: Fallback to mockProducts only if explicitly enabled in siteConfig
  if (displayProducts.length === 0 && siteConfig.features.useMockProductsFallback) {
    let filtered = [...mockProducts];
    if (category && category !== 'All') {
      const catLower = category.toLowerCase();
      filtered = filtered.filter(p => {
        const pCat = p.category.toLowerCase();
        const pColl = p.collection.toLowerCase();
        const pName = p.name.toLowerCase();
        const pDesc = p.description.toLowerCase();
        const pBadges = (p.badges || []).join(' ').toLowerCase();

        // 1. Direct category or collection match
        if (pCat === catLower || pColl === catLower || pCat.includes(catLower) || catLower.includes(pCat)) {
          return true;
        }

        // 2. Intelligent category keyword fallback
        if (catLower.includes('necklace') || catLower.includes('choker')) {
          return pName.includes('necklace') || pName.includes('choker') || pName.includes('haar') || pName.includes('naman') || pName.includes('chain');
        }
        if (catLower.includes('earring') || catLower.includes('jhumka')) {
          return pName.includes('jhumki') || pName.includes('stud') || pName.includes('earring') || pName.includes('chandbali');
        }
        if (catLower.includes('bangle') || catLower.includes('kada') || catLower.includes('bracelet')) {
          return pName.includes('kada') || pName.includes('bracelet') || pName.includes('bangle') || pName.includes('haathphool');
        }
        if (catLower.includes('ring') || catLower.includes('solitaire')) {
          return pName.includes('ring') || pName.includes('solitaire');
        }
        if (catLower.includes('temple') || catLower.includes('antique')) {
          return pName.includes('temple') || pName.includes('naman') || pName.includes('antique') || pDesc.includes('traditional');
        }
        if (catLower.includes('everyday') || catLower.includes('daily') || catLower.includes('lightweight')) {
          return pDesc.includes('daily') || pDesc.includes('everyday') || pDesc.includes('lightweight') || pName.includes('daily');
        }
        if (catLower.includes('custom') || catLower.includes('bespoke')) {
          return pBadges.includes('bespoke') || pName.includes('bespoke') || pName.includes('custom');
        }
        return false;
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
      <main className="min-h-screen pt-20 sm:pt-24 pb-20 lg:pb-16 bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
        <div className="container mx-auto px-3 sm:px-margin-mobile lg:px-margin-desktop">
          {/* Collection Heading */}
          <div className="text-center mb-4 sm:mb-6">
            <span className="font-sans text-[10px] sm:text-xs text-[var(--accent-gold)] tracking-[0.3em] uppercase block mb-1 font-semibold">
              COUTURE COLLECTION
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] font-normal">
              {category || 'Timeless Heritage'}
            </h1>
          </div>

          <FilterBar />

          {/* Products appear naturally below filter section with controlled spacing */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {displayProducts.length > 0 ? (
              displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-10 sm:py-16 text-center px-4 max-w-lg mx-auto bg-[var(--bg-card)] border border-[var(--border-card)] shadow-[var(--card-shadow)] rounded-[2px] my-4">
                <span className="material-symbols-outlined text-3xl text-[var(--accent-gold)] mb-2 block">diamond</span>
                <h3 className="font-serif text-lg sm:text-xl text-[var(--text-primary)] mb-2 font-normal">
                  Bespoke Jewelry On Order
                </h3>
                <p className="font-sans text-xs text-[var(--text-secondary)] mb-6 leading-relaxed font-light">
                  Looking for a custom design in this collection? Our master Dogra karigars craft bespoke pieces in 22K/18K/14K gold and 925 silver at our Jammu showroom.
                </p>
                <a
                  href="https://wa.me/919086098457?text=Namaste!%20I%20am%20interested%20in%20a%20custom%20piece%20from%20Ambika%20Jewels."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold-primary"
                >
                  <span className="material-symbols-outlined text-sm">chat_bubble</span>
                  INQUIRE ON WHATSAPP
                </a>
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
