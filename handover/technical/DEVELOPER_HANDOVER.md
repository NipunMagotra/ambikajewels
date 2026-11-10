# Ambika Jewels — Developer & Technical Architecture Handover

**Version:** 1.0.2  
**Target Environment:** Node.js 20.x or 22.x LTS  
**Framework:** Next.js 16.2.10 (App Router, Turbopack)  
**Database:** Supabase PostgreSQL with Row Level Security (RLS)  
**Security Standard:** OWASP ASVS v4.0.3, PCI-DSS Level 1 via Razorpay Elements, Section 31 CGST Act  

---

## 1. System Architecture Overview

```
                      ┌──────────────────────────────────────────────┐
                      │             Customer Browser                 │
                      │   (Next.js React 19 Frontend + SSR / RSC)    │
                      └──────────────────────┬───────────────────────┘
                                             │ HTTPS / TLS 1.3
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │         Next.js App Router Backend           │
                      │  - Server Route Handlers (/api/*)            │
                      │  - Rate Limiter (Upstash Token Bucket)       │
                      │  - Admin Auth (HMAC-SHA256 12-Hour Session)  │
                      │  - Server Pricing Engine (HSN 7113 3% GST)   │
                      └──────┬───────────────┬───────────────┬───────┘
                             │               │               │
            ┌────────────────▼─┐   ┌─────────▼──────┐   ┌───▼────────────────┐
            │     Supabase     │   │    Razorpay    │   │   BVC Logistics    │
            │  PostgreSQL DB   │   │  Payment API   │   │ High-Value Armed   │
            │  RLS Policies    │   │  Webhooks HMAC │   │ Transit Dispatch   │
            │  Storage Buckets │   │  Idempotency   │   │ Barcode Dockets    │
            └──────────────────┘   └────────────────┘   └────────────────────┘
```

---

## 2. Directory Structure & Key Files

```
├── handover/                                # Business & Owner Handover Package
│   ├── README.md                            # Handover master table of contents
│   ├── owner/                               # Shopkeeper operating guides
│   │   ├── OWNER_MANUAL.md                  # Non-technical step-by-step operating manual
│   │   ├── SHOPKEEPER_QUICK_START.md        # 1-page printable daily counter sheet
│   │   └── DAILY_OPERATING_CHECKLIST.md     # Morning & evening routine
│   └── technical/                           # Infrastructure & developer runbooks
│       ├── ACCOUNT_AND_SERVICE_HANDOVER.md  # Service credentials & ownership transfer
│       ├── BACKUP_AND_EMERGENCY_GUIDE.md    # Emergency procedures & troubleshooting
│       ├── DEVELOPER_HANDOVER.md            # Technical architecture & deployment runbook
│       ├── SECURITY_OPERATIONS_GUIDE.md     # Operational security & key rotation
│       └── SECURITY_INCIDENT_RESPONSE.md    # Security incident response playbook
├── src/
│   ├── app/
│   │   ├── admin/                          # Owner Admin Console (/admin)
│   │   │   ├── page.tsx                    # Auth verification guard
│   │   │   ├── AdminDashboardClient.tsx    # 9-tab Store Management UI
│   │   │   └── login/                      # Admin passcode authentication
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── audit/                  # Tamper-evident audit logging API
│   │   │   │   ├── content/                # Store website content API
│   │   │   │   ├── coupons/                # Promotional coupon CRUD API
│   │   │   │   ├── orders/                 # Order lifecycle & BVC docket API
│   │   │   │   ├── products/               # Jewellery catalog CRUD & bulk updates
│   │   │   │   ├── rates/                  # Daily bullion rates & sanity guard
│   │   │   │   └── upload/                 # Multipart image upload to storage
│   │   │   ├── razorpay/                   # Order creation & signature verification
│   │   │   ├── track/                      # IDOR-protected order tracking API
│   │   │   └── rates/lock/                 # 15-minute price lock token API
│   ├── components/
│   │   ├── admin/                          # Modular admin UI components
│   │   │   ├── InvoiceModal.tsx            # Form GST INV-1 Section 31 tax invoice
│   │   │   ├── PackingSlipModal.tsx        # Workshop packing sheet & checklist
│   │   │   ├── ProductModal.tsx            # 4-step jewellery product wizard
│   │   │   ├── BulkActionModal.tsx         # Bulk price & stock adjustment
│   │   │   ├── CsvModals.tsx               # Catalog CSV import & export
│   │   │   └── CouponModal.tsx             # Promotional coupon configuration
│   │   ├── counter/                        # Goldsmith Counter POS Billing
│   │   │   └── BillingCalculator.tsx       # Real-time counter invoice calculator
│   │   └── layout/                         # Header, Footer, Newsletter, Navigation
│   ├── config/
│   │   └── siteConfig.ts                   # Statutory KYC, GSTIN, PAN, and store metadata
│   ├── lib/
│   │   ├── adminAuth.ts                    # HMAC-SHA256 session token generation & verify
│   │   ├── auditLog.ts                     # Multi-tier audit logger (DB + in-memory ring)
│   │   ├── couponEngine.ts                 # Server-authoritative discount calculation
│   │   ├── rateLimit.ts                    # Upstash Redis & memory sliding window
│   │   ├── serverPricing.ts                # Authoritative pricing & 3% GST computation
│   │   ├── supabase.ts                     # Public Supabase client
│   │   └── supabaseAdmin.ts                # Elevated service-role client (server only)
├── supabase/
│   ├── schema.sql                          # Base PostgreSQL schema with RLS policies
│   └── migrations/                         # Migration scripts & proposals
└── tests/                                  # 182 Automated Test Suites (Node.js test runner)
```

---

## 3. Core Architectural Invariants

### 1. Server-Authoritative Pricing (Anti-Tampering)
- **Rule:** Never trust prices, totals, discounts, or tax figures sent from the client.
- **Implementation:** `src/lib/serverPricing.ts` queries the authoritative catalog, calculates:
  $$\text{Subtotal} = \sum (\text{item.quantity} \times \text{server\_price})$$
  $$\text{Tax (GST 3\%)} = \text{round}((\text{Subtotal} - \text{Discount}) \times 0.03)$$
  $$\text{Total} = \text{Subtotal} - \text{Discount} + \text{Tax} + \text{Shipping}$$
- Any discrepancy between client cart and server pricing rejects the order before reaching Razorpay.

### 2. Zero-Trust Admin Authentication
- Admin sessions use HMAC-SHA256 tokens in format: `<expiry_timestamp>.<hmac_signature>`.
- Token validity is strictly 12 hours (`ADMIN_SESSION_MAX_AGE_SECONDS = 43200`).
- Cryptographic constant-time comparison prevents timing attacks.
- Passcode is validated strictly server-side. No client bundle exposes secrets.

### 3. Customer Privacy & IDOR Prevention
- `/api/track` and `/order-status` strictly require proof of ownership:
  - Matching phone number, or
  - Matching email address, or
  - Cryptographically signed HMAC invoice token.
- Unauthenticated requests receive HTTP 401 with zero PII exposure.

### 4. CBDT Rule 114B PAN Compliance
- Indian tax regulations require customer PAN for jewellery transactions exceeding ₹2,00,000.
- PAN numbers are validated with standard regex `^[A-Z]{5}[0-9]{4}[A-Z]{1}$` and encrypted at rest with AES-256-GCM.

---

## 4. Database Schema & Migration Guide

The primary database schema is in `supabase/schema.sql`.

Key Tables:
- `products`: Catalog items, price in paise, purities, weights, HUIDs, stock status.
- `orders`: Online customer orders, line items JSONB, Razorpay IDs, BVC tracking dockets.
- `daily_rates`: Real-time Jammu gold & silver bullion rates with modification history.
- `coupons`: Active and scheduled promotional discount rules.
- `admin_audit_logs`: Append-only tamper-evident audit ledger with RLS blocking updates/deletes.
- `webhook_events`: Idempotent deduplication ledger preventing duplicate payment processing.

---

## 5. Development & Testing Commands

```bash
# Install dependencies
npm install

# Run development server (Turbopack)
npm run dev

# Run automated test suite (182 tests)
npm test

# Run TypeScript typecheck
npx tsc --noEmit

# Run ESLint check
npm run lint

# Run production KYC and environment sanity audit
npm run check-production

# Build optimized production bundle
npm run build
```

---

## 6. Production Deployment Runbook

1. **Hosting Platform:** Connect Git repository branch `main` to Vercel, Railway, or AWS.
2. **Environment Variables:** Configure all secrets in the hosting dashboard (never commit `.env.local` to git).
3. **Database Setup:** Run `supabase/schema.sql` on the production Supabase instance.
4. **Storage Bucket:** Verify that the `products` bucket exists in Supabase Storage with public read access.
5. **Razorpay Webhooks:** Configure webhook URL `https://ambikajewelsonline.com/api/razorpay/webhook` with event `payment.captured` and matching secret.
6. **Health Check:** Confirm `https://ambikajewelsonline.com` loads with HTTP 200 and `/admin` requests passcode authentication.

---
*Ambika Jewels Technical Documentation*

