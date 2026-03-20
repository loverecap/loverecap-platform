import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, Tables, TablesInsert } from '../database.types'

type DBClient = SupabaseClient<Database>

export type Asset = Tables<'assets'>
export type AssetInsert = TablesInsert<'assets'>

const BUCKET = 'project-assets'

export async function getAssetsByProject(client: DBClient, projectId: string) {
  const { data, error } = await client
    .from('assets')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export async function createAsset(client: DBClient, payload: AssetInsert) {
  const { data, error } = await client
    .from('assets')
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteAsset(client: DBClient, id: string) {
  const { data: asset, error: fetchError } = await client
    .from('assets')
    .select('storage_path, storage_bucket')
    .eq('id', id)
    .single()

  if (fetchError) throw fetchError

  const { error: storageError } = await client.storage
    .from(asset.storage_bucket)
    .remove([asset.storage_path])

  if (storageError) throw storageError

  const { error: deleteError } = await client.from('assets').delete().eq('id', id)
  if (deleteError) throw deleteError
}

export type SignedUploadUrlResult = {
  signedUrl: string
  token: string
  path: string
}

export async function generateSignedUploadUrl(
  client: DBClient,
  storagePath: string,
): Promise<SignedUploadUrlResult> {
  const { data, error } = await client.storage
    .from(BUCKET)
    .createSignedUploadUrl(storagePath)

  if (error) throw error

  return {
    signedUrl: data.signedUrl,
    token: data.token,
    path: data.path,
  }
}

export async function getSignedDownloadUrl(
  client: DBClient,
  storagePath: string,
  expiresInSeconds = 3600,
) {
  const { data, error } = await client.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, expiresInSeconds)

  if (error) throw error
  return data.signedUrl
}
