import type { ID, Nullable } from './common'

export type Theme = {
  id: ID
  name: string
  description: Nullable<string>
  preview_url: Nullable<string>
  is_active: boolean
  created_at: string
}
