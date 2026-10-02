# 📋 AMBIKA JEWELS — CLIENT ONBOARDING & ACCOUNT SETUP CHEATSHEET
> **For Field Visit / Client Office Meeting**  
> *Use this guide while sitting with the client (Shivani Anand / Lakesh Kumar) to create all official accounts using their business email and phone number, collect required KYC documents, and extract the necessary API credentials.*

---

## 📌 PART 1: PHYSICAL / DIGITAL DOCUMENTS TO COLLECT FIRST
*Ask the client to keep these ready on their table or sent to you on WhatsApp before starting account signups:*

1. **Business PAN Card** (Clear photo / PDF of the firm or proprietor's PAN).
2. **GST Registration Certificate** (Form GST REG-06, showing Jammu & Kashmir jurisdiction and 15-digit GSTIN).
3. **BIS Hallmarking Certificate / License Document** (Bureau of Indian Standards Jeweller Registration Certificate showing their Registration Number).
4. **Cancelled Cheque / Bank Statement** of the current bank account (Must show: Account Name, Account Number, and IFSC Code matching the business entity for Razorpay payouts).
5. **Aadhaar Card of the Proprietor / Director** (For instant Aadhaar OTP KYC verification on Razorpay and courier platforms).
6. **Mobile Phone with the Registered Number** (Keep the owner's phone right beside you for real-time SMS OTPs).
7. **Official Business Email Login** (Access to their primary inbox e.g., `contact@ambikajewelsshop.com` or `ambikajewelsjammu@gmail.com`).

---

## 📌 PART 2: ACCOUNTS TO CREATE (STEP-BY-STEP)

---

### 1. PAYMENT GATEWAY: RAZORPAY (INDIA)
*Handles online UPI, credit/debit cards, net banking, and automatic checkout settlements directly into the client's bank account.*

- **Website:** [https://dashboard.razorpay.com/signup](https://dashboard.razorpay.com/signup)
- **Account Details to Use:**
  - Email: Client’s official email
  - Mobile: Owner’s phone number (used for login OTPs)
- **Onboarding Steps While Sitting with Client:**
  1. Sign up and verify email + phone OTP.
  2. Select Business Category: **Retail & E-commerce → Precious Jewellery & Gems**.
  3. Enter Business Information:
     - Legal Business Name (Exactly as on GST certificate)
     - Business Type (Sole Proprietorship / Partnership / Pvt Ltd)
     - Business PAN & GSTIN
     - Registered Address: *Shop no. 3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu 180013*
  4. Bank Account Details:
     - Bank Name, Account Number, IFSC code (from cancelled cheque).
  5. Identity Verification:
     - Enter Owner's PAN + Aadhaar Number and complete instant DigiLocker / Aadhaar OTP verification.
- **Credentials to Copy from Razorpay Dashboard:**
  - Go to **Account & Settings → API Keys → Generate Key**:
    - **Key ID:** `NEXT_PUBLIC_RAZORPAY_KEY_ID` (Format: `rzp_live_...` or `rzp_test_...`)
    - **Key Secret:** `RAZORPAY_KEY_SECRET` *(Copy immediately; it will only be shown once)*
  - Go to **Account & Settings → Webhooks → Add New Webhook**:
    - Webhook URL: `https://ambikajewelsshop.com/api/razorpay/webhook`
    - Secret: Choose a strong random string (e.g. `ambika_rzp_sec_2026`) → save as `RAZORPAY_WEBHOOK_SECRET`
    - Active Events to select:
      - `order.paid`
      - `payment.captured`
      - `payment.failed`

---

### 2. LOGISTICS: BVC LOGISTICS (eSHIP) & SHIPROCKET
*BVC Logistics is India’s premier insured armored courier for fine jewelry & hallmarked gold ornaments.*

#### A. Primary High-Value Courier: BVC Logistics eSHIP
- **Website:** [https://www.bvclogistics.com/eship/](https://www.bvclogistics.com/eship/) (or contact BVC merchant onboarding executive)
- **Account Details to Use:**
  - Registered firm name, GSTIN, and Jammu showroom pickup address.
  - Submit documents: GST Certificate, BIS Hallmarking Certificate, Owner PAN/Aadhaar.
- **Credentials to Obtain from BVC Technical/Merchant Portal:**
  - **API Key:** `BVC_API_KEY`
  - **API Secret:** `BVC_API_SECRET`
  - **App ID:** `BVC_APP_ID`
  - **Pickup Pincode:** `180013` (Lower Roop Nagar, Jammu)
  - **Webhook Secret:** `BVC_WEBHOOK_SECRET`

#### B. Secondary / Silver / Accessory Courier: Shiprocket (Optional / Fallback)
*Used for silver payals, packaging boxes, temple coins, or non-bullion accessories.*
- **Website:** [https://app.shiprocket.in/register](https://app.shiprocket.in/register)
- **Steps:**
  1. Register with client email & phone.
  2. Add Pickup Address: *Shop no. 3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, 180013*.
  3. Upload GSTIN & verify bank account for COD remittances.
- **Credentials to Save:**
  - `SHIPROCKET_EMAIL`
  - `SHIPROCKET_PASSWORD`
  - `SHIPROCKET_PICKUP_LOCATION` (e.g. `Primary` or `JammuShowroom`)

---

### 3. DATABASE & STORAGE: SUPABASE
*Hosts the live PostgreSQL database (products, real-time orders, rate history) and secure file storage (invoice PDFs, jewelry images).*

- **Website:** [https://supabase.com](https://supabase.com)
- **Steps:**
  1. Click **Sign In → Sign Up** using the client's Google account or company email.
  2. Click **New Project**:
     - Project Name: `Ambika Jewels`
     - Database Password: Create a secure 16+ character password (Write this down!).
     - **Region:** Select **South Asia (Mumbai) [ap-south-1]** *(Crucial for speed in India and Indian DPDP data sovereignty compliance)*.
     - Pricing Plan: Free Tier (sufficient for launch) or Pro ($25/mo).
- **Credentials to Copy:**
  - Go to **Project Settings → API**:
    - **Project URL:** `NEXT_PUBLIC_SUPABASE_URL` (e.g. `https://xyzcompany.supabase.co`)
    - **anon public key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY` (starts with `eyJ...`)
    - **service_role secret key:** `SUPABASE_SERVICE_ROLE_KEY` *(Keep secret; used by server routes)*
  - Go to **Project Settings → Database → Connection string (URI)**:
    - Save this connection string to run migrations.

---

### 4. CACHE & SECURITY: UPSTASH REDIS
*Protects the site against bots, prevents order replay attacks, rate-limits bullion price inquiries, and stops brute-forcing.*

- **Website:** [https://console.upstash.com](https://console.upstash.com)
- **Steps:**
  1. Sign up using the client's email / Google account.
  2. Click **Create Database**:
     - Name: `ambika-jewels-cache`
     - Type: Regional
     - **Region:** `ap-south-1 (Mumbai)`
     - Eviction: enabled
- **Credentials to Copy:**
  - On the database details page, scroll down to **REST API**:
    - Click **".env"** tab.
    - **UPSTASH_REDIS_REST_URL**
    - **UPSTASH_REDIS_REST_TOKEN**

---

### 5. AI CONCIERGE: GROQ CLOUD
*Powers the "Aanya" AI Chatbot with ultra-fast LLaMA 3.3 70B inference.*

- **Website:** [https://console.groq.com](https://console.groq.com)
- **Steps:**
  1. Sign up using client's email / Google account.
  2. Go to **API Keys → Create API Key**:
     - Name: `ambika-chat-prod`
- **Credential to Copy:**
  - `GROQ_API_KEY` (Format: `gsk_...`)

---

### 6. DAILY BULLION RATES: GOLDAPI.IO
*Provides automated backup market prices for 24K/22K gold and silver.*

- **Website:** [https://www.goldapi.io/signup](https://www.goldapi.io/signup)
- **Steps:**
  1. Sign up with client's email.
  2. Verify email address.
- **Credential to Copy:**
  - On dashboard, copy **User API Key**: `GOLDAPI_KEY`

---

### 7. TRANSACTIONAL EMAILS: RESEND
*Sends automated order confirmation emails and GST tax invoices to customers.*

- **Website:** [https://resend.com](https://resend.com)
- **Steps:**
  1. Sign up with client's email.
  2. Go to **Domains → Add Domain**:
     - Enter: `ambikajewelsshop.com`
     - Copy the DNS records (DKIM, SPF, MX) to add in the client's Domain Registrar (GoDaddy/Hostinger).
  3. Go to **API Keys → Create API Key**:
     - Name: `ambika-mail-prod`
     - Permission: Sending access
- **Credentials to Copy:**
  - `RESEND_API_KEY` (Format: `re_...`)
  - `RESEND_FROM_EMAIL`: `Ambika Jewels <orders@ambikajewelsshop.com>`

---

### 8. DOMAIN REGISTRAR & DNS
*Access where `ambikajewelsshop.com` is purchased (GoDaddy, Hostinger, BigRock, Namecheap).*

- **Things to check while with client:**
  - Ask for login access to the domain control panel.
  - Make sure you can edit DNS records (A Records, CNAMEs, TXT records for email verification).

---

## 📌 PART 3: STATUTORY SELLER INFORMATION TO NOTE DOWN
*These exact details are legally required by Indian e-commerce consumer protection laws and must be filled into the website configuration:*

| Field Required | Exact Detail from Client / Certificate | Notes |
| :--- | :--- | :--- |
| **Legal Business Name** | _____________________________________________ | As registered on GST certificate |
| **Entity Type** | Sole Proprietorship / Partnership / Pvt Ltd | Confirm with client/CA |
| **15-Digit GSTIN** | _____________________________________________ | e.g. `01AAAAA0000A1Z5` |
| **10-Character Business PAN** | _____________________________________________ | e.g. `AAAAA0000A` |
| **BIS Hallmark License No.** | _____________________________________________ | Jeweller BIS Registration No. |
| **Registered Address** | Shop no. 3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, J&K 180013 | Verify door/shop number |
| **Grievance Officer Name** | _____________________________________________ | Statutory consumer officer |
| **Grievance Officer Phone** | _____________________________________________ | Must be answered during hours |
| **Grievance Officer Email** | _____________________________________________ | e.g. `grievance@ambikajewelsshop.com` |
| **Showroom Support Phone** | `+91 9682589725` | Confirm if this remains active |
| **WhatsApp Concierge** | `+91 9086098457` | Confirm if this remains active |

---

## 📌 PART 4: PRODUCTION `.env.local` CHEATSHEET
*Once you finish the signups, you can populate your production environment with these collected values:*

```env
# ==========================================
# 1. SUPABASE (MUMBAI REGION)
# ==========================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# ==========================================
# 2. RAZORPAY PAYMENT GATEWAY
# ==========================================
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# ==========================================
# 3. BVC LOGISTICS (ARMORED JEWELRY COURIER)
# ==========================================
BVC_API_KEY=your_bvc_api_key
BVC_API_SECRET=your_bvc_api_secret
BVC_APP_ID=your_bvc_app_id
BVC_ORIGIN_PINCODE=180013
BVC_WEBHOOK_SECRET=your_bvc_webhook_secret

# ==========================================
# 4. UPSTASH REDIS (SECURITY & RATE LIMITING)
# ==========================================
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token

# ==========================================
# 5. GROQ AI CLOUD (LLaMA CHATBOT)
# ==========================================
GROQ_API_KEY=gsk_...

# ==========================================
# 6. DAILY BULLION RATES & EMAILS
# ==========================================
GOLDAPI_KEY=goldapi-...-io
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Ambika Jewels <orders@ambikajewelsshop.com>

# ==========================================
# 7. ADMIN SECURITY KEYS (GENERATE RANDOM 32-CHAR STRINGS)
# ==========================================
ADMIN_PASSCODE=ambika2026
ADMIN_SESSION_SECRET=strong_32_character_random_hex_key_here
ENCRYPTION_SECRET=strong_32_character_random_hex_key_here

# ==========================================
# 8. STATUTORY SELLER CONFIGURATION
# ==========================================
STORE_LEGAL_NAME=Ambika Jewels
STORE_ENTITY_TYPE=Sole Proprietorship
STORE_GSTIN=01XXXXXXXXXXXXX
STORE_PAN=XXXXXXXXXX
STORE_BIS_LICENSE=HM/C-XXXXXXXXXX
```

---

## 📌 PART 5: QUICK CHECKLIST BEFORE LEAVING THEIR SHOWROOM

- [ ] **Aadhaar OTP verified on Razorpay** (Account submitted for live activation).
- [ ] **Bank Account verified on Razorpay** (Penny-drop test succeeded).
- [ ] **API Key ID & Secret downloaded / stored safely**.
- [ ] **BVC Logistics merchant application submitted** with GST & BIS certificates.
- [ ] **Supabase project created** in `ap-south-1 (Mumbai)`.
- [ ] **Domain DNS login verified** (You can add TXT / CNAME records).
- [ ] **All 4 statutory values collected** (GSTIN, PAN, BIS Number, Grievance Officer).
- [ ] **High-resolution photos taken** of the showroom facade, karigar workshop, and signature Dogra heritage pieces (if needed for the About/Showroom page).
