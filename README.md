# Ambika Jewels — Fine Jewelry E-Commerce & Showroom Platform

> **Authentic Dogra Heritage & Fine Jewelry**  
> Jammu, Jammu & Kashmir (UT)

Ambika Jewels is a production-grade, secure Next.js e-commerce platform and in-store counter operations suite designed for fine jewelry retail. It features certified hallmarked gold, diamond, and 925 sterling silver collections, authentic Dogra craftsmanship, real-time bullion rate tracking, and enterprise-grade payment and logistics integrations.

---

## 🧭 Master Project Context for AI Assistants & Developers

👉 **Authoritative Master Reference:** **[PROJECT_CONTEXT.md](file:///d:/Client%20Projects/Ambika%20Jewels/PROJECT_CONTEXT.md)**  
*All AI agents and developers must read `PROJECT_CONTEXT.md` before proposing or making changes to the codebase.*

---

## 📁 Repository Directory Structure

```text
├── PROJECT_CONTEXT.md                   # Single Authoritative AI Context & Rules Document
├── docs/                                # Centralized Documentation Suite (see docs/README.md)
│   ├── architecture/                    # Full-stack topology, database schema, sequence diagrams
│   ├── security/                        # Threat matrix, operational security, incident response
│   ├── deployment/                      # Netlify & Supabase guides, env variables, manual actions
│   ├── development/                     # Non-technical vibe-coding guide, testing guides
│   └── reports/                         # Current status, report index, and archived audits
├── handover/                            # Segregated Store Management Handover (see handover/README.md)
│   ├── owner/                           # Non-technical shopkeeper manual, quick start, daily checklist
│   └── technical/                       # Credentials directory, emergency guides, developer specs
├── public/                              # Static assets, luxury favicons, PWA icons, product images
├── src/                                 # Next.js Application Source Code
│   ├── app/                             # App Router (49 routes, public pages, admin, REST API)
│   ├── components/                      # Modular UI (Admin modals, product cards, layout, chat)
│   ├── config/                          # siteConfig.ts (Central business metadata & regulatory rules)
│   ├── context/                         # CartContext, WishlistContext
│   ├── data/                            # Verified seed catalog data
│   ├── lib/                             # Core engines (Pricing, Inventory, StaffAuth, BVC, Sharp)
│   └── types/                           # TypeScript interfaces
├── supabase/                            # PostgreSQL schemas, migrations, seed scripts
├── tests/                               # 244 automated test invariants across 101 test suites
└── scripts/                             # Operational & verification scripts
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

Run the comprehensive test suite (244 automated invariants across 101 suites):
```bash
npm test
```

Run TypeScript compiler check (0 errors):
```bash
npx tsc --noEmit
```

Run production readiness placeholder audits:
```bash
npm run check-production
```

Build the production bundle (52 routes statically/dynamically generated):
```bash
npm run build
```

---

## 🔒 Security & Compliance Architecture

- **Server-Side Pricing Engine**: Client cart prices are strictly untrusted; all item totals, GST (3%), and shipping fees are calculated authoritatively on the server.
- **Individual Staff Identity & RBAC**: Shared PIN eliminated; individual staff accounts, PBKDF2-SHA512 password hashing with per-account salts, and TOTP MFA for Owner actions.
- **Distributed Session Revocation**: Token hashes persisted in database for instant revocation across serverless instances.
- **Rule 114B PAN Compliance**: Statutory PAN collection for high-value orders (≥ ₹2,00,000) encrypted with AES-256-GCM.
- **Armored Logistics**: Direct integration with BVC Logistics for tamper-evident transit and vault-to-vault secure delivery.
- **Zero-Trust Admin Protection**: Admin portals and routes are guarded at the Next.js middleware layer with timing-safe HMAC sessions.
