import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/siteConfig';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.websiteUrl.replace(/\/$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/order-status',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

