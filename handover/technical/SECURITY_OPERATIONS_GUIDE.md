# AMBIKA JEWELS — SECURITY OPERATIONS GUIDE
**For Store Owners & Management**  
**Location:** Jammu Tawi Showroom  
**Confidentiality Level:** Internal Operations  

---

## 1. PURPOSE & PRINCIPLES
This guide provides non-technical instructions for Smt. Shivani Anand, Sh. Lakesh Kumar, and showroom managers to operate the Ambika Jewels online store securely on a daily basis.

### Core Golden Rules
1. **Never Share the Master Admin PIN over WhatsApp or SMS:** The admin PIN unlocks daily bullion rates, order statuses, inventory pricing, and discount coupons.
2. **Always Log Out from Shared Showroom Devices:** When stepping away from the counter counter iPad or showroom PC, click the red **Logout** button.
3. **Verify High-Value Orders (> ₹2,00,000) Manually:** Ensure the customer's PAN card is on file before armed BVC dispatch.
4. **Never Dispatch Orders Flagged with "SECURITY AUDIT REQUIRED":** If an order is flagged with an amount mismatch in the admin panel, hold dispatch immediately.

---

## 2. ADMIN ACCESS & PASSCODE HYGIENE

### Logging In
* Navigate to your website footer on any browser.
* Click the subtle **Staff Portal** link in the bottom copyright bar.
* Enter your private 6-8 digit showroom passcode.
* The system allows a maximum of 5 attempts per 15 minutes before an automatic temporary IP lockout engages.

### Active Session Duration
* Administrative sessions automatically expire after **12 hours**.
* Logging out immediately invalidates and revokes your active token on the server so it cannot be replayed by anyone else.

### Rotating the Admin Passcode
If a staff member leaves or a showroom counter device is replaced:
1. Log into your hosting provider dashboard (e.g., Vercel / Cloudflare).
2. Open **Settings > Environment Variables**.
3. Select `ADMIN_PASSCODE` and edit it to a new private numeric PIN (minimum 6 digits, recommended 8 digits).
4. Redeploy the application. All existing staff must log in with the new PIN immediately.

---

## 3. MANAGING DAILY BULLION RATES SAFELY

Bullion market rates change daily. To prevent costly errors:
* Access the **Daily Bullion Rates** card on the dashboard.
* Enter the live rate per gram for 24K Gold, 22K Gold, 18K Gold, 14K Gold, 999 Silver, and 925 Silver.
* **Safety Guard:** The system will refuse any rate entry that deviates by more than **15%** from yesterday's price (to prevent accidental keystrokes like typing `82500` instead of `8250`).
* If market movements genuinely exceed 15%, check the "Confirm unusual market movement" checkbox before saving.

---

## 4. HANDLING ORDERS & PAYMENT VERIFICATION

### Order Status Meaning
* **`PAID` / `CONFIRMED`:** Razorpay has cryptographically confirmed receipt of the full payment. It is safe to pack and hallmark verify.
* **`PENDING_CONFIRMATION`:** Customer reached checkout and opened UPI/card, but payment has not yet settled or was cancelled. Do not ship.
* **`FLAGGED / AUDIT REQUIRED`:** The paid amount from the bank did not match the calculated store cart total (e.g. attempted price hack). **DO NOT SHIP**. Call the customer and consult your Chartered Accountant.

### Packaging & Armed BVC Dispatch
1. Verify the BIS Hallmark Certificate and HUID for the piece.
2. Enclose the jewellery in a serialized tamper-evident security vault bag.
3. Click **"Book BVC Express Pickup"** in the order row.
4. Affix the printed AWB barcode label to the exterior of the vault bag.
5. Hand over cargo ONLY to uniformed, badged BVC Logistics armed transit officers upon scanning their verification OTP.

---

## 5. AUDIT LOG MONITORING

Every critical change made in the admin panel is recorded in the **Activity & Audit Trail** ledger:
* Price edits (records old price and new price).
* Showroom sold-out toggles.
* Daily bullion rate updates.
* Coupon creations, edits, and deletions.
* Product additions and deletions.

Check the Audit Trail weekly to ensure all modifications reflect authorized showroom business decisions.

