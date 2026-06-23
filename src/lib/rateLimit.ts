import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Simple in-memory fallback for local development
const memoryStore = new Map<string, { count: number; resetAt: number }>();

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Checks rate limit for a given IP address.
 * Standard limit: 15 requests per 15 minutes.
 */
export async function rateLimit(
  ip: string,
  limit: number = 15,
  durationMs: number = 15 * 60 * 1000 // 15 minutes
): Promise<RateLimitResult> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  // Use Upstash Redis if configured
  if (url && token && url.trim() !== '' && token.trim() !== '') {
    try {
      const redis = new Redis({ url, token });
      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, '15 m'),
        analytics: true,
        prefix: '@upstash/ratelimit/collegepath',
      });
      
      const result = await ratelimit.limit(ip);
      return {
        success: result.success,
        limit: result.limit,
        remaining: result.remaining,
        reset: result.reset,
      };
    } catch (e) {
      console.warn('⚠️ Upstash Redis rate limiter failed, falling back to in-memory: ', e);
    }
  }

  // Fallback to in-memory rate limiting (development/local only)
  const now = Date.now();
  const client = memoryStore.get(ip);

  // If client record doesn't exist or window expired, reset
  if (!client || now > client.resetAt) {
    const resetAt = now + durationMs;
    memoryStore.set(ip, { count: 1, resetAt });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: resetAt,
    };
  }

  // Check if limit exceeded
  if (client.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: client.resetAt,
    };
  }

  // Increment request count
  client.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - client.count,
    reset: client.resetAt,
  };
}
