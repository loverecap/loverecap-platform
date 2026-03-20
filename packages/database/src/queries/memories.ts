import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, Tables, TablesInsert, TablesUpdate } from '../database.types'

type DBClient = SupabaseClient<Database>

export type Memory = Tables<'memories'>
export type MemoryInsert = TablesInsert<'memories'>
export type MemoryUpdate = TablesUpdate<'memories'>

export async function getMemoriesByProject(client: DBClient, projectId: string) {
  const { data, error } = await client
    .from('memories')
    .select('*, assets(*)')
    .eq('project_id', projectId)
    .order('position', { ascending: true })

  if (error) throw error
  return data
}

export async function getMemoryById(client: DBClient, id: string) {
  const { data, error } = await client
    .from('memories')
    .select('*, assets(*)')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createMemory(client: DBClient, payload: MemoryInsert) {
  const { data, error } = await client
    .from('memories')
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateMemory(
  client: DBClient,
  id: string,
  payload: MemoryUpdate,
) {
  const { data, error } = await client
    .from('memories')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteMemory(client: DBClient, id: string) {
  const { error } = await client.from('memories').delete().eq('id', id)
  if (error) throw error
}

export async function reorderMemories(
  client: DBClient,
  updates: { id: string; position: number }[],
) {
  const results = await Promise.all(
    updates.map(({ id, position }) =>
      client.from('memories').update({ position }).eq('id', id).select().single(),
    ),
  )

  const failed = results.find((r) => r.error)
  if (failed?.error) throw failed.error

  return results.map((r) => r.data!)
}
