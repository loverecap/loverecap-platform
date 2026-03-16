/**
 * Simple sliding-window rate limiter backed by an in-memory Map.
 *
 * Limitations (acceptable for a low-traffic MVP):
 * - State resets on cold starts — does not persist across serverless invocations.
 * - Not distributed — each server instance maintains its own counters.
 *
 * This provides meaningful protection against rapid individual-user abuse
 * (accidental loops, bad clients) but is not a DDoS shield.
 *
 * For production scale (thousands of users), migrate to Upstash Redis:
 * https://upstash.com/docs/redis/sdks/ratelimit/overview
 */

interface Entry {
  count: number
  resetAt: number
}

const store = new Map<string, Entry>()

// Prune expired entries every minute to prevent unbounded memory growth.
// typeof check guards against environments where setInterval isn't available
// (e.g. Next.js Edge runtime which uses a different timer API).
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store) {
      if (entry.resetAt < now) store.delete(key)
    }
  }, 60_000)
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number
}

/**
 * Check and increment a rate-limit counter for `key`.
 *
 * @param key       Unique key — typically `${routeName}:${userId}` or `${routeName}:${ip}`
 * @param limit     Maximum requests allowed within the window
 * @param windowMs  Window duration in milliseconds
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const existing = store.get(key)

  if (!existing || existing.resetAt < now) {
    const resetAt = now + windowMs
    store.set(key, { count: 1, resetAt })
    return { success: true, remaining: limit - 1, resetAt }
  }

  if (existing.count >= limit) {
    return { success: false, remaining: 0, resetAt: existing.resetAt }
  }

  existing.count += 1
  return { success: true, remaining: limit - existing.count, resetAt: existing.resetAt }
}

/**
 * Extract the best-available client IP from Next.js request headers.
 * Returns 'unknown' if no IP header is present (rare in production).
 */
export function getClientIp(
  request: { headers: { get(name: string): string | null } },
): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  )
}
