/**
 * Simple in-memory sliding window rate limiter utility for API endpoints.
 * Protects AI endpoints from rate limits, quota depletion, and bot spam.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    const validTimestamps = record.timestamps.filter((ts) => now - ts < 60000);
    if (validTimestamps.length === 0) {
      rateLimitStore.delete(ip);
    } else {
      rateLimitStore.set(ip, { timestamps: validTimestamps });
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitOptions {
  limit?: number; // max requests per window
  windowMs?: number; // window size in milliseconds
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { isAllowed: boolean; limit: number; remaining: number; resetMs: number } {
  const limit = options.limit || 10; // Default: 10 requests
  const windowMs = options.windowMs || 60000; // Default: 1 minute
  const now = Date.now();

  const record = rateLimitStore.get(identifier) || { timestamps: [] };
  // Filter out timestamps outside the window
  const validTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (validTimestamps.length >= limit) {
    const oldest = validTimestamps[0];
    const resetMs = windowMs - (now - oldest);
    return {
      isAllowed: false,
      limit,
      remaining: 0,
      resetMs: Math.max(0, resetMs),
    };
  }

  validTimestamps.push(now);
  rateLimitStore.set(identifier, { timestamps: validTimestamps });

  return {
    isAllowed: true,
    limit,
    remaining: limit - validTimestamps.length,
    resetMs: windowMs,
  };
}
