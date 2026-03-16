import type { ID, Nullable } from './common'

export type EventLog = {
  id: ID
  project_id: Nullable<ID>
  user_id: Nullable<ID>
  event: string
  payload: Nullable<Record<string, unknown>>
  created_at: string
}
