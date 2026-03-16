import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

// Refreshes the user's Supabase session on every request so that
// Server Components and Route Handlers always receive a valid token.
export async function middleware(request: NextRequest) {
  // ── Trace ID ──────────────────────────────────────────────────────────────
  // Propagate or generate a correlation ID so every log line for a request
  // shares the same traceId. Route handlers read it via createLogger().
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
        // Preserve requestHeaders (including x-request-id) when Supabase refreshes cookies
        response = NextResponse.next({ request: { headers: requestHeaders } })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        )
      },
    },
  })

  // Validates the JWT — do not use getSession() here as it does not verify the token.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isAnonymous = !user || user.is_anonymous

  // Protect /dashboard: requires a real (non-anonymous) authenticated session
  if (path.startsWith('/dashboard') && isAnonymous) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  // On /sign-in: redirect already-authenticated real users to dashboard
  if (path === '/sign-in' && user && !user.is_anonymous) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Always expose the trace ID in the response — useful for client-side debugging
  response.headers.set('x-request-id', traceId)
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
