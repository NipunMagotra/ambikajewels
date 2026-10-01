export const siteConfig = {
  name: "Ambika Jewels",
  legalBusinessName: process.env.STORE_LEGAL_NAME || "Ambika Jewels",
  legalEntityType: process.env.STORE_ENTITY_TYPE || "[TO BE FILLED BY OWNER] (e.g. Sole Proprietorship / Partnership / Private Limited)",
  founder: "Shivani Anand",
  businessRepresentative: "Lakesh Kumar",
  
  // =========================================================================
  // Statutory Seller KYC Identifiers (Consumer Protection E-Commerce Rules)
  // [TO BE FILLED BY OWNER] - Build check fails in production if left placeholder
  // =========================================================================
  pan: process.env.STORE_PAN || "[TO BE FILLED BY OWNER]",
  gstin: process.env.STORE_GSTIN || "[TO BE FILLED BY OWNER]",
  bisHallmarkLicense: process.env.STORE_BIS_LICENSE || "[TO BE FILLED BY OWNER]",
  
  hsnCode: "7113",
  description: "Authentic Dogra Heritage Jewelry, Fine Solid Gold, Certified Diamonds, 925 Silver & Bespoke Jewelry Craftsmanship in Jammu.",
  address: "Shop no.3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, Jammu & Kashmir 180013",
  fullAddress: "Shop no.3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, Jammu & Kashmir 180013, India",
  city: "Jammu",
  state: "Jammu & Kashmir",
  pincode: "180013",
  country: "India",
  domain: "ambikajewelsshop.com",
  websiteUrl: "https://ambikajewelsshop.com",
  contact: {
    whatsapp: "+919086098457",
    phone: "+919682589725",
    email: "contact@ambikajewelsshop.com",
    supportEmail: "contact@ambikajewelsshop.com"
  },
  grievanceOfficer: {
    name: "Lakesh Kumar",
    designation: "Grievance Redressal & Compliance Officer",
    email: "contact@ambikajewelsshop.com",
    phone: "+919682589725",
    address: "Shop no.3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, Jammu & Kashmir 180013, India",
    responseTime: "Acknowledgement within 48 hours; resolution within 30 days (verify with CA/lawyer under Consumer Protection Rules)"
  },
  nodalOfficer: {
    name: "Shivani Anand",
    designation: "Nodal Person of Contact for Law Enforcement Agencies",
    email: "contact@ambikajewelsshop.com",
    phone: "+919682589725"
  },
  timings: "Monday – Saturday: 10:00 AM – 8:00 PM | Sunday: Open",
  
  // TODO: Replace with verified social handles or keep clean URLs
  social: {
    instagram: "https://www.instagram.com/ambikajewels",
    facebook: "https://www.facebook.com/ambikajewels"
  },
  
  returnWindowDays: 7, // 7-day inspection and return window
  
  // Feature Flags
  features: {
    // HIGH LEGAL RISK: Must remain false until corporate structure and advance-booking terms are approved by CA/lawyer
    savingsGoalsEnabled: process.env.NEXT_PUBLIC_ENABLE_SAVINGS_GOALS === 'true',
    // F4: Hide PDP price breakup until dynamic product pricing schema is applied to database
    showPdpPriceBreakup: false,
    // F5: Mock products fallback (default false; Supabase DB is single source of truth)
    useMockProductsFallback: false,
  },
  
  // Bullion Rates & Stale Rate Guards
  rates: {
    maxDeviationPercent: 10, // Max 10% change without confirm_large_change flag
    maxRateAgeHours: 24, // Stale if older than 24 hours
    rateLockMinutes: 15, // Checkout price rate-lock window in minutes
    staleRateCustomerMessage: "Our daily bullion rates are currently being refreshed by our showroom team to match the latest market opening. Please check back shortly or call us directly at +91 9682589725 to confirm today's live rate and place your order.",
  },
  
  shipping: {
    courierPartner: "BVC Logistics Secure Armed Network",
    freeThreshold: 5000000, // in paise (₹50,000)
    flatRate: 50000, // in paise (₹500)
    baseFreightPaise: 35000, // ₹350 base freight for armored transit
    adValoremRate: 0.002, // 0.20% ad valorem transit insurance for gold cargo
    gstRate: 0.18, // 18% GST on shipping services
    deliveryTimelineRegional: "1 to 2 Business Days (Jammu & Kashmir / Northern Region)",
    deliveryTimelineNational: "2 to 4 Business Days (Pan-India Armored Transit)",
    dispatchTimeline: "24 to 48 Hours for In-Stock Items (3 to 5 Days for Custom Sizing)"
  },
  tax: {
    gstRate: 0.03, // 3% GST on precious jewelry (HSN 7113)
    // TODO: Confirm with CA whether old gold exchange is gross consideration or margin scheme under GST rules
    oldGoldDeductBeforeGst: false,
  },
  compliance: {
    // Statutory PAN reporting threshold for jewelry/bullion purchases (CA to confirm)
    panRequirementThresholdInr: 200000, // ₹2,00,000 threshold (CA to confirm)
    // Statutory cash transaction limit per person per day (CA to confirm)
    cashTransactionLimitInr: 200000, // ₹2,00,000 max cash per transaction/day (CA to confirm)
    // Maximum cash disbursement allowed to customer for gold buyback/exchange (CA to confirm)
    cashDisbursementLimitInr: 10000, // ₹10,000 max cash payout for old gold purchase (CA to confirm)
    allowForm60Declaration: true,
  },
  categories: [
    "Dogra Heritage Collection",
    "Gold Jewelry",
    "Diamond Jewelry",
    "Silver Jewelry (925)",
    "Bridal Couture",
    "Gold Exchange & Custom",
    "Necklaces & Chokers",
    "Earrings & Jhumkas",
    "Bangles & Kadas",
    "Rings & Solitaires",
    "Temple & Antique Gold",
    "Everyday Wear",
    "Men's Accessories"
  ]
};
