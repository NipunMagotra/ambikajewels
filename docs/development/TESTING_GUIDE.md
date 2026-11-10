# TESTING & VERIFICATION GUIDE

> **Total Test Suite:** 244 automated test invariants across 101 test suites  
> **Test Runner:** Native Node.js test runner via `tsx --test tests/**/*.test.ts`

---

## 1. Running Automated Tests

```bash
# Run all 244 automated tests
npm test

# Run a specific test phase (e.g. Phase 12 Security Closure)
npx tsx --test tests/phase12-final-security-closure.test.ts

# Run tests in watch mode during active development
npx tsx --watch --test tests/**/*.test.ts
```

---

## 2. Test Suite Architecture (Phases 1 through 12)

| Test File | Focus & Verified Invariants |
| :--- | :--- |
| `phase1-security.test.ts` | Server-side pricing authority, price injection rejection, admin session lifetime. |
| `phase1-followup.test.ts` | Razorpay webhook signature verification, DB retry idempotency, amount mismatch detection. |
| `phase2-idor-invoice.test.ts` | Invoice privacy and IDOR prevention on customer order records. |
| `phase2-pricing-engine.test.ts` | Multi-karat pricing logic, making charges, weight tolerances, 3% GST calculation. |
| `phase2-real-handlers.test.ts` | Direct execution of API route handlers against mock & Supabase databases. |
| `phase3-a11y.test.ts` | Accessibility, keyboard focus, ARIA semantics, touch target sizes. |
| `phase3-cash-pan.test.ts` | Indian Income Tax Rule 114B (PAN requirement on cash sales >= ₹2,00,000). |
| `phase3-chatbot.test.ts` | Groq LLaMA Aanya AI concierge boundary and hallmarking advice accuracy. |
| `phase3-claims-audit.test.ts` | Truth-in-advertising checks, BIS hallmarking disclosures, purity certifications. |
| `phase3-dpdp.test.ts` | Indian Digital Personal Data Protection (DPDP) compliance and data privacy. |
| `phase4-production-resilience.test.ts` | Network timeouts, database failover handling, graceful degradation. |
| `phase5-admin-security-hardening.test.ts` | Zero-trust Edge middleware, timing-attack safe comparisons, session expiration. |
| `phase6-payment-and-business-logic.test.ts` | End-to-end payment gateway invariants, Razorpay signature checks. |
| `phase7-production-readiness.test.ts` | Coupon engine boundaries, shipping thresholds, production environment checks. |
| `phase8-pre-launch-suite.test.ts` | Pre-launch core invariants across payments, inventory, coupons, admin, tracking. |
| `phase9-admin-store-management.test.ts` | Products CRUD, image uploads with Sharp sanitization, bulk editor, audit logging. |
| `phase10-owner-usability.test.ts` | Non-technical shopkeeper workflows, 1-click sold-out, bullion rate updates. |
| `phase11-deep-security-audit.test.ts` | Penetration tests across SQLi, XSS, CSRF, IDOR, MIME polyglots, rate limits. |
| `phase12-final-security-closure.test.ts` | Individual staff accounts, Argon2/PBKDF2, TOTP MFA, persistent session revocation. |

---

## 3. Pre-Commit Quality Triad

Every code modification must pass the three standard verification commands:
1. `npm test` → 244 passed, 0 failed.
2. `npx tsc --noEmit` → 0 errors.
3. `npm run build` → All routes compile and generate successfully.
