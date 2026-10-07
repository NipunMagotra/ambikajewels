import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import ProductDetailClient from '@/components/catalog/ProductDetailClient';
import ProductCard from '@/components/catalog/ProductCard';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Product } from '@/types';
import Link from 'next/link';

import { siteConfig } from '@/config/siteConfig';
import { mockProducts } from '@/data/mockProducts';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  let prod: any = null;
  if (isSupabaseConfigured) {
    const { data } = await supabase.from('products').select('name, description').eq('slug', slug).single();
    if (data) prod = data;
    if (!prod) {
      const { data: dataById } = await supabase.from('products').select('name, description').eq('id', slug).single();
      if (dataById) prod = dataById;
    }
  }
  // F5: Fallback to mockProducts only if enabled
  if (!prod && siteConfig.features.useMockProductsFallback) {
    prod = mockProducts.find(p => p.slug === slug || p.id === slug);
  }
  
  if (!prod) return { title: 'Product Not Found' };
  
  return {
    title: `${prod.name} | Ambika Jewels`,
    description: prod.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  let product: Product | undefined = undefined;

  if (isSupabaseConfigured) {
    const { data: dbProduct } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();
    if (dbProduct) product = dbProduct as Product;
    if (!product) {
      const { data: dbById } = await supabase
        .from('products')
        .select('*')
        .eq('id', slug)
        .single();
      if (dbById) product = dbById as Product;
    }
  }

  // F5: Fallback to mockProducts only if enabled
  if (!product && siteConfig.features.useMockProductsFallback) {
    product = mockProducts.find(p => p.slug === slug || p.id === slug);
  }

  if (!product) {
    notFound();
  }

  let relatedProducts: Product[] = [];
  if (isSupabaseConfigured) {
    const { data: dbRelated } = await supabase
      .from('products')
      .select('*')
      .eq('category', product.category)
      .neq('id', product.id)
      .limit(4);
    if (dbRelated && dbRelated.length > 0) relatedProducts = dbRelated as Product[];
  }

  // F5: Fallback to mockProducts only if enabled
  if (relatedProducts.length === 0 && siteConfig.features.useMockProductsFallback) {
    relatedProducts = mockProducts.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 4);
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 sm:pt-32 pb-20 lg:pb-16 bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
        <div className="container mx-auto px-3 sm:px-margin-mobile lg:px-margin-desktop">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-1.5 font-sans text-[9px] sm:text-[10px] text-[var(--text-secondary)] mb-4 uppercase tracking-wider font-medium">
            <Link href="/" className="hover:text-[var(--accent-gold)] transition-colors">HOME</Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-[var(--accent-gold)] transition-colors">COLLECTIONS</Link>
            <span>/</span>
            <Link href={`/collections?category=${encodeURIComponent(product.category)}`} className="hover:text-[var(--accent-gold)] transition-colors">{product.category.toUpperCase()}</Link>
            <span>/</span>
            <span className="text-[var(--accent-gold)] truncate max-w-[150px] sm:max-w-none">{product.name.toUpperCase()}</span>
          </div>

          <ProductDetailClient product={product as Product} />

          {/* Related Products: You May Also Desire */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-10 sm:mt-14 border-t border-[var(--border-subtle)] pt-8 sm:pt-10">
              <div className="text-center mb-6 sm:mb-8">
                <span className="font-sans text-[9px] sm:text-[10px] text-[var(--accent-gold)] tracking-[0.3em] uppercase block mb-1 font-semibold">
                  COMPLETE THE ENSEMBLE
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[var(--text-primary)] font-normal">
                  You May Also Desire
                </h3>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {relatedProducts.map(p => (
                  <ProductCard key={p.id} product={p as Product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
