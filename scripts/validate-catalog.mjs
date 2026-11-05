#!/usr/bin/env node
/**
 * Ambika Jewels — Pre-Import Catalog Validator
 * 
 * Validates jewelry inventory data files (JSON or CSV) against strict Indian retail
 * compliance, physical weight math, categorization, and pricing invariants.
 *
 * Usage:
 *   node scripts/validate-catalog.mjs [path-to-file]
 *   Example: node scripts/validate-catalog.mjs docs/catalog/sample-inventory.json
 */

import fs from 'fs';
import path from 'path';

// Valid categories as defined in siteConfig.ts
const VALID_CATEGORIES = [
  "Dogra Heritage Collection",
  "Gold Jewellery",
  "Diamond Jewellery",
  "Silver Jewellery (925)",
  "Bridal Couture",
  "Gold Exchange & Custom",
  "Necklaces & Chokers",
  "Earrings & Jhumkas",
  "Bangles & Kadas",
  "Rings & Solitaires",
  "Temple & Antique Gold",
  "Everyday Wear",
  "Men's Accessories"
];

const VALID_PURITIES = [
  "24K", "22K", "18K", "14K", "9K", "925 Silver", "999 Silver",
  "24K (999)", "22K (916)", "18K (750)", "14K (585)"
];

const VALID_STOCK_STATUS = ["in_stock", "limited", "out_of_stock"];

function parseCsv(content) {
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  // Simple CSV parser supporting quoted strings
  function parseCsvLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/^["']|["']$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^["']|["']$/g, ''));
    return values;
  }

  const headers = parseCsvLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const rawValues = parseCsvLine(lines[i]);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h.trim()] = rawValues[idx] !== undefined ? rawValues[idx] : '';
    });
    rows.push(obj);
  }

  return rows;
}

export function validateCatalogItems(items) {
  const errors = [];
  const warnings = [];
  const seenSlugs = new Set();
  const seenSkus = new Set();

  items.forEach((item, index) => {
    const rowNum = index + 1;
    const prefix = `[Item #${rowNum} - "${item.name || item.sku || 'Unknown'}"]`;

    // 1. Mandatory Name & Slug
    if (!item.name || typeof item.name !== 'string' || item.name.trim().length < 3) {
      errors.push(`${prefix} Product name is missing or shorter than 3 characters.`);
    }

    const slug = (item.slug || '').trim().toLowerCase();
    if (!slug) {
      errors.push(`${prefix} Missing URL slug.`);
    } else if (seenSlugs.has(slug)) {
      errors.push(`${prefix} Duplicate slug "${slug}". Slugs must be globally unique.`);
    } else {
      seenSlugs.add(slug);
    }

    // 2. SKU uniqueness
    if (item.sku) {
      const sku = String(item.sku).trim().toUpperCase();
      if (seenSkus.has(sku)) {
        warnings.push(`${prefix} Duplicate SKU "${sku}".`);
      } else {
        seenSkus.add(sku);
      }
    }

    // 3. Category Validation
    const category = (item.category || '').trim();
    if (!category) {
      errors.push(`${prefix} Missing category.`);
    } else {
      const isMatch = VALID_CATEGORIES.some(vc => vc.toLowerCase() === category.toLowerCase());
      if (!isMatch) {
        warnings.push(`${prefix} Category "${category}" is not in the standard 13 siteConfig categories.`);
      }
    }

    // 4. Pricing Validation
    const price = Number(item.price_inr ?? item.price);
    if (isNaN(price) || price <= 0) {
      errors.push(`${prefix} Invalid price (${item.price_inr ?? item.price}). Price in INR must be a positive number.`);
    } else if (price < 500) {
      warnings.push(`${prefix} Price ₹${price.toLocaleString('en-IN')} appears unusually low for fine jewelry.`);
    }

    // 5. Weight Math Invariants (Crucial for Fine Jewelry)
    const grossWt = Number(item.gross_weight_grams ?? item.gross_weight);
    const netWt = Number(item.net_weight_grams ?? item.net_weight);
    const stoneWt = Number(item.stone_weight_grams ?? 0);

    if (item.gross_weight_grams !== undefined || item.net_weight_grams !== undefined) {
      if (isNaN(grossWt) || grossWt <= 0) {
        errors.push(`${prefix} Invalid gross_weight_grams (${grossWt}). Must be > 0.`);
      }
      if (isNaN(netWt) || netWt <= 0) {
        errors.push(`${prefix} Invalid net_weight_grams (${netWt}). Must be > 0.`);
      }
      if (netWt > grossWt) {
        errors.push(`${prefix} Invariant violation: net weight (${netWt}g) exceeds gross weight (${grossWt}g).`);
      }
      if (stoneWt > 0 && Math.abs((grossWt - stoneWt) - netWt) > 0.05) {
        warnings.push(`${prefix} Weight discrepancy: gross (${grossWt}g) - stone (${stoneWt}g) != net (${netWt}g).`);
      }
    }

    // 6. Metal Purity Check
    if (item.purity) {
      const purity = String(item.purity).trim();
      const isPurityValid = VALID_PURITIES.some(vp => purity.toLowerCase().includes(vp.toLowerCase()));
      if (!isPurityValid) {
        warnings.push(`${prefix} Purity "${purity}" is not recognized among standard gold/silver karats.`);
      }
    }

    // 7. BIS Hallmarking & HUID Disclosures
    if (item.bis_hallmarked === true || String(item.bis_hallmarked).toLowerCase() === 'true') {
      if (!item.huid_code && !item.bis_hallmark) {
        warnings.push(`${prefix} Marked as BIS Hallmarked, but no 6-character HUID or hallmark license provided.`);
      }
    }

    // 8. Image Assets
    const images = Array.isArray(item.images)
      ? item.images
      : (typeof item.images === 'string' ? item.images.split(';').map(s => s.trim()).filter(Boolean) : []);

    if (images.length === 0) {
      warnings.push(`${prefix} No product images specified. Will use default showroom fallback image.`);
    }

    // 9. Stock Status Check
    const stock = (item.stock_status || 'in_stock').trim().toLowerCase();
    if (!VALID_STOCK_STATUS.includes(stock)) {
      errors.push(`${prefix} Invalid stock_status "${stock}". Must be one of: ${VALID_STOCK_STATUS.join(', ')}.`);
    }
  });

  return { isValid: errors.length === 0, errors, warnings, totalItems: items.length };
}

// CLI Execution (only if invoked directly)
if (process.argv[1] && process.argv[1].endsWith('validate-catalog.mjs')) {
  const filePath = process.argv[2] || path.join(process.cwd(), 'docs/catalog/sample-inventory.json');

  console.log('='.repeat(72));
  console.log('💎 AMBIKA JEWELS — PRE-IMPORT CATALOG DATA VALIDATOR');
  console.log('='.repeat(72));
  console.log(`Inspecting file: ${filePath}`);

  if (!fs.existsSync(filePath)) {
    console.error(`\n❌ Error: File not found at "${filePath}"\n`);
    process.exit(1);
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    let items = [];

    if (filePath.endsWith('.json')) {
      items = JSON.parse(content);
      if (!Array.isArray(items)) {
        console.error('\n❌ Error: JSON file must contain an array of product objects.\n');
        process.exit(1);
      }
    } else if (filePath.endsWith('.csv')) {
      items = parseCsv(content);
    } else {
      console.error('\n❌ Error: Unsupported file format. Please provide a .json or .csv file.\n');
      process.exit(1);
    }

    console.log(`Found ${items.length} product records. Running validation checks...\n`);

    const report = validateCatalogItems(items);

    if (report.warnings.length > 0) {
      console.log(`⚠️  ${report.warnings.length} Advisory Warning(s):`);
      report.warnings.forEach(w => console.log(`   - ${w}`));
      console.log('');
    }

    if (!report.isValid) {
      console.error(`❌ Validation Failed with ${report.errors.length} Error(s):`);
      report.errors.forEach(e => console.error(`   • ${e}`));
      console.error('\nPlease fix the errors above before importing into Supabase.\n');
      process.exit(1);
    }

    console.log('✅ 100% Validation Passed!');
    console.log(`   All ${report.totalItems} jewelry items meet Indian e-commerce, weight, and pricing invariants.`);
    console.log('   Ready for automated import into Supabase products table.\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Fatal Exception during catalog validation:', err.message);
    process.exit(1);
  }
}
