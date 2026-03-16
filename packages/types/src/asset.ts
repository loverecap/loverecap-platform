import type { ID, Nullable } from './common'

export type AssetType = 'image' | 'video'

export type Asset = {
  id: ID
  project_id: ID
  memory_id: Nullable<ID>
  storage_path: string
  storage_bucket: string
  mime_type: string
  size_bytes: number
  asset_type: AssetType
  width: Nullable<number>
  height: Nullable<number>
  created_at: string
}
