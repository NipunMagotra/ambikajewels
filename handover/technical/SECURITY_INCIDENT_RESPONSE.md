# AMBIKA JEWELS — SECURITY INCIDENT RESPONSE PLAYBOOK
**Emergency Action Protocols for Showroom Owners & Technical Maintainers**  
**Primary Domain:** `ambikajewelsonline.com`  

---

## 1. INCIDENT SEVERITY CLASSIFICATION

| Severity | Incident Type | Examples | Immediate Action |
| :--- | :--- | :--- | :--- |
| **SEV-1 (CRITICAL)** | Active Compromise / Fraud | Payment amount mismatch, unauthorized price drop, suspected admin PIN leak | Freeze orders, rotate admin PIN, hold shipments |
| **SEV-2 (HIGH)** | Service Interruption / Attack | Webhook failure, persistent brute-force login attempts, database disconnect | Investigate logs, contact hosting support |
| **SEV-3 (MEDIUM)** | Anomalous Activity | Unrecognized coupon applied, customer reporting unable to track order | Review audit trail, verify coupon limits |
| **SEV-4 (LOW)** | Minor Glitch / User Error | Non-critical styling bug, single failed login | Normal developer triage |

---

## 2. EMERGENCY CONTACT DIRECTORY

* **Primary Store Owner:** Smt. Shivani Anand / Sh. Lakesh Kumar — `+91 9682589725`
* **Showroom Address:** Ambika Jewels, Jammu Tawi, J&K - 180001
* **Payment Gateway Emergency:** Razorpay Merchant Escalations (`support@razorpay.com` / Dashboard Urgent Ticket)
* **Logistics Emergency:** BVC Logistics Jammu Regional Hub Manager
* **Database & Hosting Provider:** Vercel Support / Supabase Support

---

## 3. PLAYBOOK A: SUSPECTED ADMIN PASSCODE LEAK

**Trigger:** An unknown party changed prices, or an unauthorized person logged in.

1. **Step 1 — Immediate Passcode Invalidation:**
   * Open the hosting dashboard (Vercel).
   * Go to **Project Settings > Environment Variables**.
   * Change `ADMIN_PASSCODE` to a completely new 8-digit random PIN.
   * Change `ADMIN_SESSION_SECRET` to a new random 64-character hex string.
   * Redeploy the project immediately. This automatically revokes and invalidates every existing admin cookie and session across the globe within seconds.
2. **Step 2 — Audit Review:**
   * Open the Admin Dashboard with the new PIN.
   * Navigate to the **Activity & Audit Trail** tab.
   * Check all actions taken over the past 48 hours.
   * Revert any unauthorized price changes or coupon additions.
3. **Step 3 — Order Freeze:**
   * Filter orders by status `CONFIRMED`.
   * Cross-reference any orders placed during the anomaly window against your physical inventory records.
   * Put any suspicious orders on temporary hold before dispatching.

---

## 4. PLAYBOOK B: PAYMENT AMOUNT MISMATCH OR GATEWAY ERROR

**Trigger:** An order is flagged with `[SECURITY AUDIT REQUIRED] Webhook amount mismatch` or a customer claims they paid ₹1 instead of ₹1,00,000.

1. **Do NOT Dispatch the Jewellery:**
   * An amount mismatch means the client attempted to tamper with the checkout payload or network connection dropped during verification.
2. **Inspect Razorpay Live Dashboard:**
   * Log into [dashboard.razorpay.com](https://dashboard.razorpay.com).
   * Search for the `razorpay_payment_id`.
   * Verify the exact amount captured by the bank in Rupees.
3. **Compare with Store Catalog:**
   * If the bank captured the correct store amount, manually mark the order as `CONFIRMED` in the admin panel and proceed.
   * If the captured amount is less than the true price, issue a full refund directly from the Razorpay dashboard with reason: "Pricing discrepancy / order cancelled".

---

## 5. PLAYBOOK C: SHOWROOM DEVICE LOSS OR THEFT

**Trigger:** A counter tablet, showroom laptop, or owner's mobile device is lost or stolen.

1. **Rotate Credentials:**
   * Immediately rotate `ADMIN_PASSCODE` and `ADMIN_SESSION_SECRET` in hosting.
   * This immediately prevents the lost device from accessing `/admin` even if the browser had an active cookie saved.
2. **Remote Device Wipe:**
   * If using Apple iCloud or Google Find My Device, initiate a remote lock or erase command on the lost device.

---

## 6. PLAYBOOK D: THIRD-PARTY DATA REQUEST (DPDP COMPLIANCE)

**Trigger:** A customer requests deletion or export of their personal data under the Digital Personal Data Protection (DPDP) Act.

1. Customer submits request via `/data-request` on the public website.
2. The store owner receives the ticket at `contact@ambikajewelsonline.com`.
3. Verify the requester's identity by confirming their registered phone number or email.
4. Export or purge customer records in Supabase (excluding statutory GST/CBDT tax invoice archives required by Indian law for 8 years).
5. Acknowledge completion to the customer within 72 hours.

