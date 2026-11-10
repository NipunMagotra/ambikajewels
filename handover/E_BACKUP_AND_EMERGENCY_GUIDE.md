# Ambika Jewels — Emergency Operations & Disaster Recovery Guide

---

## 1. Emergency Scenarios & Rapid Protocols

### Scenario A: Bullion Market Emergency Spike (Gold Rates Swing Wildly)
**Problem:** Global bullion market surges or swings rapidly after your morning update, and you want to prevent online purchases at outdated prices.

**Solution (Choose either method):**
- **Method 1 (Update Rates in 15 seconds):** Log into `ambikajewelsonline.com/admin`, open the **📈 Bullion & Pricing** tab, enter the new bullion rate, check **Confirm Large Change**, and click **Publish & Lock Daily Bullion Rates**. All prices update immediately.
- **Method 2 (Temporary Pause / Maintenance Mode):** If you need time to evaluate prices, in **🎨 Website Content**, update the Announcement Bar to:  
  *"Notice: Online checkout temporarily paused for daily bullion repricing. Please call our Jammu showroom directly at +91 9682589725 to place your order."*

---

### Scenario B: Customer Paid via UPI/Card, but Order Shows "Unconfirmed"
**Problem:** The customer says money left their bank account, but they received an internet disconnection or closed their browser before the confirmation page loaded.

**Solution:**
1. Open Razorpay Dashboard (`dashboard.razorpay.com`).
2. Search for the payment using the customer's phone number or email.
3. Confirm if the payment status is **Captured** (money successfully received).
4. Note the Razorpay Payment ID (e.g., `pay_...`).
5. Open your Admin Console under **🛍️ Orders**. Locate the order or customer:
   - Verify the amount matches the payment in Razorpay.
   - Change the order status to **Confirmed**.
   - The customer will receive their tracking link and tax invoice automatically.
6. If the payment shows **Failed** in Razorpay, the customer's issuing bank will automatically refund the amount within 2 to 5 business days per RBI guidelines.

---

### Scenario C: Admin Passcode Lost or Compromised
**Problem:** A staff member forgot the passcode, or you suspect an unauthorized person saw the passcode.

**Solution:**
1. Log into your hosting dashboard (Vercel / Cloudflare).
2. Go to **Settings** → **Environment Variables**.
3. Locate `ADMIN_PASSCODE` and change it to a new strong passkey.
4. Locate `ADMIN_SESSION_SECRET` and change the value (this immediately invalidates and logs out all existing active sessions on all devices).
5. Click **Redeploy**. Within 60 seconds, the new passcode is active.

---

### Scenario D: Website Down or Returning a 500 Error Screen
**Problem:** The website is not opening or showing a temporary connection error.

**Immediate Checks:**
1. **Check Internet & Domain:** Visit `https://downforeveryoneorjustme.com/ambikajewelsonline.com` to see if the downtime is global or just your local Wi-Fi.
2. **Check Hosting Status:** Log into Vercel / Railway and verify if the latest deployment shows green "Ready". If failed, click "Redeploy last successful build".
3. **Check Supabase Database:** Visit [supabase.com/dashboard](https://supabase.com/dashboard) and check if the database status is active.
4. **Call Emergency Technical Support:** Contact your designated developer / support partner with the exact error code shown.

---

## 2. Database Backup & Data Protection Routine

### Automated Cloud Backups
- Supabase automatically takes daily point-in-time recovery (PITR) backups of your entire PostgreSQL database, including all products, orders, daily rate histories, and audit records.
- Backups are encrypted with AES-256 and stored across multiple geographic zones.

### Recommended Weekly Manual Export (Takes 2 Minutes)
For ultimate peace of mind:
1. Every Sunday evening, log into [supabase.com/dashboard](https://supabase.com/dashboard).
2. Select the **Ambika Jewels** project.
3. Click **Table Editor** → **products** → click **Export to CSV**.
4. Click **orders** → click **Export to CSV**.
5. Save the two CSV files to an encrypted USB drive or secure showroom Google Drive folder named `Ambika_Jewels_Weekly_Backups/`.

---

## 3. Critical Emergency Contact Directory

| Role / Entity | Name | Telephone | Email |
| :--- | :--- | :--- | :--- |
| **Store Owner** | Smt. Shivani Anand | +91 9086098457 | `contact@ambikajewelsonline.com` |
| **Showroom Manager** | Sh. Lakesh Kumar | +91 9682589725 | `contact@ambikajewelsonline.com` |
| **BVC Armed Courier** | BVC Logistics Helpdesk | 1800-22-2828 | `support@bvclogistics.com` |
| **Razorpay Merchant** | Razorpay Priority Support | — | Via [dashboard.razorpay.com](https://dashboard.razorpay.com) |
| **J&K Cyber Crime Cell** | J&K Police Cyber Cell | 1930 / +91 191-2455555 | `cyberpolice-jk@nic.in` |

---
*Ambika Jewels Emergency Response Manual*

