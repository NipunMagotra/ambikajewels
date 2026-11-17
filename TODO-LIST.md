# 📋 Ambika Jewels — Production Launch To-Do List

**Target Domain:** [ambikajewelsonline.com](https://ambikajewelsonline.com)  
**Code Status:** 100% Complete & Tested (314/314 automated tests passing)  
**Remaining Work:** Account setup & credential configuration only (no coding required)  

---

## 🚀 Quick Launch Overview

All software, security protections, jewelry valuation math, and anti-duplicate-shipment logic are fully built and verified in the code. To start accepting real customer orders, you only need to complete the following **5 external account setup steps**.

---

## 📌 The Master Launch Checklist

### [ ] Step 1: Run the Database Security Script in Supabase (2 Minutes)

This locks down your database so unauthorized internet users cannot view other customers' orders, change gold prices, or access internal data.

1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project: `ircbwkumbxrcusccbkuv` (or your production project).
3. In the left navigation menu, click on the **SQL Editor** icon (`>_`).
4. Open the SQL file located in this repository at:
   `supabase/migrations/20261116_tighten_rls_policies.sql`
5. Copy the entire contents of that file, paste it into the Supabase SQL Editor, and click **Run** (green button).
6. Confirm that the message says: `Success. No rows returned.`

---

### [ ] Step 2: Verify Your Email Domain in Resend (5 Minutes)

This ensures order receipts, GST tax invoices, and login security codes arrive directly in customers' inboxes from `orders@ambikajewelsonline.com` without going to spam.

1. Log into your [Resend Dashboard](https://resend.com/domains).
2. Click **Add Domain** and enter: `ambikajewelsonline.com`.
3. Choose region **ap-south-1** (Singapore/India) or default.
4. Resend will display 3 DNS records:
   - **DKIM** (TXT record)
   - **SPF** (TXT record)
   - **DMARC** (TXT record)
5. Log into your domain registrar (GoDaddy, Namecheap, Cloudflare, or BigRock) where your domain is managed.
6. Go to **DNS Settings** and add those 3 records.
7. Return to Resend and click **Verify DNS Records** until you see a green checkmark (**Verified**).
8. Copy your live API Key (`re_...`) from the **API Keys** section.

---

### [ ] Step 3: Set Up Upstash Redis for Login Codes (3 Minutes)

This powers the customer password-free login codes (OTPs) across mobile devices and prevents bots from spamming your checkout.

1. Log into [Upstash Console](https://console.upstash.com).
2. Click **Create Database**.
3. Choose:
   - Name: `ambika-jewels-redis`
   - Region: `ap-south-1` (Mumbai, India)
   - Plan: Free / Pay-as-you-go
4. Once created, scroll down to the **REST API** section.
5. Select the **.env** tab and copy:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

---

### [ ] Step 4: Configure Live Razorpay Payment Gateway (5 Minutes)

This switches your checkout from test mode to accepting real UPI, Credit/Debit cards, NetBanking, and EMI.

1. Log into your [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Switch the toggle in the top bar from **Test Mode** to **Live Mode**.
3. Go to **Settings** → **API Keys** → **Generate Live Key**.
4. Save the generated:
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID` (`rzp_live_...`)
   - `RAZORPAY_KEY_SECRET`
5. Go to **Settings** → **Webhooks** → click **Add New Webhook**.
6. Set the fields:
   - **Webhook URL:** `https://ambikajewelsonline.com/api/razorpay/webhook`
   - **Secret:** Create a strong random password (e.g. 24 characters) and save it as `RAZORPAY_WEBHOOK_SECRET`.
   - **Active Events:** Check these three events:
     - `payment.captured`
     - `order.paid`
     - `payment.failed`
7. Click **Save**.

---

### [ ] Step 5: Obtain Live BVC Logistics Credentials (5 Minutes)

This connects your store directly to BVC's armored vault and security escort network for shipping 22K hallmarked jewelry (HSN 7113).

1. Contact your BVC Logistics account representative or relationship manager.
2. Request your **Production eSHIP Universe API Credentials**:
   - `BVC_API_KEY`
   - `BVC_API_SECRET`
   - `BVC_APP_ID`
   - `BVC_WEBHOOK_SECRET`
3. Confirm your showroom pickup origin pincode is set to:
   - `BVC_ORIGIN_PINCODE`: `180013` (Lower Roop Nagar, Jammu)

---

### [ ] Step 6: Enter All Keys in Netlify & Deploy (5 Minutes)

This injects all your live business credentials securely into the cloud server.

1. Log into your [Netlify Dashboard](https://app.netlify.com).
2. Select your site: `ambika-jewels` (or your custom site name).
3. Go to **Site Configuration** → **Environment variables**.
4. Add or update the variables listed in the **Reference Table** below.
5. Once saved, go to **Deploys** → click **Trigger deploy** → **Deploy site**.
6. Wait 60–90 seconds for Netlify to finish building and publishing.

---

### [ ] Step 7: Perform a Live ₹1 Test Purchase & Final Sign-Off

1. Open your live website: [ambikajewelsonline.com](https://ambikajewelsonline.com).
2. Add a low-cost item or temporary ₹1 test piece to your cart.
3. Complete checkout using real UPI (Google Pay / PhonePe / Paytm).
4. Verify:
   - [ ] Payment succeeds and order confirmation page loads.
   - [ ] You receive a GST Tax Invoice email from `orders@ambikajewelsonline.com`.
   - [ ] Order appears in your `/admin` dashboard under **Orders** with status `confirmed` and `paid`.
   - [ ] A BVC security bag serial number (`AMB-SECBAG-...`) is generated.
   - [ ] Order tracking works at `/track` using your Order Reference and phone number.
5. In your admin dashboard, refund the ₹1 payment to confirm the refund pipeline functions properly.

---

## 🔑 Reference: Environment Variables for Netlify

| Variable Name | Description | Where to Get It |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase API URL | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Public Key | Supabase Dashboard → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Privileged Key | Supabase Dashboard → Project Settings → API |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Live Razorpay Key (`rzp_live_*`) | Razorpay Dashboard → Settings → API Keys |
| `RAZORPAY_KEY_SECRET` | Live Razorpay Secret | Razorpay Dashboard → Settings → API Keys |
| `RAZORPAY_WEBHOOK_SECRET` | Live Razorpay Webhook Secret | Created by you in Razorpay Webhook Settings |
| `UPSTASH_REDIS_REST_URL` | Redis Database URL | Upstash Console → Database Details |
| `UPSTASH_REDIS_REST_TOKEN` | Redis Access Token | Upstash Console → Database Details |
| `RESEND_API_KEY` | Resend Email API Key | Resend Dashboard → API Keys |
| `RESEND_FROM_EMAIL` | Sender Address | Set to: `Ambika Jewels <orders@ambikajewelsonline.com>` |
| `ADMIN_ALERT_EMAIL` | Manager Alert Recipient | Set to your email: `contact@ambikajewelsonline.com` |
| `ADMIN_PASSCODE` | Showroom Counter Password | Choose a strong 8-16 digit master passcode |
| `ADMIN_SESSION_SECRET` | Admin Security Cookie Key | Any random 32+ character string |
| `CUSTOMER_SESSION_SECRET` | Customer Account Cookie Key | Any random 32+ character string |
| `PAN_ENCRYPTION_SECRET` | CBDT PAN Data Encryption Key | Any random 32+ character string |
| `BVC_API_KEY` | BVC Courier Live Key | Provided by BVC Logistics Account Manager |
| `BVC_API_SECRET` | BVC Courier Live Secret | Provided by BVC Logistics Account Manager |
| `BVC_APP_ID` | BVC App ID | Provided by BVC Logistics Account Manager |
| `BVC_WEBHOOK_SECRET` | BVC Webhook Secret | Provided by BVC Logistics Account Manager |
| `BVC_ORIGIN_PINCODE` | Showroom Dispatch Pincode | Set to: `180013` |
| `GROQ_API_KEY` | Aanya AI Concierge Key | Groq Cloud Console (Optional) |
| `GOLDAPI_KEY` | Bullion Market Feed Key | GoldAPI.io (Optional) |

---

*Once all boxes are checked, your store is officially live, secure, and ready to welcome valued patrons across India!*
