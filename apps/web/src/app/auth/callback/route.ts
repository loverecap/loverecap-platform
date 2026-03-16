import { NextResponse, type NextRequest } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import { getProjectsByUser } from '@loverecap/database'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next')
  const source = requestUrl.searchParams.get('source')

  const supabase = await createRouteHandlerClient()

  // Exchange the code for a session (magic link / OAuth flows)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return NextResponse.redirect(new URL('/sign-in?error=auth', requestUrl.origin))
    }
  }

  // If a custom redirect was requested (e.g. ?next=/some-path), honor it.
  // Only allow relative paths to prevent open-redirect attacks.
  if (next && /^\/(?!\/)/.test(next)) {
    return NextResponse.redirect(new URL(next, requestUrl.origin))
  }

  // Password sign-in path also lands here — session is already set, just redirect
  // Smart redirect: user with projects → /dashboard, otherwise → /create
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL('/sign-in', requestUrl.origin))
    }

    const projects = await getProjectsByUser(supabase, user.id)
    const destination = projects.length > 0 ? '/dashboard' : '/create'
    return NextResponse.redirect(new URL(destination, requestUrl.origin))
  } catch {
    // Fallback: go to create
    return NextResponse.redirect(new URL('/create', requestUrl.origin))
  }
}
