import type { ID, Nullable, Timestamps } from './common'

export type StoryStatus = 'draft' | 'published'

export type Story = {
  id: ID
  user_id: ID
  slug: string
  title: string
  partner_name_1: string
  partner_name_2: string
  relationship_start_date: string
  status: StoryStatus
  cover_image_url: Nullable<string>
} & Timestamps

export type StoryEvent = {
  id: ID
  story_id: ID
  title: string
  description: Nullable<string>
  occurred_at: string
  image_url: Nullable<string>
  position: number
} & Timestamps
