# Ambika Jewels — Service Registry & Account Handover

**Confidential Document — For Business Owners & Authorized Technical Representatives Only**

This document catalogues every external service, account, and platform required to run `ambikajewelsonline.com`. It provides the ownership transfer guidelines so the business owner retains 100% legal control of all assets.

---

## 1. Third-Party Services Overview

| Service | Purpose | Primary Contact / Email | Account URL |
| :--- | :--- | :--- | :--- |
| **Domain Registrar** | Domain Name (`ambikajewelsonline.com`) | `contact@ambikajewelsonline.com` | Registrar Portal (Hostinger / GoDaddy) |
| **Hosting Platform** | Next.js Server & Edge Hosting | Store Technical Admin | Vercel / Railway / Cloudflare |
| **Supabase** | Cloud Database & Image Storage | `contact@ambikajewelsonline.com` | [supabase.com/dashboard](https://supabase.com/dashboard) |
| **Razorpay** | Online Payment Gateway (UPI, Cards, Netbanking) | Shivani Anand / Lakesh Kumar | [dashboard.razorpay.com](https://dashboard.razorpay.com) |
| **BVC Logistics** | High-Value Armed Jewellery Courier | Lakesh Kumar (Account Holder) | [bvclogistics.com](https://bvclogistics.com) |
| **Resend** | Transactional Order Confirmation Emails | Store Technical Admin | [resend.com](https://resend.com) |
| **Upstash Redis** | DDoS Protection & API Rate Limiting | Store Technical Admin | [console.upstash.com](https://console.upstash.com) |

---

## 2. Environment Variables & Secret Key Registry

All sensitive secrets are stored securely in `.env.local` on your hosting server. **Never print, commit to GitHub, or share secret keys via WhatsApp or unsecured email.**

### A. Supabase Database & Storage
- `NEXT_PUBLIC_SUPABASE_URL`: Public endpoint for Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public read key (Row Level Security protected).
- `SUPABASE_SERVICE_ROLE_KEY`: **Private Elevated Server Secret.** Grants backend administrative access. Never exposed to browser.

### B. Razorpay Payments
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Public merchant key (e.g. `rzp_test_...` or `rzp_live_...`).
- `RAZORPAY_KEY_SECRET`: **Private Server Secret.** Used to verify cryptographic payment signatures.
- `RAZORPAY_WEBHOOK_SECRET`: **Private Server Secret.** Validates genuine Razorpay payment webhooks.

### C. Admin Console Security
- `ADMIN_SESSION_SECRET`: Minimum 32-character random cryptographic secret used to sign 12-hour admin tokens with HMAC-SHA256.
- `ADMIN_PASSCODE`: 6-to-12 character passkey used by the owner/manager to log into `/admin/login`.

### D. PAN & Statutory Compliance Encryption
- `ENCRYPTION_SECRET`: AES-256-GCM 32-byte secret key used to encrypt customer PAN numbers at rest for orders exceeding ₹2,00,000 under CBDT Rule 114B.

### E. Transactional Email (Resend)
- `RESEND_API_KEY`: API token used to dispatch automated order confirmations to customers.
- `ORDER_NOTIFICATION_EMAIL`: Showroom email receiving order alerts (`contact@ambikajewelsonline.com`).

### F. Logistics Integration (BVC Logistics)
- `BVC_API_KEY` & `BVC_ACCOUNT_NUMBER`: Merchant credentials provided by BVC for electronic docket generation and insurance verification.

---

## 3. Account Ownership Transfer Checklist

To ensure complete legal and financial independence, ensure the following accounts are registered under the official business name and email:

- [ ] **Domain Name:** Registered in the name of *Shivani Anand (Ambika Jewels)* with auto-renewal enabled and DNSSEC active.
- [ ] **Razorpay Account:** KYC verified with official GSTIN (`01AHWPH9511N1ZX`), Business PAN (`AHWPH9511N`), and bank account of Ambika Jewels.
- [ ] **BVC Logistics Merchant Account:** Commercial contract active with daily vault pickup from Lower Roop Nagar, Jammu showroom.
- [ ] **Two-Factor Authentication (2FA):** 2FA enabled on Google Account, Razorpay Dashboard, and Supabase using the owner's mobile authenticator app.

---
*Ambika Jewels Confidential Service Registry*

