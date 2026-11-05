-- ============================================================================
-- Ambika Jewels — Complete 16-Product Catalog Migration (Idempotent)
-- Generated automatically by scripts/prepare-complete-catalog.mjs
-- ============================================================================

INSERT INTO products (
  name, slug, description, price, display_price, category, images, badges, metal_finishes, stock_status, is_featured, collection, craftsmanship_story
) VALUES (
  'Authentic 22K Dogri Jhumki',
  'authentic-22k-dogri-jhumki',
  'Iconic Dogri Jhumki sculpted in authentic 22K BIS hallmarked gold with traditional Jammu umbrella filigree and pearl droplet tassels.',
  9500000,
  '₹95,000',
  'Dogra Heritage Collection',
  ARRAY['/products/kundan-chandbali.png', 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=800&q=80'],
  ARRAY['22K BIS', 'DOGRA HERITAGE', 'TOP SELLER'],
  ARRAY['Gold', 'Antique Gold'],
  'in_stock',
  true,
  'Dogra Heritage Collection',
  'Handcrafted signature Dogra Jhumki worn by brides across Jammu region since generations.'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  display_price = EXCLUDED.display_price,
  category = EXCLUDED.category,
  images = EXCLUDED.images,
  badges = EXCLUDED.badges,
  metal_finishes = EXCLUDED.metal_finishes,
  stock_status = EXCLUDED.stock_status,
  is_featured = EXCLUDED.is_featured,
  collection = EXCLUDED.collection,
  craftsmanship_story = EXCLUDED.craftsmanship_story,
  updated_at = NOW();

INSERT INTO products (
  name, slug, description, price, display_price, category, images, badges, metal_finishes, stock_status, is_featured, collection, craftsmanship_story
) VALUES (
  'Royal Dogri Naman Set',
  'royal-dogri-naman-set',
  'Sacred 22K gold Dogri Naman necklace set intricately engraved with traditional floral medallions and natural Burmese rubies.',
  26000000,
  '₹2,60,000',
  'Dogra Heritage Collection',
  ARRAY['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80', '/products/royal-kundan.png'],
  ARRAY['22K BIS', 'DOGRI NAMAN', 'SIGNATURE'],
  ARRAY['Gold'],
  'in_stock',
  true,
  'Dogra Heritage Collection',
  'Authentic Jammu Dogri Naman design preserved and handcrafted by master karigars.'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  display_price = EXCLUDED.display_price,
  category = EXCLUDED.category,
  images = EXCLUDED.images,
  badges = EXCLUDED.badges,
  metal_finishes = EXCLUDED.metal_finishes,
  stock_status = EXCLUDED.stock_status,
  is_featured = EXCLUDED.is_featured,
  collection = EXCLUDED.collection,
  craftsmanship_story = EXCLUDED.craftsmanship_story,
  updated_at = NOW();

INSERT INTO products (
  name, slug, description, price, display_price, category, images, badges, metal_finishes, stock_status, is_featured, collection, craftsmanship_story
) VALUES (
  'Heritage Dogri Long Set',
  'heritage-dogri-long-set',
  'Grand royal Dogri Long Haar featuring multi-layer 22K gold bead strands and a central relief pendant with Meenakari backing.',
  32000000,
  '₹3,20,000',
  'Dogra Heritage Collection',
  ARRAY['/products/heritage-ruby-haar.png', '/products/temple-lakshmi.png'],
  ARRAY['22K BIS', 'DOGRI LONG HAAR', 'BRIDAL'],
  ARRAY['Gold', 'Antique Gold'],
  'in_stock',
  true,
  'Dogra Heritage Collection',
  'A staple of Dogra heritage bridal trousseaus crafted over 100 hours of artisanal embossing.'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  display_price = EXCLUDED.display_price,
  category = EXCLUDED.category,
  images = EXCLUDED.images,
  badges = EXCLUDED.badges,
  metal_finishes = EXCLUDED.metal_finishes,
  stock_status = EXCLUDED.stock_status,
  is_featured = EXCLUDED.is_featured,
  collection = EXCLUDED.collection,
  craftsmanship_story = EXCLUDED.craftsmanship_story,
  updated_at = NOW();

INSERT INTO products (
  name, slug, description, price, display_price, category, images, badges, metal_finishes, stock_status, is_featured, collection, craftsmanship_story
) VALUES (
  'Royal Dogra Kundan Bridal Set',
  'royal-dogra-kundan-bridal-set',
  'Exquisite 22K gold Kundan choker set encrusted with natural uncut Polki diamonds and natural emerald drops.',
  35000000,
  '₹3,50,000',
  'Bridal Couture',
  ARRAY['/products/royal-kundan.png', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'],
  ARRAY['22K BIS', 'BRIDAL', 'POLKI'],
  ARRAY['Gold', 'Antique Gold'],
  'in_stock',
  true,
  'Bridal Couture',
  'Sculpted over 120 hours using heritage Meenakari enamel and Kundan setting techniques.'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  display_price = EXCLUDED.display_price,
  category = EXCLUDED.category,
  images = EXCLUDED.images,
  badges = EXCLUDED.badges,
  metal_finishes = EXCLUDED.metal_finishes,
  stock_status = EXCLUDED.stock_status,
  is_featured = EXCLUDED.is_featured,
  collection = EXCLUDED.collection,
  craftsmanship_story = EXCLUDED.craftsmanship_story,
  updated_at = NOW();

INSERT INTO products (
  name, slug, description, price, display_price, category, images, badges, metal_finishes, stock_status, is_featured, collection, craftsmanship_story
) VALUES (
  'Maharani Polki Bridal Haathphool & Choker',
  'maharani-polki-bridal-haathphool-choker',
  'Grand royal bridal set with matching haathphool, crafted in 22K hallmarked gold with certified uncut diamonds.',
  48000000,
  '₹4,80,000',
  'Bridal Couture',
  ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', '/products/royal-kundan.png'],
  ARRAY['22K BIS', 'LIMITED EDITION'],
  ARRAY['Gold'],
  'in_stock',
  true,
  'Bridal Couture',
  'Inspired by ancient Dogra royal court jewels.'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  display_price = EXCLUDED.display_price,
  category = EXCLUDED.category,
  images = EXCLUDED.images,
  badges = EXCLUDED.badges,
  metal_finishes = EXCLUDED.metal_finishes,
  stock_status = EXCLUDED.stock_status,
  is_featured = EXCLUDED.is_featured,
  collection = EXCLUDED.collection,
  craftsmanship_story = EXCLUDED.craftsmanship_story,
  updated_at = NOW();

INSERT INTO products (
  name, slug, description, price, display_price, category, images, badges, metal_finishes, stock_status, is_featured, collection, craftsmanship_story
) VALUES (
  '18K Gold Solitaire Diamond Engagement Ring',
  '18k-gold-solitaire-diamond-engagement-ring',
  '1.2 Carat certified natural VVS1 round solitaire diamond set on a hallmarked 18K solid yellow gold band with GIA certification.',
  16000000,
  '₹1,60,000',
  'Diamond Jewellery',
  ARRAY['https://images.unsplash.com/photo-1603561596112-0a132b757442?auto=format&fit=crop&w=800&q=80'],
  ARRAY['18K GIA', 'CERTIFIED DIAMOND'],
  ARRAY['Gold', 'White Gold', 'Rose Gold'],
  'in_stock',
  true,
  'Diamond Jewellery',
  'Hand-polished 6-claw solitaire setting in 18K hallmarked gold.'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  display_price = EXCLUDED.display_price,
  category = EXCLUDED.category,
  images = EXCLUDED.images,
  badges = EXCLUDED.badges,
  metal_finishes = EXCLUDED.metal_finishes,
  stock_status = EXCLUDED.stock_status,
  is_featured = EXCLUDED.is_featured,
  collection = EXCLUDED.collection,
  craftsmanship_story = EXCLUDED.craftsmanship_story,
  updated_at = NOW();

INSERT INTO products (
  name, slug, description, price, display_price, category, images, badges, metal_finishes, stock_status, is_featured, collection, craftsmanship_story
) VALUES (
  '14K Gold Diamond Tennis Bracelet',
  '14k-gold-diamond-tennis-bracelet',
  'Sleek 14K yellow gold tennis bracelet linked with 2.8 carats of natural round brilliant diamonds.',
  13500000,
  '₹1,35,000',
  'Diamond Jewellery',
  ARRAY['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80'],
  ARRAY['14K GOLD', 'CERTIFIED'],
  ARRAY['Gold', 'Rose Gold'],
  'in_stock',
  false,
  'Diamond Jewellery',
  'Flexible 4-prong diamond setting designed in durable 14K gold.'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  display_price = EXCLUDED.display_price,
  category = EXCLUDED.category,
  images = EXCLUDED.images,
  badges = EXCLUDED.badges,
  metal_finishes = EXCLUDED.metal_finishes,
  stock_status = EXCLUDED.stock_status,
  is_featured = EXCLUDED.is_featured,
  collection = EXCLUDED.collection,
  craftsmanship_story = EXCLUDED.craftsmanship_story,
  updated_at = NOW();

INSERT INTO products (
  name, slug, description, price, display_price, category, images, badges, metal_finishes, stock_status, is_featured, collection, craftsmanship_story
) VALUES (
  '18K Gold Emerald Cut Diamond Studs',
  '18k-gold-emerald-cut-diamond-studs',
  'Pair of certified natural VVS emerald cut solitaire diamond studs set in 18K solid yellow gold.',
  11000000,
  '₹1,10,000',
  'Diamond Jewellery',
  ARRAY['https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80'],
  ARRAY['18K GIA', 'SOLITAIRE'],
  ARRAY['Gold', 'White Gold'],
  'in_stock',
  false,
  'Diamond Jewellery',
  'Ultra-clear emerald cut solitaire setting in 18K gold.'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  display_price = EXCLUDED.display_price,
  category = EXCLUDED.category,
  images = EXCLUDED.images,
  badges = EXCLUDED.badges,
  metal_finishes = EXCLUDED.metal_finishes,
  stock_status = EXCLUDED.stock_status,
  is_featured = EXCLUDED.is_featured,
  collection = EXCLUDED.collection,
  craftsmanship_story = EXCLUDED.craftsmanship_story,
  updated_at = NOW();

INSERT INTO products (
  name, slug, description, price, display_price, category, images, badges, metal_finishes, stock_status, is_featured, collection, craftsmanship_story
) VALUES (
  '925 Sterling Silver Antique Oxidized Choker',
  '925-sterling-silver-antique-oxidized-choker',
  'Artisanal 925 hallmarked sterling silver tribal choker with ghungroo bells and traditional oxidized finish.',
  1850000,
  '₹18,500',
  'Silver Jewellery (925)',
  ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'],
  ARRAY['925 SILVER', 'HANDMADE'],
  ARRAY['Silver'],
  'in_stock',
  true,
  'Silver Jewellery (925)',
  'Hand-hammered 925 sterling silver with authentic antique patina.'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  display_price = EXCLUDED.display_price,
  category = EXCLUDED.category,
  images = EXCLUDED.images,
  badges = EXCLUDED.badges,
  metal_finishes = EXCLUDED.metal_finishes,
  stock_status = EXCLUDED.stock_status,
  is_featured = EXCLUDED.is_featured,
  collection = EXCLUDED.collection,
  craftsmanship_story = EXCLUDED.craftsmanship_story,
  updated_at = NOW();

INSERT INTO products (
  name, slug, description, price, display_price, category, images, badges, metal_finishes, stock_status, is_featured, collection, craftsmanship_story
) VALUES (
  '925 Silver Dogri Style Payal (Pair)',
  '925-silver-dogri-style-payal-pair',
  'Traditional 925 hallmarked silver anklet pair with carved floral links and delicate bell chimes.',
  1250000,
  '₹12,500',
  'Silver Jewellery (925)',
  ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'],
  ARRAY['925 SILVER', 'TRADITIONAL'],
  ARRAY['Silver'],
  'in_stock',
  false,
  'Silver Jewellery (925)',
  'Authentic traditional Dogri silver payal crafted in 925 silver.'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  display_price = EXCLUDED.display_price,
  category = EXCLUDED.category,
  images = EXCLUDED.images,
  badges = EXCLUDED.badges,
  metal_finishes = EXCLUDED.metal_finishes,
  stock_status = EXCLUDED.stock_status,
  is_featured = EXCLUDED.is_featured,
  collection = EXCLUDED.collection,
  craftsmanship_story = EXCLUDED.craftsmanship_story,
  updated_at = NOW();

INSERT INTO products (
  name, slug, description, price, display_price, category, images, badges, metal_finishes, stock_status, is_featured, collection, craftsmanship_story
) VALUES (
  '22K Gold Traditional Guluband Choker',
  '22k-gold-traditional-guluband-choker',
  'Authentic 22K Dogra Guluband choker with intricate gold bead work and adjustable silk cord.',
  14500000,
  '₹1,45,000',
  'Gold Jewellery',
  ARRAY['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'],
  ARRAY['22K BIS', 'HERITAGE'],
  ARRAY['Gold'],
  'in_stock',
  true,
  'Gold Jewellery',
  'Classical Dogra 22K gold design.'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  display_price = EXCLUDED.display_price,
  category = EXCLUDED.category,
  images = EXCLUDED.images,
  badges = EXCLUDED.badges,
  metal_finishes = EXCLUDED.metal_finishes,
  stock_status = EXCLUDED.stock_status,
  is_featured = EXCLUDED.is_featured,
  collection = EXCLUDED.collection,
  craftsmanship_story = EXCLUDED.craftsmanship_story,
  updated_at = NOW();

INSERT INTO products (
  name, slug, description, price, display_price, category, images, badges, metal_finishes, stock_status, is_featured, collection, craftsmanship_story
) VALUES (
  '14K Gold Lightweight Daily Pendant Chain',
  '14k-gold-lightweight-daily-pendant-chain',
  'Smooth 14K hallmarked gold delicate chain with a minimalist geometric gold pendant designed for daily office wear.',
  2800000,
  '₹28,000',
  'Gold Jewellery',
  ARRAY['/products/minimalist-gold-chain.png'],
  ARRAY['14K BIS', 'EVERYDAY WEAR'],
  ARRAY['Gold', 'Rose Gold'],
  'in_stock',
  false,
  'Gold Jewellery',
  'Durable 14K gold alloy engineered for daily active wear.'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  display_price = EXCLUDED.display_price,
  category = EXCLUDED.category,
  images = EXCLUDED.images,
  badges = EXCLUDED.badges,
  metal_finishes = EXCLUDED.metal_finishes,
  stock_status = EXCLUDED.stock_status,
  is_featured = EXCLUDED.is_featured,
  collection = EXCLUDED.collection,
  craftsmanship_story = EXCLUDED.craftsmanship_story,
  updated_at = NOW();

INSERT INTO products (
  name, slug, description, price, display_price, category, images, badges, metal_finishes, stock_status, is_featured, collection, craftsmanship_story
) VALUES (
  '9K Gold Sleek Stacking Ring',
  '9k-gold-sleek-stacking-ring',
  'Minimalist 9K solid gold stackable band with micro-diamond accents.',
  1200000,
  '₹12,000',
  'Gold Jewellery',
  ARRAY['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'],
  ARRAY['9K GOLD', 'AFFORDABLE LUXURY'],
  ARRAY['Gold', 'Rose Gold'],
  'in_stock',
  false,
  'Gold Jewellery',
  'Ultra-lightweight 9K solid gold band.'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  display_price = EXCLUDED.display_price,
  category = EXCLUDED.category,
  images = EXCLUDED.images,
  badges = EXCLUDED.badges,
  metal_finishes = EXCLUDED.metal_finishes,
  stock_status = EXCLUDED.stock_status,
  is_featured = EXCLUDED.is_featured,
  collection = EXCLUDED.collection,
  craftsmanship_story = EXCLUDED.craftsmanship_story,
  updated_at = NOW();

INSERT INTO products (
  name, slug, description, price, display_price, category, images, badges, metal_finishes, stock_status, is_featured, collection, craftsmanship_story
) VALUES (
  'Custom Bespoke Gold Jewellery Service',
  'custom-bespoke-gold-jewellery-service',
  'Share your sketch or photo on WhatsApp (+91 9086098457). Our master karigars will create a 3D CAD design and craft your custom 22K/18K gold piece.',
  5000000,
  '₹50,000 (Advance Booking)',
  'Gold Exchange & Custom',
  ARRAY['/products/temple-lakshmi.png', '/products/royal-kundan.png'],
  ARRAY['BESPOKE 3D CAD', 'GOLD EXCHANGE'],
  ARRAY['Gold', 'Antique Gold', 'White Gold'],
  'in_stock',
  true,
  'Gold Exchange & Custom',
  'We melt your old family gold and transform it into modern custom heirloom pieces.'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  display_price = EXCLUDED.display_price,
  category = EXCLUDED.category,
  images = EXCLUDED.images,
  badges = EXCLUDED.badges,
  metal_finishes = EXCLUDED.metal_finishes,
  stock_status = EXCLUDED.stock_status,
  is_featured = EXCLUDED.is_featured,
  collection = EXCLUDED.collection,
  craftsmanship_story = EXCLUDED.craftsmanship_story,
  updated_at = NOW();

INSERT INTO products (
  name, slug, description, price, display_price, category, images, badges, metal_finishes, stock_status, is_featured, collection, craftsmanship_story
) VALUES (
  'Royal Dogra 22K Gold Cufflinks',
  'royal-dogra-22k-gold-cufflinks',
  'Solid 22K gold cufflinks engraved with Jammu royal lion insignia and ruby center.',
  7800000,
  '₹78,000',
  'Men's Accessories',
  ARRAY['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'],
  ARRAY['22K BIS', 'MEN''S'],
  ARRAY['Gold', 'Silver'],
  'in_stock',
  true,
  'Men''s Accessories',
  'Hand-engraved royal emblem with swivel back closure.'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  display_price = EXCLUDED.display_price,
  category = EXCLUDED.category,
  images = EXCLUDED.images,
  badges = EXCLUDED.badges,
  metal_finishes = EXCLUDED.metal_finishes,
  stock_status = EXCLUDED.stock_status,
  is_featured = EXCLUDED.is_featured,
  collection = EXCLUDED.collection,
  craftsmanship_story = EXCLUDED.craftsmanship_story,
  updated_at = NOW();

INSERT INTO products (
  name, slug, description, price, display_price, category, images, badges, metal_finishes, stock_status, is_featured, collection, craftsmanship_story
) VALUES (
  'Solid 22K Gold Men''s Heavy Kada',
  'solid-22k-gold-mens-heavy-kada',
  'Heavy masculine 22K solid gold Kada featuring grooved bevel edges.',
  21000000,
  '₹2,10,000',
  'Men's Accessories',
  ARRAY['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80'],
  ARRAY['22K BIS', 'HEAVY GOLD'],
  ARRAY['Gold'],
  'in_stock',
  true,
  'Men''s Accessories',
  'Cast in 45 grams of solid 22K hallmarked gold.'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  display_price = EXCLUDED.display_price,
  category = EXCLUDED.category,
  images = EXCLUDED.images,
  badges = EXCLUDED.badges,
  metal_finishes = EXCLUDED.metal_finishes,
  stock_status = EXCLUDED.stock_status,
  is_featured = EXCLUDED.is_featured,
  collection = EXCLUDED.collection,
  craftsmanship_story = EXCLUDED.craftsmanship_story,
  updated_at = NOW();
