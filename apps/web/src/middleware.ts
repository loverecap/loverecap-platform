import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
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

  const path = request.nextUrl.pathname
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
