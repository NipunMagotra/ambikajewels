import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import ProductDetailClient from '@/components/catalog/ProductDetailClient';
import ProductCard from '@/components/catalog/ProductCard';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockProducts } from '@/data/mockProducts';
import type { Product } from '@/types';
import Link from 'next/link';
import { siteConfig } from '@/config/siteConfig';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let prod: any = null;

  if (isSupabaseConfigured) {
    try {
      const { data } = await supabase.from('products').select('name, description, images, price').eq('slug', slug).single();
      if (data) prod = data;
      if (!prod) {
        const { data: dataById } = await supabase.from('products').select('name, description, images, price').eq('id', slug).single();
        if (dataById) prod = dataById;
      }
    } catch (e) {}
  }

  if (!prod) {
    prod = mockProducts.find((p) => p.slug === slug || p.id === slug);
  }
  
  if (!prod) return { title: 'Product Not Found | Ambika Jewels' };

  const baseUrl = siteConfig.websiteUrl || 'https://ambikajewelsonline.com';
  const canonicalUrl = `${baseUrl}/collections/${slug}`;
  const ogImage = (prod.images && prod.images.length > 0)
    ? (prod.images[0].startsWith('http') ? prod.images[0] : `${baseUrl}${prod.images[0]}`)
    : `${baseUrl}/hero-clean.png`;
  
  return {
    title: `${prod.name} | Ambika Jewels`,
    description: prod.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${prod.name} | Ambika Jewels`,
      description: prod.description,
      url: canonicalUrl,
      images: [
        {
          url: ogImage,
          alt: prod.name,
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${prod.name} | Ambika Jewels`,
      description: prod.description,
      images: [ogImage],
    }
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product: Product | undefined = undefined;

  if (isSupabaseConfigured) {
    try {
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
    } catch (e) {}
  }

  if (!product) {
    product = mockProducts.find((p) => p.slug === slug || p.id === slug);
  }

  if (!product) {
    notFound();
  }

  let relatedProducts: Product[] = [];
  if (isSupabaseConfigured) {
    try {
      const { data: dbRelated } = await supabase
        .from('products')
        .select('*')
        .eq('category', product.category)
        .neq('id', product.id)
        .limit(4);
      if (dbRelated && dbRelated.length > 0) relatedProducts = dbRelated as Product[];
    } catch (e) {}
  }

  if (relatedProducts.length === 0) {
    relatedProducts = mockProducts
      .filter((p) => p.id !== product!.id && (p.category === product!.category || p.collection === product!.collection))
      .slice(0, 4);
    if (relatedProducts.length === 0) {
      relatedProducts = mockProducts.filter((p) => p.id !== product!.id).slice(0, 4);
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 sm:pt-24 pb-20 lg:pb-28 bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
        
        {/* Breadcrumb Navigation */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-3 border-b border-[var(--border-subtle)] text-[10px] sm:text-[11px] font-sans text-[var(--text-tertiary)] flex items-center gap-2 uppercase tracking-wider">
          <Link href="/" className="hover:text-[var(--text-primary)]">HOME</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-[var(--text-primary)]">COLLECTIONS</Link>
          <span>/</span>
          <Link href={`/collections?category=${encodeURIComponent(product.category)}`} className="hover:text-[var(--text-primary)] truncate">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[var(--text-primary)] truncate font-medium">{product.name}</span>
        </div>

        {/* Private Showroom Product Experience */}
        <ProductDetailClient product={product} />

        {/* Curated Companions / Complete the Ensemble */}
        {relatedProducts.length > 0 && (
          <section className="container mx-auto px-4 sm:px-6 lg:px-12 mt-20 pt-16 border-t border-[var(--border-subtle)]">
            <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 sm:mb-12 gap-2">
              <div>
                <span className="text-[9.5px] font-sans tracking-[0.28em] uppercase text-[var(--accent-gold)] font-medium block mb-1.5">
                  ATELIER RECOMMENDATIONS
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)] font-normal tracking-tight">
                  Complete the Heirloom Ensemble
                </h2>
              </div>
              <Link
                href="/collections"
                className="text-[10.5px] font-sans tracking-[0.18em] uppercase text-[var(--text-primary)] hover:text-[var(--accent-gold)] font-medium underline underline-offset-4"
              >
                VIEW FULL ATELIER &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </section>
        )}

      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
