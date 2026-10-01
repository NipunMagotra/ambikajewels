# MASTER PROJECT CONTEXT: AMBIKA JEWELS (ONLINE SHOWROOM & E-COMMERCE PLATFORM)

> **Purpose of this Document:**  
> This document contains the complete, unabridged architectural, business, operational, and development context of the **Ambika Jewels** project. It is structured specifically to be shared with AI models (such as ChatGPT, Claude, etc.) so that the assistant possesses 100% of the background required to provide expert advice, generate production code, solve KYC/business challenges, and guide ongoing development without requiring repetitive explanations.

---

## 1. PROJECT & CLIENT OVERVIEW

### Who I Am & What I Am Doing
- **Role:** Independent Full-Stack Web Developer / Agency Lead.
- **Task:** Designing, building, and deploying a bespoke, luxury e-commerce showroom website and counter operations suite for a high-end regional fine jewelry showroom in Jammu, India.
- **Current Milestone (TODAY):** I am physically visiting the client's showroom in Lower Roop Nagar, Jammu to collect KYC documentation, create live merchant accounts (Razorpay & Shiprocket), take showroom media assets, and align on business operations before full production launch.

### Client & Business Profile
- **Brand Name:** Ambika Jewels
- **Industry:** Fine Jewelry Retail, Bridal Couture, Bespoke Custom Craftsmanship, and Digital Gold.
- **Year Established:** 2021
- **Founder & Owner:** Shivani Anand (Manages the Exclusive Boutique & Bespoke Styling)
- **Business Representative:** Lakesh Kumar (Manages Counter Operations, Procurement & Daily Bullion Rates)
- **Physical Flagship Showroom Address:**  
  *Shop no. 3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, Jammu & Kashmir 180013, India.*
- **Official Contact Details:**
  - Phone: `+91 9682589725`
  - WhatsApp Concierge: `+91 9086098457`
  - Email: `contact@ambikajewelsshop.com`
  - Domain: `ambikajewelsshop.com`
- **Showroom Operating Hours:**  
  Monday to Saturday: 10:00 AM – 8:00 PM | Sunday: Open | Extended hours during wedding/festive seasons.

### Unique Value Propositions (USPs) & Brand Heritage
1. **Signature Dogra Heritage Collection:** Authentic regional Dogra jewelry from Jammu (Dogri Jhumki, Dogri Naman Set, Dogri Long Haar) handcrafted by master Jammu karigars.
2. **Multi-Purity Gold Offerings:** 22K (916 Hallmarked), 18K (750), 14K (585), and 9K (375).
3. **Certified Real Diamonds:** 18K and 14K gold settings accompanied by genuine IGI/GIA certifications.
4. **925 Sterling Silver:** Traditional Dogra silver payals, silver chokers, temple coins, and bridal silver gifts.
5. **Gold Exchange & Melting:** 100% daily market valuation on old gold exchange; live heirloom melting and redesigning.
6. **3D CAD Preview Customization:** Customers share sketches or Instagram photos on WhatsApp and receive a 3D digital CAD render within 48 hours before physical fabrication.
7. **P-Gold Module:** Online 24K digital gold accumulation program with 100% physical vault backing and showroom redemption guarantee.

---

## 2. COMPLETE TECHNICAL ARCHITECTURE

### Tech Stack
- **Framework:** Next.js 16.2.10 (App Router, Server Components & Route Handlers).
- **Runtime & UI Library:** React 19.2.4.
- **Language:** TypeScript 5.
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`) with customized luxury gold design tokens, glassmorphism, and Material Symbols.
- **Database & Auth:** Supabase (PostgreSQL with Row-Level Security). *Architected with an automatic dual-mode fallback: uses Supabase when configured, and falls back to in-memory/mock data if env vars are missing.*
- **Hosting & Serverless:** Netlify (`@netlify/plugin-nextjs`).
- **AI Concierge ("Aanya"):** Powered by Groq Cloud LLaMA 3.3 70B Versatile model (`/api/chat`).
- **Payment Gateway:** Official Razorpay Node SDK (`razorpay: ^2.9.8`) + dynamic client-side `checkout.js`.
- **Logistics & Automated Fulfillment:** Shiprocket External REST API v2.

### Project Directory Structure
```
Ambika Jewels/
├── public/                     # High-res jewelry imagery, hero banners, icons
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with fonts, metadata & CartProvider
│   │   ├── page.tsx            # Luxury Home Landing Page (Hero, Heritage Collections, Testimonials)
│   │   ├── collections/        # Catalog page (/collections) & filters
│   │   │   └── [slug]/         # Dynamic Product Detail Page (Image gallery, purity badges, WhatsApp inquiry)
│   │   ├── cart/               # Full cart summary page
│   │   ├── checkout/           # Multi-step guest checkout + Razorpay SDK integration
│   │   ├── about/              # Brand story, Dogra heritage history & showroom photos
│   │   ├── services/           # Gold exchange, 3D CAD custom jewelry, gold melting
│   │   ├── contact/            # Showroom address, Google Maps link, WhatsApp & phone
│   │   ├── shipping-policy/    # Detailed 2-5 day delivery policy via Shiprocket
│   │   ├── refund-policy/      # Cancellation, 7-day inspection & refund policy
│   │   ├── privacy-policy/     # Indian IT Act compliant privacy policy
│   │   ├── terms/              # E-commerce terms of service
│   │   ├── admin/
│   │   │   ├── page.tsx        # Admin portal landing
│   │   │   ├── counter/        # Jammu Counter POS: Billing, live gold rates, savings goals
│   │   │   └── login/          # Passcode protected admin access
│   │   └── api/
│   │       ├── razorpay/
│   │       │   ├── create-order/route.ts  # Initiates Razorpay order (paise calculation)
│   │       │   └── verify/route.ts        # HMAC-SHA256 signature check & Shiprocket order dispatch
│   │       ├── orders/route.ts            # Supabase order creation endpoint
│   │       ├── chat/route.ts              # Groq LLaMA 3.3 Aanya Assistant endpoint
│   │       ├── silver/route.ts            # Daily silver rate endpoint
│   │       └── admin/                     # Auth validation endpoints
│   ├── components/
│   │   ├── layout/             # Header (Mega menu), Footer, MobileBottomNav
│   │   ├── catalog/            # ProductCard, ProductGrid, ProductDetailClient
│   │   ├── counter/            # RateTickerHeader, BillingCalculator, SavingsGoalTracker
│   │   └── ui/                 # ContactButtons, Modals
│   ├── context/
│   │   └── CartContext.tsx     # Global React context with localStorage persistence
│   ├── config/
│   │   └── siteConfig.ts       # Central store metadata, GST rates, shipping thresholds
│   ├── data/
│   │   └── mockProducts.ts     # High-value catalog seed data (22K Dogra sets, diamonds, silver)
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client singleton with graceful fallback detection
│   │   └── counterStore.ts     # Jammu daily bullion rate storage
│   └── types/
│       ├── index.ts            # Product, CartItem, Order, Category TypeScript definitions
│       └── counter.ts          # DailyRates, BillReceipt, GoldSavingsGoal definitions
├── supabase/
│   ├── schema.sql              # Core E-commerce Schema: products, orders, faq_items, RLS
│   └── pgold_schema.sql        # P-Gold Digital Gold accumulation & transactions schema
└── DOCUMENT.md                 # Complete business knowledge base & operational guide
```

---

## 3. CURRENT E-COMMERCE IMPLEMENTATION & FLOW

### End-to-End Checkout Pipeline
1. **Cart:** Customer adds fine jewelry items to cart. Prices are stored in **paise** (`₹1,45,000` = `14500000`) to prevent floating-point rounding errors.
2. **Checkout Page (`/checkout`):**
   - Step 1: Reviews cart items, calculates 3% GST (`siteConfig.tax.gstRate = 0.03`) and shipping (Free above ₹50,000; ₹500 flat fee below).
   - Step 2: Customer enters shipping address, phone, email, and special notes. Must check consent for Terms, Shipping Policy, and Refund Policy.
   - Step 3: Triggers payment.
3. **Order Creation (`/api/razorpay/create-order`):**
   - Checks environment variables `NEXT_PUBLIC_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
   - If keys are missing (development mode), returns a mock order ID (`is_mock: true`) so the UI does not crash during client demonstrations.
   - If keys exist, initializes `new Razorpay(...)` and creates an official Razorpay order with receipt number.
4. **Client-Side Modal:**
   - Dynamically injects `https://checkout.razorpay.com/v1/checkout.js`.
   - Opens the luxury gold-themed Razorpay modal supporting UPI (GPay, PhonePe, Paytm), NetBanking, Credit/Debit Cards, and Wallets.
5. **Verification & Automated Shipping (`/api/razorpay/verify`):**
   - Validates the `razorpay_signature` using HMAC-SHA256 (`crypto.createHmac('sha256', secret)`).
   - Authenticates directly with Shiprocket API v2 (`POST https://apiv2.shiprocket.in/v1/external/auth/login`).
   - Dispatches a prepaid adhoc shipment order (`POST https://apiv2.shiprocket.in/v1/external/orders/create/adhoc`) with HSN code `7113` (Precious jewelry), customer shipping coordinates, and default dimensions (0.5 kg, 10x10x5 cm).
   - Returns order confirmation number (`AMB-XXXXXX`) and Shiprocket order ID to the frontend, which clears the cart and shows the success screen.

---

## 4. TODAY'S SHOWROOM VISIT & ONBOARDING PLAYBOOK

### Documents Requested from the Client
I have requested the following documents for live verification:
1. **Personal Documents:** Owner's PAN Card, Identity Proof (Aadhaar / Passport / Voter ID).
2. **Business & Showroom Documents:**
   - GST Certificate (Mandatory for inter-state jewelry transit & E-Way bills).
   - Business Proof (MSME / Udyam Certificate, Shop & Establishment License, OR BIS Hallmark Certificate).
   - Showroom Address Proof for Lower Roop Nagar (Electricity Bill, Rent Agreement, or GST Certificate).
3. **Bank Details:** Cancelled Cheque OR 3-Month Bank Statement (showing Account Name, Account Number, and IFSC).
4. **Jewelry-Specific Compliance:**
   - 1 to 3 recent wholesale supplier purchase invoices (proves legitimate jewelry supply chain).
   - 30–60 second unedited walkthrough video showing the exterior sign board, entrance, counters, and stock inside the showroom.

### Critical Verification Rules for On-Site Setup
- **Bank Name Match:** The name on the cancelled cheque **must exactly match** the Trade Name on the GST Certificate or the Proprietor's PAN name. Otherwise, Razorpay penny-drop verification fails instantly.
- **Showroom Address Match:** The GST Principal Place of Business must match the Shiprocket pickup address (*Shop no. 3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu*).
- **BIS Hallmark License Number:** Take note of their 6-8 digit BIS certificate number to submit during Razorpay's Merchant Category Code (MCC 5094 / 5944 - Precious Stones & Metals) risk onboarding.

### On-Site Action Checklist (Live on Client's Devices)
1. **Razorpay Dashboard ([dashboard.razorpay.com](https://dashboard.razorpay.com)):**
   - Create account using client's official email.
   - Upload KYC documents under **Retail $\rightarrow$ Jewelry & Precious Stones**.
   - Input the live website URL (all required policy pages are already published).
   - Navigate to **Settings $\rightarrow$ API Keys**, generate keys, and securely copy:
     - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
     - `RAZORPAY_KEY_SECRET`
2. **Shiprocket Dashboard ([app.shiprocket.in](https://app.shiprocket.in)):**
   - Register account and complete Company KYC.
   - Add Pickup Location: Name `Primary`, Shop no. 3, Lower Roop Nagar, Jammu 180013, Contact: Lakesh Kumar (+91 9682589725).
   - Go to **Settings $\rightarrow$ API $\rightarrow$ Configure**, click **Create API User**, and record:
     - `SHIPROCKET_EMAIL`
     - `SHIPROCKET_PASSWORD`
     - `SHIPROCKET_PICKUP_LOCATION` (`Primary`)
3. **Media Capture at Showroom:**
   - 30-60 second continuous exterior to interior video.
   - Clear photo of the framed BIS Hallmark certificate.
   - Professional photos of the owners (Shivani Anand & Lakesh Kumar) for the website's About Us section.
   - Photo of signature Ambika Jewels packaging box/pouch for checkout trust badges.

---

## 5. AUDIT: WHAT IS STILL MISSING FOR A FULL E-COMMERCE SUITE

To make this a 100% complete, production-grade e-commerce application, the following items remain on the technical roadmap:

### 🔴 Phase 1: Critical Transaction Gaps (Immediate Priority)
1. **Database Order Persistence:**  
   In `/api/razorpay/verify/route.ts`, when payment verifies, it currently generates an order number and calls Shiprocket, **but does not insert the record into Supabase `orders` table**. We must add `await supabase.from('orders').insert(...)` so the store has a persistent database record of customer info, items, total amount, and Razorpay payment ID.
2. **Razorpay Webhooks (`/api/razorpay/webhook`):**  
   If a customer pays on mobile via UPI and closes the browser before returning to the website, the frontend redirect never fires. A webhook listener for `payment.captured` is required to ensure no paid order is ever lost.
3. **Indian Jewelry PAN Compliance (> ₹2,00,000):**  
   CBDT Rule 114B mandates collecting the customer's PAN card number for jewelry purchases exceeding ₹2 Lakh. Since catalog items reach ₹2,60,000–₹3,20,000, checkout must enforce a mandatory PAN field when `finalTotal > 20000000` paise.
4. **GST Tax Invoice Generation (HSN 7113):**  
   Automated creation of downloadable/printable tax invoices showing 3% GST breakdown, HUID/Hallmark disclosure, and registered GSTIN.

### 🟡 Phase 2: Operations & Admin Dashboard
1. **Online Order Management Screen (`/admin/orders`):**  
   Currently, `/admin` only houses the counter billing and gold rate tool. We need an order management dashboard to view online website orders, filter by status (`paid`, `processing`, `shipped`, `delivered`), and view customer details.
2. **Public Customer Order Tracking (`/track`):**  
   A dedicated page where customers can enter their Order Number (`AMB-XXXXXX`) or phone number to view live Shiprocket tracking status and courier details.
3. **Automated Order Notifications:**  
   Instant order confirmation emails (via Resend) or WhatsApp messages with invoice receipts.

### 🟢 Phase 3: Customer Experience Enhancements
1. **Ring & Bangle Sizing Selector:** Required size dropdowns (Indian Ring sizes 10–24, Bangle sizes 2.4, 2.6, 2.8) on product detail pages before adding to cart.
2. **Global Search Modal:** Instant search in the Header across categories, metals, and product titles.
3. **Customer Wishlist:** Ability for users to save heritage pieces to a wishlist stored in localStorage.
4. **Coupon / Promo Code Engine:** Checkout coupon input supporting percentage or fixed festive discounts.

---

## 6. ENVIRONMENT VARIABLES & SECRETS REFERENCE

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# AI Assistant (Groq Cloud LLaMA 3.3 70B)
GROQ_API_KEY=<your-groq-api-key>

# Razorpay Configuration (dashboard.razorpay.com)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_or_live_key
RAZORPAY_KEY_SECRET=<your-razorpay-secret-key>

# Shiprocket Configuration (app.shiprocket.in)
SHIPROCKET_EMAIL=<your-shiprocket-api-email>
SHIPROCKET_PASSWORD=<your-shiprocket-api-password>
SHIPROCKET_PICKUP_LOCATION=Primary

# GoldAPI.io (Live Bullion Ticker)
GOLDAPI_KEY=<your-goldapi-key>

# Admin Protection
ADMIN_PASSCODE=ambika2026
```

---

## 7. HOW TO USE THIS CONTEXT WITH CHATGPT

When working with ChatGPT using this document, you can provide prompts such as:
- *"I am at the client's showroom right now. Razorpay is asking for XYZ during jewelry category KYC—how should I respond?"*
- *"Write the complete code for `/api/razorpay/verify/route.ts` that saves verified orders into Supabase and handles PAN card validation for orders above ₹2,00,000."*
- *"Generate the code for the missing `/admin/orders` page so the Ambika Jewels team can view and manage their online orders."*
- *"Write the code for a public `/track` order page that fetches tracking status from Shiprocket using the order number."*
