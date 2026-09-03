import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "@/config/siteConfig";

import { CartProvider } from "@/context/CartContext";
import ChatWidget from "@/components/chat/ChatWidget";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Modern Heritage`,
  description: siteConfig.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0d0707",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body>
        <CartProvider>
          {children}
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}
