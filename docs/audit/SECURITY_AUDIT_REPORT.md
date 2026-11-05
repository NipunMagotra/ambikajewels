# Phase 6: Comprehensive Security Audit & Threat Model Report

**Target Brand:** Ambika Jewels (Bespoke Fine Jewelry & Dogra Heritage Bridal Couture)  
**Registered Showroom:** Shop no. 3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, J&K 180013, India  
**Auditor Role:** Senior Application Security Architect & Penetration Tester  
**Frameworks Evaluated:** OWASP Top 10 (2021), OWASP API Security Top 10 (2023), ASVS v4.0.3, Indian IT Act 2000 & DPDP Act 2023  
**Testing Methodology:** Safe, Non-Destructive Static Analysis (SAST), Software Composition Analysis (SCA), and Dynamic Verification (DAST) on Dedicated Staging Environment  
**Automated Regression Coverage:** 154 passing unit/integration security tests + Playwright E2E security suites  

---

## 1. Executive Summary & Security Posture

A comprehensive pre-launch security review was conducted across all API endpoints, authentication boundaries, payment processing pipelines, statutory data handling routines, and admin interfaces of the Ambika Jewels platform.

Because high-value jewelry transactions involve significant capital (ranging from ₹25,000 to over ₹5,00,000 per order) and legally protected taxpayer identifiers (Indian PAN cards), the application was evaluated against severe adversarial threats, including **client-side price manipulation**, **inventory exhaustion**, **IDOR customer data exfiltration**, **payment webhook spoofing**, and **administrative privilege escalation**.

### Overall Security Rating: **STRONG (Grade: A-)**

The platform exhibits architectural defense-in-depth:
- **Zero Client Trust:** Pricing is computed entirely server-side from authoritative database records. Client-injected prices or fractional quantities are strictly rejected.
- **Cryptographic Payment Integrity:** Timing-safe HMAC-SHA256 signature verification and persistent idempotency guards protect Razorpay transaction verifications and webhooks.
- **Strict Data Encryption at Rest:** Mandatory customer PANs collected under CBDT Rule 114B are encrypted using authenticated **AES-256-GCM** before database insertion.
- **Zero-Trust Administrative Perimeter:** All administrative endpoints (`/admin/*` and `/api/admin/*`) are enforced at the Next.js Edge/Middleware level via 12-hour HMAC signed session tokens.

---

## 2. Threat Surface & Detailed Vulnerability Assessment

### A. Authentication & Session Management
- **Architecture:** Administrative access requires an `ADMIN_PASSCODE` that issues a cryptographically signed HMAC-SHA256 session token (`ambika_admin_session`) with an immutable 12-hour expiration timestamp.
- **Cookie Security Configuration:**
  - `HttpOnly: true` (Inaccessible to malicious client-side JavaScript / XSS).
  - `SameSite: 'strict'` (Mitigates Cross-Site Request Forgery).
  - `Secure: true` (Enforced in production environments over HTTPS).
  - `Path: '/'`.
  - `Max-Age: 43200` (Strict 12-hour session lifetime).
- **Security Tests:** Verified in `Phase 1` and `Phase 5` test suites:
  - Expired tokens are rejected.
  - Tampered signatures or manipulated timestamps are rejected.
  - Query parameter bypass attempts (`?admin=true`, `?bypass=1`) are blocked.
  - Spoofed headers (`X-Forwarded-For`, `X-Admin`, `X-Role`) are ignored.
- **Identified Risk (Severity: Low-to-Medium):** Shared administrative passcode across showroom counter staff.  
  *Remediation Recommendation:* Transition from a single shared passcode to individual staff accounts with audit logging as proposed in `supabase/migrations/proposal_staff_accounts_and_audit_log.sql`.

---

### B. Authorization & Anti-IDOR Protections (Broken Object Level Authorization)
- **Public Order Tracking (`/track` & `/api/track`):**
  - High-ticket jewelry orders contain sensitive Personally Identifiable Information (customer legal name, delivery address, phone number, purchase amount, BVC armored tracking dockets).
  - *Finding & Remediation in Phase 1:* The tracking endpoint originally queried `data.email` and `data.phone`, while the database schema stored `customer_email` and `customer_phone`. This bug was resolved and verified with automated regression tests.
  - *Anti-IDOR Defense:* Tracking requests require the `order_id` **plus** proof of ownership: either the verified customer phone number, verified customer email, or a cryptographically signed order access token (`generateOrderAccessToken()`). Unauthenticated attackers guessing sequential order numbers receive HTTP 403 Forbidden.
- **Database Row Level Security (RLS):**
  - Supabase tables (`webhook_events`, `customer_savings_goals`, `orders`) enforce RLS policies preventing the public anonymous key (`anon`) from reading or modifying order data directly.

---

### C. Financial & Business Logic Integrity (Anti-Tampering)
- **Server-Side Pricing Engine (`src/lib/serverPricing.ts`):**
  - The client transmits only `product_id` and `quantity`.
  - The backend retrieves the product from the authoritative database, verifying active stock status.
  - Computes subtotal in integer paise, applies statutory 3% GST on HSN 7113, and enforces the ₹50,000 free shipping threshold.
  - *Input Sanitization:* Input quantities are strictly validated: non-integers, decimals (`1.5`), zeros, and negative numbers (`-2`) are rejected with HTTP 400.
- **Intraday Bullion Rate-Lock Guard:**
  - Gold prices fluctuate dynamically throughout trading hours. To protect the showroom against market spikes during checkout, the platform issues a 15-minute signed rate-lock token (`/api/rates/lock`).
  - Checkout verifies the token's HMAC signature and timestamp, rejecting orders if the rate lock has expired.
- **Bullion Rate Sanity Bounds:**
  - Administrative bullion rate updates (`/api/admin/rates`) feature a **5% deviation safeguard**. If a staff member enters an accidental typo (e.g., ₹850/g instead of ₹8,500/g), the update is blocked unless explicitly confirmed.

---

### D. Payment Gateway & Webhook Security (Razorpay)
- **Signature Verification (`/api/razorpay/verify`):**
  - HMAC-SHA256 signature calculated over `${razorpay_order_id}|${razorpay_payment_id}` using `RAZORPAY_KEY_SECRET`.
  - Comparison is executed via `crypto.timingSafeEqual()` preventing side-channel timing attacks.
- **Drop-off Webhook Receiver (`/api/razorpay/webhook`):**
  - Receives asynchronous notifications from Razorpay when users approve UPI payments but close the browser before returning to the website.
  - Verifies raw-body signature before JSON parsing, preventing payload tampering.
  - *Persistent Idempotency:* Records every processed webhook ID in the `webhook_events` table. Duplicate webhook deliveries return HTTP 200 immediately without reprocessing or re-dispatching shipments.
  - *Amount Verification Guard:* If Razorpay webhook indicates an amount differing from the database pre-order, the order is flagged for manual review rather than marked paid.

---

### E. Sensitive Taxpayer Data Protection (CBDT Rule 114B PAN)
- **Mandatory PAN Verification:**
  - Mandated by Indian Income Tax Rules for transactions $\ge ₹2,00,000$.
  - Format validated using regex: `^[A-Z]{5}[0-9]{4}[A-Z]{1}$`.
- **Encryption at Rest:**
  - Plaintext PAN is never stored directly in the database.
  - Encrypted using **AES-256-GCM** with a dedicated `ENCRYPTION_KEY`.
  - Authentication tag and initialization vector (IV) are stored alongside ciphertext.
  - Plaintext PAN is strictly scrubbed from API responses and client-facing tracking receipts.

---

### F. Injection & Cross-Site Scripting (XSS) Defenses
- **SQL Injection:**
  - All database queries are executed through the Supabase JavaScript client (`@supabase/supabase-js`) utilizing parameterized queries.
  - Zero dynamic SQL string concatenation exists in API routes.
- **Cross-Site Scripting (XSS):**
  - Built on React 19 and Next.js 16 App Router. React automatically escapes untrusted strings before DOM insertion.
  - No instances of `dangerouslySetInnerHTML` exist on user-controllable input fields.
- **Server-Side Request Forgery (SSRF):**
  - Outbound HTTP requests from server endpoints (Razorpay, BVC Logistics, Shiprocket) target hardcoded, HTTPS-only official provider URLs. No user-supplied URLs are fetched by the server.

---

### G. Rate Limiting & Abuse Prevention
- **Distributed Sliding-Window Rate Limiting:**
  - Powered by `@upstash/ratelimit` with Redis backend (and graceful in-memory fallback):
    - `createOrder`: 10 requests per 5 minutes per IP.
    - `verifyPayment`: 15 requests per 5 minutes per IP.
    - `adminLogin`: 5 attempts per 15 minutes per IP (Brute-force lockout).
    - `trackOrder`: 20 requests per 5 minutes per IP (Anti-scraping).

---

### H. Dependency Vulnerability Analysis (SCA)
An `npm audit` was conducted on the 392 installed packages:
- **Findings:** 20 vulnerabilities identified in development dependencies:
  - 9 Moderate
  - 10 High
  - 1 Critical (related to transitive CLI utilities in `@netlify/plugin-nextjs`).
- **Risk Assessment:** **Low runtime risk** for the production Next.js application, as none of the vulnerable packages are bundled into the client browser build or executed in serverless API routes.
- **Remediation Recommendation:** Execute `npm audit fix` or upgrade `@netlify/plugin-nextjs` to the latest version before production deployment.

---

## 3. Vulnerability Findings & Severity Matrix

| ID | Category | Vulnerability / Threat | Severity | Status | Remediation Details |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **SEC-01** | **Authorization** | Tracking endpoint field mismatch (`data.email` vs `data.customer_email`) | **High** | **RESOLVED** | Fixed in `src/app/api/track/route.ts` and locked with automated regression test. |
| **SEC-02** | **Business Logic** | Mock products fallback in checkout pricing | **Medium** | **RESOLVED** | Disabled in `src/config/siteConfig.ts` (`useMockProductsFallback: false`). Database is sole source of truth. |
| **SEC-03** | **Access Control** | Edge Middleware deprecation notice in Next.js 16 (`middleware` -> `proxy`) | **Low** | **MONITORED** | Middleware functions correctly. Scheduled for Next.js 17 proxy migration. |
| **SEC-04** | **Authentication** | Shared Admin Passcode across counter staff | **Medium** | **PROPOSED** | Migrate to individual multi-staff accounts via `proposal_staff_accounts_and_audit_log.sql`. |
| **SEC-05** | **SCA / CVEs** | Transitive vulnerabilities in `@netlify/plugin-nextjs` | **Medium** | **ACTIONABLE** | Upgrade Netlify Next.js plugin prior to production hosting release. |
| **SEC-06** | **Headers** | Missing Content Security Policy (CSP) headers | **Low** | **RECOMMENDED**| Add security headers in `next.config.ts` (HSTS, CSP, X-Frame-Options). |

---

## 4. Prioritized Production Hardening Checklist

Before public launch:

1. **Environment Secrets Checklist:**
   - [ ] Ensure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set in production environment variables.
   - [ ] Ensure `RAZORPAY_WEBHOOK_SECRET` matches the webhook endpoint in Razorpay Dashboard.
   - [ ] Ensure `ADMIN_SESSION_SECRET` is set to a cryptographically random 32+ character string.
   - [ ] Ensure `ENCRYPTION_KEY` is a 64-character hex string (32 bytes) for AES-256-GCM PAN encryption.
   - [ ] Ensure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are active for distributed rate limiting.

2. **Recommended `next.config.ts` Security Headers:**
   ```typescript
   const securityHeaders = [
     { key: 'X-DNS-Prefetch-Control', value: 'on' },
     { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
     { key: 'X-Frame-Options', value: 'DENY' },
     { key: 'X-Content-Type-Options', value: 'nosniff' },
     { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
     { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
   ];
   ```

This concludes the Phase 6 application security audit.
