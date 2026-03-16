import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

// Used in Client Components. Reads from NEXT_PUBLIC_ env vars only.
export function createSupabaseBrowserClient() {
  const url = process.env['NEXT_PUBLIC_SUPABASE_URL']
  const key = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']

  if (!url || !key) {
    throw new Error(
      'Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY',
    )
  }

  return createBrowserClient<Database>(url, key)
}
