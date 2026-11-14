# 🚀 Ambika Jewels — Production Launch Blueprint & Status

> **Target Domain:** `https://ambikajewelsonline.com` (or your chosen production domain)  
> **Framework:** Next.js 16 (App Router) + React 19 + Tailwind CSS 4  
> **Status:** **~85% Complete — Pre-Launch Final Phase**  
> **Last Updated:** November 2026

---

## 📊 Quick Status Summary

| Area | Status | Progress | Notes |
| :--- | :---: | :---: | :--- |
| **Source Code & Features** | ✅ READY | 100% | Full storefront, catalog, cart, checkout, admin suite, chatbot |
| **Security & Automated Tests** | ✅ READY | 100% | **244 / 244 tests passing** (101 suites), zero-trust RLS, HMAC tokens |
| **Statutory & Legal KYC** | ✅ READY | 100% | Verified GSTIN, PAN, BIS Hallmark license & Consumer Protection compliance |
| **Database Schema (Supabase)** | ✅ READY | 100% | 15 tables, indexes, triggers, stored procedures, and 15 FAQs deployed |
| **Cloud Services Config** | 🟡 PARTIAL | 80% | Supabase, Resend, Upstash, Groq configured; Razorpay & Storage bucket pending |
| **Hosting & Live Deployment** | ⏳ PENDING | 0% | Netlify connection, custom domain DNS, SSL, and live smoke test |

---

## ✅ What is DONE

### 1. Storefront & Customer Experience
* [x] **Responsive Mobile-First UI:** Fully responsive design built with Next.js 16, React 19, and Tailwind CSS 4.
* [x] **Jewellery Catalog:** Filterable by category (Necklaces, Earrings, Bangles, Rings, Bridal), collection, and purity.
* [x] **Dynamic Pricing Engine:** Server-authoritative price breakdown (Metal Value + Making Charges + 3% GST).
* [x] **Cart & Checkout:** Client-side cart with server-side validation to prevent client price tampering.
* [x] **Order Tracking:** Self-service tracking at `/track` matching order reference + customer phone/email.
* [x] **Ambika AI Concierge:** AI customer assistant powered by Groq LLM with store knowledge and FAQ search.
* [x] **DPDP Act 2023 Compliance:** Customer data access/deletion portal at `/privacy-request` with audit receipts.

### 2. Store Owner Administration (`/admin`)
* [x] **Staff Portal Discovery:** Hidden link in footer for showroom staff to access `/admin`.
* [x] **Authentication:** Secure passkey login with timing-safe validation and 12-hour session lifetime.
* [x] **Product Operations:** Add pieces, upload photos, change prices, clone products, toggle 1-click **Sold Out**.
* [x] **Daily Bullion Rates:** Set daily 24K, 22K, 18K, 14K gold and silver rates with typo-guard bounds.
* [x] **Coupon Management:** Create, toggle, and manage percentage or flat promotional discount codes.
* [x] **Tamper-Evident Audit Logging:** Every price change, rate update, and stock toggle logs to `admin_audit_logs`.

### 3. Database & Security Infrastructure
* [x] **Consolidated Production SQL Schema:** Created and executed in Supabase ([`supabase/full_production_schema.sql`](./supabase/full_production_schema.sql)).
  * 15 complete tables: `products`, `orders`, `daily_rates`, `coupons`, `store_settings`, `staff_accounts`, `revoked_sessions`, `admin_audit_logs`, `inventory_reservations`, `webhook_events`, `customer_savings_goals`, `order_timeline`, `faq_items`, `newsletter_subscribers`, `data_subject_requests`.
* [x] **Atomic Inventory Locking:** PostgreSQL procedure `reserve_inventory_atomic` prevents overselling during high-traffic checkout.
* [x] **Full Row Level Security (RLS):** All tables strictly protected against unauthorized public anon reads and mutations.
* [x] **Automated Test Suite:** All 244 unit, security, IDOR, pricing, and compliance tests pass (`npm run test`).
* [x] **Repository Cleanup:** Removed 4,500+ unneeded agent skills and legacy caches, keeping the repo fast and light.

### 4. Configured Environment Variables (`.env.local`)
* [x] `NEXT_PUBLIC_SUPABASE_URL`
* [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
* [x] `SUPABASE_SERVICE_ROLE_KEY`
* [x] `GROQ_API_KEY` (Ambika AI Chatbot)
* [x] `GOLDAPI_KEY` (Daily Bullion Rates)
* [x] `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN` (Rate Limiting & DDoS defense)
* [x] `RESEND_API_KEY` & `RESEND_FROM_EMAIL` (Transactional order emails)
* [x] `ADMIN_PASSCODE` & `ADMIN_SESSION_SECRET` (Staff portal protection)
* [x] `STORE_LEGAL_NAME`, `STORE_ENTITY_TYPE`, `STORE_GSTIN`, `STORE_PAN`, `STORE_BIS_LICENSE`

---

## ⏳ What is LEFT to Do

### 1. Supabase Storage Bucket Setup
- [ ] Go to [Supabase Dashboard](https://supabase.com) → **Storage**.
- [ ] Click **New Bucket**, name it **`products`**, and toggle **Public bucket** to **ON**.
- [ ] Click **Save**. *(Required for uploaded jewellery pictures to display to shoppers)*.

### 2. Live Payment Gateway (Razorpay)
Currently, Razorpay keys in `.env.local` are pending live activation:
- [ ] Go to [Razorpay Dashboard](https://dashboard.razorpay.com) → **Settings** → **API Keys**.
- [ ] Generate Live Keys and update `.env.local`:
  ```env
  NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx
  RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
  ```
- [ ] Add Live Webhook in Razorpay Dashboard → **Settings** → **Webhooks**:
  * **Webhook URL:** `https://yourdomain.com/api/razorpay/webhook`
  * **Secret:** Choose a secret and set `RAZORPAY_WEBHOOK_SECRET=your_webhook_secret`
  * **Active Events:**
    * `order.paid`
    * `payment.captured`
    * `payment.failed`

### 3. Add Dedicated PII Encryption Secret
- [ ] Generate a 64-character random hex string and add to `.env.local`:
  ```powershell
  # Generate in PowerShell:
  -join ((1..32) | ForEach-Object { '{0:x2}' -f (Get-Random -Max 256) })
  ```
  ```env
  ENCRYPTION_SECRET=your_generated_64_char_hex_key
  ```

### 4. Logistics & Couriers (BVC / Shiprocket)
- [ ] If using BVC Armored Logistics, set:
  `BVC_API_KEY`, `BVC_API_SECRET`, `BVC_APP_ID`, `BVC_ORIGIN_PINCODE=180013`, `BVC_WEBHOOK_SECRET`
- [ ] Or if using Shiprocket, configure `SHIPROCKET_EMAIL` and `SHIPROCKET_PASSWORD`.

### 5. Final Local Pre-Flight Check
Run these four commands in your terminal:
```powershell
npm run check-production  # Verifies owner statutory disclosures
npm run test              # Runs all 244 tests
npm run lint              # Checks for code quality issues
npm run build             # Verifies clean Next.js production build
```

### 6. Hosting Deployment & Custom Domain
- [ ] Push code to GitHub repository (do **not** commit `.env.local`).
- [ ] In **Netlify** (or **Vercel**):
  * Connect repository.
  * Add all environment variables from `.env.local` into the hosting dashboard (**Site settings** → **Environment variables**).
- [ ] Configure DNS:
  * Point your domain's `A` and `CNAME` records to Netlify.
  * Verify SSL certificate generates and activates.

### 7. Post-Launch Smoke Test
- [ ] Place a real order on the live website (e.g. create a ₹1 test jewellery item or real purchase).
- [ ] Verify Razorpay payment processes successfully.
- [ ] Confirm order lands in Supabase `orders` table.
- [ ] Check customer order confirmation email arrives from `orders@ambikajewelsonline.com`.
- [ ] Log in to `/admin` using your `ADMIN_PASSCODE` to verify order status management.

---

## 🔗 All Service Connections & Credentials Map

This map lists every external service, what it does, and where credentials are managed:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AMBIKA JEWELS PRODUCTION                        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
┌──────────────┐             ┌──────────────┐             ┌──────────────┐
│   SUPABASE   │             │   RAZORPAY   │             │    RESEND    │
│  (Database)  │             │  (Payments)  │             │   (Emails)   │
└──────┬───────┘             └──────┬───────┘             └──────┬───────┘
       │                            │                            │
       ├─ NEXT_PUBLIC_SUPABASE_URL  ├─ NEXT_PUBLIC_RAZORPAY_KEY  ├─ RESEND_API_KEY
       ├─ NEXT_PUBLIC_SUPABASE_ANON ├─ RAZORPAY_KEY_SECRET       └─ RESEND_FROM_EMAIL
       └─ SUPABASE_SERVICE_ROLE_KEY └─ RAZORPAY_WEBHOOK_SECRET
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
┌──────────────┐             ┌──────────────┐             ┌──────────────┐
│   UPSTASH    │             │  GROQ CLOUD  │             │  BVC / SHIP  │
│(Rate Limits) │             │ (Ambika AI)  │             │ (Logistics)  │
└──────┬───────┘             └──────┬───────┘             └──────┬───────┘
       │                            │                            │
       ├─ UPSTASH_REDIS_REST_URL    └─ GROQ_API_KEY              ├─ BVC_API_KEY
       └─ UPSTASH_REDIS_REST_TOKEN                               └─ BVC_API_SECRET
```

### Detailed Connection Directory

| Service | Portal / Dashboard | Required Keys | Purpose |
| :--- | :--- | :--- | :--- |
| **Supabase** | [supabase.com/dashboard](https://supabase.com/dashboard) | `NEXT_PUBLIC_SUPABASE_URL`<br>`NEXT_PUBLIC_SUPABASE_ANON_KEY`<br>`SUPABASE_SERVICE_ROLE_KEY` | PostgreSQL database, RLS security, and `products` storage bucket for photos. |
| **Razorpay** | [dashboard.razorpay.com](https://dashboard.razorpay.com) | `NEXT_PUBLIC_RAZORPAY_KEY_ID`<br>`RAZORPAY_KEY_SECRET`<br>`RAZORPAY_WEBHOOK_SECRET` | Handles UPI, Cards, Net Banking checkout and sends payment verification webhooks. |
| **Resend** | [resend.com](https://resend.com) | `RESEND_API_KEY`<br>`RESEND_FROM_EMAIL` | Sends branded order invoices and customer confirmations. *(Requires domain DNS verification).* |
| **Upstash** | [console.upstash.com](https://console.upstash.com) | `UPSTASH_REDIS_REST_URL`<br>`UPSTASH_REDIS_REST_TOKEN` | High-speed distributed Redis store for anti-bot protection and API rate limiting. |
| **Groq Cloud** | [console.groq.com](https://console.groq.com) | `GROQ_API_KEY` | Powers the Ambika AI jewellery concierge with ultra-fast inference. |
| **GoldAPI** | [goldapi.io](https://goldapi.io) | `GOLDAPI_KEY` | Fetches live market bullion rates for 24K, 22K, 18K gold and silver. |
| **Logistics** | [bvclogistics.com](https://www.bvclogistics.com) | `BVC_API_KEY`<br>`BVC_API_SECRET`<br>`BVC_WEBHOOK_SECRET` | Insured armored jewellery shipping, docket creation, and security bag tracking. |
| **Admin Auth** | Local Secret | `ADMIN_PASSCODE`<br>`ADMIN_SESSION_SECRET` | Protects store owner operations at `/admin` with HMAC signed session tokens. |
| **PII Crypto** | Local Secret | `ENCRYPTION_SECRET` | AES-256 encryption at rest for customer PAN numbers and phone numbers. |

---

## 🚦 Go-Live Command Summary

When you are ready to ship:

```powershell
# 1. Test production legal disclosure check
npm run check-production

# 2. Run automated test suite
npm run test

# 3. Build project
npm run build

# 4. Deploy to Netlify
git push origin main
```

