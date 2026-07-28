export interface FAQItem {
  question: string;
  answer: string;
  keywords: string[];
  category: string;
}

export const storeKnowledge = {
  name: "Ambika Jewels",
  address: "Shop no.3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, Jammu & Kashmir 180013",
  phone: "+91 9682589725",
  whatsapp: "+91 9086098457",
  email: "contact@ambikajewels.com",
  
  hours: {
    monday: "11:00 AM – 12:00 AM (Midnight)",
    tuesdayToSaturday: "12:00 AM – 8:30 AM & 11:00 AM – 12:00 AM",
    sunday: "12:00 AM – 8:30 AM",
    formattedSummary: "Monday: 11:00 AM – 12:00 AM; Tuesday to Saturday: 12:00 AM – 8:30 AM & 11:00 AM – 12:00 AM; Sunday: 12:00 AM – 8:30 AM."
  },

  purityAndCertification: [
    "100% pure 22K (916) and 18K (750) BIS hallmarked gold.",
    "Certified real diamonds with GIA & IGI certificates.",
    "Transparent pricing: Gold rate + making charges + 3% GST."
  ],

  policies: [
    "Lifetime buyback & exchange at 100% current gold value.",
    "30 days easy exchange policy.",
    "Free insured home delivery all over India for orders over ₹50,000."
  ],

  customOrders: [
    "We specialize in custom gold and diamond designs.",
    "Send a photo or sketch on WhatsApp (+91 9086098457) to receive a 3D design preview within 2 days.",
    "We also redesign old family gold into modern heritage designs."
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
    answer: "Namaste! Our store timings are:\n• Monday: 11:00 AM – 12:00 AM (Midnight)\n• Tuesday to Saturday: 12:00 AM – 8:30 AM & 11:00 AM – 12:00 AM\n• Sunday: 12:00 AM – 8:30 AM.",
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
