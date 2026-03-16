import type { ID, Nullable, Timestamps } from './common'

export type ProjectStatus =
  | 'draft'
  | 'awaiting_payment'
  | 'paid'
  | 'pending_manual_creation'
  | 'processing'
  | 'published'
  | 'delivery_sent'
  | 'archived'
  | 'deleted'

export type Project = {
  id: ID
  user_id: ID
  title: string
  slug: string
  status: ProjectStatus
  partner_name_1: string
  partner_name_2: string
  relationship_start_date: string
  theme_id: Nullable<ID>
  cover_asset_id: Nullable<ID>
  published_at: Nullable<string>
} & Timestamps

export type ProjectWithRelations = Project & {
  memories?: import('./memory').Memory[]
  assets?: import('./asset').Asset[]
  themes?: import('./theme').Theme | null
}
