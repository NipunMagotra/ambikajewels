import type { Product } from '@/types';

export const mockProducts: Product[] = [
  // 1. BRIDAL COUTURE
  {
    id: 'b1',
    name: 'Royal Dogra Kundan Bridal Set',
    slug: 'royal-dogra-kundan-bridal-set',
    description: 'Exquisite 22K gold Kundan choker set encrusted with uncut Polki diamonds and natural emerald drops. Handcrafted by Jammu karigars.',
    price: 35000000, // ₹3,50,000
    display_price: '₹3,50,000',
    category: 'Bridal Couture',
    images: [
      '/products/royal-kundan.png',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
    ],
    badges: ['22K BIS', 'BRIDAL', 'POLKI'],
    metal_finishes: ['Gold', 'Antique Gold'],
    stock_status: 'in_stock',
    is_featured: true,
    collection: 'Bridal Couture',
    craftsmanship_story: 'Sculpted over 120 hours using heritage Meenakari enamel and Kundan setting techniques.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'b2',
    name: 'Maharani Polki Bridal Haathphool & Choker',
    slug: 'maharani-polki-bridal-haathphool-choker',
    description: 'Grand royal bridal set with matching haathphool, crafted in 22K hallmarked gold with certified uncut diamonds.',
    price: 48000000, // ₹4,80,000
    display_price: '₹4,80,000',
    category: 'Bridal Couture',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
      '/products/royal-kundan.png'
    ],
    badges: ['22K BIS', 'LIMITED EDITION'],
    metal_finishes: ['Gold'],
    stock_status: 'in_stock',
    is_featured: true,
    collection: 'Bridal Couture',
    craftsmanship_story: 'Inspired by ancient Dogra royal court jewels.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'b3',
    name: 'Heritage Ruby & Polki Bridal Haar',
    slug: 'heritage-ruby-polki-bridal-haar',
    description: 'Long royal bridal necklace adorned with Burmese rubies, freshwater pearls, and 22K gold Polki setting.',
    price: 29000000, // ₹2,90,000
    display_price: '₹2,90,000',
    category: 'Bridal Couture',
    images: [
      'https://images.unsplash.com/photo-1611591475140-e3e78f993d01?auto=format&fit=crop&w=800&q=80'
    ],
    badges: ['22K BIS', 'BURMESE RUBY'],
    metal_finishes: ['Gold', 'Rose Gold'],
    stock_status: 'in_stock',
    is_featured: false,
    collection: 'Bridal Couture',
    craftsmanship_story: 'Features delicate hand-carved floral links in pure gold.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // 2. NECKLACES
  {
    id: 'n1',
    name: 'Vintage Emerald Filigree Necklace',
    slug: 'vintage-emerald-filigree-necklace',
    description: 'Delicate 22K gold filigree necklace centered around a vivid Zambian emerald drop.',
    price: 18500000, // ₹1,85,000
    display_price: '₹1,85,000',
    category: 'Necklaces',
    images: [
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80'
    ],
    badges: ['22K BIS', 'BESTSELLER'],
    metal_finishes: ['Gold', 'Silver'],
    stock_status: 'in_stock',
    is_featured: true,
    collection: 'Signature Necklaces',
    craftsmanship_story: 'Handcrafted wire filigree technique passed down through generations.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'n2',
    name: 'Traditional Guluband Gold Choker',
    slug: 'traditional-guluband-gold-choker',
    description: 'Authentic 22K Dogra Guluband choker with intricate gold bead work and adjustable silk cord.',
    price: 14500000, // ₹1,45,000
    display_price: '₹1,45,000',
    category: 'Necklaces',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
    ],
    badges: ['22K BIS', 'HERITAGE'],
    metal_finishes: ['Gold'],
    stock_status: 'in_stock',
    is_featured: true,
    collection: 'Signature Necklaces',
    craftsmanship_story: 'Classical Dogra design worn during regional celebrations.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'n3',
    name: 'Solitaire Diamond Pendant Necklace',
    slug: 'solitaire-diamond-pendant-necklace',
    description: '18K white and yellow gold chain featuring a certified VVS1 solitaire diamond.',
    price: 9500000, // ₹95,000
    display_price: '₹95,000',
    category: 'Necklaces',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80'
    ],
    badges: ['18K GIA', 'SOLITAIRE'],
    metal_finishes: ['Gold', 'White Gold', 'Rose Gold'],
    stock_status: 'in_stock',
    is_featured: false,
    collection: 'Daily Luxury',
    craftsmanship_story: 'Minimalist modern setting designed for everyday elegance.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // 3. EARRINGS
  {
    id: 'e1',
    name: 'Kundan Polki Chandbali Earrings',
    slug: 'kundan-polki-chandbali-earrings',
    description: 'Statement crescent Chandbali earrings set in 22K gold with pearl tassels and ruby accents.',
    price: 8500000, // ₹85,000
    display_price: '₹85,000',
    category: 'Earrings',
    images: [
      '/products/kundan-chandbali.png',
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80'
    ],
    badges: ['22K BIS', 'MUST HAVE'],
    metal_finishes: ['Gold', 'Antique Gold'],
    stock_status: 'in_stock',
    is_featured: true,
    collection: 'Artisanal Earrings',
    craftsmanship_story: 'Handcrafted Chandbali silhouette featuring intricate Meenakari backing.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'e2',
    name: 'Classic Gold Jhumkas with Pearl Drops',
    slug: 'classic-gold-jhumkas-pearl-drops',
    description: 'Timeless 22K gold dome Jhumkas with carved floral tops and hanging seed pearls.',
    price: 6800000, // ₹68,000
    display_price: '₹68,000',
    category: 'Earrings',
    images: [
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=800&q=80'
    ],
    badges: ['22K BIS'],
    metal_finishes: ['Gold'],
    stock_status: 'in_stock',
    is_featured: true,
    collection: 'Artisanal Earrings',
    craftsmanship_story: 'Precision gold wire lattice crafted by Jammu master goldsmiths.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'e3',
    name: 'Emerald Cut Diamond Studs',
    slug: 'emerald-cut-diamond-studs',
    description: 'Pair of certified VVS emerald cut solitaire diamond studs set in 18K yellow gold.',
    price: 11000000, // ₹1,10,000
    display_price: '₹1,10,000',
    category: 'Earrings',
    images: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80'
    ],
    badges: ['18K GIA', 'SOLITAIRE'],
    metal_finishes: ['Gold', 'White Gold'],
    stock_status: 'in_stock',
    is_featured: false,
    collection: 'Daily Luxury',
    craftsmanship_story: 'Ultra-clear emerald cut solitaire setting.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // 4. TEMPLE JEWELRY
  {
    id: 't1',
    name: 'Lakshmi Nakshi 22K Temple Necklace',
    slug: 'lakshmi-nakshi-22k-temple-necklace',
    description: 'Heavy 22K gold Nakshi temple necklace depicting Goddess Lakshmi surrounded by divine motifs and rubies.',
    price: 24000000, // ₹2,40,000
    display_price: '₹2,40,000',
    category: 'Temple Jewelry',
    images: [
      '/products/temple-lakshmi.png',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80'
    ],
    badges: ['22K BIS', 'HAND CARVED'],
    metal_finishes: ['Gold', 'Antique Gold'],
    stock_status: 'in_stock',
    is_featured: true,
    collection: 'Temple Jewelry',
    craftsmanship_story: 'Three-dimensional Nakshi hand-embossing by master artisans.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 't2',
    name: 'Antique Peacock Temple Kada',
    slug: 'antique-peacock-temple-kada',
    description: 'Single heavy 22K gold temple Kada featuring intricate carved peacock heads with ruby eyes.',
    price: 13500000, // ₹1,35,000
    display_price: '₹1,35,000',
    category: 'Temple Jewelry',
    images: [
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80'
    ],
    badges: ['22K BIS', 'ANTIQUE'],
    metal_finishes: ['Antique Gold'],
    stock_status: 'in_stock',
    is_featured: true,
    collection: 'Temple Jewelry',
    craftsmanship_story: 'Solid gold cast and hand-chiselled with sacred temple iconography.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // 5. BANGLES & BRACELETS
  {
    id: 'bg1',
    name: 'Kundan & Meenakari Gold Bangles (Pair)',
    slug: 'kundan-meenakari-gold-bangles-pair',
    description: 'Pair of 22K hallmarked gold openable Kadas with Kundan inlay and peacock green Meenakari work.',
    price: 17500000, // ₹1,75,000
    display_price: '₹1,75,000',
    category: 'Bangles & Bracelets',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
    ],
    badges: ['22K BIS', 'PAIR'],
    metal_finishes: ['Gold'],
    stock_status: 'in_stock',
    is_featured: true,
    collection: 'Bangles & Bracelets',
    craftsmanship_story: 'Precision screw lock mechanism with Meenakari detailing.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'bg2',
    name: 'Diamond Tennis Bracelet in 18K Gold',
    slug: 'diamond-tennis-bracelet-18k-gold',
    description: 'Sleek 18K yellow gold tennis bracelet linked with 3.5 carats of round brilliant diamonds.',
    price: 19500000, // ₹1,95,000
    display_price: '₹1,95,000',
    category: 'Bangles & Bracelets',
    images: [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80'
    ],
    badges: ['18K GIA', 'LUXURY'],
    metal_finishes: ['Gold', 'White Gold', 'Rose Gold'],
    stock_status: 'in_stock',
    is_featured: false,
    collection: 'Daily Luxury',
    craftsmanship_story: 'Flexible 4-prong diamond setting.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // 6. RINGS
  {
    id: 'r1',
    name: 'Navratna Royal Gold Ring',
    slug: 'navratna-royal-gold-ring',
    description: '22K gold ring set with nine sacred precious gems arranged in traditional astrological harmony.',
    price: 6500000, // ₹65,000
    display_price: '₹65,000',
    category: 'Rings',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'
    ],
    badges: ['22K BIS', 'NAVRATNA'],
    metal_finishes: ['Gold'],
    stock_status: 'in_stock',
    is_featured: true,
    collection: 'Daily Luxury',
    craftsmanship_story: 'Nine natural certified gemstones set in sacred geometric pattern.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'r2',
    name: 'Solitaire Diamond Engagement Ring',
    slug: 'solitaire-diamond-engagement-ring',
    description: '1.2 Carat certified VVS1 round solitaire diamond set on a 18K gold band.',
    price: 16000000, // ₹1,60,000
    display_price: '₹1,60,000',
    category: 'Rings',
    images: [
      'https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=800&q=80'
    ],
    badges: ['18K GIA', 'SOLITAIRE'],
    metal_finishes: ['Gold', 'White Gold', 'Rose Gold'],
    stock_status: 'in_stock',
    is_featured: true,
    collection: 'Daily Luxury',
    craftsmanship_story: 'Hand-polished 6-claw solitaire setting.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // 7. DAILY LUXURY
  {
    id: 'd1',
    name: 'Minimalist 22K Gold Chain',
    slug: 'minimalist-22k-gold-chain',
    description: 'Smooth 22K hallmarked gold rope chain designed for light everyday wear.',
    price: 4500000, // ₹45,000
    display_price: '₹45,000',
    category: 'Daily Luxury',
    images: [
      'https://images.unsplash.com/photo-1611591475140-e3e78f993d01?auto=format&fit=crop&w=800&q=80'
    ],
    badges: ['22K BIS', 'ESSENTIAL'],
    metal_finishes: ['Gold'],
    stock_status: 'in_stock',
    is_featured: false,
    collection: 'Daily Luxury',
    craftsmanship_story: 'Interlocking 22K links polished for smooth skin contact.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'd2',
    name: 'Pearl & Gold Sleek Bracelet',
    slug: 'pearl-gold-sleek-bracelet',
    description: 'Fine 18K gold chain accented with natural South Sea cultured pearls.',
    price: 3200000, // ₹32,000
    display_price: '₹32,000',
    category: 'Daily Luxury',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80'
    ],
    badges: ['18K GOLD', 'PEARL'],
    metal_finishes: ['Gold', 'Rose Gold'],
    stock_status: 'in_stock',
    is_featured: false,
    collection: 'Daily Luxury',
    craftsmanship_story: 'Selected uniform grade South Sea pearls.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // 8. MEN'S ACCESSORIES
  {
    id: 'm1',
    name: 'Royal Dogra 22K Gold Cufflinks',
    slug: 'royal-dogra-22k-gold-cufflinks',
    description: 'Solid 22K gold cufflinks engraved with Jammu royal lion insignia and ruby center.',
    price: 7800000, // ₹78,000
    display_price: '₹78,000',
    category: "Men's Accessories",
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'
    ],
    badges: ['22K BIS', "MEN'S"],
    metal_finishes: ['Gold', 'Silver'],
    stock_status: 'in_stock',
    is_featured: true,
    collection: "Men's Accessories",
    craftsmanship_story: 'Hand-engraved royal emblem with swivel back closure.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'm2',
    name: 'Solid 22K Gold Men\'s Kada',
    slug: 'solid-22k-gold-mens-kada',
    description: 'Heavy masculine 22K solid gold Kada featuring grooved bevel edges.',
    price: 21000000, // ₹2,10,000
    display_price: '₹2,10,000',
    category: "Men's Accessories",
    images: [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80'
    ],
    badges: ['22K BIS', 'HEAVY GOLD'],
    metal_finishes: ['Gold'],
    stock_status: 'in_stock',
    is_featured: true,
    collection: "Men's Accessories",
    craftsmanship_story: 'Cast in 45 grams of solid 22K hallmarked gold.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];
