-- ============================================
-- Ambika Jewels — Seed Data
-- ============================================

-- PRODUCTS: intentionally not seeded. Add real inventory via the admin panel.
-- (Demo products below are kept only as a commented reference.)
/*
INSERT INTO products (name, slug, description, price, display_price, category, images, badges, metal_finishes, stock_status, is_featured, collection, craftsmanship_story) VALUES

-- Necklaces
(
  'The Empress Polki Choker',
  'empress-polki-choker',
  'A masterpiece of artisanal excellence, featuring hand-set Polki diamonds and traditional meenakari work. This choker represents the pinnacle of Rajputana royalty, reimagined for the modern bride.',
  48500000,
  '₹4,85,000',
  'Necklaces',
  ARRAY[
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCU7YSAaG4rRgulwCm7woYpixsJWjdnaGmLXFWXvOwA60IE3mh6rhOBbFqQVA4QY1IBfbeIgv74-gTWaHiPJXwbRsMsxnppdlTNKpYwvYfuF0utbJ8-DP2Wp010hVr-O8Ye9gb4wWi8AI34-9fsoVtRA34a2B9C1zu0rxAJ4_433gxsuG_2RfE65DmmN6lq0zwj8FHsQchHJK0XMWWQX4Q8XCXWXlnVjM3owfk6tPX6UayUocR6QRg',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBzDKZVTA0W_QW0nhAudxPoa35dL0cd3CHPoTAClBn1nJ7qKLNPrRsKCkPhWsALvBPYE4j_Hdgs9pQMuX6W9gLkEmqxR_jKbOgO-j4lOVfkATmvXEcnC6iqcfSpUBRnL4kOetpBHSPNjFr5xk7REp8EuWiSEtVU3w_HFtpLqqjrvNu41_mo_q52Bx_jQ7Mb4e8n9rXhQi5S6oF1Aw1MWiYXAJ8KGyB50LZDccAAcNEM49K8SmN2FoM'
  ],
  ARRAY['CERTIFIED 22K GOLD'],
  ARRAY['Gold'],
  'in_stock',
  TRUE,
  'Bridal',
  'Every Ambika piece begins with a hand-drawn sketch, a blueprint of cultural memory. Our master craftsmen in Jammu spend over 200 hours perfecting a single choker, using techniques passed down through seven generations.'
),

(
  'Traditional Kundan Necklace',
  'traditional-kundan-necklace',
  'Hand-forged by master artisans in the heart of Jammu, this masterpiece features 22k hallmark gold with the traditional ''Jadau'' technique. Every uncut diamond (Polki) is individually set into a hand-carved gold bezel, complemented by royal emerald droplets.',
  14500000,
  '₹1,45,000',
  'Necklaces',
  ARRAY[
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCU7YSAaG4rRgulwCm7woYpixsJWjdnaGmLXFWXvOwA60IE3mh6rhOBbFqQVA4QY1IBfbeIgv74-gTWaHiPJXwbRsMsxnppdlTNKpYwvYfuF0utbJ8-DP2Wp010hVr-O8Ye9gb4wWi8AI34-9fsoVtRA34a2B9C1zu0rxAJ4_433gxsuG_2RfE65DmmN6lq0zwj8FHsQchHJK0XMWWQX4Q8XCXWXlnVjM3owfk6tPX6UayUocR6QRg'
  ],
  ARRAY['NEW ARRIVAL', 'CERTIFIED'],
  ARRAY['Gold'],
  'in_stock',
  TRUE,
  'Heritage',
  'The reverse side reveals an intricate hand-painted Meenakari pattern, ensuring the piece is as beautiful from the back as it is from the front—a true testament to Modern Heritage.'
),

(
  'The Rajmata Polki Set',
  'rajmata-polki-set',
  'A grand bridal set featuring an elaborate Polki necklace with emerald and pearl drops. This statement piece embodies the grandeur of royal Indian weddings.',
  45000000,
  '₹4,50,000',
  'Necklaces',
  ARRAY[
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBzDKZVTA0W_QW0nhAudxPoa35dL0cd3CHPoTAClBn1nJ7qKLNPrRsKCkPhWsALvBPYE4j_Hdgs9pQMuX6W9gLkEmqxR_jKbOgO-j4lOVfkATmvXEcnC6iqcfSpUBRnL4kOetpBHSPNjFr5xk7REp8EuWiSEtVU3w_HFtpLqqjrvNu41_mo_q52Bx_jQ7Mb4e8n9rXhQi5S6oF1Aw1MWiYXAJ8KGyB50LZDccAAcNEM49K8SmN2FoM'
  ],
  ARRAY['NEW ARRIVAL'],
  ARRAY['Gold'],
  'in_stock',
  FALSE,
  'Bridal',
  'Each Polki diamond is individually selected by our master karigars for its unique fire and character.'
),

-- Earrings
(
  'Celestial Solitaire',
  'celestial-solitaire',
  'A portrait of minimalist elegance — a single large pear-shaped diamond set in handcrafted 22k gold. This solitaire ring transcends trends, designed to be an heirloom for generations.',
  14500000,
  '₹1,45,000',
  'Rings',
  ARRAY[
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDQCh0M8TWVa4RkHJtJxN6eUs_4cgvKY4zgTMtHPJPdTf3B_WA6q6mi9QNLMARrfb0XX8J0XLxjt2WhnYlqq-heKNWHKjX77-y-sQWiKWZF_2q7AztAs0OwVIr2wFeBW9zflzlwnSN5qoqqmwrbrU6gIFuc3ZwMlC5uyGazwJb2_AW8MqZDZm3Mec8or-VgHpeK2GtVHU2Mn7QT5Gr0ziSkVscEEXtfufErbpWWzkzUK6uleO1v4I8'
  ],
  ARRAY['CERTIFIED'],
  ARRAY['Gold', 'Silver', 'Rose Gold'],
  'in_stock',
  TRUE,
  'Modern',
  'The diamond is hand-selected for its exceptional fire and brilliance, then set using techniques perfected over seven generations.'
),

(
  'Ruby Mandala',
  'ruby-mandala',
  'A gold pendant featuring a ruby-encrusted mandala design. The pendant hangs from a thin gold chain, embodying the spiritual geometry of Indian temple architecture.',
  8800000,
  '₹88,000',
  'Necklaces',
  ARRAY[
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD04-q_82v8gvGIVGUHw15oKNVedGv9Sh3cPne0yfomppKLhPjk_Ou8f97dZZ3Rv-oitqgtwfzrgK_C_1GDMn4gowi9et2JBWVy4tcC3249x5lpKcB37Hp1cL1K_eE-jlX_XwExAAgXrstbb52gO7GZvY9qivkbe6jpNMoRI6JYgEpD9Mm-SDtDqUGOgI2aeflUn6iAbQAHAYF_fTsm3dkaqZYbWtJ6mD0ubKnffbG696bT7L5EA6k'
  ],
  ARRAY['NEW ARRIVAL'],
  ARRAY['Gold'],
  'in_stock',
  TRUE,
  'Temple',
  'Each ruby is sourced from traditional gem traders and hand-set using the ancient ''Kundan'' technique.'
),

(
  'Lotus Filigree Earrings',
  'lotus-filigree',
  'Artistic gold floral earrings with delicate enamel work in white and gold. The intricate petal details showcase the finest filigree craftsmanship from Jammu.',
  6450000,
  '₹64,500',
  'Earrings',
  ARRAY[
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBCi_kKqZBglz4wzCFRuDuamzDXYzQOWcIxLmS0c-py7u3nvAGj7q4vPSrr80BfXohmQv4f0zAAoFYT59-xEGgLxzRoOHdxOIER0JHBOYZUSuQeNGsuke1HgXvlcQ6KNLud08vZhydGkS5vq-PwXFGQQgiMMGSrR4rSTFcdaScS7aJ8ECMKmlen8pnuAOF1yGNMvB8-0NkTUfXdbocEfDL3s4ZwE6TAy35xXpaQYwfSH5M_eiqBRjo'
  ],
  ARRAY[],
  ARRAY['Gold'],
  'in_stock',
  TRUE,
  'Heritage',
  'Our filigree masters use magnifying tools and tweezers to shape hair-thin gold wires into lotus petal patterns.'
),

(
  'Heritage Links Bracelet',
  'heritage-links',
  'A refined gold bracelet with a textured link design. Each link is individually hand-forged, creating a connection to heritage and history through modern craftsmanship.',
  11200000,
  '₹1,12,000',
  'Bangles & Bracelets',
  ARRAY[
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB6Sl43lR5d7V8bYr3bTP2jf5shH3b8moSZDOt58FqRTaBnRwVQK6oSr3oF91YuWRH0ehV_Zgyxv5nS3OBxU9Hxe79r_LqscH3r4gGeDmgQ7IJ-ViuIAKTUM5ucpLmnWXWtSx8OHV2xS72P9LMsD2hJBdKNjqQgGq8zZnzTKqddzcnbTqwsYmRDCGWaeHMPufzD_ZLYQnVLM4is04I38MlX6wDErDEZJpLP_gG32kKgL2HZ-O3g3Aw'
  ],
  ARRAY[],
  ARRAY['Gold'],
  'in_stock',
  TRUE,
  'Heritage',
  'The textured finish is achieved through a traditional hammering technique, giving each link a unique, organic character.'
),

(
  'Moghal Garden Jhumkas',
  'moghal-garden-jhumkas',
  'Exquisite gold Jhumka earrings featuring intricate filigree work inspired by the gardens of Mughal architecture. Ruby drops add a regal touch.',
  12500000,
  '₹1,25,000',
  'Earrings',
  ARRAY[
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCk2DuVJ6Nie6vkeiV3wdLzXc13tzns2bYlr_biC_PE_FMCIpms-AiRALQQ_oKqsqv_z0Ue9Pro4r2_dbt1vtlRmMQ0_TMXNm2OOl6jMX42ppjOOx2PRdNHnASxtvk0TgsWZ6AbqeJHKXBbO6NdvXQpA14CcQ9iHNGNqe2TxxVsCK0heFEMLgwIklrzxnUHmOA6Qqxn4rGAHLzEYbGoWEAWGoHQDkrExjKPeptavT277_CXDu4O16I'
  ],
  ARRAY[],
  ARRAY['Gold'],
  'in_stock',
  FALSE,
  'Heritage',
  'The Jhumka bell is cast using the ancient ''lost wax'' technique, ensuring each piece has a unique sonic signature.'
),

(
  'Royal Lion Kada',
  'royal-lion-kada',
  'A bold statement bangle featuring a lion motif, symbolizing strength and royalty in Indian heritage. Crafted in 22k gold with meenakari enamel detailing.',
  21000000,
  '₹2,10,000',
  'Bangles & Bracelets',
  ARRAY[
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD-xSLIg120zF9f2lpyANNVe0rC4UOe7WLQg1H694EQZNlrH5M_4sCV7qAre9nBo0tposPWGI_e2M6OG4EIcd9AhrO-00cjd6Qk6SJRDXu2qyejJe2ekLa1Su3IMDKZso11JQSTXNjyhND6mDOkFg9PankyTKQjs6VpWvvNeLvtE-ZfTx6fU5HBcRGTCFhh-rwGdDBPnFnRbx_0G1B2wHTpPGRGiA93pUU4cKmxATeZgTk5hMqy_CQ'
  ],
  ARRAY[],
  ARRAY['Gold'],
  'in_stock',
  FALSE,
  'Heritage',
  'The lion motif is inspired by the royal insignia of the Dogra dynasty of Jammu.'
),

(
  'Sapphire Halo Pendant',
  'sapphire-halo-pendant',
  'An exquisite pendant featuring a deep blue sapphire surrounded by a halo of brilliant micro-pavé diamonds. Set in 18k yellow gold with a delicate chain.',
  8500000,
  '₹85,000',
  'Necklaces',
  ARRAY[
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBCi_kKqZBglz4wzCFRuDuamzDXYzQOWcIxLmS0c-py7u3nvAGj7q4vPSrr80BfXohmQv4f0zAAoFYT59-xEGgLxzRoOHdxOIER0JHBOYZUSuQeNGsuke1HgXvlcQ6KNLud08vZhydGkS5vq-PwXFGQQgiMMGSrR4rSTFcdaScS7aJ8ECMKmlen8pnuAOF1yGNMvB8-0NkTUfXdbocEfDL3s4ZwE6TAy35xXpaQYwfSH5M_eiqBRjo'
  ],
  ARRAY[],
  ARRAY['Gold', 'Silver'],
  'in_stock',
  FALSE,
  'Modern',
  'The sapphire is sourced from Sri Lanka and hand-set by our gem specialist with over 30 years of experience.'
),

(
  'Noor Bridal Tikka',
  'noor-bridal-tikka',
  'A stunning bridal maang tikka featuring Polki diamonds and pearl drops. This piece completes any bridal ensemble with its regal elegance.',
  6500000,
  '₹65,000',
  'Bridal Couture',
  ARRAY[
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCk2DuVJ6Nie6vkeiV3wdLzXc13tzns2bYlr_biC_PE_FMCIpms-AiRALQQ_oKqsqv_z0Ue9Pro4r2_dbt1vtlRmMQ0_TMXNm2OOl6jMX42ppjOOx2PRdNHnASxtvk0TgsWZ6AbqeJHKXBbO6NdvXQpA14CcQ9iHNGNqe2TxxVsCK0heFEMLgwIklrzxnUHmOA6Qqxn4rGAHLzEYbGoWEAWGoHQDkrExjKPeptavT277_CXDu4O16I'
  ],
  ARRAY[],
  ARRAY['Gold'],
  'in_stock',
  FALSE,
  'Bridal',
  'The pearl drops are sourced from Hyderabad, each selected for its lustre and perfect spherical shape.'
),

(
  'Temple Gold Jhumkas',
  'temple-gold-jhumkas',
  'Classic South Indian temple-style jhumka earrings in 22k gold. Features intricate deity motifs and traditional bell-shaped drops with a matte gold finish.',
  3250000,
  '₹32,500',
  'Earrings',
  ARRAY[
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCk2DuVJ6Nie6vkeiV3wdLzXc13tzns2bYlr_biC_PE_FMCIpms-AiRALQQ_oKqsqv_z0Ue9Pro4r2_dbt1vtlRmMQ0_TMXNm2OOl6jMX42ppjOOx2PRdNHnASxtvk0TgsWZ6AbqeJHKXBbO6NdvXQpA14CcQ9iHNGNqe2TxxVsCK0heFEMLgwIklrzxnUHmOA6Qqxn4rGAHLzEYbGoWEAWGoHQDkrExjKPeptavT277_CXDu4O16I'
  ],
  ARRAY[],
  ARRAY['Gold'],
  'in_stock',
  FALSE,
  'Temple',
  'The deity motifs are inspired by the ancient temples of South India, hand-carved into the gold surface.'
),

(
  'Kundan Studs',
  'kundan-studs',
  'Elegant Kundan stud earrings featuring uncut diamonds in a classic round setting. Perfect for daily luxury wear.',
  4500000,
  '₹45,000',
  'Earrings',
  ARRAY[
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDQCh0M8TWVa4RkHJtJxN6eUs_4cgvKY4zgTMtHPJPdTf3B_WA6q6mi9QNLMARrfb0XX8J0XLxjt2WhnYlqq-heKNWHKjX77-y-sQWiKWZF_2q7AztAs0OwVIr2wFeBW9zflzlwnSN5qoqqmwrbrU6gIFuc3ZwMlC5uyGazwJb2_AW8MqZDZm3Mec8or-VgHpeK2GtVHU2Mn7QT5Gr0ziSkVscEEXtfufErbpWWzkzUK6uleO1v4I8'
  ],
  ARRAY[],
  ARRAY['Gold'],
  'in_stock',
  FALSE,
  'Daily Luxury',
  'Each stud is individually set with Kundan technique, ensuring a secure and beautiful setting.'
),

(
  'Maang Tikka',
  'maang-tikka',
  'A delicate bridal maang tikka with Polki diamonds and pearl droplets. Handcrafted in 22k gold for the modern bride.',
  3250000,
  '₹32,500',
  'Bridal Couture',
  ARRAY[
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD04-q_82v8gvGIVGUHw15oKNVedGv9Sh3cPne0yfomppKLhPjk_Ou8f97dZZ3Rv-oitqgtwfzrgK_C_1GDMn4gowi9et2JBWVy4tcC3249x5lpKcB37Hp1cL1K_eE-jlX_XwExAAgXrstbb52gO7GZvY9qivkbe6jpNMoRI6JYgEpD9Mm-SDtDqUGOgI2aeflUn6iAbQAHAYF_fTsm3dkaqZYbWtJ6mD0ubKnffbG696bT7L5EA6k'
  ],
  ARRAY[],
  ARRAY['Gold'],
  'in_stock',
  FALSE,
  'Bridal',
  ''
),

(
  'Vaikuntha Gold Kadas',
  'vaikuntha-gold-kadas',
  'A pair of heavy gold kadas featuring intricate temple-inspired carvings. Symbolizing divine protection, these kadas are a statement of faith and heritage.',
  28000000,
  '₹2,80,000',
  'Bangles & Bracelets',
  ARRAY[
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD-xSLIg120zF9f2lpyANNVe0rC4UOe7WLQg1H694EQZNlrH5M_4sCV7qAre9nBo0tposPWGI_e2M6OG4EIcd9AhrO-00cjd6Qk6SJRDXu2qyejJe2ekLa1Su3IMDKZso11JQSTXNjyhND6mDOkFg9PankyTKQjs6VpWvvNeLvtE-ZfTx6fU5HBcRGTCFhh-rwGdDBPnFnRbx_0G1B2wHTpPGRGiA93pUU4cKmxATeZgTk5hMqy_CQ'
  ],
  ARRAY[],
  ARRAY['Gold'],
  'in_stock',
  FALSE,
  'Temple',
  ''
),

(
  'Peacock Kada',
  'peacock-kada',
  'An ornate gold kada featuring a stunning peacock motif with meenakari enamel work in vibrant blue and green. A celebration of Indian artistry.',
  11200000,
  '₹1,12,000',
  'Bangles & Bracelets',
  ARRAY[
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB6Sl43lR5d7V8bYr3bTP2jf5shH3b8moSZDOt58FqRTaBnRwVQK6oSr3oF91YuWRH0ehV_Zgyxv5nS3OBxU9Hxe79r_LqscH3r4gGeDmgQ7IJ-ViuIAKTUM5ucpLmnWXWtSx8OHV2xS72P9LMsD2hJBdKNjqQgGq8zZnzTKqddzcnbTqwsYmRDCGWaeHMPufzD_ZLYQnVLM4is04I38MlX6wDErDEZJpLP_gG32kKgL2HZ-O3g3Aw'
  ],
  ARRAY['NEW'],
  ARRAY['Gold'],
  'in_stock',
  FALSE,
  'Heritage',
  ''
),

(
  'Emerald Solitaire Ring',
  'emerald-solitaire',
  'A breathtaking emerald solitaire set in handcrafted 22k gold. The deep green stone radiates timeless elegance.',
  4590000,
  '₹45,900',
  'Rings',
  ARRAY[
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDQCh0M8TWVa4RkHJtJxN6eUs_4cgvKY4zgTMtHPJPdTf3B_WA6q6mi9QNLMARrfb0XX8J0XLxjt2WhnYlqq-heKNWHKjX77-y-sQWiKWZF_2q7AztAs0OwVIr2wFeBW9zflzlwnSN5qoqqmwrbrU6gIFuc3ZwMlC5uyGazwJb2_AW8MqZDZm3Mec8or-VgHpeK2GtVHU2Mn7QT5Gr0ziSkVscEEXtfufErbpWWzkzUK6uleO1v4I8'
  ],
  ARRAY[],
  ARRAY['Gold'],
  'in_stock',
  FALSE,
  'Modern',
  ''
);

-- ============================================
-- FAQ ITEMS
-- ============================================
INSERT INTO faq_items (question, answer, keywords, category, sort_order) VALUES

-- About
('Where is Ambika Jewels located?', 'Ambika Jewels flagship showroom is located at Shop no. 3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, Jammu & Kashmir - 180013, India.', ARRAY['location', 'address', 'where', 'roop nagar', 'jammu', 'shop', 'store', 'find'], 'about', 1),
('What are your showroom hours?', 'Our showroom timings are Monday to Saturday: 10:00 AM – 8:00 PM. We are also open on Sundays, with extended hours during festive and wedding seasons.', ARRAY['hours', 'timing', 'open', 'close', 'time', 'when', 'schedule'], 'about', 2),
('How long has Ambika Jewels been in business?', 'Ambika Jewels was established in 2021 in Jammu, founded by Shivani Anand and Lakesh Kumar, dedicated to authentic Dogra heritage fine jewelry, bridal couture, and bespoke karigar craftsmanship.', ARRAY['history', 'founded', 'years', 'old', 'since', 'established', 'about'], 'about', 3),

-- Shipping
('Do you offer delivery?', 'Yes! We offer fully insured, armored transit via BVC Logistics across India. Delivery is complimentary on all orders above ₹50,000. All parcels are dispatched in serialized tamper-evident security bags.', ARRAY['delivery', 'shipping', 'ship', 'deliver', 'send', 'courier', 'free', 'bvc'], 'shipping', 4),
('How long does delivery take?', 'Armored delivery typically takes 1 to 2 business days for Jammu & Kashmir and Northern Region, and 2 to 4 business days pan-India.', ARRAY['delivery', 'time', 'how long', 'days', 'when', 'arrive', 'fast', 'express'], 'shipping', 5),
('Do you ship internationally?', 'Currently, we only ship within India in accordance with domestic bullion and foreign exchange regulations. For bespoke NRI bridal inquiries, please contact our concierge on WhatsApp.', ARRAY['international', 'abroad', 'foreign', 'overseas', 'outside india', 'global'], 'shipping', 6),

-- Returns
('What is your return policy?', 'We offer a 7-day inspection and return window on eligible standard products in original condition with intact security tags and BIS hallmark certification intact. Custom pieces are non-returnable as per stated store terms.', ARRAY['return', 'refund', 'exchange', 'back', 'cancel', 'policy'], 'returns', 7),
('Can I exchange a product?', 'Yes, we provide transparent lifetime gold exchange and buyback based on live daily Jammu bullion rates and scientific XRF purity testing, in accordance with our Exchange Policy.', ARRAY['exchange', 'swap', 'replace', 'change', 'different'], 'returns', 8),

-- Care
('How should I care for my gold jewelry?', 'Store your gold jewelry in the provided velvet-lined jewelry case. Clean gently with warm water and a soft lint-free cloth. Keep away from perfumes, sanitizers, and harsh detergents.', ARRAY['care', 'clean', 'maintain', 'gold', 'polish', 'store', 'storage', 'maintenance'], 'care', 9),
('Do you offer repair and polishing services?', 'Yes! We offer expert inspection, ultrasonic cleaning, and repolishing at our Lower Roop Nagar showroom. For repairs, our master Jammu karigars can restore any heirloom piece.', ARRAY['repair', 'polish', 'fix', 'restore', 'broken', 'damage', 'service', 'maintenance'], 'care', 10),
('Is your jewelry hallmarked?', 'Yes, all our gold jewelry is 100% BIS Hallmarked with a laser-engraved 6-character alphanumeric HUID (Hallmark Unique Identification) stamped in accordance with Bureau of Indian Standards regulations.', ARRAY['hallmark', 'certified', 'bis', 'purity', 'authentic', 'genuine', 'real', 'certificate', '22k', '18k', 'huid'], 'care', 11),

-- Payment
('What payment methods do you accept?', 'We accept all major secure payment methods via Razorpay: UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay), and Net Banking across 50+ Indian banks. We also accept in-showroom counter billing.', ARRAY['payment', 'pay', 'upi', 'card', 'cash', 'cod', 'bank', 'transfer', 'method', 'online', 'razorpay'], 'payment', 12),
('Do you offer EMI or installment options?', 'Flexible payment arrangements and advance bridal bookings can be discussed directly at our showroom or with our WhatsApp concierge.', ARRAY['emi', 'installment', 'monthly', 'loan', 'finance', 'credit'], 'payment', 13),

-- General
('Do you offer custom jewelry?', 'Absolutely! Custom design is our specialty. Share your vision with us on WhatsApp — a sketch, a photo, or just an idea — and our master karigars will bring it to life. Custom pieces typically take 2-4 weeks.', ARRAY['custom', 'design', 'bespoke', 'personalize', 'make', 'order', 'special'], 'general', 14),
('Do you offer a virtual consultation?', 'Yes! We offer free virtual consultations via WhatsApp video call. Our jewelry experts can help you choose the perfect piece, show you products up close, and answer any questions. Book a slot by messaging us.', ARRAY['virtual', 'consultation', 'video', 'call', 'online', 'whatsapp', 'appointment', 'book'], 'general', 15);
