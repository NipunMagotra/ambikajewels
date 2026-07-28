export interface FAQItem {
  question: string;
  answer: string;
  keywords: string[];
  category: string;
}

export const storeKnowledge = {
  name: "Ambika Jewels",
  tagline: "Preserving Jammu's Heritage Jewelry Since 1984",
  foundedYear: 1984,
  experienceYears: "40+ years",
  locationName: "Jammu, Jammu & Kashmir",
  address: "Shop no.3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, Jammu & Kashmir 180013",
  landmarks: "Near E.W.S Colony, Sector 1, Lower Roop Nagar",
  phone: "+91 9682589725",
  whatsapp: "+91 9086098457",
  email: "contact@ambikajewels.com",
  
  hours: {
    monday: "11:00 AM – 8:30 PM",
    tuesdayToSaturday: "11:00 AM – 8:30 PM",
    tuesday: "11:00 AM – 8:30 PM",
    wednesday: "11:00 AM – 8:30 PM",
    thursday: "11:00 AM – 8:30 PM",
    friday: "11:00 AM – 8:30 PM",
    saturday: "11:00 AM – 8:30 PM",
    sunday: "12:00 PM – 8:30 PM",
    formattedSummary: "Monday to Saturday: 11:00 AM – 8:30 PM; Sunday: 12:00 PM – 8:30 PM."
  },

  purityAndCertification: [
    "100% official BIS Hallmarked Gold (22K / 916 and 18K / 750 purity with unique HUID tag).",
    "Certified real diamonds with official GIA and IGI certificates.",
    "Natural gemstones (Burmese Rubies, Zambian Emeralds, South Sea Pearls).",
    "Transparent pricing formula: Daily Gold Rate + Making Charges + 3% GST."
  ],

  policies: [
    "Lifetime buyback & exchange at 100% of current market gold value.",
    "30-day easy exchange policy for catalog products.",
    "Free 100% insured home delivery across India on all orders over ₹50,000.",
    "Free lifetime cleaning, polishing, and stone inspection in-store."
  ],

  customOrders: [
    "Bespoke custom gold and diamond jewelry made by master karigars in Jammu.",
    "Share any sketch, photo, or Instagram picture on WhatsApp (+91 9086098457) for a 3D CAD design preview in 2 days.",
    "Old gold transformation: Bring old family heirloom gold to be melted and redesigned into modern heritage pieces."
  ],

  services: [
    "In-store private bridal consultations",
    "Live WhatsApp video shopping appointments for out-of-station and NRI customers",
    "Jewelry repair, resizing, and restorative polishing",
    "Gold rate lock advances for wedding purchases"
  ]
};

export const faqItems: FAQItem[] = [
  {
    question: "Where is Ambika Jewels located?",
    answer: "Namaste! Ambika Jewels is located at:\nShop no.3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, J&K 180013.\n\nPhone: +91 9682589725 | WhatsApp: +91 9086098457.",
    keywords: ["location", "loacaton", "locaton", "address", "addres", "where", "jammu", "roop nagar", "shop location", "store location", "find", "reach", "situated", "place", "map"],
    category: "about"
  },
  {
    question: "What are your shop hours and timings?",
    answer: "Namaste! Our store timings are:\n• Monday to Saturday: 11:00 AM – 8:30 PM\n• Sunday: 12:00 PM – 8:30 PM.",
    keywords: ["hours", "timing", "timings", "open", "close", "time", "when", "schedule", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    category: "about"
  },
  {
    question: "How can I contact Ambika Jewels?",
    answer: "Namaste! You can call or message us directly:\n• Phone: +91 9682589725\n• WhatsApp: +91 9086098457\n• Email: contact@ambikajewels.com\n\nOr visit our showroom at Shop no.3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu.",
    keywords: ["contact", "phone", "whatsapp", "call", "mobile", "number", "reach", "email"],
    category: "contact"
  },
  {
    question: "How long has Ambika Jewels been in business?",
    answer: "Ambika Jewels was founded in 1984 in Jammu. For over 40 years, we have been crafting authentic 22K hallmarked gold, Polki, and Kundan jewelry.",
    keywords: ["history", "founded", "years", "old", "since", "established", "about", "legacy"],
    category: "about"
  },
  {
    question: "Is your gold hallmarked and diamonds certified?",
    answer: "Yes! All our gold jewelry is 100% BIS Hallmarked (22K 916 and 18K 750). All diamond jewelry comes with official GIA or IGI certificates.",
    keywords: ["hallmark", "certified", "bis", "purity", "authentic", "genuine", "real", "certificate", "22k", "18k", "diamond"],
    category: "purity"
  },
  {
    question: "Do you offer custom jewelry design?",
    answer: "Yes! Custom jewelry is our specialty. Share your design, photo, or idea with us on WhatsApp (+91 9086098457), and our master karigars will create a 3D preview for you in 2 days.",
    keywords: ["custom", "design", "bespoke", "personalize", "make", "order", "special", "photo", "sketch"],
    category: "services"
  },
  {
    question: "Do you offer delivery across India?",
    answer: "Yes! We offer free fully-insured home delivery across India on all orders over ₹50,000. All shipments are tamper-proof and fully insured.",
    keywords: ["delivery", "shipping", "ship", "deliver", "send", "courier", "free", "india"],
    category: "shipping"
  },
  {
    question: "What is your buyback and return policy?",
    answer: "We offer lifetime buyback & exchange at 100% of current gold value, plus a 30-day easy exchange policy on standard catalog items.",
    keywords: ["return", "refund", "exchange", "buyback", "policy", "guarantee"],
    category: "policies"
  }
];
