# AMBIKA JEWELS — MASTER PROJECT CONTEXT

> **Authoritative Context Document for AI Assistants, Developers & Founders**  
> *Last Updated: November 2026 | Version: 1.0.2 | Stack: Next.js 16 + React 19 + TypeScript 5 + Supabase + Razorpay*  
> **RULE:** Any AI agent working on this codebase MUST read this entire file first before making changes.

---

## 1. PROJECT & BUSINESS OVERVIEW

### The Business
- **Brand Name:** Ambika Jewels (Legal Name: Ambika Jewels, Sole Proprietorship)
- **Founder:** Shivani Anand (Boutique & Bespoke Styling)
- **Business Representative & Compliance:** Lakesh Kumar (Showroom Operations, Daily Bullion Rates)
- **Physical Flagship Showroom:**  
  *Shop no. 3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, Jammu & Kashmir 180013, India.*
- **Official Contact Details:**
  - Phone: `+91 9682589725`
  - WhatsApp Concierge: `+91 9086098457`
  - Support & Compliance Email: `contact@ambikajewelsonline.com`
  - Canonical Domain: `https://ambikajewelsonline.com`
- **Showroom Operating Hours:** Monday – Saturday: 10:00 AM – 8:00 PM | Sunday: Open
- **Statutory KYC & Regulatory Identifiers:**
  - GSTIN: `01AHWPH9511N1ZX` (Jammu & Kashmir)
  - Business PAN: `AHWPH9511N`
  - BIS Hallmark License: `HM/C-9990041009` (Mandatory 6-digit HUID hallmarking)
  - HSN Code: `7113` (Precious Metal Articles & Jewellery)

### Core Offerings & USPs
1. **Dogra Heritage Jewellery Collection:** Jammu heirloom jewellery (Dogri Jhumkis, Dogri Naman chokers, Dogri Haars, Balis) handcrafted by regional karigars.
2. **Multi-Purity Precious Gold:** 22K (916 Hallmarked), 18K (750), 14K (585), and 9K (375).
3. **Certified Natural Diamonds:** IGI/GIA certified natural diamonds set in 18K and 14K solid gold.
4. **925 Sterling Silver:** Traditional Dogra bridal payals, chokers, puja articles, and temple coins.
5. **Gold Exchange Program:** Transparent karat analysis and fair market valuation on old gold trade-ins.
6. **Live Heirloom Melting & Redesign:** Safe in-showroom gold melting and custom heirloom redesign.
7. **Personalized Concierge & Boutique Appointments:** Private Jammu boutique visits and nationwide armed insured courier delivery.

---

## 2. PRODUCTION TECHNOLOGY STACK

Only technologies actually in active use:

- **Framework:** Next.js 16.2.10 (App Router, Turbopack, Server Components & Route Handlers).
- **Runtime & UI Library:** React 19.2.4 & React DOM 19.2.4.
- **Language:** TypeScript 5.
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`) with custom luxury theme tokens, dark/light mode toggle.
- **Database & Backend Services:** Supabase PostgreSQL with Row Level Security (RLS). Dual-mode architecture: connects to live Supabase when configured, with robust in-memory/fallback structures for isolated local development and test execution.
- **Payment Processing:** Official Razorpay Node SDK (`razorpay: ^2.9.8`) + client-side checkout popup (`checkout.js`).
- **High-Value Logistics:** BVC Logistics Armed Courier Integration (100% insured transit, OTP delivery protocol).
- **Image Processing & Sanitization:** Sharp (server-side MIME/magic-byte validation, decompression bomb protection, EXIF stripping, WebP compression).
- **Rate Limiting:** Upstash Redis / In-memory token bucket rate limiting on sensitive auth and checkout endpoints.
- **Interactive Components:** Swiper 14 (gallery carousel), Medium-Zoom (lightbox image inspection).
- **Hosting & Deployment:** Netlify (`@netlify/plugin-nextjs`).

---

## 3. SYSTEM ARCHITECTURE

```
                                  [ CUSTOMER BROWSER ]
                                           │
                        HTTPS / edge routing / next.js proxy
                                           │
                                    [ src/middleware.ts ]
                             (Zero-Trust Edge HMAC Session Guard)
                                           │
                ┌──────────────────────────┴──────────────────────────┐
                │                                                     │
       [ PUBLIC STOREFRONT ]                                   [ ADMIN CONSOLE ]
  /collections, /cart, /checkout                              /admin, /admin/counter
                │                                                     │
  ┌─────────────┴─────────────┐                         ┌─────────────┴─────────────┐
  │                           │                         │                           │
[ Server Pricing API ]   [ Razorpay Webhook ]     [ Product CRUD ]           [ Bullion Rates ]
/api/razorpay/create     /api/razorpay/webhook    /api/admin/products        /api/admin/rates
  │ (3% GST, BVC,          │ (HMAC Signature        │ (Sharp WebP sanitizer)   │ (Sanity bounds)
  │  Server Inventory)     │  Idempotent DB lock)   │                          │
  └─────────────┬─────────────┘                         └─────────────┬─────────────┘
                │                                                     │
                └──────────────────────────┬──────────────────────────┘
                                           │
                              [ SERVER UTILITIES & ENGINES ]
                        - src/lib/serverPricing.ts   (Price authority)
                        - src/lib/inventoryEngine.ts (Atomic reservation)
                        - src/lib/couponEngine.ts    (Server discounts)
                        - src/lib/staffAuth.ts       (RBAC & TOTP MFA)
                        - src/lib/auditLog.ts        (Tamper-evident logs)
                                           │
                                 [ PERSISTENT STORAGE ]
                        - Supabase PostgreSQL (RLS Enforced)
                        - Supabase Storage Bucket ('products')
```

---

## 4. DIRECTORY STRUCTURE

```
d:/Client Projects/Ambika Jewels/
├── public/                 # Static assets (Favicons, Apple touch icons, manifest, hero)
├── src/
│   ├── app/                # Next.js App Router (49 routes, pages, API route handlers)
│   │   ├── admin/          # Admin portal, login, counter POS, order hub
│   │   ├── api/            # Server Route Handlers (Auth, Razorpay, Products, Rates, Content)
│   │   ├── collections/    # Catalog & Product Detail Pages
│   │   ├── cart/           # Shopping cart
│   │   ├── checkout/       # Guest checkout with Razorpay SDK integration
│   │   └── ...             # Policies, Contact, About, Services, Legal
│   ├── components/         # Reusable React components
│   │   ├── admin/          # Visual modals (ProductModal, CouponModal, Invoices, CSV)
│   │   ├── catalog/        # ProductCard, ProductDetailClient, Swiper Gallery
│   │   ├── layout/         # Header, Footer, MobileBottomNav, Newsletter
│   │   └── ui/             # ContactButtons, ToastNotification, MandalaDivider
│   ├── config/             # siteConfig.ts (Central store metadata, statutory KYC, defaults)
│   ├── context/            # React contexts (CartContext, WishlistContext)
│   ├── data/               # Seed catalog data (mockProducts.ts)
│   ├── lib/                # Core engines and backend utilities
│   │   ├── adminAuth.ts       # Session validation, cookie parsing, revocation checks
│   │   ├── auditLog.ts        # Tamper-evident admin audit trail
│   │   ├── bvcLogistics.ts    # BVC Armed Delivery courier integration
│   │   ├── couponEngine.ts    # Discount engine with server bounds
│   │   ├── inventoryEngine.ts # Atomic reservation & anti-double-selling engine
│   │   ├── rateLimit.ts       # Rate limiting on sensitive endpoints
│   │   ├── serverPricing.ts   # Cryptographic server-side price authority
│   │   ├── staffAuth.ts       # Individual staff accounts, Argon2/PBKDF2, TOTP MFA
│   │   ├── storeContent.ts    # Dynamic hero and showroom announcement settings
│   │   ├── supabase.ts        # Public Supabase client singleton
│   │   └── supabaseAdmin.ts   # Privileged service-role Supabase client
│   └── types/              # TypeScript interfaces (Product, Order, Staff, Audit)
├── docs/                   # Developer, architecture, deployment & reports
│   ├── architecture/       # System and database architecture
│   ├── deployment/         # Environment variables, checklists, manual actions
│   ├── development/        # Vibe-coding guide, testing instructions
│   └── reports/            # Current status and archived historical audit reports
├── handover/               # Shopkeeper manuals & technical handover guides
│   ├── owner/              # Non-technical shopkeeper operating guides
│   └── technical/          # Developer credentials, backup, emergency response
├── scripts/                # Utility scripts (check-production, generate-favicons)
├── supabase/               # SQL schema, migrations, seed scripts
└── tests/                  # 244 automated test invariants (phases 1–12)
```

---

## 5. CRITICAL SECURITY BOUNDARIES (NEVER WEAKEN)

1. **Server-Side Pricing Authority (`src/lib/serverPricing.ts`):**
   - Prices submitted from customer client browsers are NEVER trusted.
   - All cart items, bullion calculations, 3% precious metal GST, and ₹500 shipping fees are re-calculated on the server from the authoritative database before generating Razorpay orders.
2. **Payment Signature Verification (`src/app/api/razorpay/verify/route.ts`):**
   - Razorpay orders are marked `paid` ONLY after HMAC-SHA256 signature verification passes using `RAZORPAY_KEY_SECRET`.
   - Webhooks in `src/app/api/razorpay/webhook/route.ts` verify signatures and use atomic database idempotency to prevent double-crediting.
3. **Zero-Trust Admin Access (`src/lib/adminAuth.ts` & `src/lib/staffAuth.ts`):**
   - Every admin action is tied to an individual staff identity (`owner`, `manager`, `staff`).
   - Shared passcode bypass is eliminated.
   - Owner actions require TOTP Multi-Factor Authentication (MFA).
   - Sessions are cryptographically signed with HMAC-SHA256 and can be instantly revoked across all serverless nodes.
4. **Image Upload Sanitization (`src/app/api/admin/upload/route.ts`):**
   - Files are decoded and sanitized via Sharp.
   - Rejects non-image files, SVG/HTML scripts disguised as images, polyglot payloads, and decompression bombs (>10MB or >4096px).
   - Strips EXIF metadata and re-encodes safely as WebP.
5. **Atomic Inventory Concurrency (`src/lib/inventoryEngine.ts`):**
   - Prevents two customers from purchasing the same unique jewellery piece.
   - Locks stock during payment checkout window (15-minute reservation). Releases lock if checkout is aborted or fails.
6. **Customer Privacy (IDOR Defenses):**
   - Orders and invoices cannot be retrieved without proof of ownership (matched phone number or tracking token).

---

## 6. BUSINESS & REGULATORY RULES

- **GST on Precious Jewellery:** Exactly 3% Goods and Services Tax applied to all gold, diamond, and silver items (HSN 7113).
- **Shipping Threshold:** Free insured courier delivery on orders of ₹50,000 and above. Flat ₹500 fee for orders under ₹50,000.
- **Daily Bullion Rate Sanity Bounds:** Gold rate changes in the admin console are bounded within ±10% to prevent devastating typographical errors.
- **Hallmarking:** All gold items feature BIS 6-digit HUID hallmarking.
- **Cash Transaction Limit (Rule 114B):** Cash orders above ₹2,00,000 strictly require customer PAN verification (PAN is validated with regex `^[A-Z]{5}[0-9]{4}[A-Z]{1}$`).

---

## 7. ESSENTIAL DEVELOPMENT & VERIFICATION COMMANDS

```bash
# Run local development server
npm run dev

# Run full automated test suite (244 tests across 101 suites)
npm test

# Run TypeScript type-checker (0 errors required)
npx tsc --noEmit

# Run ESLint (0 errors required)
npm run lint

# Compile production build (52 routes statically & dynamically generated)
npm run build

# Check production environment variables & placeholders
npm run check-production
```

---

## 8. CURRENT STATUS

| Component | Status | Details |
| :--- | :--- | :--- |
| **Storefront & Catalog** | ✅ COMPLETE | 49 public routes, categories, filters, wishlist, search. |
| **Admin Operations** | ✅ COMPLETE | Products CRUD, Bullion rates, Invoices, CSV, Coupons, Content. |
| **Staff & RBAC Auth** | ✅ COMPLETE | Individual staff accounts, TOTP MFA, session revocation. |
| **Automated Tests** | ✅ COMPLETE | 244/244 passing tests covering phases 1 through 12. |
| **Production Build** | ✅ COMPLETE | Compiles cleanly in Next.js 16.2.10 (Turbopack). |
| **Live Payment Keys** | ⏳ PENDING HUMAN | Requires shopkeeper/owner Razorpay Live production keys. |
| **Domain DNS & SSL** | ⏳ PENDING HUMAN | Requires pointing `ambikajewelsonline.com` to host. |
| **Production DB Migration** | ⏳ PENDING HUMAN | Run `supabase/migrations/20261110_staff_accounts_and_revocation.sql`. |

---

## 9. INSTRUCTIONS FOR FUTURE AI AGENTS

1. **Inspect Before Changing:** Always check `git status`, relevant test files, and existing code before touching any logic.
2. **Never Break Payment or Pricing Invariants:** Do not modify `serverPricing.ts` or `razorpay` routes without running `npm test`.
3. **No Legacy Backdoors:** Never re-introduce a shared password or bypass authentication for convenience.
4. **Never Expose Secrets:** Do not commit `.env.local` or include live production keys in code or documentation.
5. **Run the Quality Triad After Changes:** Every significant change must be validated with:
   - `npm test`
   - `npx tsc --noEmit`
   - `npm run build`
