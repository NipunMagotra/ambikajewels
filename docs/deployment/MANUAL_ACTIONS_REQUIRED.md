# MANUAL ACTIONS REQUIRED — HUMAN PRE-LAUNCH GATES

> **To the Founder / Store Operator:**  
> While the code, security guardrails, and automated tests are 100% complete and verified, software alone cannot activate legal merchant accounts, link bank accounts, configure external DNS, or verify real payment settlement.  
> The items below **strictly require human intervention**. None of these can be executed by an AI assistant.

---

## 1. Execute Supabase Production SQL Migration

- **What it means:** Applying the database migration script that creates the `staff_accounts`, `revoked_sessions`, and `inventory_reservations` tables with Row-Level Security.
- **Why it matters:** Without this, staff logins and session revocations will run in in-memory fallback mode rather than persisting to PostgreSQL across serverless cold starts.
- **Where to do it:** Supabase Cloud Dashboard → Project → **SQL Editor**.
- **What you need:** Admin access to the Ambika Jewels Supabase project.
- **Exact File to Execute:** `supabase/migrations/20261110_staff_accounts_and_revocation.sql`.
- **How to verify it worked:** Go to Supabase Dashboard → **Table Editor**. Confirm that `staff_accounts` and `revoked_sessions` appear in the table list with RLS enabled.
- **Caution:** Never expose your Supabase Database Password or Service Role Key in chat or public repositories.

---

## 2. Register Owner Account & Activate TOTP Multi-Factor Authentication

- **What it means:** Generating the founder/owner administrative profile with a secure master password and scanning the Google Authenticator / Apple Passwords QR code.
- **Why it matters:** Ensures that privileged operations (changing gold rates, bulk-editing inventory, changing payment configurations) cannot be accessed without physical possession of the owner's phone.
- **Where to do it:** Ambika Jewels Admin Login (`/admin/login`).
- **What you need:** Authenticator app on owner's smartphone (Google Authenticator, Microsoft Authenticator, or 1Password).
- **How to verify it worked:** Log in at `/admin/login` using your owner email and password, then confirm the prompt for the 6-digit TOTP code grants access to the dashboard.

---

## 3. Configure Production Domain & HTTPS DNS

- **What it means:** Pointing `ambikajewelsonline.com` to the Netlify production hosting environment.
- **Why it matters:** Customers and payment gateways require a trusted, secure `https://` domain matching business KYC.
- **Where to do it:** Domain Registrar (GoDaddy, Namecheap, Google Domains / Squarespace) and Netlify **Domain Management**.
- **What you need:** DNS Records provided by Netlify:
  - CNAME: `www` → Netlify site subdomain (e.g. `ambika-jewels.netlify.app`)
  - A Record / ALIAS: `@` (apex) → `75.2.60.5`
- **How to verify it worked:** Open `https://ambikajewelsonline.com` in an incognito window. Verify the padlock icon appears, SSL certificate is valid, and HTTP automatically redirects to HTTPS.

---

## 4. Switch Razorpay from Test to Live Mode

- **What it means:** Replacing test API credentials (`rzp_test_*`) with live merchant credentials (`rzp_live_*`) in the Netlify production environment.
- **Why it matters:** Test mode cannot capture real Indian Rupee funds or settle payouts to the showroom's bank account.
- **Where to do it:** Razorpay Dashboard (`dashboard.razorpay.com`) → **Settings** → **API Keys** → Generate Live Key. Then paste into **Netlify Dashboard → Site configuration → Environment variables**.
- **What you need:**
  - `RAZORPAY_KEY_ID` (starts with `rzp_live_`)
  - `NEXT_PUBLIC_RAZORPAY_KEY_ID` (same value)
  - `RAZORPAY_KEY_SECRET`
- **How to verify it worked:** The checkout popup displays "Ambika Jewels" in Live Mode without the "Test Mode" watermark banner.
- **Caution:** Never email or paste the `RAZORPAY_KEY_SECRET` in public tickets.

---

## 5. Register Razorpay Production Webhook Endpoint

- **What it means:** Registering the production webhook URL in Razorpay so that payment confirmations are delivered directly to the server even if a customer closes their browser prematurely.
- **Why it matters:** Prevents situations where money is debited from customer's UPI/Card but the website doesn't know the order was paid.
- **Where to do it:** Razorpay Dashboard → **Settings** → **Webhooks** → **Add New Webhook**.
- **Webhook URL:** `https://ambikajewelsonline.com/api/razorpay/webhook`
- **Secret:** Generate a random 32-character secret string and configure as `RAZORPAY_WEBHOOK_SECRET` in Netlify.
- **Active Events to Select:**
  - `order.paid`
  - `payment.captured`
  - `payment.failed`
- **How to verify it worked:** Send a test ping from Razorpay dashboard; verify HTTP 200 response in Razorpay webhook logs.

---

## 6. Conduct One Controlled Live Transaction (₹100 Smoke Test)

- **What it means:** Processing a real ₹100 payment using a personal UPI app or debit card on the live production website.
- **Why it matters:** Proves end-to-end payment capture, signature verification, invoice generation, and database sync on real Indian banking rails.
- **Where to do it:** Public website checkout.
- **How to verify it worked:**
  1. The order status page updates to **Payment Confirmed**.
  2. The transaction appears under Razorpay Dashboard → **Payments** with status **Captured**.
  3. The order appears in `/admin` under the **Orders Hub**.
  4. Perform a full refund from the Razorpay dashboard to confirm refund settlement back to the test card/UPI account.

---

## 7. Verify Resend Transactional Email Domain (DKIM/SPF)

- **What it means:** Adding DNS records in your domain registrar for Resend to verify sender authenticity.
- **Why it matters:** Ensures order confirmation emails and GST receipts land in customer inboxes rather than spam folders.
- **Where to do it:** Resend Dashboard (`resend.com`) → **Domains** → Add `ambikajewelsonline.com`.
- **How to verify it worked:** Status in Resend switches to **Verified**; test placing an order and confirm email arrives with valid DKIM signatures.

---

## 8. BVC Logistics Production Merchant Credentials

- **What it means:** Setting up live API credentials for BVC Logistics armored courier delivery.
- **Why it matters:** Enables automated armored pickup scheduling and customer OTP delivery tracking.
- **Where to do it:** BVC Logistics Merchant Portal → Netlify Environment Variables.
- **How to verify it worked:** In `/admin`, open an order and click **Generate BVC Consignment**; verify live tracking number and printable armored shipping label are generated.
