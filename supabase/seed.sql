-- ============================================
-- Ambika Jewels — Seed Data
-- ============================================

-- ============================================
-- PRODUCTS
-- ============================================
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
('Where is Ambika Jewels located?', 'Ambika Jewels is located in Muthi, Jammu, Jammu & Kashmir - 181205. We have been serving our community since 1984.', ARRAY['location', 'address', 'where', 'muthi', 'jammu', 'shop', 'store', 'find'], 'about', 1),
('What are your shop hours?', 'Our store timings are: Monday: 11:00 AM – 12:00 AM (Midnight); Tuesday to Saturday: 12:00 AM – 8:30 AM & 11:00 AM – 12:00 AM; Sunday: 12:00 AM – 8:30 AM.', ARRAY['hours', 'timing', 'open', 'close', 'time', 'when', 'schedule'], 'about', 2),
('How long has Ambika Jewels been in business?', 'Ambika Jewels was founded in 1984 in the heart of Jammu. For over 40 years, we have been dedicated to preserving Dogra heritage jewelry through master craftsmanship.', ARRAY['history', 'founded', 'years', 'old', 'since', 'established', 'about'], 'about', 3),

-- Shipping
('Do you offer delivery?', 'Yes! We offer free insured delivery on all orders above ₹50,000 across India. For orders below ₹50,000, a nominal shipping fee of ₹500 applies. All deliveries are fully insured and come with tracking.', ARRAY['delivery', 'shipping', 'ship', 'deliver', 'send', 'courier', 'free'], 'shipping', 4),
('How long does delivery take?', 'Standard delivery takes 5-7 business days across India. For Jammu & Kashmir, delivery is typically 3-5 business days. Express delivery (2-3 days) is available at an additional charge.', ARRAY['delivery', 'time', 'how long', 'days', 'when', 'arrive', 'fast', 'express'], 'shipping', 5),
('Do you ship internationally?', 'Currently, we only ship within India. For international inquiries, please contact us on WhatsApp and we will try to arrange shipping on a case-by-case basis.', ARRAY['international', 'abroad', 'foreign', 'overseas', 'outside india', 'global'], 'shipping', 6),

-- Returns
('What is your return policy?', 'We offer a 7-day return policy on all products in their original condition with tags intact. Custom or personalized pieces are non-returnable. Please contact us on WhatsApp to initiate a return.', ARRAY['return', 'refund', 'exchange', 'back', 'cancel', 'policy'], 'returns', 7),
('Can I exchange a product?', 'Yes, we offer free exchanges within 15 days of delivery. The product must be in its original condition with all tags and packaging intact. Please reach out on WhatsApp to arrange an exchange.', ARRAY['exchange', 'swap', 'replace', 'change', 'different'], 'returns', 8),

-- Care
('How should I care for my gold jewelry?', 'Store your gold jewelry in a soft pouch or lined box to prevent scratches. Clean with warm soapy water and a soft brush. Avoid exposing to harsh chemicals, perfumes, or chlorine. Remove jewelry before swimming or exercising.', ARRAY['care', 'clean', 'maintain', 'gold', 'polish', 'store', 'storage', 'maintenance'], 'care', 9),
('Do you offer repair and polishing services?', 'Yes! We offer complimentary polishing for all Ambika Jewels pieces. For repairs, our master karigars can restore any piece to its original glory. Visit our store or WhatsApp us for details.', ARRAY['repair', 'polish', 'fix', 'restore', 'broken', 'damage', 'service', 'maintenance'], 'care', 10),
('Is your jewelry hallmarked?', 'Yes, all our gold jewelry is BIS Hallmarked, guaranteeing the purity of gold. Each piece comes with a certificate of authenticity and a hallmark stamp. We use only 22k and 18k gold.', ARRAY['hallmark', 'certified', 'bis', 'purity', 'authentic', 'genuine', 'real', 'certificate', '22k', '18k'], 'care', 11),

-- Payment
('What payment methods do you accept?', 'We are currently setting up online payment. For now, you can place your order online and confirm payment via WhatsApp or by calling us. We accept UPI, bank transfer, and cash on delivery for local orders.', ARRAY['payment', 'pay', 'upi', 'card', 'cash', 'cod', 'bank', 'transfer', 'method', 'online'], 'payment', 12),
('Do you offer EMI or installment options?', 'EMI options are being planned for the near future. Currently, for high-value purchases, we can discuss flexible payment arrangements. Please contact us on WhatsApp for details.', ARRAY['emi', 'installment', 'monthly', 'loan', 'finance', 'credit'], 'payment', 13),

-- General
('Do you offer custom jewelry?', 'Absolutely! Custom design is our specialty. Share your vision with us on WhatsApp — a sketch, a photo, or just an idea — and our master karigars will bring it to life. Custom pieces typically take 2-4 weeks.', ARRAY['custom', 'design', 'bespoke', 'personalize', 'make', 'order', 'special'], 'general', 14),
('Do you offer a virtual consultation?', 'Yes! We offer free virtual consultations via WhatsApp video call. Our jewelry experts can help you choose the perfect piece, show you products up close, and answer any questions. Book a slot by messaging us.', ARRAY['virtual', 'consultation', 'video', 'call', 'online', 'whatsapp', 'appointment', 'book'], 'general', 15);
