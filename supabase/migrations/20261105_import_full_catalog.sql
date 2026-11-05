-- ============================================================================
-- Ambika Jewels — Full Product Catalog Migration
-- Generated automatically by scripts/import-catalog.mjs
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
  ARRAY['22K (916)'],
  ARRAY['Gold', 'Antique Gold'],
  'in_stock',
  true,
  'Dogra Heritage Collection',
  'Iconic Dogri Jhumki sculpted in authentic 22K BIS hallmarked gold with traditional Jammu umbrella filigree and pearl droplet tassels.'
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
  ARRAY['/products/royal-kundan.png', 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80'],
  ARRAY['22K (916)'],
  ARRAY['Gold'],
  'in_stock',
  true,
  'Dogra Heritage Collection',
  'Sacred 22K gold Dogri Naman necklace set intricately engraved with traditional floral medallions and natural Burmese rubies.'
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
  'Heritage Dogri Long Haar',
  'heritage-dogri-long-set',
  'Grand royal Dogri Long Haar featuring multi-layer 22K gold bead strands and a central relief pendant with Meenakari backing.',
  32000000,
  '₹3,20,000',
  'Dogra Heritage Collection',
  ARRAY['/products/heritage-ruby-haar.png', '/products/temple-lakshmi.png'],
  ARRAY['22K (916)'],
  ARRAY['Gold', 'Antique Gold'],
  'in_stock',
  true,
  'Dogra Heritage Collection',
  'Grand royal Dogri Long Haar featuring multi-layer 22K gold bead strands and a central relief pendant with Meenakari backing.'
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
  'The Empress Polki Choker',
  'empress-polki-choker',
  'A masterpiece of artisanal excellence, featuring hand-set Polki diamonds and traditional meenakari work.',
  48500000,
  '₹4,85,000',
  'Necklaces & Chokers',
  ARRAY['/products/royal-kundan.png', 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80'],
  ARRAY['22K (916)'],
  ARRAY['Gold'],
  'in_stock',
  true,
  'Bridal Couture',
  'A masterpiece of artisanal excellence, featuring hand-set Polki diamonds and traditional meenakari work.'
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
  'Celestial Solitaire Diamond Ring',
  'celestial-solitaire-diamond-ring',
  'A single magnificent pear-shaped diamond set in handcrafted 18K solid gold with laser-cut micro-prongs.',
  14500000,
  '₹1,45,000',
  'Rings & Solitaires',
  ARRAY['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', '/hero-clean.png'],
  ARRAY['18K (750)'],
  ARRAY['Gold', 'Rose Gold', 'White Gold'],
  'in_stock',
  true,
  'Modern Solitaire',
  'A single magnificent pear-shaped diamond set in handcrafted 18K solid gold with laser-cut micro-prongs.'
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
  'Imperial Peacock Kada Pair',
  'imperial-peacock-kada-pair',
  'Handcrafted antique gold kada pair featuring twin peacocks facing each other with fine filigree repoussé work.',
  24000000,
  '₹2,40,000',
  'Bangles & Kadas',
  ARRAY['https://images.unsplash.com/photo-1611591475839-72f889c14828?auto=format&fit=crop&w=800&q=80', '/hero-clean.png'],
  ARRAY['22K (916)'],
  ARRAY['Gold', 'Antique Gold'],
  'in_stock',
  true,
  'Temple & Antique Gold',
  'Handcrafted antique gold kada pair featuring twin peacocks facing each other with fine filigree repoussé work.'
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
  'Kundan Chandbali Earrings',
  'kundan-chandbali-earrings',
  'Crescent moon shaped bridal Chandbali earrings with natural emerald cluster tassels and foil-backed kundan stones.',
  13800000,
  '₹1,38,000',
  'Earrings & Jhumkas',
  ARRAY['/products/kundan-chandbali.png', 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80'],
  ARRAY['22K (916)'],
  ARRAY['Gold', 'Antique Gold'],
  'in_stock',
  true,
  'Bridal Couture',
  'Crescent moon shaped bridal Chandbali earrings with natural emerald cluster tassels and foil-backed kundan stones.'
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
  'Royal Dogri Bridal Silver Payal',
  'royal-dogri-bridal-silver-payal',
  'Heavy traditional Dogra bridal anklets featuring interlocking silver chain links and handcrafted musical ghungroo bells.',
  1850000,
  '₹18,500',
  'Silver Jewellery (925)',
  ARRAY['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', '/hero-clean.png'],
  ARRAY['925 SILVER'],
  ARRAY['Silver', 'Antique Silver'],
  'in_stock',
  true,
  'Dogra Heritage Collection',
  'Heavy traditional Dogra bridal anklets featuring interlocking silver chain links and handcrafted musical ghungroo bells.'
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
