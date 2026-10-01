import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';
import { getDailyRates } from '@/lib/counterStore';

const GOLDAPI_KEY = process.env.GOLDAPI_KEY || '';

// Short in-memory cache to conserve GoldAPI quotas (10 minutes TTL)
interface SilverCache {
  pricePerGram999: number;
  pricePerGram925: number;
  source: string;
  cachedAt: number;
}
let cachedSilver: SilverCache | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function GET(request: Request) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // 1. Shared Upstash Redis Rate Limiting (20 req / min)
    const rateCheck = await checkRateLimit('silverPrice', ip);
    if (!rateCheck.success) {
      return NextResponse.json(
        { success: false, message: 'Too many silver rate requests. Please wait a moment.' },
        { status: 429 }
      );
    }

    const now = Date.now();
    if (cachedSilver && now - cachedSilver.cachedAt < CACHE_TTL_MS) {
      const pricePerKg999 = Math.round(cachedSilver.pricePerGram999 * 1000);
      const pricePer10g999 = Math.round(cachedSilver.pricePerGram999 * 10);
      return NextResponse.json({
        success: true,
        data: {
          price_per_gram_999: cachedSilver.pricePerGram999,
          price_per_gram_925: cachedSilver.pricePerGram925,
          price_per_10g_999: pricePer10g999,
          price_per_kg_999: pricePerKg999,
          metal: 'XAG',
          currency: 'INR',
          source: `${cachedSilver.source}_cached`,
          timestamp: new Date(cachedSilver.cachedAt).toISOString()
        }
      });
    }

    // Default to store set daily rates if API is unavailable
    const storeRates = await getDailyRates();
    let pricePerGram999 = storeRates.silver_999 || 92;
    let pricePerGram925 = storeRates.silver_925 || 85;
    let sourceUsed = 'store_daily_rates';

    if (GOLDAPI_KEY && !GOLDAPI_KEY.includes('placeholder')) {
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
          if (apiData.price_gram_24k) {
            const rawSilver = Number(apiData.price_gram_24k);
            if (rawSilver > 0) {
              pricePerGram999 = Math.round(rawSilver);
              pricePerGram925 = Math.round(pricePerGram999 * 0.925);
              sourceUsed = 'goldapi_ibja_domestic';
            }
          } else if (apiData.price) {
            const pricePerOz = Number(apiData.price);
            if (pricePerOz > 0) {
              const rawSilver = pricePerOz / 31.1034768;
              pricePerGram999 = Math.round(rawSilver);
              pricePerGram925 = Math.round(pricePerGram999 * 0.925);
              sourceUsed = 'goldapi_ibja_domestic';
            }
          }
        }
      } catch (apiErr) {
        console.warn('Live Silver API fetch failed/timed out, using store daily rate fallback:', apiErr);
      }
    }

    // Update Cache
    cachedSilver = {
      pricePerGram999,
      pricePerGram925,
      source: sourceUsed,
      cachedAt: now
    };

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
