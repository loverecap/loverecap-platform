import type { ID, Nullable, Timestamps } from './common'
import type { Asset } from './asset'

export type Memory = {
  id: ID
  project_id: ID
  title: string
  description: Nullable<string>
  short_description: Nullable<string>
  occurred_at: string
  emoji: Nullable<string>
  position: number
} & Timestamps

export type MemoryWithAssets = Memory & {
  assets: Asset[]
}
