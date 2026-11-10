import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/config/siteConfig";

import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import ChatWidget from "@/components/chat/ChatWidget";
import ConsentBanner from "@/components/compliance/ConsentBanner";
import ToastNotification from "@/components/ui/ToastNotification";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.websiteUrl),
  title: {
    default: `${siteConfig.name} | Dogra Heritage & Fine Jewellery in Jammu`,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: [
    "Ambika Jewels",
    "Dogra Heritage Jewellery",
    "Jammu Jewellery Showroom",
    "Dogri Jhumki",
    "Dogri Naman Choker",
    "22K BIS Hallmarked Gold",
    "Certified Diamond Jewellery",
    "925 Sterling Silver Jammu",
    "Lower Roop Nagar Jewellery"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: `${siteConfig.name} | Authentic Dogra Heritage & Fine Jewellery`,
    description: siteConfig.description,
    url: siteConfig.websiteUrl,
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/products/royal-kundan.png",
        width: 1200,
        height: 630,
        alt: "Ambika Jewels Fine Jewellery Collection"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Modern Heritage Fine Jewellery`,
    description: siteConfig.description,
    images: ["/products/royal-kundan.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FAF7F2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeJsonLd = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: siteConfig.name,
    legalName: siteConfig.legalBusinessName,
    url: siteConfig.websiteUrl,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Shop no.3, E.W.S colony, Sector 1, Lower Roop Nagar",
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.state,
      postalCode: siteConfig.pincode,
      addressCountry: "IN"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "32.7715891",
      longitude: "74.8304221"
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "10:00",
        closes: "20:00"
      }
    ],
    priceRange: "₹₹₹₹",
    paymentAccepted: "UPI, Cards, NetBanking, Razorpay",
    currenciesAccepted: "INR"
  };

  return (
    <html lang="en" className="light scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeJsonLd) }}
        />
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
      </head>
      <body>
        <CartProvider>
          <WishlistProvider>
            {children}
            <ToastNotification />
            <ChatWidget />
            <ConsentBanner />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
