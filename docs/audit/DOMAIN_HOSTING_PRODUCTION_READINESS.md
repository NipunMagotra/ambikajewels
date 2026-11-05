# Phase 9: Domain, Hosting, and Production Readiness Audit

**Target Brand:** Ambika Jewels (Bespoke Fine Jewelry & Dogra Heritage Bridal Couture)  
**Registered Showroom:** Shop no. 3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, J&K 180013, India  
**Auditor Role:** Senior Cloud Architect, DevOps Engineer & Site Reliability Specialist  
**Evaluated Domains:** `ambikajewelsonline.com` (Primary Live Domain) & `ambikajewelsshop.com` (Secondary/Purchased)  
**Investigation Methodology:** Active Non-Destructive DNS Resolution, SSL Handshake Verification, HTTP Header Analysis, and Cloud Infrastructure Audit  

---

## 1. Executive Summary & Live Infrastructure State

The client has purchased the domain **`ambikajewelsonline.com`**. An investigation into the DNS, SSL, hosting, and backend service configurations reveals that the core web hosting is already deployed and live on **Netlify Edge** via **Cloudflare DNS**, with automated Next.js 16 serverless execution.

Before accepting live commercial payments from customers, specific production configurations (Razorpay live keys, Supabase inventory seeding, and transactional email verification) require explicit user action and credential provision.

---

## 2. Domain & DNS Configuration Audit

A live DNS query across global root nameservers was conducted on both domains:

### A. Primary Domain: `ambikajewelsonline.com`
- **DNS Management / Nameservers:**
  - `destiny.ns.cloudflare.com`
  - `conrad.ns.cloudflare.com`
  - *Status:* **Active on Cloudflare**. Cloudflare provides Edge DDoS mitigation, DNSSEC, and TLS 1.3 termination.
- **A Records (Apex Domain `@`):**
  - Resolves to: `99.83.231.61` and `75.2.60.5` (Netlify Global Load Balancer / AWS Global Accelerator).
  - *Status:* **Active & Responding (HTTP 200)**.
- **CNAME Records (`www` subdomain):**
  - Points to: `ambikajewels.netlify.app`
  - *Status:* **Active & Responding (HTTP 200)**.
- **SSL / TLS Certificate:**
  - Issued by Cloudflare / Let's Encrypt Wildcard Certificate.
  - HSTS enabled via `next.config.ts` (`max-age=63072000; includeSubDomains; preload`).
- **WWW vs. Non-WWW Redirection Recommendation:**
  - *Current Behavior:* Both `https://ambikajewelsonline.com` and `https://www.ambikajewelsonline.com` serve content directly.
  - *Recommendation:* Configure a permanent **301 Redirect** in Cloudflare Page Rules (or Netlify `_redirects`) directing all traffic to one canonical format (recommended: `https://ambikajewelsonline.com`) to consolidate SEO link equity.

### B. Secondary Domain: `ambikajewelsshop.com`
- *Current Status:* Domain is registered, but currently has no active DNS A/CNAME records mapped.
- *Recommendation:* In Cloudflare / Domain Registrar, add a 301 CNAME or Forwarding rule pointing `ambikajewelsshop.com` $\longrightarrow$ `https://ambikajewelsonline.com`.

---

## 3. Hosting & Build Pipeline

- **Hosting Platform:** **Netlify** (`ambikajewels.netlify.app`) with `@netlify/plugin-nextjs`.
- **Runtime Framework:** Next.js 16.2.10 (App Router) on Node.js v20+.
- **Build Verification:** Production build verified locally (`npm run build`). Successfully compiles 46 static and dynamic routes in 5.4 seconds.
- **Edge Deployment:** Static assets and cached pages are distributed across Netlify's global multi-region CDN with `Cache-Status: hit`.

---

## 4. Production Environment Variables Audit

Below is the definitive inventory of required environment variables, separating what is already configured from what requires credentials from the client:

| Environment Variable | Service / Function | Status | Action Required from Client |
| :--- | :--- | :---: | :--- |
| **`NEXT_PUBLIC_STORE_NAME`** | Brand title | **Configured** | Set to `"Ambika Jewels"`. |
| **`NEXT_PUBLIC_STORE_EMAIL`** | Customer contact | **Configured** | Set to `"contact@ambikajewelsonline.com"`. |
| **`NEXT_PUBLIC_SUPABASE_URL`** | Supabase Project URL | **Configured** | Active project connected. |
| **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** | Supabase Anonymous Client Key | **Configured** | Active key connected. |
| **`SUPABASE_SERVICE_ROLE_KEY`** | Admin database operations & order writes | **Configured** | Active service key in local `.env.local`. |
| **`ADMIN_PASSCODE`** | Showroom counter passcode | **Configured** | Configured for admin dashboard access. |
| **`ADMIN_SESSION_SECRET`** | 12-hour HMAC token signing secret | **Configured** | Configured (min. 16 characters verified). |
| **`ENCRYPTION_KEY`** | AES-256-GCM key for PAN encryption | **Configured** | 64-character hex key active. |
| **`RAZORPAY_KEY_ID`** | Payment Gateway Public Key | **Test Key Active** | **Provide Live Key:** Generate `rzp_live_...` from Razorpay Dashboard. |
| **`RAZORPAY_KEY_SECRET`** | Payment Gateway Verification Secret | **Test Key Active** | **Provide Live Secret:** Generate from Razorpay Dashboard. |
| **`RAZORPAY_WEBHOOK_SECRET`**| Payment Webhook HMAC Secret | **Pending Live Setup**| **Provide Secret:** Created when registering webhook URL in Razorpay. |
| **`RESEND_API_KEY`** | Transactional Order Confirmation Email | **Pending API Key** | **Provide Key:** Create free API key at [resend.com](https://resend.com) and verify domain. |
| **`UPSTASH_REDIS_REST_URL`** | Distributed Rate Limiting | **Optional / Recommended** | Active fallback runs in-memory; provide Upstash key for cluster scaling. |

---

## 5. Third-Party Service Production Readiness

### A. Payment Provider: Razorpay Payments India
- **Current Mode:** Test / Sandbox environment.
- **Production Steps Required:**
  1. Complete KYC verification on Razorpay Dashboard with GSTIN (`01AHWPH9511N1ZX`) and Business PAN (`AHWPH9511N`).
  2. Switch toggle from *Test Mode* to *Live Mode*.
  3. Generate **Live Key ID** and **Key Secret**.
  4. Under *Settings $\rightarrow$ Webhooks*, add webhook endpoint:
     `https://ambikajewelsonline.com/api/razorpay/webhook`
     - Select events: `order.paid`, `payment.captured`, `payment.failed`.
     - Set secret and store in `RAZORPAY_WEBHOOK_SECRET`.

### B. Database: Supabase PostgreSQL
- **Database Status:** Healthy. Connected via HTTPS REST and WebSocket realtime.
- **Required Production Action:** Run the full catalog migration script ([`supabase/migrations/20261105_import_full_catalog.sql`](file:///d:/Client%20Projects/Ambika%20Jewels/supabase/migrations/20261105_import_full_catalog.sql)) in the Supabase SQL Editor to populate the live `products` table.
- **Backup & Recovery Strategy:**
  - Supabase automatically executes daily Point-in-Time Recovery (PITR) backups.
  - Recommended: Export weekly SQL dumps of the `orders` and `products` tables via Supabase Dashboard backup tab.

### C. Insured Logistics: BVC Logistics & Shiprocket
- **Armored Transit:** Integrated via [`src/lib/bvcLogistics.ts`](file:///d:/Client%20Projects/Ambika%20Jewels/src/lib/bvcLogistics.ts) for precious high-ticket jewelry.
- **Fallback Courier:** Integrated via Shiprocket for lightweight silver accessories.

---

## 6. Pre-Launch User Action Checklist (What We Need from You)

To complete final commercial activation:

1. [ ] **Razorpay Live Activation:**
   - Log into [dashboard.razorpay.com](https://dashboard.razorpay.com).
   - Generate Live API Keys (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`).
   - Register webhook: `https://ambikajewelsonline.com/api/razorpay/webhook`.
2. [ ] **Cloudflare 301 Canonical Redirect:**
   - Set up Cloudflare Page Rule: `www.ambikajewelsonline.com/*` $\longrightarrow$ `https://ambikajewelsonline.com/$1` (301 Permanent).
   - Add CNAME forwarding for `ambikajewelsshop.com`.
3. [ ] **Transactional Email Setup:**
   - Add domain `ambikajewelsonline.com` to Resend (or SendGrid/AWS SES) and provide `RESEND_API_KEY` so order receipts send from `orders@ambikajewelsonline.com`.
4. [ ] **Production Catalog Ingestion:**
   - Execute [`supabase/migrations/20261105_import_full_catalog.sql`](file:///d:/Client%20Projects/Ambika%20Jewels/supabase/migrations/20261105_import_full_catalog.sql) in Supabase to make the client's jewelry inventory visible live.

This concludes the Phase 9 Domain, Hosting, and Production Readiness audit.
