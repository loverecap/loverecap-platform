import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth'
import { env } from '@/lib/env'
import { ok, err, unauthorizedError, serverError } from '@/lib/api-response'

const schema = z.object({
  provider_payment_id: z.string().min(1),
})

// POST /api/payments/dev-simulate
// Triggers AbacatePay's payment simulation endpoint.
// ONLY available outside production — returns 403 in production.
//
// AbacatePay docs: POST /v1/pixQrCode/simulate-payment?id=<pixId>
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return err('Not available in production', 403, 'FORBIDDEN')
  }

  const supabase = await createRouteHandlerClient()
  const user = await requireUser(supabase).catch(() => null)
  if (!user) return unauthorizedError()

  try {
    const body: unknown = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return err('provider_payment_id é obrigatório', 400, 'VALIDATION_ERROR')

    const { provider_payment_id } = parsed.data

    const url = new URL('https://api.abacatepay.com/v1/pixQrCode/simulate-payment')
    url.searchParams.set('id', provider_payment_id)

    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.abacatePayApiKey()}`,
      },
      body: JSON.stringify({}),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(`AbacatePay simulate error ${res.status}: ${text}`)
    }

    return ok({ simulated: true })
  } catch (error) {
    console.error('[POST /api/payments/dev-simulate]', error)
    return serverError()
  }
}
