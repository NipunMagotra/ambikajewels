# Phase 3: Jewelry-Specific Commerce Audit & Regulatory Compliance

**Target Brand:** Ambika Jewels (Bespoke Fine Jewelry & Dogra Heritage Bridal Couture)  
**Registered Showroom:** Shop no. 3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, J&K 180013, India  
**Auditor Role:** Senior Jewelry E-Commerce Architect, Compliance Auditor & Catalog Manager  
**Audit Scope:** Domain-Specific Jewelry E-Commerce Requirements, Indian Legal Metrology, BIS Hallmarking, and Customer Confidence Features  

---

## 1. Executive Summary

An e-commerce platform selling high-ticket precious metals (22K/18K/14K Gold, 925 Sterling Silver, and Natural Certified Diamonds) requires fundamentally different data modeling, legal metrology compliance, and trust-building mechanisms than standard consumer apparel or electronics stores.

The Ambika Jewels platform demonstrates strong foundational compliance in Indian jewelry commerce—most notably enforcing gross vs. net weight distinctions, 6-character alphanumeric BIS HUID disclosures, CBDT Rule 114B PAN thresholds ($\ge ₹2,00,000$), and 3% GST calculations on HSN Code 7113. 

This audit evaluates the platform's product data model, validates jurisdictional operating requirements in Jammu, Jammu & Kashmir, India, audits customer confidence features, and outlines the precise architectural enhancements needed for enterprise-grade jewelry retail.

---

## 2. Product Data Model & Attribute Support Matrix

Fine jewelry pieces vary significantly by classification. A bridal choker requires net gold weight and neckline dimensions; a solitaire ring requires ring sizing and 4Cs diamond certification; earrings require drop length and closure type. 

The table below audits whether each specific attribute is supported in the current product schema (`src/types/index.ts`, `supabase/schema.sql`, and `src/data/mockProducts.ts`):

| Domain Category | Attribute Name | Current Status | Code / Schema Location | Gap Analysis & Recommendation |
| :--- | :--- | :---: | :--- | :--- |
| **Product Identity** | Product Name | **Supported** | `Product.name` | Clean, descriptive naming conventions. |
| | SKU (Stock Keeping Unit) | **Partial** | Uses `id` (UUID) or `slug` | Missing dedicated retail SKU (e.g., `AJ-DOG-JHK-001`). Add `sku` to schema. |
| | Barcode / QR Code | **Missing** | Not in schema | Recommended for counter POS barcode scanning in Jammu showroom. |
| | Category | **Supported** | `Product.category` | 13 primary fine jewelry categories defined in `siteConfig.categories`. |
| | Subcategory | **Missing** | Inferred from name/category | Add optional `subcategory` (e.g., Category: *"Earrings"*, Subcategory: *"Jhumkis"*). |
| | Collection | **Supported** | `Product.collection` | Supports Dogra Heritage, Bridal Couture, Modern Heirlooms, etc. |
| | Tags | **Partial** | `Product.badges: string[]` | `badges` used for display chips; add `tags: string[]` for SEO/search filtering. |
| | Product Status | **Supported** | `Product.stock_status` | Enum: `'in_stock' \| 'limited' \| 'out_of_stock'`. |
| **Jewelry Specifications** | Jewelry Type | **Partial** | Inferred from category | Distinct enum recommended: `ring`, `earring`, `necklace`, `bangle`, `pendant`. |
| | Metal Type | **Supported** | `Product.material` | Explicitly captures "22K Solid Gold", "925 Sterling Silver", etc. |
| | Purity & Karatage | **Supported** | `Product.purity` | Standardized to "22K (916)", "18K (750)", "14K (585)", "925 Silver". |
| | Net Metal Weight | **Supported** | `Product.weight_grams` | Mandatory net precious metal weight (excluding lac, stones, enamel). |
| | Gross Weight | **Supported** | `Product.gross_weight_grams` | Invariant enforced: $\text{Gross Weight} \ge \text{Net Metal Weight}$. |
| | Dimensions (L × B × H) | **Supported** | `Product.dimensions` | Object with `length_cm`, `breadth_cm`, and `height_cm`. |
| | Ring Size Selector | **Supported** | PDP Selector / `STANDARD_INDIAN_RING_SIZES` | Supports standard Indian ring sizes 10 through 24. Conditional on ring items. |
| | Bangle Size Selector | **Supported** | PDP Selector / `STANDARD_INDIAN_BANGLE_SIZES` | Supports standard Indian bangle sizes 2.2 through 2.10. Conditional on wristwear. |
| | Chain / Necklace Length | **Partial** | In `dimensions.length_cm` | Dedicated `chain_length_inches` recommended for pendants and chains. |
| | Gemstone Type | **Partial** | In `description` / `craftsmanship_story` | Add structured `gemstone_type` (e.g., "Natural Burmese Ruby", "VS Diamonds"). |
| | Gemstone Weight (Carats) | **Missing** | Described in prose | Add structured `gemstone_weight_carats` for diamonds and precious gems. |
| | Diamond 4Cs (Cut, Color, Clarity, Carat) | **Partial** | Displayed in badges (e.g. "CERTIFIED DIAMOND") | Add structured 4Cs object for diamond solitaires. |
| | Stone Count & Setting | **Missing** | In free-text description | Add `stone_count: number` and `setting_type: string` (Prong, Bezel, Kundan Jadau). |
| | Metal Finishes / Plating | **Supported** | `Product.metal_finishes` | Supports "Gold", "Antique Gold", "Rose Gold", "Silver". |
| | Design / Karigar Story | **Supported** | `Product.craftsmanship_story` | Dedicated storytelling field for Dogra heritage and Jammu craftsmanship. |
| | Manufacturer / Seller | **Supported** | `Product.seller_details` | Complies with Legal Metrology with Jammu showroom address. |
| **Commercial Details** | Selling Price | **Supported** | `Product.price` / `display_price` | Integer paise storage with formatted INR display. |
| | Original Price / MRP | **Missing** | Only single price stored | Add `original_price` to enable strike-through promotional discounting. |
| | Artisanal Making Charges | **Supported** | Calculated in `pricingEngine.ts` | Decomposed transparently on PDP into metal value, making charges, and taxes. |
| | Tax Configuration | **Supported** | `siteConfig.tax.gstRate: 0.03` | Exact 3% GST calculation on HSN Code 7113. |
| | Stock Quantity | **Status Enum** | `stock_status` | Uses status enum; numerical stock counter not implemented. |
| | Delivery Availability | **Supported** | `/api/shipping/serviceability` | Pincode check with BVC Logistics insured transit integration. |
| **Trust & Authenticity** | BIS Hallmarking | **Supported** | `Product.bis_hallmark`, `is_hallmarked` | Explicitly indicates BIS assay compliance. |
| | HUID Serialization | **Supported** | `Product.has_huid`, `Product.huid` | Captures unique 6-character alphanumeric laser Hallmark Unique Identification. |
| | Gemological Certification | **Supported** | Badges & `bis_hallmark` | Captures IGI, GIA, and BIS certification details. |
| | Care Instructions | **Supported** | `Product.care_instructions` | Stored per product and rendered in specifications. |
| | Return / Exchange Window | **Supported** | `siteConfig.returnWindowDays: 7` | Highlighted across PDP trust bar and legal policies. |

---

## 3. Jurisdictional Legal Metrology & Indian Statutory Compliance

The store's physical showroom and legal registration are in **Jammu, Jammu & Kashmir, India**. The following Indian statutory frameworks apply and were verified:

### A. Bureau of Indian Standards (BIS) Hallmarking Scheme IV
- Under the *Hallmarking of Gold Jewellery and Gold Artefacts Order, 2020*, mandatory hallmarking is in effect across notified districts in India.
- In gold jewelry (IS 1417:2016), gold items must bear three distinct marks:
  1. The **BIS Logo** (triangular mark).
  2. The **Purity in Karat and Fineness** (e.g., `22K916`, `18K750`, `14K585`).
  3. The **6-character Alphanumeric HUID** (Hallmark Unique Identification Number) laser-inscribed by a BIS-recognized Assaying and Hallmarking Centre (AHC).
- For silver jewelry (IS 2112:2014), purity is graded as `925` (Sterling Silver).
- **Compliance Status in Ambika Jewels:** **Fully Compliant**. Every gold piece in the catalog specifies its BIS karatage, and products highlight 6-character HUID serialization on PDP and checkout disclosures.

### B. Legal Metrology (Packaged Commodities) Rules, 2011 & 2017 Amendments
E-commerce entities selling precious articles in India must explicitly declare:
1. **Name and address of the manufacturer/seller:** Declared in `siteConfig.fullAddress` and on every PDP.
2. **Country of Origin:** Declared as *"India"* on every PDP.
3. **Net Quantity & Net Precious Metal Weight:** Clearly distinguished from gross weight so customers are not charged gold rates for stones or lac.
4. **Dimensions:** Declared in metric units (cm) for length, breadth, and height.
5. **Retail Sale Price (MRP):** Expressed as *"Inclusive of all taxes"*.
6. **Consumer Care Details:** Name, address, telephone number, and email of grievance officer prominently displayed in footer.
- **Compliance Status in Ambika Jewels:** **Fully Compliant**.

### C. CBDT Rule 114B of the Income-tax Rules, 1962 (Mandatory PAN)
- Mandatory requirement to quote Permanent Account Number (PAN) for sale or purchase of goods or services exceeding ₹2,00,000 per transaction.
- **Compliance Status in Ambika Jewels:** **Fully Compliant**. Tested and verified in Section F: Checkout strictly requires a valid 10-character PAN (`^[A-Z]{5}[0-9]{4}[A-Z]{1}$`) when order total is $\ge ₹2,00,000$, and encrypts PAN at rest via AES-256-GCM.

### D. Goods and Services Tax (GST) Act
- Classification: **HSN Code 7113** (*Articles of jewellery and parts thereof, of precious metal or of metal clad with precious metal*).
- Rate: Exactly **3% GST** (1.5% CGST + 1.5% SGST for intra-state J&K sales, or 3% IGST for inter-state deliveries).
- **Compliance Status in Ambika Jewels:** **Fully Compliant**. Computed at the paise level across cart, checkout, invoices, and thermal POS receipts.

---

## 4. Jewelry E-Commerce Confidence Features: Existing vs. Missing Analysis

High-value jewelry purchases online demand deep customer reassurance. The platform was evaluated for 15 essential jewelry e-commerce features:

```
+----------------------------------------------------+----------------+
| Feature                                            | Implementation |
+----------------------------------------------------+----------------+
| 1.  Indian Ring Size Guide (Sizes 10 to 24)        | [x] EXISTING   |
| 2.  Indian Bangle Size Guide (Sizes 2.2 to 2.10)   | [x] EXISTING   |
| 3.  Material & 22K/18K/925 Purity Explanations     | [x] EXISTING   |
| 4.  Net Metal Weight vs. Gross Weight Invariant    | [x] EXISTING   |
| 5.  Transparent Price Breakup (Metal + Making + GST)| [x] EXISTING  |
| 6.  Multiple Product Angles (Swiper Gallery HUD)   | [x] EXISTING   |
| 7.  Zoomable Product Imagery (Loupe & Lightbox)    | [x] EXISTING   |
| 8.  Product Care Instructions                      | [x] EXISTING   |
| 9.  BIS Hallmark & 6-Char HUID Badges              | [x] EXISTING   |
| 10. Insured Armored Shipping Info (BVC Express)    | [x] EXISTING   |
| 11. 7-Day Return & Gold Exchange Program Pages     | [x] EXISTING   |
| 12. Showroom Karigar Video Consultation CTA        | [x] EXISTING   |
| 13. Dynamic FAQ Accordion & Keyword Search         | [x] EXISTING   |
| 14. Dedicated Gemstone 4Cs Filter / Attribute Grid | [ ] MISSING    |
| 15. Diamond & Hallmarking Certificate Modal Viewer | [ ] MISSING    |
+----------------------------------------------------+----------------+
```

### Detailed Breakdown of Key Confidence Features:

1. **Jewelry Sizing Selectors (Existing):**
   - Implemented in `ProductDetailClient.tsx` using `STANDARD_INDIAN_RING_SIZES` and `STANDARD_INDIAN_BANGLE_SIZES`.
   - Ring sizes range from 10 to 24 with standard size 14 highlighted. Bangle sizes provide inch diameter conversions (`2.2` = 2-2/16", `2.6` = 2-6/16" standard).
   - Only appears conditionally when `isRing` or `isBangle` evaluates to true; never appears on earrings or necklaces.

2. **Transparent Price Breakup Engine (Existing):**
   - Breaks down the retail price into:
     - Precious Metal Value ($\text{Net Weight} \times \text{Current Bullion Rate}$)
     - Artisanal Making Charges
     - BIS Hallmarking Fee (₹45)
     - 3% GST on HSN 7113
   - Builds exceptional consumer trust against arbitrary jewelry markups.

3. **Multi-Angle Gallery HUD (Existing):**
   - High-resolution Swiper carousel with angle indicators:
     - `01 • MASTERPIECE SILHOUETTE`
     - `02 • 45° PROFILE & SETTING`
     - `03 • CRAFTSMANSHIP & 22K HALLMARK`
     - `04 • ON-MODEL SCALE & PROPORTIONS`
     - `05 • ATELIER DETAILS`

4. **VIP Video Shopping Salon (Existing):**
   - High-ticket bridal buyers often want to inspect heavy heirlooms before purchasing. A dedicated 1-click WhatsApp appointment scheduler connects customers directly with Jammu showroom karigars.

5. **Missing Feature 1: Structured Diamond 4Cs Grid:**
   - While diamonds are labeled "CERTIFIED DIAMOND" in badges, a dedicated table displaying Color (D-Z), Clarity (IF to SI2), Cut (Round Brilliant, Oval, Princess), and Carat Weight is not yet broken out as separate database columns.

6. **Missing Feature 2: Digital Certificate Modal Viewer:**
   - Customers buying diamond jewelry or high-value gold sets appreciate seeing a sample or serialized digital scan of the IGI/GIA certificate or BIS AHC assay card directly on the product page.

---

## 5. Architectural Recommendations & Schema Enhancements

To upgrade the catalog from competent to industry-leading, the following backwards-compatible schema extensions are recommended:

### Recommended TypeScript Product Interface Extension
```typescript
export interface GemstoneSpecification {
  gemstone_type: string;        // e.g. "Natural Diamond", "Burmese Ruby", "South Sea Pearl"
  carat_weight?: number;        // e.g. 0.75
  cut?: string;                 // e.g. "Round Brilliant", "Cushion", "Polki Jadau"
  color_grade?: string;         // e.g. "G-H"
  clarity_grade?: string;       // e.g. "VVS1-VS1"
  stone_count?: number;         // e.g. 36
  setting_type?: string;        // e.g. "Pavé", "Prong", "Kundan"
  certificate_lab?: string;     // e.g. "IGI", "GIA", "SGL", "BIS AHC"
  certificate_number?: string;  // Serialized certificate ID
}

export interface ExtendedProductFields {
  sku?: string;                         // Retail SKU: e.g. "AJ-DOG-JHK-001"
  barcode?: string;                     // 12-digit EAN/UPC for counter POS
  subcategory?: string;                 // e.g. "Jhumkis", "Chokers", "Solitaires"
  original_mrp_paise?: number;          // For strike-through pricing
  gemstones?: GemstoneSpecification[];  // Structured stones array
  certificate_sample_url?: string;      // Image link to sample certificate
}
```

This completes the Phase 3 domain-specific jewelry commerce audit.

