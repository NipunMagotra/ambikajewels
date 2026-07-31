import { NextResponse } from 'next/server';
import { pgoldStore } from '@/lib/pgoldStore';
import { GoldDenomination } from '@/types/pgold';

export async function GET() {
  try {
    const settings = await pgoldStore.getSettings();
    let price24k = settings.price_per_gram_24k;
    let price22k = settings.price_per_gram_22k;
    let sourceUsed = 'manual';

    // If pricing mode is API and provider URL is supplied, attempt live fetch
    if (settings.pricing_mode === 'api' && settings.api_provider_url) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 sec timeout

        const res = await fetch(settings.api_provider_url, {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const apiData = await res.json();
          // Flexible key parsing for external APIs (e.g. { rate24k, price_24k, price } etc.)
          const fetchedRate = Number(apiData.price_24k || apiData.rate24k || apiData.gold_24k || apiData.price);
          if (!isNaN(fetchedRate) && fetchedRate > 0) {
            price24k = fetchedRate;
            price22k = Math.round(fetchedRate * 0.917 * 100) / 100;
            sourceUsed = 'api';
          }
        }
      } catch (apiErr) {
        console.warn('External Gold API fetch failed/timed out, using store price:', apiErr);
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
