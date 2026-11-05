# Ambika Jewels — Jewelry Product Catalog Management & Ingestion Guide

**Document ID:** `docs/catalog/CATALOG_MANAGEMENT_GUIDE.md`  
**Target Audience:** Showroom Owner (Shivani Anand), Counter Manager (Lakesh Kumar), Developers, and Inventory Staff  
**Tools Provided:**
- CSV Template: [`docs/catalog/JEWELRY_CATALOG_TEMPLATE.csv`](file:///d:/Client%20Projects/Ambika%20Jewels/docs/catalog/JEWELRY_CATALOG_TEMPLATE.csv)
- Sample JSON: [`docs/catalog/sample-inventory.json`](file:///d:/Client%20Projects/Ambika%20Jewels/docs/catalog/sample-inventory.json)
- Validation Engine: `npm run validate-catalog`
- Ingestion Engine: `npm run import-catalog`

---

## 1. Why Fine Jewelry Requires Strict Data Validation

Fine jewelry e-commerce is fundamentally different from generic retail:
1. **Weight & Metal Purity Transparency:** Customers and statutory bodies (BIS, Legal Metrology) require exact gross weight, pure metal net weight, and stone weight disclosures.
2. **Pricing Integrity:** Precious metal prices fluctuate daily. Calculations must convert reliably to integer **paise** (e.g. `₹2,60,000` = `26000000` paise) so floating-point errors cannot occur during Razorpay checkout.
3. **CBDT Rule 114B Compliance:** Any order totaling above ₹2,00,000 mandates collecting the customer's PAN card.
4. **BVC Armored Shipping Invariants:** High-value consignments require package dimensions (length, breadth, height) and weight for insured vault pickup.

---

## 2. Supported Catalog Categories

Every product MUST belong to one of the 13 official showroom categories defined in `src/config/siteConfig.ts`:

1. `Dogra Heritage Collection` (Authentic Jammu Dogri Jhumki, Naman Set, Long Haar)
2. `Gold Jewellery` (22K, 18K, 14K daily and occasion wear)
3. `Diamond Jewellery` (IGI/GIA certified solitaires, diamond chokers, eternity bands)
4. `Silver Jewellery (925)` (Sterling silver Dogra payals, temple coins, pooja articles)
5. `Bridal Couture` (Grand wedding bridal sets, Kundan, Jadau, Polki)
6. `Gold Exchange & Custom` (Bespoke 3D CAD design samples and heirloom redesign)
7. `Necklaces & Chokers`
8. `Earrings & Jhumkas`
9. `Bangles & Kadas`
10. `Rings & Solitaires`
11. `Temple & Antique Gold`
12. `Everyday Wear`
13. `Men's Accessories`

---

## 3. Product Fields Specification (Field-by-Field)

| Column Header | Type | Required? | Example | Rules & Constraints |
| :--- | :--- | :---: | :--- | :--- |
| `sku` | String | Yes | `AMB-DG-001` | Unique showroom stock code (3-20 uppercase chars). |
| `name` | String | Yes | `Authentic 22K Dogri Jhumki` | Customer-facing title (minimum 3 characters). |
| `slug` | String | Yes | `authentic-22k-dogri-jhumki` | Unique URL path. Lowercase letters, numbers, and hyphens only. |
| `category` | String | Yes | `Dogra Heritage Collection` | Must match one of the 13 categories above. |
| `collection` | String | Yes | `Dogra Heritage Collection` | E.g. `Heritage`, `Bridal`, `Modern`, `Temple`. |
| `purity` | String | Yes | `22K (916)` | `22K (916)`, `18K (750)`, `14K (585)`, or `925 Silver`. |
| `gross_weight_grams` | Number | Yes | `15.2` | Total physical scale weight in grams (> 0). |
| `net_weight_grams` | Number | Yes | `14.5` | Pure metal weight in grams. Must be $\le$ gross weight! |
| `stone_description`| String | No | `Natural Freshwater Pearls` | Gemstone, pearl, or diamond cut/clarity description. |
| `stone_weight_grams`| Number | No | `0.7` | Weight of stones in grams (gross minus net). |
| `stone_value_inr` | Number | No | `3500` | Estimated value of gemstones in INR. |
| `making_charge_type`| Enum | Yes | `percent` or `flat` | `percent` (% of gold value) or `flat` (₹ per gram). |
| `making_charge_rate`| Number | Yes | `12` (for 12%) or `650` (for ₹650/g) | Numerical rate used for transparent pricing. |
| `price_inr` | Number | Yes | `95000` | Authoritative selling price in Indian Rupees. |
| `bis_hallmarked` | Boolean | Yes | `true` | Bureau of Indian Standards hallmark stamp present. |
| `huid_code` | String | Conditional | `HM916A` | 6-character laser-engraved alphanumeric HUID. |
| `stock_status` | Enum | Yes | `in_stock` | Must be `in_stock`, `limited`, or `out_of_stock`. |
| `is_featured` | Boolean | Yes | `true` | Show on homepage Best Sellers luxury grid. |
| `dimensions_length_cm` | Number | Yes | `4.8` | Product length in cm (for parcel box calculation). |
| `dimensions_breadth_cm`| Number | Yes | `2.4` | Product breadth in cm. |
| `dimensions_height_cm` | Number | Yes | `2.4` | Product height in cm. |
| `care_instructions` | String | Yes | `Store in velvet pouch...` | Gold/silver maintenance tips for customer. |
| `craftsmanship_story` | String | Yes | `Handcrafted by master karigars...` | Authentic heritage narrative displayed on PDP. |
| `images` | String/Array | Yes | `/products/kundan.png` | Semicolon-separated image URLs or file paths. |

---

## 4. Step-by-Step Inventory Ingestion Workflow

### Step 1: Fill the Catalog Template
Open [`docs/catalog/JEWELRY_CATALOG_TEMPLATE.csv`](file:///d:/Client%20Projects/Ambika%20Jewels/docs/catalog/JEWELRY_CATALOG_TEMPLATE.csv) in Excel, Google Sheets, or your inventory spreadsheet editor. Enter each physical showroom piece row-by-row, ensuring all columns are filled. Save as CSV or export as JSON.

### Step 2: Validate Data Automatically
Before touching the live website or database, run the automated validator:

```bash
# Validates the CSV template
npm run validate-catalog docs/catalog/JEWELRY_CATALOG_TEMPLATE.csv

# Or validate your custom file
node scripts/validate-catalog.mjs path/to/your-inventory.csv
```

The validator will immediately check:
* ✅ No negative or zero weights
* ✅ Net weight $\le$ Gross weight invariant
* ✅ Zero duplicate URL slugs or SKUs
* ✅ Category matches official showroom categories
* ✅ Image availability and pricing math

### Step 3: Preview the Ingestion (Dry-Run Mode)
Preview what will be imported without writing to the database:

```bash
npm run import-catalog -- --dry-run
```

This command will:
1. Validate all rows
2. Convert all INR prices into exact integer paise (`price * 100`)
3. Format localized currency strings (`₹2,60,000`)
4. Generate an idempotent SQL migration file: `supabase/migrations/20261105_import_full_catalog.sql`

### Step 4: Apply to Live Database
Choose one of two simple ways to apply:

* **Option A (CLI):**
  If `SUPABASE_SERVICE_ROLE_KEY` is configured in your environment:
  ```bash
  npm run import-catalog docs/catalog/JEWELRY_CATALOG_TEMPLATE.csv
  ```
* **Option B (Supabase Dashboard - 1-Click):**
  Open your [Supabase Dashboard](https://supabase.com) $\rightarrow$ **SQL Editor** $\rightarrow$ Open `supabase/migrations/20261105_import_full_catalog.sql` $\rightarrow$ Click **Run**.

---

## 5. Safeguards & Best Practices

1. **Idempotent Updates:** Re-importing the same CSV will update existing products matching on `slug` rather than creating duplicates.
2. **Never Overwrite Real Stock with Placeholders:** If a piece is custom-ordered or out of stock, set `stock_status` to `out_of_stock`.
3. **Image Hosting:** Place local images in `public/products/` or use secure HTTPS URLs (e.g. Unsplash, Supabase Storage bucket, or Cloudinary).

