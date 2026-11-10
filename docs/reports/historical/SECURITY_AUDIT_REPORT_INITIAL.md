# Cloudflare Security Audit Report: Ambika Jewels

## Executive Summary
- **Target**: Ambika Jewels Fine Jewelry E-Commerce Platform
- **Audit Date**: October 2026
- **Tool**: Cloudflare Security Audit Skill (`cloudflare/security-audit-skill`)
- **Profile**: Full 6-Phase Comprehensive Codebase Review

### Verdict Summary
| Verdict | Count | Details |
| :--- | :--- | :--- |
| **Confirmed Vulnerabilities** | **3** | 2 Medium Severity, 1 Low Severity |
| **Needs Validation** | **0** | All candidate claims independently verified against source |
| **Rejected Candidates** | **2** | Cart Price Tampering (Mitigated), PAN Plaintext Leak (Mitigated) |

---

## Confirmed Findings

### 1. [Medium] Non-Constant-Time Signature Comparison in Razorpay Verification
- **Fingerprint**: `ambika.crypto.timing_attack_verify`
- **File**: `src/app/api/razorpay/verify/route.ts:102`
- **Impact**: `generatedSignature === razorpay_signature` uses JavaScript string equality rather than `crypto.timingSafeEqual`. In high-precision network environments, this exposes the HMAC verification to character-by-character timing attacks.
- **Remediation**: Use `crypto.timingSafeEqual(sigBuf, expBuf)`.

### 2. [Medium] Postgres UUID Syntax Error on Order Tracking Reference Codes
- **Fingerprint**: `ambika.db.track_uuid_mismatch`
- **File**: `src/app/api/track/route.ts:57`
- **Impact**: The orders table uses UUID for primary key `id` and TEXT for `order_number`. The tracking route queries `.eq('id', orderId)`. Passing human reference numbers (e.g. `AMB-102948`) triggers a Postgres syntax error, preventing customers from viewing live order status.
- **Remediation**: Dynamically query `order_number` for alphanumeric strings.

### 3. [Low] Unvalidated Redirect Query Parameter in Admin Login
- **Fingerprint**: `ambika.auth.open_redirect`
- **File**: `src/app/admin/login/page.tsx:34`
- **Impact**: Reading `redirect` query param directly into `router.push(target)` permits open redirection to external phishing URLs if an admin clicks a poisoned link.
- **Remediation**: Sanitize target to ensure it starts with a single `/`.

---

## Defensive Controls Verified Effective
1. **Server-Side Pricing Engine**: Client cart prices are 100% ignored. `calculateOrderPricingServer` strictly checks prices from the Supabase database.
2. **PAN Card Data Protection**: CBDT Rule 114B PAN numbers are encrypted using AES-256-GCM with authenticated tags before storing.
3. **AI Prompt Injection Defenses**: `/api/chat` scrubs mobile numbers, PAN, and addresses before sending to Groq, and regex filters block prompt escape directives.
4. **Rate Limiting**: Critical endpoints (`create-order`, `track`, `chat`, `admin/login`) enforce Upstash Redis rate limits.
