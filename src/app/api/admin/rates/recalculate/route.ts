import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/adminAuth';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';
import { recordAuditLog } from '@/lib/auditLog';
import { getAdminMemoryProducts } from '@/app/api/admin/products/route';
import { memoryDailyRates } from '@/app/api/admin/rates/route';

export const dynamic = 'force-dynamic';

function formatInr(paise: number): string {
  const rupees = Math.round(paise / 100);
  return `₹${rupees.toLocaleString('en-IN')}`;
}

export async function POST(request: Request) {
  try {
    const isAuth = await verifyAdminAuth(request);
    if (!isAuth) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    // 1. Fetch latest daily rates (Supabase DB or memory fallback)
    let latestRate: any = null;
    let products: any[] = [];

    if (isSupabaseAdminConfigured && supabaseAdmin) {
      const { data: dbRate } = await supabaseAdmin
        .from('daily_rates')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (dbRate) {
        latestRate = dbRate;
      }

      const { data: dbProducts } = await supabaseAdmin
        .from('products')
        .select('*');

      if (dbProducts && dbProducts.length > 0) {
        products = dbProducts;
      }
    }

    if (!latestRate) {
      latestRate = memoryDailyRates;
    }

    if (!products || products.length === 0) {
      products = getAdminMemoryProducts() || [];
    }

    if (!latestRate) {
      return NextResponse.json(
        { success: false, message: 'Could not fetch active daily bullion rates.' },
        { status: 500 }
      );
    }

    const updatedList: any[] = [];

    for (const prod of products) {
      // Products with net weight can be recalculated
      const netWeight = prod.net_weight_grams ? Number(prod.net_weight_grams) : (prod.weight_grams ? Number(prod.weight_grams) : 0);
      if (netWeight <= 0) continue;

      // Rate per gram based on purity
      let ratePerGram = Number(latestRate.gold_22k);
      const purity = String(prod.purity || '22K').toUpperCase();

      if (purity.includes('24')) {
        ratePerGram = Number(latestRate.gold_24k);
      } else if (purity.includes('22')) {
        ratePerGram = Number(latestRate.gold_22k);
      } else if (purity.includes('18')) {
        ratePerGram = Number(latestRate.gold_18k || Math.round(latestRate.gold_24k * 0.75));
      } else if (purity.includes('14')) {
        ratePerGram = Number(latestRate.gold_14k || Math.round(latestRate.gold_24k * 0.585));
      } else if (purity.includes('925') || purity.includes('SILVER')) {
        ratePerGram = Number(latestRate.silver_925 || Math.round(latestRate.silver_999 * 0.925));
      }

      if (ratePerGram <= 0) continue;

      // Pure metal value in INR
      const metalValueRupees = netWeight * ratePerGram;

      // Making charges
      const makingRate = Number(prod.making_charge_rate || 8);
      const isFlatMaking = prod.making_charge_type === 'flat';
      const makingChargesRupees = isFlatMaking
        ? makingRate * netWeight
        : metalValueRupees * (makingRate / 100);

      // Stone value in INR
      const stoneValueRupees = prod.stone_value_paise ? Number(prod.stone_value_paise) / 100 : 0;

      // Final calculated piece price in paise
      const newPriceRupees = Math.round(metalValueRupees + makingChargesRupees + stoneValueRupees);
      const newPricePaise = newPriceRupees * 100;
      const newDisplayPrice = formatInr(newPricePaise);

      if (newPricePaise !== prod.price) {
        let updateOk = true;
        if (isSupabaseAdminConfigured && supabaseAdmin) {
          const { error: updateErr } = await supabaseAdmin
            .from('products')
            .update({
              price: newPricePaise,
              display_price: newDisplayPrice,
              updated_at: new Date().toISOString()
            })
            .eq('id', prod.id);

          if (updateErr) updateOk = false;
        }

        if (updateOk) {
          updatedList.push({
            id: prod.id,
            name: prod.name,
            oldPrice: prod.price,
            newPrice: newPricePaise,
            displayPrice: newDisplayPrice
          });
        }
      }
    }

    // Sync memory products if applicable
    const memList = getAdminMemoryProducts();
    if (Array.isArray(memList)) {
      for (const item of updatedList) {
        const idx = memList.findIndex((p: any) => p.id === item.id);
        if (idx >= 0) {
          memList[idx].price = item.newPrice;
          memList[idx].display_price = item.displayPrice;
        }
      }
    }

    await recordAuditLog({
      action: 'BULLION_CATALOG_RECALCULATED',
      entityType: 'rates',
      newValues: {
        updatedPiecesCount: updatedList.length,
        ratesSnapshot: {
          gold_24k: latestRate.gold_24k,
          gold_22k: latestRate.gold_22k,
          silver_925: latestRate.silver_925
        }
      },
      request
    });

    return NextResponse.json({
      success: true,
      message: `Successfully recalculated prices for ${updatedList.length} jewelry pieces using active bullion rates`,
      updatedCount: updatedList.length,
      updatedProducts: updatedList
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    console.error('[BULLION RECALCULATION EXCEPTION]', err);
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
