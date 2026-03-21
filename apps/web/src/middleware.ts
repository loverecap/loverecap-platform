import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

// ─── Edge-level rate limiting ─────────────────────────────────────────────────
// Runs BEFORE any serverless function — cheapest possible protection.
// Uses in-memory Map per edge worker instance. Not globally distributed,
// but effective against burst spam from the same user hitting the same edge node.
// Upgrade to Upstash Redis for global enforcement if needed.

function applyRateLimit(
  request: NextRequest,
  key: string,
  limit: number,
  windowMs: number,
  isApiRoute: boolean,
): NextResponse | null {
  const result = rateLimit(key, limit, windowMs)
  if (result.success) return null

  const retryAfterSec = Math.ceil((result.resetAt - Date.now()) / 1000)

  if (isApiRoute) {
    return new NextResponse(
      JSON.stringify({ data: null, error: { message: 'Too many requests. Please wait.', code: 'RATE_LIMITED' } }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfterSec),
          'X-RateLimit-Reset': String(result.resetAt),
        },
      },
    )
  }

  // For page routes: redirect to home (preserves UX better than a raw 429)
  const url = request.nextUrl.clone()
  url.pathname = '/'
  url.searchParams.set('rl', '1')
  return NextResponse.redirect(url)
}

export async function middleware(request: NextRequest) {
  const ip = getClientIp(request)
  const path = request.nextUrl.pathname
  const method = request.method

  // ── 1. API mutation rate limit: 60 POST/min per IP ───────────────────────
  if (path.startsWith('/api/') && method === 'POST') {
    const limited = applyRateLimit(request, `api:post:${ip}`, 60, 60_000, true)
    if (limited) return limited
  }

  // ── 2. API DELETE rate limit: 30/min per IP ───────────────────────────────
  if (path.startsWith('/api/') && method === 'DELETE') {
    const limited = applyRateLimit(request, `api:del:${ip}`, 30, 60_000, true)
    if (limited) return limited
  }

  // ── 3. Public story pages: 30 GETs/min per IP ────────────────────────────
  // Each /s/ page hits DB + generates N signed URLs. Prevent hammering.
  if (path.startsWith('/s/')) {
    const limited = applyRateLimit(request, `story:${ip}`, 30, 60_000, false)
    if (limited) return limited
  }

  // ── 4. Create flow: 20 GETs/min per IP (prevent wizard spam) ─────────────
  if (path.startsWith('/create')) {
    const limited = applyRateLimit(request, `create:${ip}`, 20, 60_000, false)
    if (limited) return limited
  }

  // ─────────────────────────────────────────────────────────────────────────
  const requestHeaders = new Headers(request.headers)
  const traceId = requestHeaders.get('x-request-id') ?? crypto.randomUUID()
  requestHeaders.set('x-request-id', traceId)

  let response = NextResponse.next({ request: { headers: requestHeaders } })

  const url = process.env['NEXT_PUBLIC_SUPABASE_URL']
  const key = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']

  if (!url || !key) {
    response.headers.set('x-request-id', traceId)
    return response
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request: { headers: requestHeaders } })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAnonymous = !user || user.is_anonymous

  if (path.startsWith('/dashboard') && isAnonymous) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  if (path === '/sign-in' && user && !user.is_anonymous) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  response.headers.set('x-request-id', traceId)
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
