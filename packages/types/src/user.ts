import type { ID, Timestamps } from './common'

export type User = {
  id: ID
  email: string
  full_name: string | null
  avatar_url: string | null
} & Timestamps
