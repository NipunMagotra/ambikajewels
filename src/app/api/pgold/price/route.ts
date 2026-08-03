import { NextResponse } from 'next/server';
import { pgoldStore } from '@/lib/pgoldStore';
import { GoldDenomination } from '@/types/pgold';

const GOLDAPI_KEY = process.env.GOLDAPI_KEY || 'goldapi-df8bb9137fadd82060b12b273ceae434-io';

export async function GET() {
  try {
    const settings = await pgoldStore.getSettings();
    let price24k = settings.price_per_gram_24k;
    let price22k = settings.price_per_gram_22k;
    let sourceUsed = 'manual';

    // If pricing mode is API, attempt live fetch from GoldAPI.io or custom URL
    if (settings.pricing_mode === 'api') {
      const targetUrl = settings.api_provider_url || 'https://www.goldapi.io/api/XAU/INR';

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 sec timeout

        const headers: Record<string, string> = {
          'Accept': 'application/json',
          'User-Agent': 'AmbikaJewels/1.0'
        };

        if (targetUrl.includes('goldapi.io')) {
          headers['x-access-token'] = GOLDAPI_KEY;
        }

        const res = await fetch(targetUrl, {
          signal: controller.signal,
          headers
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const apiData = await res.json();

          // 1. GoldAPI.io response: { price_gram_24k, price_gram_22k, price }
          if (apiData.price_gram_24k) {
            const raw24 = Number(apiData.price_gram_24k);
            // Convert raw international spot to IBJA Domestic Jammu Market Rate
            price24k = raw24 > 10000 ? Math.round(raw24 * 0.6838) : Math.round(raw24);
            price22k = Math.round(price24k * 0.9167);
            sourceUsed = 'goldapi_ibja_domestic';
          }
          // 2. Public bullion endpoint format: { items: [{ xauPrice }] }
          else if (apiData.items && apiData.items[0]?.xauPrice) {
            const pricePerOz = Number(apiData.items[0].xauPrice);
            if (pricePerOz > 0) {
              const raw24 = pricePerOz / 31.1034768;
              price24k = raw24 > 10000 ? Math.round(raw24 * 0.6838) : Math.round(raw24);
              price22k = Math.round(price24k * 0.9167);
              sourceUsed = 'api_ibja_domestic';
            }
          }
          // 3. Generic JSON rate key formats
          else {
            const raw = Number(apiData.price_24k || apiData.rate24k || apiData.gold_24k || apiData.price_per_gram || apiData.price);
            if (!isNaN(raw) && raw > 1000) {
              price24k = raw > 10000 ? Math.round(raw * 0.6838) : Math.round(raw);
              price22k = Math.round(price24k * 0.9167);
              sourceUsed = 'api_ibja_domestic';
            }
          }
        }
      } catch (apiErr) {
        console.warn('Live Gold API fetch failed/timed out, using store fallback price:', apiErr);
      }
    }

    // Calculate standard required denominations: 0.1g, 0.5g, 1g, 2g, 5g, 10g
    const weights = [0.1, 0.5, 1, 2, 5, 10];
    const denominations: GoldDenomination[] = weights.map(w => ({
      weightGrams: w,
      label: `${w}g`,
      price24k: Math.round(w * price24k * 1.03), // include 3% GST preview
      price22k: Math.round(w * price22k * 1.03)
    }));

    return NextResponse.json({
      success: true,
      data: {
        price_per_gram_24k: price24k,
        price_per_gram_22k: price22k,
        source: sourceUsed,
        pricing_mode: settings.pricing_mode,
        is_enabled: settings.is_enabled,
        min_purchase_amount: settings.min_purchase_amount,
        max_purchase_amount: settings.max_purchase_amount,
        denominations,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching P-Gold price:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch current gold price' },
      { status: 500 }
    );
  }
}
