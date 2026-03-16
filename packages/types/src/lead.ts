import type { ID, Nullable } from './common'

export type Lead = {
  id: ID
  email: string
  source: Nullable<string>
  created_at: string
}
