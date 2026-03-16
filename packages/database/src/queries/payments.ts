import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, Json, Tables, TablesInsert, Enums } from '../database.types'

type DBClient = SupabaseClient<Database>

export type Payment = Tables<'payments'>
export type PaymentInsert = TablesInsert<'payments'>
export type PaymentStatus = Enums<'payment_status'>

// ──────────────────────────────────────────────
// Read
// ──────────────────────────────────────────────

export async function getPaymentById(client: DBClient, id: string) {
  const { data, error } = await client
    .from('payments')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function getPaymentByProviderId(
  client: DBClient,
  providerPaymentId: string,
) {
  const { data, error } = await client
    .from('payments')
    .select('*')
    .eq('provider_payment_id', providerPaymentId)
    .single()

  if (error) throw error
  return data
}

export async function getPaymentsByProject(client: DBClient, projectId: string) {
  const { data, error } = await client
    .from('payments')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// ──────────────────────────────────────────────
// Write
// ──────────────────────────────────────────────

export async function createPayment(client: DBClient, payload: PaymentInsert) {
  const { data, error } = await client
    .from('payments')
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updatePaymentStatus(
  client: DBClient,
  id: string,
  status: PaymentStatus,
  providerPaymentId?: string,
  metadata?: Record<string, unknown>,
) {
  const { data, error } = await client
    .from('payments')
    .update({
      status,
      ...(providerPaymentId ? { provider_payment_id: providerPaymentId } : {}),
      ...(metadata ? { metadata: metadata as Json } : {}),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// ──────────────────────────────────────────────
// Event log helpers (append-only audit trail)
// ──────────────────────────────────────────────

export async function logEvent(
  client: DBClient,
  event: string,
  options: {
    projectId?: string | undefined
    userId?: string | undefined
    payload?: Record<string, unknown> | undefined
  } = {},
) {
  const { error } = await client.from('event_logs').insert({
    event,
    project_id: options.projectId ?? null,
    user_id: options.userId ?? null,
    payload: (options.payload ?? null) as Json | null,
  })

  // Event log failures should never surface to the caller
  if (error) console.error('[event_log]', error.message)
}
