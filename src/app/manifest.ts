import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/siteConfig';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: 'Ambika Jewels',
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#140205',
    theme_color: '#4C111B',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml'
      }
    ]
  };
}
