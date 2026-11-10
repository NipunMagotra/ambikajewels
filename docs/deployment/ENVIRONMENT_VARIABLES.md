# ENVIRONMENT VARIABLES SPECIFICATION & REFERENCE

> **CRITICAL SECURITY RULE:** Never commit actual values, production secrets, API keys, or private tokens to this repository. All sensitive variables must be configured solely within your secure hosting dashboard (e.g. Netlify Environment Variables) and local untracked `.env.local`.

---

## 1. Core Supabase Database & Storage Variables

| Variable Name | Purpose | Required / Optional | Scope | Where Configured |
| :--- | :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public HTTPS endpoint for your Supabase project instance. | **Required** | Public (Client + Server) | Netlify Env / `.env.local` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public client API key restricted by PostgreSQL Row-Level Security (RLS). | **Required** | Public (Client + Server) | Netlify Env / `.env.local` |
| `SUPABASE_SERVICE_ROLE_KEY` | Privileged administrative key that bypasses RLS for server-side order sync, inventory mutations, and image uploads. | **Required** in Production | **Secret** (Server Only) | Netlify Env / `.env.local` |

---

## 2. Payment Gateway Variables (Razorpay)

| Variable Name | Purpose | Required / Optional | Scope | Where Configured |
| :--- | :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay public key ID injected into the client `checkout.js` modal. | **Required** | Public (Client + Server) | Netlify Env / `.env.local` |
| `RAZORPAY_KEY_ID` | Server-side Razorpay key ID matching `NEXT_PUBLIC_RAZORPAY_KEY_ID`. | **Required** | Public / Server | Netlify Env / `.env.local` |
| `RAZORPAY_KEY_SECRET` | Secret key used to cryptographically verify payment signatures via HMAC-SHA256. | **Required** | **Secret** (Server Only) | Netlify Env / `.env.local` |
| `RAZORPAY_WEBHOOK_SECRET` | Secret key used to verify incoming Razorpay webhook event signatures (`order.paid`, etc.). | **Required** | **Secret** (Server Only) | Netlify Env / `.env.local` |

> [!IMPORTANT]
> Keep `rzp_test_*` credentials during staging. Only swap to live keys (`rzp_live_*`) once final domain, SSL, and small real-transaction tests pass.

---

## 3. Administrative Security & Session Variables

| Variable Name | Purpose | Required / Optional | Scope | Where Configured |
| :--- | :--- | :--- | :--- | :--- |
| `ADMIN_SESSION_SECRET` | Cryptographic secret (minimum 32 characters) used to sign and verify Edge session tokens. | **Required** | **Secret** (Server Only) | Netlify Env / `.env.local` |
| `ENCRYPTION_SECRET` | 32-byte secret used for AES-256 rate-lock encryption and token signing. | Optional (Defaults to fallback) | **Secret** (Server Only) | Netlify Env / `.env.local` |
| `ADMIN_ALERT_EMAIL` | Destination email address for high-priority security notifications (payment mismatches, rate deviations). | Optional (Defaults to store email) | Server Only | Netlify Env / `.env.local` |

---

## 4. High-Value Logistics Variables (BVC Armed Courier)

| Variable Name | Purpose | Required / Optional | Scope | Where Configured |
| :--- | :--- | :--- | :--- | :--- |
| `BVC_API_KEY` | BVC Logistics API identification key for armored delivery waybill creation. | Optional (Auto-mocked in dev) | **Secret** (Server Only) | Netlify Env / `.env.local` |
| `BVC_API_SECRET` | BVC Logistics API secret key. | Optional | **Secret** (Server Only) | Netlify Env / `.env.local` |
| `BVC_WEBHOOK_SECRET` | Secret used to verify delivery tracking status webhooks from BVC. | Optional | **Secret** (Server Only) | Netlify Env / `.env.local` |
| `BVC_ORIGIN_PINCODE` | Jammu flagship showroom dispatch pincode (Default: `180013`). | Optional | Server Only | Netlify Env / `.env.local` |

---

## 5. Communications & Email Variables (Resend)

| Variable Name | Purpose | Required / Optional | Scope | Where Configured |
| :--- | :--- | :--- | :--- | :--- |
| `RESEND_API_KEY` | Resend API key for automated transactional order confirmation emails and enquiry receipts. | Optional (Simulated in dev) | **Secret** (Server Only) | Netlify Env / `.env.local` |
| `RESEND_FROM_EMAIL` | Verified sender domain address (e.g. `orders@ambikajewelsonline.com`). | Optional | Server Only | Netlify Env / `.env.local` |

---

## 6. Distributed Rate Limiting (Upstash Redis)

| Variable Name | Purpose | Required / Optional | Scope | Where Configured |
| :--- | :--- | :--- | :--- | :--- |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST endpoint for distributed edge rate limiting. | Optional (Falls back to in-memory) | **Secret** (Server Only) | Netlify Env / `.env.local` |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST access token. | Optional | **Secret** (Server Only) | Netlify Env / `.env.local` |

---

## 7. AI Concierge & External Rates (Optional)

| Variable Name | Purpose | Required / Optional | Scope | Where Configured |
| :--- | :--- | :--- | :--- | :--- |
| `GROQ_API_KEY` | API key for Groq Cloud (powers "Aanya" AI jewellery concierge). | Optional (Simulated fallback) | **Secret** (Server Only) | Netlify Env / `.env.local` |
| `GOLDAPI_KEY` | API key for GoldAPI.io real-time bullion market feeds. | Optional (Uses local counter rates) | **Secret** (Server Only) | Netlify Env / `.env.local` |
