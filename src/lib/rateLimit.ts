import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Initialize Upstash Redis client if configured
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export const isUpstashConfigured = Boolean(
  redisUrl && 
  redisToken && 
  redisUrl.startsWith('https://') &&
  !redisUrl.includes('placeholder')
);

const redis = isUpstashConfigured
  ? new Redis({
      url: redisUrl!,
      token: redisToken!,
    })
  : null;

// Distributed shared rate limiters via Upstash
const upstashLimiters = redis
  ? {
      adminLogin: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '15 m'),
        analytics: true,
        prefix: 'ratelimit:admin_login',
      }),
      track: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(15, '1 m'),
        analytics: true,
        prefix: 'ratelimit:track',
      }),
      chat: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, '1 m'),
        analytics: true,
        prefix: 'ratelimit:chat',
      }),
      orders: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '10 m'),
        analytics: true,
        prefix: 'ratelimit:orders',
      }),
      createOrder: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '5 m'),
        analytics: true,
        prefix: 'ratelimit:create_order',
      }),
      verifyPayment: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(15, '5 m'),
        analytics: true,
        prefix: 'ratelimit:verify_payment',
      }),
      serviceability: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(30, '1 m'),
        analytics: true,
        prefix: 'ratelimit:serviceability',
      }),
      silverPrice: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, '1 m'),
        analytics: true,
        prefix: 'ratelimit:silver_price',
      }),
      dataRequest: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '15 m'),
        analytics: true,
        prefix: 'ratelimit:data_request',
      }),
    }
  : null;

// Local fallback store for offline development if Upstash keys are not yet provided
interface LocalRecord {
  count: number;
  resetTime: number;
}
const localFallbacks = new Map<string, LocalRecord>();

function checkLocalFallback(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const record = localFallbacks.get(key);

  if (!record || now > record.resetTime) {
    localFallbacks.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= max) {
    return false;
  }

  record.count += 1;
  return true;
}

export type RateLimiterType = 'adminLogin' | 'track' | 'chat' | 'orders' | 'createOrder' | 'verifyPayment' | 'serviceability' | 'silverPrice' | 'dataRequest';

/**
 * Executes a distributed rate limit check using Upstash Redis.
 * Falls back to local in-memory window only if Upstash credentials are not set.
 */
export async function checkRateLimit(
  type: RateLimiterType,
  identifier: string
): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number }> {
  if (upstashLimiters && upstashLimiters[type]) {
    try {
      const result = await upstashLimiters[type].limit(identifier);
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      };
    } catch (redisErr) {
      console.warn(`[UPSTASH REDIS ERROR] Rate limit query failed, falling back to local:`, redisErr);
    }
  }

  // Fallback windows:
  // adminLogin: 5 per 15 min
  // track: 15 per 1 min
  // chat: 20 per 1 min
  // orders: 10 per 10 min
  // createOrder: 10 per 5 min
  // verifyPayment: 15 per 5 min
  // serviceability: 30 per 1 min
  // silverPrice: 20 per 1 min
  // dataRequest: 5 per 15 min
  const config = {
    adminLogin: { max: 5, ms: 15 * 60 * 1000 },
    track: { max: 15, ms: 60 * 1000 },
    chat: { max: 20, ms: 60 * 1000 },
    orders: { max: 10, ms: 10 * 60 * 1000 },
    createOrder: { max: 10, ms: 5 * 60 * 1000 },
    verifyPayment: { max: 15, ms: 5 * 60 * 1000 },
    serviceability: { max: 30, ms: 60 * 1000 },
    silverPrice: { max: 20, ms: 60 * 1000 },
    dataRequest: { max: 5, ms: 15 * 60 * 1000 },
  }[type];

  const allowed = checkLocalFallback(`${type}:${identifier}`, config.max, config.ms);
  return { success: allowed };
}
