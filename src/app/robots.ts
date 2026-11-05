import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/siteConfig';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.websiteUrl || 'https://ambikajewelsonline.com';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/admin/', '/checkout/', '/order-status/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

