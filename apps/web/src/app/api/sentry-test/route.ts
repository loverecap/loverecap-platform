import { NextResponse } from 'next/server'

// DELETE THIS FILE after confirming Sentry captures errors in production.
export function GET() {
  throw new Error('Sentry production test — delete me')
  return NextResponse.json({ ok: true })
}
