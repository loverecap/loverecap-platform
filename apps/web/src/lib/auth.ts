import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@loverecap/database'

type DBClient = SupabaseClient<Database>

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
