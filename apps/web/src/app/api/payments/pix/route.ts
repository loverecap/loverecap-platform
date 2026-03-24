import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth'
import { createPayment, getProjectById, createAdminClient, logEvent } from '@loverecap/database'
import { createPixCharge } from '@/lib/payments/abacatepay'
import { env } from '@/lib/env'
import { rateLimit } from '@/lib/rate-limit'
import { createLogger } from '@/lib/logger'
import { ok, validationError } from '@/lib/api-response'
import { AppError } from '@/lib/errors'
import { withApiHandler } from '@/lib/with-api-handler'

const schema = z.object({
  project_id: z.string().uuid(),
  email: z.string().email(),
  tax_id: z.string().min(11).max(18),
  cellphone: z.string().min(10).max(20),
})

const PRICE_CENTS = 999

export const POST = withApiHandler('payments/pix', async (request: NextRequest) => {
  const log = createLogger('payments/pix', request)

  const supabase = await createRouteHandlerClient()
  const user = await requireUser(supabase).catch(() => null)
  if (!user) throw AppError.unauthorized()

  const rl = rateLimit(`pix:${user.id}`, 5, 60 * 60 * 1000)
  if (!rl.success) {
    log.warn('Rate limit exceeded', { userId: user.id })
    throw AppError.rateLimited('Muitas tentativas de pagamento. Tente novamente em breve.')
  }

  const body: unknown = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return validationError(parsed.error)

  const { project_id, email } = parsed.data
  const tax_id = parsed.data.tax_id.replace(/\D/g, '')
  const cellphone = parsed.data.cellphone.replace(/\D/g, '')

  log.info('PIX charge requested', { userId: user.id, projectId: project_id })

  const project = await getProjectById(supabase, project_id).catch(
    (e: { code?: string }) => {
      if (e?.code === 'PGRST116') return null
      throw e
    },
  )

  if (!project) throw new AppError('PROJECT_NOT_FOUND', 404, 'Project not found')
  if (project.user_id !== user.id) throw AppError.forbidden()
  if (project.status !== 'draft') {
    log.warn('Invalid project status for payment', { projectId: project_id, status: project.status })
    throw new AppError('PROJECT_NOT_DRAFT', 422, `Não é possível iniciar pagamento para um projeto com status "${project.status}"`)
  }

  const charge = await createPixCharge(env.abacatePayApiKey(), {
    amount: PRICE_CENTS,
    description: 'LoveRecap - acesso vitalicio',
    customer: {
      name: (user.user_metadata?.['full_name'] as string | undefined) ?? email,
      email,
      cellphone,
      taxId: tax_id,
    },
  })

  log.info('PIX charge created', { chargeId: charge.id, projectId: project_id })

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

  void logEvent(admin, 'payment.pix.created', {
    projectId: project_id,
    userId: user.id,
    payload: { provider_payment_id: charge.id },
  })

  return ok({
    paymentId: payment.id,
    providerPaymentId: charge.id,
    qrCodeImage: `data:image/png;base64,${charge.brCodeBase64}`,
    brCode: charge.brCode,
    expiresAt: charge.expiresAt,
  })
})
