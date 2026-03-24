import { type NextRequest } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth'
import {
  createAdminClient,
  getProjectById,
  updatePaymentStatus,
  publishProject,
  logEvent,
} from '@loverecap/database'
import { checkPixStatus } from '@/lib/payments/abacatepay'
import { env } from '@/lib/env'
import { ok, notFoundError } from '@/lib/api-response'
import { AppError } from '@/lib/errors'
import { withApiHandler } from '@/lib/with-api-handler'
import { createLogger } from '@/lib/logger'
import { sendStoryReadyEmail, sendAccountSetupEmail } from '@/lib/email'

export const GET = withApiHandler('payments/status', async (request: NextRequest) => {
  const log = createLogger('payments/status', request)

  const supabase = await createRouteHandlerClient()
  const user = await requireUser(supabase).catch(() => null)
  if (!user) throw AppError.unauthorized()

  const paymentId = request.nextUrl.searchParams.get('payment_id')
  if (!paymentId) throw new AppError('VALIDATION_ERROR', 400, 'payment_id é obrigatório')

  const { data: payment, error: payErr } = await supabase
    .from('payments')
    .select('id, status, provider_payment_id, project_id, user_id, metadata')
    .eq('id', paymentId)
    .eq('user_id', user.id)
    .single()

  if (payErr || !payment) return notFoundError('Payment')

  if (payment.status === 'approved') {
    const project = await getProjectById(supabase, payment.project_id).catch(() => null)
    return ok({ status: 'PAID', slug: project?.slug ?? null })
  }

  if (!payment.provider_payment_id) {
    return ok({ status: 'PENDING' })
  }

  const pixStatus = await checkPixStatus(env.abacatePayApiKey(), payment.provider_payment_id)

  if (pixStatus === 'PAID') {
    const admin = createAdminClient()

    await updatePaymentStatus(admin, payment.id, 'approved', payment.provider_payment_id)
    log.info('Payment confirmed via polling', { paymentId: payment.id, projectId: payment.project_id })

    const project = await getProjectById(admin, payment.project_id).catch(() => null)
    const slug = project?.slug ?? ''

    let published = false
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await publishProject(admin, payment.project_id, payment.user_id, slug)
        log.info('Project auto-published', { projectId: payment.project_id, slug, attempt })
        published = true
        break
      } catch (publishError) {
        log.error('Auto-publish attempt failed', { projectId: payment.project_id, attempt, error: String(publishError) })
        if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 1000))
      }
    }

    if (!published) {
      return ok({ status: 'PROCESSING' })
    }

    if (project) {
      void sendPostPaymentEmail(admin, user, payment, project, slug).catch(
        (emailErr) => log.error('Email dispatch failed', { error: String(emailErr) }),
      )
    }

    void logEvent(admin, 'payment.pix.confirmed', {
      projectId: payment.project_id,
      userId: payment.user_id,
      payload: { provider_payment_id: payment.provider_payment_id },
    })

    return ok({ status: 'PAID', slug: slug || null })
  }

  if (pixStatus === 'EXPIRED' || pixStatus === 'CANCELLED') {
    await updatePaymentStatus(supabase, payment.id, 'cancelled')
    log.info('Payment expired/cancelled', { paymentId: payment.id, pixStatus })
    return ok({ status: 'EXPIRED' })
  }

  return ok({ status: 'PENDING' })
})

type AuthUser = NonNullable<Awaited<ReturnType<ReturnType<typeof createAdminClient>['auth']['getUser']>>['data']['user']>

async function sendPostPaymentEmail(
  admin: ReturnType<typeof createAdminClient>,
  user: AuthUser,
  payment: { user_id: string; metadata: unknown },
  project: { partner_name_1: string | null; partner_name_2: string | null },
  slug: string,
) {
  const partnerName1 = project.partner_name_1 ?? ''
  const partnerName2 = project.partner_name_2 ?? ''

  if (user.is_anonymous) {
    const customerEmail = (payment.metadata as Record<string, unknown> | null)?.['customer_email'] as string | undefined
    if (!customerEmail) return

    await admin.auth.admin.updateUserById(payment.user_id, { email: customerEmail }).catch(
      (e) => console.error(JSON.stringify({ level: 'error', service: 'payments/status', msg: 'updateUserById failed', error: String(e) })),
    )

    const appUrl = process.env['NEXT_PUBLIC_APP_URL'] ?? ''
    const { data: linkData } = await admin.auth.admin.generateLink({
      type: 'recovery',
      email: customerEmail,
      options: { redirectTo: `${appUrl}/auth/callback?next=/set-password` },
    })

    const setPasswordUrl = linkData?.properties?.action_link ?? ''
    await sendAccountSetupEmail({ to: customerEmail, partnerName1, partnerName2, slug, setPasswordUrl })
  } else {
    const email = user.email
    if (!email) return
    await sendStoryReadyEmail({ to: email, partnerName1, partnerName2, slug })
  }
}
