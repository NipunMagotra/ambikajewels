import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import ProductDetailClient from '@/components/catalog/ProductDetailClient';
import ProductCard from '@/components/catalog/ProductCard';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Product } from '@/types';
import Link from 'next/link';

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
  }
  if (!prod) prod = mockProducts.find(p => p.slug === slug);
  
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
  }

  if (!product) {
    product = mockProducts.find(p => p.slug === slug);
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

  if (relatedProducts.length === 0) {
    relatedProducts = mockProducts.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 4);
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 sm:pt-24 pb-24 lg:pb-section-gap">
        <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-1.5 font-label-caps text-[9px] sm:text-[10px] text-on-surface-variant mb-4 sm:mb-stack-md">
            <Link href="/" className="hover:text-primary">HOME</Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-primary">COLLECTIONS</Link>
            <span>/</span>
            <Link href={`/collections?category=${encodeURIComponent(product.category)}`} className="hover:text-primary">{product.category.toUpperCase()}</Link>
            <span>/</span>
            <span className="text-primary truncate max-w-[150px] sm:max-w-none">{product.name.toUpperCase()}</span>
          </div>

          <ProductDetailClient product={product as Product} />

          {/* Related Products */}
          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-12 sm:mt-section-gap">
              <h3 className="font-headline-md text-2xl lg:text- headline-md text-primary mb-6 sm:mb-stack-lg text-center">
                You May Also Desire
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-stack-md lg:gap-stack-lg">
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
