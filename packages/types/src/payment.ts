import type { ID, Nullable, Timestamps } from './common'

export type PaymentStatus = 'pending' | 'approved' | 'rejected' | 'cancelled' | 'refunded'

export type Payment = {
  id: ID
  project_id: ID
  user_id: ID
  provider: string
  provider_payment_id: Nullable<string>
  status: PaymentStatus
  amount_cents: number
  currency: string
  metadata: Nullable<Record<string, unknown>>
} & Timestamps
