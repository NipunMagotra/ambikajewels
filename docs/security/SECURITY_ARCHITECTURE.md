# SECURITY ARCHITECTURE & THREAT MITIGATION MATRIX

> **Standard:** OWASP ASVS v4.0.3 Level 2 Compliant  
> **Testing Coverage:** 244 automated test invariants spanning phases 1 through 12.

---

## 1. Threat Mitigation Matrix

| Threat Category | Potential Attack Vector | Applied Engineering Defense | Verified Invariant |
| :--- | :--- | :--- | :--- |
| **Price Tampering** | Attacker alters cart payload to pay ₹1 for a ₹2,00,000 gold jhumki. | **Server-Side Pricing Authority (`serverPricing.ts`):** All prices, 3% GST, and shipping thresholds are re-computed server-side from PostgreSQL. Client-submitted prices are discarded. | `phase1-security.test.ts` & `phase8-pre-launch-suite.test.ts` |
| **Payment Spoofing** | Attacker crafts fake Razorpay response with mock transaction ID. | **HMAC-SHA256 Signature Verification (`/api/razorpay/verify`):** Signatures are cryptographically verified using secret key before order is marked paid. | `phase1-followup.test.ts` & `phase8-pre-launch-suite.test.ts` |
| **Double-Spending** | Attacker replays webhook event to credit multiple orders or inflate amounts. | **Webhook Idempotency (`/api/razorpay/webhook`):** Atomic database lock ensures duplicate webhook events return HTTP 200 without double-crediting. | `phase1-followup.test.ts` |
| **Inventory Racing** | Two buyers attempt to checkout the last unique Dogra necklace simultaneously. | **Atomic Inventory Reservations (`inventoryEngine.ts`):** 15-minute checkout hold; locks stock at reservation time. | `phase9-admin-store-management.test.ts` |
| **Polyglot File Upload** | Attacker uploads PHP, HTML, or SVG disguised with a `.jpg` extension. | **Sharp Binary Decode & Sanitization (`/api/admin/upload`):** Validates magic bytes, decodes pixel buffer via Sharp, strips EXIF, rejects SVGs, and re-compresses to WebP. | `phase9-admin-store-management.test.ts` & `phase11-deep-security-audit.test.ts` |
| **Session Hijacking / Replay** | Attacker captures admin session cookie after logout. | **Distributed Persistent Revocation (`staffAuth.ts`):** Token hash is stored in `revoked_sessions` table and memory cache; immediate rejection on edge and server. | `phase12-final-security-closure.test.ts` |
| **Brute Force & Credential Stuffing** | Automated dictionary attacks against `/admin/login`. | **Progressive Lockout & Rate Limiting (`rateLimit.ts`):** 5 failed attempts locks account for 15 minutes; IP rate limits enforced. | `phase12-final-security-closure.test.ts` |
| **IDOR / Customer Data Leak** | User modifies URL order ID to view another customer's invoice or address. | **Phone & Token Gated Lookups (`/api/track`):** Queries require order reference AND matching customer phone number or cryptographic tracking token. | `phase2-idor-invoice.test.ts` & `phase8-pre-launch-suite.test.ts` |
| **Bullion Typo Disaster** | Shopkeeper accidentally types ₹82,500 instead of ₹8,250 for gold rate. | **Bullion Sanity Bounds (`/api/admin/rates`):** Rate updates deviating >10% from prevailing rate are rejected unless confirmed with explicit override flag. | `phase1-followup.test.ts` & `phase10-owner-usability.test.ts` |
| **Cash PAN Evasion** | Cash purchase exceeding ₹2,00,000 without PAN. | **Statutory PAN Enforcement (Rule 114B):** Indian Income Tax Rule 114B regex and checksum enforced server-side on orders >= ₹2,00,000. | `phase3-cash-pan.test.ts` |

---

## 2. Cryptographic Specifications

- **Session Signing:** HMAC-SHA256 with 32-byte secret key (`ADMIN_SESSION_SECRET`).
- **Signature Comparison:** Constant-time `crypto.timingSafeEqual` prevents timing-attack side channels.
- **Password Storage:** PBKDF2-SHA512 with 100,000 iterations and 16-byte cryptographically secure random per-user salts.
- **Two-Factor Authentication:** RFC 6238 Time-Based One-Time Password (TOTP) algorithm using 160-bit base32 secrets.
