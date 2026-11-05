#!/usr/bin/env node
/**
 * Ambika Jewels — Automated Product Catalog Ingestion Script
 * 
 * Safely imports and synchronizes fine jewelry inventory into the Supabase database.
 * Supports:
 * - JSON and CSV input formats
 * - Pre-import mathematical and compliance validation
 * - Automatic conversion from INR to integer paise
 * - Automatic generation of formatted display prices (e.g. ₹2,60,000)
 * - Safe Idempotent Upsert (matching on slug) to prevent duplicate products
 * - Dry-run mode (`--dry-run`)
 * - SQL script export for direct execution in Supabase Dashboard SQL Editor
 *
 * Usage:
 *   node scripts/import-catalog.mjs [path-to-file] [--dry-run]
 *   Example: node scripts/import-catalog.mjs docs/catalog/sample-inventory.json --dry-run
 */

import fs from 'fs';
import path from 'path';
import { validateCatalogItems } from './validate-catalog.mjs';

function formatInr(paise) {
  const rupees = Math.round(paise / 100);
  return `₹${rupees.toLocaleString('en-IN')}`;
}

function parseCsv(content) {
  const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

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

const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const fileArg = args.find(a => !a.startsWith('--'));
const filePath = fileArg || path.join(process.cwd(), 'docs/catalog/sample-inventory.json');

console.log('='.repeat(72));
console.log('📥 AMBIKA JEWELS — PRODUCT CATALOG INGESTION ENGINE');
console.log('='.repeat(72));
console.log(`Source File : ${filePath}`);
console.log(`Mode        : ${isDryRun ? 'DRY RUN (Preview & SQL generation only)' : 'LIVE IMPORT'}`);

if (!fs.existsSync(filePath)) {
  console.error(`\n❌ Error: File not found at "${filePath}"\n`);
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf-8');
let rawItems = [];

if (filePath.endsWith('.json')) {
  rawItems = JSON.parse(content);
} else if (filePath.endsWith('.csv')) {
  rawItems = parseCsv(content);
} else {
  console.error('\n❌ Error: Unsupported format. Provide .json or .csv.\n');
  process.exit(1);
}

// 1. Validate
console.log(`\nStep 1: Validating ${rawItems.length} catalog items...`);
const valResult = validateCatalogItems(rawItems);

if (!valResult.isValid) {
  console.error(`\n❌ Validation Failed with ${valResult.errors.length} error(s):`);
  valResult.errors.forEach(e => console.error(`   • ${e}`));
  console.error('\nImport aborted. Please resolve validation errors first.\n');
  process.exit(1);
}

console.log('✅ Validation passed! Preparing database records...\n');

// 2. Transform into Database Schema Entities
const transformedProducts = rawItems.map(item => {
  const priceInr = Number(item.price_inr ?? item.price);
  const pricePaise = Math.round(priceInr * 100);
  const displayPrice = formatInr(pricePaise);

  const images = Array.isArray(item.images)
    ? item.images
    : (typeof item.images === 'string' ? item.images.split(';').map(s => s.trim()).filter(Boolean) : []);

  const defaultImages = images.length > 0 ? images : ['/hero-clean.png'];

  const badges = Array.isArray(item.badges)
    ? item.badges
    : (typeof item.badges === 'string'
        ? item.badges.split(',').map(s => s.trim()).filter(Boolean)
        : (item.purity ? [String(item.purity).toUpperCase()] : ['22K BIS']));

  const metalFinishes = Array.isArray(item.metal_finishes)
    ? item.metal_finishes
    : (typeof item.metal_finishes === 'string'
        ? item.metal_finishes.split(',').map(s => s.trim()).filter(Boolean)
        : ['Gold']);

  const isFeatured = item.is_featured === true || String(item.is_featured).toLowerCase() === 'true';

  return {
    name: item.name.trim(),
    slug: item.slug.trim().toLowerCase(),
    description: (item.craftsmanship_story || item.description || `${item.name} handcrafted by master karigars in Jammu.`).trim(),
    price: pricePaise,
    display_price: displayPrice,
    category: item.category.trim(),
    images: defaultImages,
    badges: badges,
    metal_finishes: metalFinishes,
    stock_status: (item.stock_status || 'in_stock').trim().toLowerCase(),
    is_featured: isFeatured,
    collection: (item.collection || 'Heritage').trim(),
    craftsmanship_story: (item.craftsmanship_story || '').trim()
  };
});

// 3. Generate Standalone SQL Migration File
const sqlStatements = transformedProducts.map(p => {
  const escapeSql = (str) => (str || '').replace(/'/g, "''");
  const imagesSql = `ARRAY[${p.images.map(img => `'${escapeSql(img)}'`).join(', ')}]`;
  const badgesSql = `ARRAY[${p.badges.map(b => `'${escapeSql(b)}'`).join(', ')}]`;
  const finishesSql = `ARRAY[${p.metal_finishes.map(f => `'${escapeSql(f)}'`).join(', ')}]`;

  return `INSERT INTO products (
  name, slug, description, price, display_price, category, images, badges, metal_finishes, stock_status, is_featured, collection, craftsmanship_story
) VALUES (
  '${escapeSql(p.name)}',
  '${escapeSql(p.slug)}',
  '${escapeSql(p.description)}',
  ${p.price},
  '${escapeSql(p.display_price)}',
  '${escapeSql(p.category)}',
  ${imagesSql},
  ${badgesSql},
  ${finishesSql},
  '${p.stock_status}',
  ${p.is_featured},
  '${escapeSql(p.collection)}',
  '${escapeSql(p.craftsmanship_story)}'
) ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  display_price = EXCLUDED.display_price,
  category = EXCLUDED.category,
  images = EXCLUDED.images,
  badges = EXCLUDED.badges,
  metal_finishes = EXCLUDED.metal_finishes,
  stock_status = EXCLUDED.stock_status,
  is_featured = EXCLUDED.is_featured,
  collection = EXCLUDED.collection,
  craftsmanship_story = EXCLUDED.craftsmanship_story,
  updated_at = NOW();`;
});

const sqlFilePath = path.join(process.cwd(), 'supabase/migrations/20261105_import_full_catalog.sql');
const fullSql = `-- ============================================================================
-- Ambika Jewels — Full Product Catalog Migration
-- Generated automatically by scripts/import-catalog.mjs
-- ============================================================================

${sqlStatements.join('\n\n')}
`;

fs.writeFileSync(sqlFilePath, fullSql, 'utf-8');
console.log(`Step 2: Generated idempotent SQL migration:`);
console.log(`        📁 ${path.relative(process.cwd(), sqlFilePath)} (${transformedProducts.length} items)\n`);

// 4. Summary Preview
console.log('Step 3: Catalog Import Preview:');
transformedProducts.forEach((p, idx) => {
  console.log(`   ${idx + 1}. [${p.category.padEnd(26)}] ${p.name.padEnd(36)} -> ${p.display_price} (${p.price} paise)`);
});

if (isDryRun) {
  console.log('\n✅ Dry-Run Complete: 0 database modifications made.');
  console.log('   To apply live to Supabase:');
  console.log('   Option A: Run `node scripts/import-catalog.mjs ' + filePath + '`');
  console.log('   Option B: Paste `supabase/migrations/20261105_import_full_catalog.sql` into Supabase SQL Editor.\n');
  process.exit(0);
}

// 5. Live Import via Supabase Admin (if keys available)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceKey || supabaseUrl.includes('<your-project-id>')) {
  console.log('\nℹ️  Supabase credentials not configured in current terminal environment.');
  console.log('   The migration script has been generated and is ready to run:');
  console.log(`   👉 ${path.relative(process.cwd(), sqlFilePath)}`);
  console.log('   You can copy/paste this file into the Supabase Dashboard SQL Editor anytime.\n');
  process.exit(0);
}

console.log('\n🚀 Step 4: Connecting to Supabase and upserting products...');
// Supabase upsert logic when credentials exist
import('@supabase/supabase-js').then(async ({ createClient }) => {
  const supabase = createClient(supabaseUrl, serviceKey);

  const { data, error } = await supabase
    .from('products')
    .upsert(transformedProducts, { onConflict: 'slug' })
    .select('id, name, slug');

  if (error) {
    console.error('\n❌ Supabase Upsert Failed:', error.message);
    process.exit(1);
  }

  console.log(`\n🎉 Success! Upserted ${data?.length || transformedProducts.length} products to Supabase.`);
  process.exit(0);
}).catch(err => {
  console.error('\n❌ Could not load @supabase/supabase-js:', err.message);
  process.exit(1);
});

