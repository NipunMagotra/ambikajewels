# AMBIKA JEWELS — PRODUCTION SECURITY CHECKLIST
**Pre-Go-Live Hardening & Ongoing Operational Security Gates**  
**Target Domain:** `ambikajewelsonline.com`  

---

## 1. PRE-LAUNCH CRITICAL GATES (ONE-TIME VERIFICATION)

### A. Environment Secret Isolation
- [x] Zero server secrets in client JavaScript chunks (`.next/static/**`).
- [x] `SUPABASE_SERVICE_ROLE_KEY` is loaded only in server-side API routes and isolated modules.
- [x] `RAZORPAY_KEY_SECRET` is never exposed in browser requests or source maps.
- [x] `ADMIN_PASSCODE` is loaded only from server environment variables.
- [x] Dedicated 64-character `ADMIN_SESSION_SECRET` configured for HMAC session signing.

### B. Payment & Financial Cryptography
- [x] Server-authoritative price calculation (browser cart values are treated as untrusted hints).
- [x] 3% GST and BIS hallmarking charges calculated strictly server-side.
- [x] Constant-time HMAC-SHA256 signature verification on Razorpay payment callbacks.
- [x] Timing-safe HMAC-SHA256 signature verification on inbound webhooks.
- [x] Persistent idempotency deduplication preventing double-fulfillment on replayed webhooks.
- [x] Amount mismatch safety net automatically flags suspect transactions and halts dispatch.

### C. Authentication & Session Defense
- [x] Admin routes protected by server-side Edge Middleware and cryptographic token verification.
- [x] Session tokens carry 12-hour maximum lifetime with timestamped signatures.
- [x] Sliding-window rate limiting on login endpoint (5 attempts per 15 minutes).
- [x] Constant-time string comparison (`crypto.timingSafeEqual`) on admin passcode verification.
- [x] Active server-side token revocation on logout to prevent replay of captured cookies.

### D. Data Protection & Access Control (IDOR & RLS)
- [x] Order tracking requires 2-factor identifier match (Order Reference + Phone OR Email OR secure token).
- [x] PostgREST anonymous write access revoked on `orders` and `customer_savings_goals`.
- [x] Customer PAN numbers encrypted using AES-256-GCM before database storage (CBDT Rule 114B).
- [x] PAN numbers automatically stripped from gateway notes and public API responses.
- [x] Masked shipping addresses rendered on public order status tracking pages.

### E. File Upload & Binary Defense
- [x] Image uploads restricted to verified binary magic bytes (JPEG, PNG, WebP, GIF, AVIF).
- [x] User-supplied file extensions discarded; extensions mapped strictly from verified binary headers.
- [x] SVG and HTML uploads rejected to prevent stored XSS or polyglot attacks.
- [x] Uploaded image size capped at 10MB with sanitized filenames.

### F. Network & Browser Security Headers
- [x] Content-Security-Policy (CSP) active with strict script and frame allowances.
- [x] `frame-ancestors 'none'` and `X-Frame-Options: DENY` preventing clickjacking.
- [x] `Strict-Transport-Security` (HSTS) with 2-year preload configuration.
- [x] `X-Content-Type-Options: nosniff` preventing MIME confusion attacks.
- [x] `Referrer-Policy: strict-origin-when-cross-origin` preventing token leakage in referrers.

---

## 2. PRODUCTION LAUNCH GATES (REQUIRING HUMAN ACTION)

The following items must be performed with live credentials upon hosting deployment:

- [ ] **Live Razorpay Key Provisioning:** Swap `rzp_test_*` for approved `rzp_live_*` in hosting settings.
- [ ] **Live Webhook Subscription:** Create webhook endpoint in Razorpay Live Dashboard with `RAZORPAY_WEBHOOK_SECRET`.
- [ ] **Production Domain DNS Records:** Point `A` record (`@`) and `CNAME` (`www`) to hosting IP at domain registrar.
- [ ] **Email Domain DNS Records:** Add DKIM, SPF, and DMARC TXT records for `ambikajewelsonline.com` in Resend.
- [ ] **Live BVC Logistics Onboarding:** Input Jammu merchant credentials and secure transit customer code.
- [ ] **Automated Supabase Backups:** Confirm daily PITR backup schedule is active in Supabase project settings.
- [ ] **Real ₹100 Live Payment Smoke Test:** Execute one genuine ₹100 UPI order and subsequent refund test.

---

## 3. ONGOING OPERATIONAL CHECKS (MONTHLY / QUARTERLY)

- [ ] Review weekly audit logs for unauthorized rate edits or stock status changes.
- [ ] Rotate admin passcode every 90 days or immediately upon showroom staff turnover.
- [ ] Inspect Razorpay settlement reports against local Jammu accounting books.
- [ ] Run `npm test` and `npm audit` following any minor software updates or dependency upgrades.

