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
    const { data } = await supabase.from('products').select('name, description, images, price').eq('slug', slug).single();
    if (data) prod = data;
    if (!prod) {
      const { data: dataById } = await supabase.from('products').select('name, description, images, price').eq('id', slug).single();
      if (dataById) prod = dataById;
    }
  }
  // F5: Fallback to mockProducts only if enabled
  if (!prod && siteConfig.features.useMockProductsFallback) {
    prod = mockProducts.find(p => p.slug === slug || p.id === slug);
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

  const baseUrl = siteConfig.websiteUrl || 'https://ambikajewelsonline.com';
  const productImageUrl = (product.images && product.images.length > 0)
    ? (product.images[0].startsWith('http') ? product.images[0] : `${baseUrl}${product.images[0]}`)
    : `${baseUrl}/hero-clean.png`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": (product.images && product.images.length > 0)
      ? product.images.map(img => img.startsWith('http') ? img : `${baseUrl}${img}`)
      : [productImageUrl],
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "Ambika Jewels"
    },
    "material": product.material || "22K Solid Gold",
    "offers": {
      "@type": "Offer",
      "url": `${baseUrl}/collections/${product.slug || product.id}`,
      "priceCurrency": "INR",
      "price": Math.round((product.price || 0) / 100),
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock_status === 'out_of_stock'
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": siteConfig.name
      }
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Collections",
        "item": `${baseUrl}/collections`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.category,
        "item": `${baseUrl}/collections?category=${encodeURIComponent(product.category)}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": product.name,
        "item": `${baseUrl}/collections/${product.slug || product.id}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header />
      <main className="min-h-screen pt-20 sm:pt-24 pb-20 lg:pb-16 bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
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
