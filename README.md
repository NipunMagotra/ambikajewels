# Ambika Jewels — Fine Jewelry E-Commerce & Showroom Platform

> **Authentic Dogra Heritage & Fine Jewelry**  
> Jammu, Jammu & Kashmir (UT)

Ambika Jewels is a production-grade, secure Next.js e-commerce platform and in-store counter operations suite designed for fine jewelry retail. It features certified hallmarked gold, diamond, and 925 sterling silver collections, authentic Dogra craftsmanship, real-time bullion rate tracking, and enterprise-grade payment and logistics integrations.

---

## 📁 Repository Directory Structure

```text
├── docs/                                # Centralized project & business documentation
│   ├── BUSINESS_KNOWLEDGE_BASE.md       # Showroom guide, brand heritage, Karigar history & USPs
│   ├── PROJECT_OVERVIEW.md              # Technical architecture, system design & API specifications
│   ├── SECURITY_AUDIT_REPORT.md         # 6-phase security audit findings & remediation verification
│   ├── CLIENT_ONBOARDING_AND_CREDENTIALS_CHECKLIST.md  # Production cutover & API keys checklist
│   ├── LEGAL_SAVINGS_SCHEME_CHECKLIST.md # Statutory compliance & regulatory requirements
│   ├── PROPOSAL_STAFF_ACCOUNTS_AUDIT_LOG.md            # Role-based access control architecture proposal
│   └── dependency-graph.svg             # Madge/Graphviz architectural module dependency diagram
├── public/                              # Optimized static assets & product imagery
│   ├── hero-clean.png                   # Primary showroom banner & fallback product visual
│   └── products/                        # High-resolution heritage jewelry photography
├── src/                                 # Next.js Application Source Code
│   ├── app/                             # App Router pages and REST API routes
│   │   ├── (storefront)/                # Catalog, product details, cart, checkout, legal policies
│   │   ├── admin/                       # In-store counter tools, rate board, orders management
│   │   └── api/                         # Secured API endpoints (Razorpay, BVC, rate lock, chat, etc.)
│   ├── components/                      # Modular React UI components
│   │   ├── catalog/                     # Product cards, detail client, and filtering
│   │   ├── counter/                     # Showroom billing calculator, rate tickers, Form 60 modal
│   │   ├── layout/                      # Responsive header, mega menu, footer, mobile nav
│   │   ├── home/                        # Hero, Dogra heritage storytelling, bestsellers, trust badges
│   │   ├── chat/                        # AI concierge assistant widget (Aanya)
│   │   ├── compliance/                  # DPDP consent and regulatory banners
│   │   ├── search/                      # Instant catalog search modal (⌘K)
│   │   └── ui/                          # Shared UI buttons, toasts, dividers
│   ├── config/                          # Central store metadata, tax rules, and thresholds
│   ├── context/                         # Client-side state (Shopping Cart with localStorage sync)
│   ├── data/                            # Verified catalog seeds and showroom FAQ knowledge base
│   ├── lib/                             # Core utilities, security engines, and external integrations
│   │   ├── adminAuth.ts                 # Timing-safe HMAC session token authentication
│   │   ├── bvcLogistics.ts              # BVC Secure Logistics armored transit integration
│   │   ├── catalogSearch.ts             # Fuzzy token-based catalog search engine
│   │   ├── checkoutValidation.ts        # Phone normalization & Rule 114B PAN verification
│   │   ├── counterStore.ts              # Daily Jammu bullion rate state
│   │   ├── encryption.ts                # AES-256-GCM encryption for customer PII & PAN
│   │   ├── pricingEngine.ts             # Client-side dynamic pricing calculation
│   │   ├── serverPricing.ts             # Tamper-proof server-side pricing verification engine
│   │   ├── rateLimit.ts                 # Upstash Redis token-bucket rate limiter
│   │   ├── rateLock.ts                  # Bullion rate lock signature generation
│   │   ├── supabase.ts                  # Supabase database client singleton
│   │   └── whatsapp.ts                  # WhatsApp concierge direct messaging deep links
│   ├── types/                           # TypeScript interfaces for products, orders, and counter tools
│   └── middleware.ts                    # Zero-trust route guarding for admin endpoints
├── supabase/                            # Database schemas, migrations, and seed data
│   ├── schema.sql                       # Core PostgreSQL schema with RLS policies
│   ├── seed.sql                         # Initial catalog database records
│   └── migrations/                      # Applied schema migrations & proposals
├── tests/                               # Comprehensive automated test suites (130+ unit & integration tests)
└── scripts/                             # Operational & security verification scripts
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+ (recommended LTS)
- npm or pnpm

### 2. Environment Configuration
Copy `.env.example` to `.env.local` and configure your credentials:
```bash
cp .env.example .env.local
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

Run the comprehensive test suite (covers security, pricing engines, auth, and accessibility):
```bash
npm test
```

Run production readiness placeholder audits:
```bash
npm run check-production
```

Build the production bundle:
```bash
npm run build
```

---

## 🔒 Security & Compliance Architecture

- **Server-Side Pricing Engine**: Client cart prices are strictly untrusted; all item totals, GST (3%), and shipping fees are calculated authoritatively on the server.
- **Rule 114B PAN Compliance**: Statutory PAN collection for high-value orders (≥ ₹2,00,000) encrypted with AES-256-GCM.
- **Armored Logistics**: Direct API integration with BVC Logistics for tamper-evident transit and vault-to-vault secure delivery.
- **Zero-Trust Admin Protection**: Admin portals and routes are guarded at the Next.js middleware layer with timing-safe HMAC sessions.
