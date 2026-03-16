import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, Tables, TablesInsert, TablesUpdate } from '../database.types'

type DBClient = SupabaseClient<Database>

export type Project = Tables<'projects'>
export type ProjectInsert = TablesInsert<'projects'>
export type ProjectUpdate = TablesUpdate<'projects'>

// ──────────────────────────────────────────────
// Read
// ──────────────────────────────────────────────

export async function getProjectById(client: DBClient, id: string) {
  const { data, error } = await client
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function getProjectBySlug(client: DBClient, slug: string) {
  const { data, error } = await client
    .from('projects')
    .select('*, memories(*), assets!assets_project_id_fkey(*), themes(*)')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}

export async function getProjectsByUser(client: DBClient, userId: string) {
  const { data, error } = await client
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .not('status', 'eq', 'deleted')
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data
}

// ──────────────────────────────────────────────
// Write
// ──────────────────────────────────────────────

export async function createProject(client: DBClient, payload: ProjectInsert) {
  const { data, error } = await client
    .from('projects')
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProject(
  client: DBClient,
  id: string,
  userId: string,
  payload: ProjectUpdate,
) {
  const { data, error } = await client
    .from('projects')
    .update(payload)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function publishProject(
  client: DBClient,
  id: string,
  userId: string,
  slug: string,
) {
  const { data, error } = await client
    .from('projects')
    .update({
      status: 'published',
      slug,
      published_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function softDeleteProject(
  client: DBClient,
  id: string,
  userId: string,
) {
  const { data, error } = await client
    .from('projects')
    .update({ status: 'deleted' })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}
