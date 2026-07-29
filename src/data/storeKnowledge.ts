export interface FAQItem {
  question: string;
  answer: string;
  keywords: string[];
  category: string;
}

export const storeKnowledge = {
  name: "Ambika Jewels",
  tagline: "Authentic Dogra Heritage & Fine Custom Jewelry",
  foundedYear: 2021,
  owner: "Shivani Anand",
  businessRepresentative: "Lakesh Kumar",
  experienceYears: "Since 2021",
  locationName: "Jammu, Jammu & Kashmir",
  address: "Shop no.3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, Jammu & Kashmir 180013",
  landmarks: "Near E.W.S Colony, Sector 1, Lower Roop Nagar",
  phone: "+91 9682589725",
  whatsapp: "+91 9086098457",
  email: "contact@ambikajewels.com",
  
  hours: {
    mondayToSaturday: "10:00 AM – 8:00 PM",
    monday: "10:00 AM – 8:00 PM",
    tuesdayToSaturday: "10:00 AM – 8:00 PM",
    sunday: "Open (10:00 AM – 8:00 PM)",
    festiveHours: "Extended up to 9:00 PM – 10:00 PM during festive seasons & wedding periods depending on customer demand.",
    formattedSummary: "Monday to Saturday: 10:00 AM – 8:00 PM; Sunday: Open; Festival Season: Extended up to 9:00 PM – 10:00 PM."
  },

  goldPurity: [
    "22K Gold (916 Hallmarked)",
    "18K Gold (750 Hallmarked)",
    "14K Gold (585 Hallmarked)",
    "9K Gold (375 Hallmarked)"
  ],

  diamondJewelry: [
    "Available in 18K Gold",
    "Available in 14K Gold",
    "Certified real diamonds with official GIA and IGI certificates"
  ],

  silverCollection: [
    "925 Hallmarked Silver",
    "Traditional Silver Jewelry",
    "Other Exclusive Silver Collections"
  ],

  signatureDograCollection: [
    "Dogri Jhumki",
    "Dogri Naman Set",
    "Dogri Long Set",
    "Authentic Dogra Heritage Designs"
  ],

  goldExchangeAndCustomization: [
    "Exchange old gold jewelry for brand new designs.",
    "Melt existing gold jewelry to create completely new customized pieces.",
    "Upgrade older family heirlooms into modern designer collections."
  ],

  paymentMethods: [
    "UPI",
    "Bank Transfer",
    "RTGS",
    "Cash",
    "Other standard digital payment methods"
  ],

  whyChooseUs: [
    "Unique and exclusive jewelry designs not commonly available elsewhere.",
    "Genuine gold, certified diamonds, and 925 silver jewelry.",
    "Specialization in traditional Dogra heritage collections.",
    "Full gold exchange and old gold melting customization services.",
    "Wide range for weddings, bridal couture, and everyday wear.",
    "Boutique & showroom managed by owner Shivani Anand and representative Lakesh Kumar."
  ],

  purityAndCertification: [
    "100% official BIS Hallmarked Gold in 22K, 18K, 14K, and 9K purity.",
    "Certified real diamonds in 18K & 14K gold with GIA and IGI certificates.",
    "925 Hallmarked Silver & traditional silver collections.",
    "Transparent pricing formula: Daily Gold Rate + Making Charges + 3% GST."
  ],

  policies: [
    "100% gold exchange and custom redesign policy.",
    "Lifetime buyback & exchange options.",
    "Free 100% insured home delivery across India on all orders over ₹50,000.",
    "Free lifetime cleaning, polishing, and stone inspection in-store."
  ],

  services: [
    "Gold Exchange Program (Exchange old gold for new designs)",
    "Jewelry Customization (Melt & redesign old gold into custom pieces)",
    "Bespoke 3D CAD design preview for custom ideas",
    "Signature Dogra Heritage Jewelry consultations",
    "In-store private boutique & showroom appointments",
    "Live WhatsApp video shopping calls"
  ]
};

export const faqItems: FAQItem[] = [
  {
    question: "When was the store established?",
    answer: "Namaste! Our jewelry showroom was established in 2021 in Jammu by owner Shivani Anand and business representative Lakesh Kumar, offering premium quality jewelry and authentic Dogra heritage collections.",
    keywords: ["established", "founded", "history", "year", "2021", "owner", "start", "old", "since", "shivani", "lakesh"],
    category: "about"
  },
  {
    question: "What types of jewelry do you sell?",
    answer: "We offer a complete range of jewelry including Gold Necklaces, Chokers, Earrings, Bangles, Bracelets, Kadas, Rings, Bridal Jewelry, Men's Jewelry, 925 Silver Jewelry, Diamond Jewelry, Traditional Dogra Jewelry, Everyday Wear, and Custom Jewelry.",
    keywords: ["types", "sell", "offer", "products", "collections", "items", "categories", "jewelry", "gold", "diamond", "silver", "bridal", "mens"],
    category: "products"
  },
  {
    question: "Do you sell Dogra jewelry?",
    answer: "Yes! We specialize in authentic traditional Dogra heritage jewelry reflecting Jammu's rich cultural heritage. Popular offerings include Dogri Jhumki, Dogri Naman Set, Dogri Long Set, and custom Dogra designs.",
    keywords: ["dogra", "dogri", "heritage", "naman", "jhumki", "jhumka", "long set", "jammu", "traditional", "culture", "cultural"],
    category: "specialty"
  },
  {
    question: "Do you sell bridal jewelry?",
    answer: "Yes! We have an extensive bridal jewelry collection, including royal gold chokers, Kundan sets, Polki, Haathphool, and complete bridal wedding suites.",
    keywords: ["bridal", "bride", "wedding", "marriage", "haathphool", "choker", "dulhan"],
    category: "bridal"
  },
  {
    question: "Do you customize jewelry?",
    answer: "Yes! We specialize in custom jewelry creation. You can bring any design, sketch, or photo on WhatsApp (+91 9086098457), and our karigars will create custom jewelry for you. We also melt old gold to craft brand-new customized pieces.",
    keywords: ["custom", "customize", "customized", "personalize", "make", "design", "redesign", "bespoke", "sketch", "photo"],
    category: "services"
  },
  {
    question: "Can I exchange my old gold?",
    answer: "Yes! Under our Gold Exchange program, customers can exchange old gold jewelry for new designs, or have their old gold melted and transformed into fresh modern jewelry.",
    keywords: ["exchange", "old gold", "melt", "trade", "upgrade", "replace", "gold exchange"],
    category: "services"
  },
  {
    question: "What gold purity is available?",
    answer: "Our gold jewelry is available in 22K Gold (916), 18K Gold (750), 14K Gold (585), and 9K Gold (375). All pieces carry official hallmarking.",
    keywords: ["purity", "carat", "karat", "22k", "18k", "14k", "9k", "916", "750", "bis", "hallmark"],
    category: "purity"
  },
  {
    question: "What silver jewelry do you offer?",
    answer: "We offer 925 Hallmarked Silver jewelry, traditional silver ornaments, and exclusive modern silver collections.",
    keywords: ["silver", "925", "sterling", "silverware", "chandi"],
    category: "silver"
  },
  {
    question: "Do you sell diamond jewelry?",
    answer: "Yes! All our certified real diamond jewelry is available in 18K Gold and 14K Gold settings with official GIA/IGI certification.",
    keywords: ["diamond", "diamonds", "heera", "solitaire", "vvs", "gia", "igi"],
    category: "diamond"
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept UPI, Bank Transfer, RTGS, Cash, and all standard digital payment methods.",
    keywords: ["payment", "pay", "upi", "gpay", "phonepe", "bank transfer", "rtgs", "cash", "cards", "digital"],
    category: "payment"
  },
  {
    question: "What are your opening hours?",
    answer: "Our showroom timings are:\n• Monday – Saturday: 10:00 AM – 8:00 PM\n• Sunday: Open (10:00 AM – 8:00 PM)\n• Festival Hours: Open until 9:00 PM – 10:00 PM during wedding & festive seasons.",
    keywords: ["hours", "timing", "timings", "open", "close", "time", "schedule", "sunday", "festive", "festivals"],
    category: "about"
  },
  {
    question: "Where is the showroom located?",
    answer: "Ambika Jewels is located at:\nShop no.3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, J&K 180013.\nPhone: +91 9682589725 | WhatsApp: +91 9086098457.",
    keywords: ["location", "address", "where", "jammu", "roop nagar", "map", "reach", "find"],
    category: "about"
  }
];
