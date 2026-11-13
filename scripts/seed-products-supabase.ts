import { createClient } from '@supabase/supabase-js';
import { mockProducts } from '../src/data/mockProducts';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Supabase credentials missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

function normalizePurity(purity?: string): '24K' | '22K' | '18K' | '14K' | '925Silver' {
  if (!purity) return '22K';
  const str = purity.toUpperCase();
  if (str.includes('24')) return '24K';
  if (str.includes('22')) return '22K';
  if (str.includes('18')) return '18K';
  if (str.includes('14')) return '14K';
  if (str.includes('925') || str.includes('SILVER')) return '925Silver';
  return '22K';
}

function normalizeHuid(huid?: string): string | null {
  if (!huid || typeof huid !== 'string') return null;
  const trimmed = huid.trim().toUpperCase();
  return trimmed.length === 6 ? trimmed : null;
}

// Deterministic valid UUID generator for seed items
function deterministicUuid(index: number): string {
  const hex = (index + 1).toString(16).padStart(12, '0');
  return `00000000-0000-4000-a000-${hex}`;
}

async function seed() {
  console.log('Checking existing products in Supabase...');
  const { data: existing, error: checkErr } = await supabase.from('products').select('id, name');
  if (checkErr) {
    console.error('Error querying products:', checkErr);
    process.exit(1);
  }

  if (existing && existing.length > 0) {
    console.log(`Supabase already has ${existing.length} products. Skipping seeding.`);
    return;
  }

  console.log(`Seeding ${mockProducts.length} products into Supabase...`);

  const rows = mockProducts.map((p, idx) => {
    return {
      id: deterministicUuid(idx),
      name: p.name,
      slug: p.slug,
      description: p.description || '',
      price: p.price,
      display_price: p.display_price,
      category: p.category,
      images: p.images || [],
      badges: p.badges || [],
      metal_finishes: p.metal_finishes || ['Gold'],
      stock_status: p.stock_status || 'in_stock',
      is_featured: Boolean(p.is_featured),
      collection: p.collection || 'Heritage',
      craftsmanship_story: p.craftsmanship_story || '',
      net_weight_grams: p.weight_grams ? Number(p.weight_grams) : 0,
      gross_weight_grams: p.gross_weight_grams ? Number(p.gross_weight_grams) : (p.weight_grams ? Number(p.weight_grams) : 0),
      purity: normalizePurity(p.purity),
      making_charge_type: 'percent',
      making_charge_rate: 8.0,
      stone_weight_grams: 0.0,
      stone_value_paise: 0,
      hallmark_pieces: 1,
      huid_code: normalizeHuid(p.huid),
      hsn_code: p.hsn_code || '7113',
      created_at: p.created_at || new Date().toISOString(),
      updated_at: p.updated_at || new Date().toISOString()
    };
  });

  const { data, error } = await supabase.from('products').insert(rows).select('id, name');
  if (error) {
    console.error('Insert error:', error);
    process.exit(1);
  }

  console.log(`Successfully seeded ${data?.length} products into Supabase!`);
}

seed();

