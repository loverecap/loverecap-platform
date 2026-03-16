import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth'
import { createPayment, getProjectById, createAdminClient, logEvent } from '@loverecap/database'
import { createPixCharge } from '@/lib/payments/abacatepay'
import { env } from '@/lib/env'
import { rateLimit } from '@/lib/rate-limit'
import {
  ok,
  err,
  validationError,
  unauthorizedError,
  notFoundError,
  forbiddenError,
  serverError,
} from '@/lib/api-response'

const schema = z.object({
  project_id: z.string().uuid(),
  email: z.string().email(),
  /** CPF — accepts both formatted (000.000.000-00) and raw (00000000000) */
  tax_id: z.string().min(11).max(18),
  /** Celular — accepts (11) 99999-9999 or 11999999999 */
  cellphone: z.string().min(10).max(20),
})

/** R$ 9,99 — single price for MVP */
const PRICE_CENTS = 999

export async function POST(request: NextRequest) {
  const supabase = await createRouteHandlerClient()
  const user = await requireUser(supabase).catch(() => null)
  if (!user) return unauthorizedError()

  // 5 payment attempts per user per hour — prevents abuse of external API quota
  const rl = rateLimit(`pix:${user.id}`, 5, 60 * 60 * 1000)
  if (!rl.success) {
    return err('Muitas tentativas de pagamento. Tente novamente em breve.', 429, 'RATE_LIMITED')
  }

  try {
    const body: unknown = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const { project_id, email, tax_id, cellphone } = parsed.data

    // Verify project ownership via RLS-protected client
    const project = await getProjectById(supabase, project_id).catch(
      (e: { code?: string }) => {
        if (e?.code === 'PGRST116') return null
        throw e
      },
    )

    if (!project) return notFoundError('Project')
    if (project.user_id !== user.id) return forbiddenError()
    if (project.status !== 'draft') {
      return err(
        `Não é possível iniciar pagamento para um projeto com status "${project.status}"`,
        422,
        'INVALID_STATUS',
      )
    }

    // Create PIX charge with AbacatePay
    const charge = await createPixCharge(env.abacatePayApiKey(), {
      amount: PRICE_CENTS,
      description: 'LoveRecap — acesso vitalício',
      customer: {
        name: (user.user_metadata?.['full_name'] as string | undefined) ?? email,
        email,
        cellphone,
        taxId: tax_id,
      },
      metadata: {
        project_id,
        user_id: user.id,
      },
    })

    // Use admin client — payments table has no INSERT RLS policy (anonymous users have role 'anon').
    // Ownership is already verified above via the RLS-protected project query.
    const admin = createAdminClient()
    const payment = await createPayment(admin, {
      project_id,
      user_id: user.id,
      provider: 'abacate_pay',
      provider_payment_id: charge.id,
      amount_cents: PRICE_CENTS,
      currency: 'BRL',
      status: 'pending',
      metadata: { customer_email: email },
    })

    // Fire-and-forget audit trail
    void logEvent(admin, 'payment.pix.created', {
      projectId: project_id,
      userId: user.id,
      payload: { provider_payment_id: charge.id },
    })

    return ok({
      paymentId: payment.id,
      providerPaymentId: charge.id,
      /** <img src={qrCodeImage} /> — ready to render directly */
      qrCodeImage: `data:image/png;base64,${charge.brCodeBase64}`,
      brCode: charge.brCode,
      expiresAt: charge.expiresAt,
    })
  } catch (error) {
    console.error('[POST /api/payments/pix]', error)
    return serverError()
  }
}
