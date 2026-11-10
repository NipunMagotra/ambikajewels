# THE NON-TECHNICAL FOUNDER'S VIBE-CODING GUIDE

> **Welcome, Founder!**  
> You do not need to be a computer scientist or full-stack software engineer to operate and grow Ambika Jewels using modern AI coding tools.  
> This guide is written in plain English to help you navigate, prompt, review, and safely evolve your online jewellery showroom without breaking things.

---

## 🌟 1. How This Application Actually Works (The Big Picture)

Think of Ambika Jewels as a digital version of your physical showroom in Jammu:

1. **The Storefront (Public Website):**
   - Built with **Next.js** and **React**.
   - These are the visual display cases where visitors browse earrings, Dogra necklaces, bangles, and bridal collections.
2. **The Counter & Vault (The Server & Database):**
   - The server runs on **Netlify**, and the database runs on **Supabase** (PostgreSQL).
   - This is where the authoritative product catalog, stock numbers, gold rates, and order history live safely behind locked doors.
3. **The Cash Register (Razorpay):**
   - Handles UPI, debit/credit cards, and NetBanking securely.
   - The website asks Razorpay to accept payments, and Razorpay sends back a cryptographically signed receipt proving the money was deposited.
4. **The Owner's Office (`/admin`):**
   - The private visual dashboard where you update gold prices, add new inventory, upload pictures, and print GST tax invoices without touching code.

---

## 📚 2. The "10 Files I Should Know First"

If you ever want to know where something lives or tell an AI IDE where to look, here are the 10 most important files in the whole project:

1. **`PROJECT_CONTEXT.md` (Project Root):**  
   The master instruction guide. Always tell any AI model: *"Read PROJECT_CONTEXT.md before answering or changing code."*
2. **`src/config/siteConfig.ts`:**  
   The identity card of your business. Showroom address, GST number, PAN, WhatsApp number, phone number, and free delivery thresholds live here.
3. **`src/app/page.tsx`:**  
   The homepage layout. Hero banner, featured Dogra heritage collections, showroom features, and customer reviews.
4. **`src/lib/serverPricing.ts`:**  
   The bank vault price calculator. Computes the 3% GST, subtotal, and courier charges. *Never let an AI weaken this!*
5. **`src/lib/inventoryEngine.ts`:**  
   The anti-double-selling engine. Ensures two people cannot buy the same physical piece at the exact same second.
6. **`src/lib/staffAuth.ts`:**  
   Staff accounts, security roles (Owner, Manager, Staff), and Two-Factor Authentication (MFA).
7. **`src/components/layout/Header.tsx`:**  
   The top navigation bar, logo, search bar, cart icon, categories menu, and announcement bar.
8. **`src/app/admin/AdminDashboardClient.tsx`:**  
   The visual admin console where you operate your jewellery business.
9. **`src/app/api/razorpay/verify/route.ts`:**  
   The payment verification gate. Validates genuine bank signatures before marking orders paid.
10. **`supabase/schema.sql`:**  
    The database blueprint defining tables for products, orders, coupons, and staff.

---

## 🛡️ 3. Safe AI Coding Workflow (Follow Every Single Time)

When asking an AI IDE to make changes, follow this 11-step safety ladder:

```
[ Step 1: Explain Desired Goal in Plain English ]
                      ↓
[ Step 2: Instruct AI to Inspect Existing Code First ]
                      ↓
[ Step 3: Ask AI for a Plain-English Plan Before Modifying Files ]
                      ↓
[ Step 4: AI Applies the Changes ]
                      ↓
[ Step 5: Review the Changed Lines (Git Diff) ]
                      ↓
[ Step 6: Run Automated Tests: `npm test` ]
                      ↓
[ Step 7: Run TypeScript Checker: `npx tsc --noEmit` ]
                      ↓
[ Step 8: Run Linter: `npm run lint` ]
                      ↓
[ Step 9: Run Production Build: `npm run build` ]
                      ↓
[ Step 10: Test the Flow in Your Browser ]
                      ↓
[ Step 11: Git Commit Only When 100% Satisfied ]
```

---

## ⚠️ 4. How to Spot a Risky Change

Stop and ask questions if an AI suggests:
- **"Let's disable signature verification temporarily to test."** → ❌ *Never allow this. It allows fake orders.*
- **"Let's calculate the price in the browser."** → ❌ *Never allow this. A malicious customer could change a ₹2,00,000 necklace to ₹1.*
- **"Let's turn off Row-Level Security (RLS) in the database."** → ❌ *Never allow this. It exposes your customer data.*
- **"Let's delete these test files because they are failing."** → ❌ *Never allow this. If a test fails, fix the code bug, not the test.*
- **"I have hardcoded your secret key in the file."** → ❌ *Never allow this. Secrets belong only in `.env.local` or hosting dashboards.*

---

## 💾 5. How to Create a Quick Safety Backup Before Big Experiments

Before asking an AI to do something complex, create a new branch in your terminal:

```bash
# 1. Create a safe experimental branch
git checkout -b experiment/my-new-feature

# 2. If something goes wrong and you want to throw it away:
git checkout main
git branch -D experiment/my-new-feature
```

---

## 💳 6. How to Safely Handle Payment Changes

If you ever change Razorpay settings:
1. Always test in **Razorpay Test Mode** first.
2. Verify that `npm test` passes all 244 automated test invariants.
3. Test a mock order with test cards or test UPI.
4. Only switch to live keys after the full test passes.
