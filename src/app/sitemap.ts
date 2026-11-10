import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/siteConfig';
import { mockProducts } from '@/data/mockProducts';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Product } from '@/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.websiteUrl.replace(/\/$/, '');
  const now = new Date();

  // 1. Static Pages
  const staticRoutes = [
    '',
    '/collections',
    '/about',
    '/services',
    '/contact',
    '/track',
    '/seller-info',
    '/authenticity',
    '/privacy-policy',
    '/terms',
    '/refund-policy',
    '/shipping-policy',
    '/exchange-policy',
    '/custom-orders-policy',
    '/grievance-policy',
    '/wishlist',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? ('daily' as const) : ('weekly' as const),
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Category Collection URLs
  const categoryRoutes = siteConfig.categories.map((cat) => ({
    url: `${baseUrl}/collections?category=${encodeURIComponent(cat)}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // 3. Product Detail URLs
  let products: Product[] = [];
  if (isSupabaseConfigured) {
    try {
      const { data } = await supabase.from('products').select('*');
      if (data && data.length > 0) {
        products = data as Product[];
      }
    } catch {
      // fallback
    }
  }

  if (products.length === 0) {
    products = mockProducts;
  }

  const productRoutes = products.map((prod) => ({
    url: `${baseUrl}/collections/${prod.slug || prod.id}`,
    lastModified: new Date(prod.updated_at || now),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}

