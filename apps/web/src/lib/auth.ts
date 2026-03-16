import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@loverecap/database'

type DBClient = SupabaseClient<Database>

// Returns the authenticated user from a route handler client.
// Throws if no active session exists — the handler should catch this
// and return a 401 using unauthorizedError().
export async function requireUser(client: DBClient) {
  const {
    data: { user },
    error,
  } = await client.auth.getUser()

  if (error || !user) {
    throw new Error('UNAUTHORIZED')
  }

  return user
}
