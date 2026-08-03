import { NextResponse } from 'next/server';

const GOLDAPI_KEY = process.env.GOLDAPI_KEY || 'goldapi-df8bb9137fadd82060b12b273ceae434-io';

export async function GET() {
  try {
    let pricePerGram999 = 95; // Default fallback: ₹95 / gram (₹95,000 / kg)
    let pricePerGram925 = 88; // Default fallback 925 Sterling: ₹88 / gram
    let sourceUsed = 'default';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 sec timeout

      const res = await fetch('https://www.goldapi.io/api/XAG/INR', {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'AmbikaJewels/1.0',
          'x-access-token': GOLDAPI_KEY
        }
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const apiData = await res.json();

        // Check if price_gram_24k (999 fine silver) is returned by GoldAPI
        if (apiData.price_gram_24k) {
          const rawSilver = Number(apiData.price_gram_24k);
          pricePerGram999 = rawSilver > 120 ? Math.round(rawSilver * 0.51) : Math.round(rawSilver);
          pricePerGram925 = Math.round(pricePerGram999 * 0.925);
          sourceUsed = 'goldapi_ibja_domestic';
        } else if (apiData.price) {
          const pricePerOz = Number(apiData.price);
          if (pricePerOz > 0) {
            const rawSilver = pricePerOz / 31.1034768;
            pricePerGram999 = rawSilver > 120 ? Math.round(rawSilver * 0.51) : Math.round(rawSilver);
            pricePerGram925 = Math.round(pricePerGram999 * 0.925);
            sourceUsed = 'goldapi_ibja_domestic';
          }
        }
      }
    } catch (apiErr) {
      console.warn('Live Silver API fetch failed/timed out, using store fallback:', apiErr);
    }

    const pricePerKg999 = Math.round(pricePerGram999 * 1000);
    const pricePer10g999 = Math.round(pricePerGram999 * 10);

    return NextResponse.json({
      success: true,
      data: {
        price_per_gram_999: pricePerGram999,
        price_per_gram_925: pricePerGram925,
        price_per_10g_999: pricePer10g999,
        price_per_kg_999: pricePerKg999,
        metal: 'XAG',
        currency: 'INR',
        source: sourceUsed,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching Silver price:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch current silver price' },
      { status: 500 }
    );
  }
}
