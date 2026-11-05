import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/config/siteConfig";

import { CartProvider } from "@/context/CartContext";
import ChatWidget from "@/components/chat/ChatWidget";
import ConsentBanner from "@/components/compliance/ConsentBanner";
import ToastNotification from "@/components/ui/ToastNotification";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.websiteUrl || 'https://ambikajewelsonline.com'),
  title: `${siteConfig.name} | Modern Heritage Fine Jewellery Jammu`,
  description: siteConfig.description,
  keywords: [
    "Dogra jewellery Jammu",
    "Dogri Jhumki",
    "Royal Dogri Naman Set",
    "22K Gold jewellery Jammu",
    "BIS Hallmarked gold",
    "Bridal couture jewellery Jammu",
    "Ambika Jewels Lower Roop Nagar",
    "925 silver jewellery Jammu"
  ],
  openGraph: {
    title: `${siteConfig.name} | Modern Heritage Fine Jewellery`,
    description: siteConfig.description,
    url: siteConfig.websiteUrl || 'https://ambikajewelsonline.com',
    siteName: siteConfig.name,
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/hero-clean.png',
        width: 1200,
        height: 630,
        alt: 'Ambika Jewels Fine Jewellery Showroom'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} | Modern Heritage Fine Jewellery`,
    description: siteConfig.description,
    images: ['/hero-clean.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jewelryStoreSchema = {
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  "name": siteConfig.name,
  "description": siteConfig.description,
  "image": `${siteConfig.websiteUrl || 'https://ambikajewelsonline.com'}/hero-clean.png`,
  "telephone": siteConfig.contact.phone,
  "email": siteConfig.contact.email,
  "url": siteConfig.websiteUrl || 'https://ambikajewelsonline.com',
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Shop no.3, E.W.S colony, Sector 1, Lower Roop Nagar",
    "addressLocality": siteConfig.city,
    "addressRegion": siteConfig.state,
    "postalCode": siteConfig.pincode,
    "addressCountry": "IN"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "10:00",
      "closes": "20:00"
    }
  ],
  "priceRange": "₹₹₹₹"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAF7F2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('ambika_theme');
                if (t === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                } else {
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jewelryStoreSchema) }}
        />
      </head>
      <body>
        <CartProvider>
          {children}
          <ToastNotification />
          <ChatWidget />
          <ConsentBanner />
        </CartProvider>
      </body>
    </html>
  );
}
