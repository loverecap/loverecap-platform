import { timingSafeEqual } from 'crypto'
import { type NextRequest, NextResponse } from 'next/server'
import {
  createAdminClient,
  getPaymentByProviderId,
  getProjectById,
  updatePaymentStatus,
  publishProject,
  logEvent,
} from '@loverecap/database'
import { env } from '@/lib/env'
import { createLogger } from '@/lib/logger'
import { sendStoryReadyEmail, sendAccountSetupEmail } from '@/lib/email'

function verifySecret(secret: string, header: string): boolean {
  const token = header.replace(/^Bearer\s+/i, '').trim()
  try {
    return timingSafeEqual(Buffer.from(secret), Buffer.from(token))
  } catch {
    return false
  }
}

interface BillingPayload {
  id?: string
  status?: string
  metadata?: { project_id?: string; user_id?: string }
}

interface WithdrawPayload {
  id?: string
  amount?: number
  status?: string
}

interface WebhookBody {
  event?: string
  
  billing?: BillingPayload
  
  withdraw?: WithdrawPayload
}

export async function POST(request: NextRequest) {
  const log = createLogger('webhooks/payments', request)

  const secret = env.abacatePayWebhookSecret()
  if (secret) {
    const authHeader = request.headers.get('authorization') ?? ''
    if (!verifySecret(secret, authHeader)) {
      log.warn('Invalid webhook secret — request rejected')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  } else if (process.env.NODE_ENV === 'production') {
    log.error('ABACATEPAY_WEBHOOK_SECRET not configured in production')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let body: WebhookBody
  try {
    body = await request.json() as WebhookBody
  } catch {
    log.warn('Invalid JSON body')
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  log.info('Webhook received', { event: body.event, billingId: body.billing?.id })

  const admin = createAdminClient()

  await logEvent(admin, 'webhook.abacatepay.received', {
    payload: body as Record<string, unknown>,
  })

  try {
    switch (body.event) {
      case 'billing.paid':
        await handleBillingPaid(admin, body.billing, log)
        break

      case 'billing.disputed':
        await handleBillingDisputed(admin, body.billing, log)
        break

      case 'withdraw.done':
      case 'withdraw.failed':
        log.info('Withdraw event — no action needed', { event: body.event })
        break

      default:
        log.warn('Unknown webhook event', { event: body.event })
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    log.error('Unhandled webhook error', { error: String(error) })
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

async function handleBillingPaid(
  admin: ReturnType<typeof createAdminClient>,
  billing: BillingPayload | undefined,
  log: ReturnType<typeof createLogger>,
) {
  if (!billing?.id) return

  const payment = await getPaymentByProviderId(admin, billing.id).catch(() => null)
  if (!payment) {
    log.warn('billing.paid — no payment record found', { billingId: billing.id })
    return
  }

  if (payment.status === 'approved') {
    log.info('billing.paid — already approved, skipping (idempotent)', { paymentId: payment.id })
    return
  }

  await updatePaymentStatus(admin, payment.id, 'approved', billing.id)
  log.info('Payment approved', { paymentId: payment.id, projectId: payment.project_id })

  const project = await getProjectById(admin, payment.project_id).catch(() => null)
  if (project) {
    try {
      await publishProject(admin, project.id, payment.user_id, project.slug)
      log.info('Project published', { projectId: project.id, slug: project.slug })

      void sendPostPaymentEmail(admin, payment, project).catch(
        (emailErr) => log.error('Email dispatch failed', { error: String(emailErr) }),
      )
    } catch (publishError) {
      log.error('Auto-publish failed', { projectId: project.id, error: String(publishError) })
    }
  }

  await logEvent(admin, 'payment.pix.confirmed', {
    projectId: payment.project_id,
    userId: payment.user_id,
    payload: { provider_payment_id: billing.id, source: 'webhook' },
  })
}

type PaymentRecord = Awaited<ReturnType<typeof getPaymentByProviderId>>
type ProjectRecord = Awaited<ReturnType<typeof getProjectById>>

async function sendPostPaymentEmail(
  admin: ReturnType<typeof createAdminClient>,
  payment: PaymentRecord,
  project: ProjectRecord,
) {
  const { data: userData } = await admin.auth.admin.getUserById(payment.user_id)
  const user = userData?.user
  if (!user) return

  const partnerName1 = project.partner_name_1 ?? ''
  const partnerName2 = project.partner_name_2 ?? ''
  const slug = project.slug

  if (user.is_anonymous) {
    const customerEmail = (payment.metadata as Record<string, unknown> | null)?.['customer_email'] as string | undefined
    if (!customerEmail) return

    await admin.auth.admin.updateUserById(payment.user_id, { email: customerEmail }).catch(
      (e) => console.error('[webhook] updateUserById failed', e),
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

async function handleBillingDisputed(
  admin: ReturnType<typeof createAdminClient>,
  billing: BillingPayload | undefined,
  log: ReturnType<typeof createLogger>,
) {
  if (!billing?.id) return

  const payment = await getPaymentByProviderId(admin, billing.id).catch(() => null)
  if (!payment) {
    log.warn('billing.disputed — no payment record found', { billingId: billing.id })
    return
  }

  if (payment.status !== 'approved' && payment.status !== 'cancelled') return

  await updatePaymentStatus(admin, payment.id, 'rejected', billing.id)
  log.warn('Payment disputed and rejected', { paymentId: payment.id, projectId: payment.project_id })

  await logEvent(admin, 'payment.pix.disputed', {
    projectId: payment.project_id,
    userId: payment.user_id,
    payload: { provider_payment_id: billing.id },
  })
}
