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
import { sendStoryReadyEmail, sendAccountSetupEmail } from '@/lib/email'

// POST /api/webhooks/abacatepay
// Receives payment status updates from AbacatePay (Webhook v1).
//
// Events subscribed: billing.paid
//
// Configure the webhook URL in your AbacatePay dashboard:
//   https://yourapp.com/api/webhooks/abacatepay
//
// AbacatePay Webhook v1 body shape for billing.paid:
//   { event: "billing.paid"; billing: { id: string; status: string; ... } }
//
// Verify with ABACATEPAY_WEBHOOK_SECRET (set in dashboard + .env).

function verifySecret(secret: string, header: string): boolean {
  // AbacatePay passes the secret as: Authorization: Bearer <secret>
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
  /** Present on billing.paid and billing.disputed */
  billing?: BillingPayload
  /** Present on withdraw.done and withdraw.failed */
  withdraw?: WithdrawPayload
}

export async function POST(request: NextRequest) {
  // ── Secret verification ───────────────────────────────────────────────
  const secret = env.abacatePayWebhookSecret()
  if (secret) {
    const authHeader = request.headers.get('authorization') ?? ''
    if (!verifySecret(secret, authHeader)) {
      console.warn('[POST /api/webhooks/abacatepay] Invalid secret — rejected')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  } else if (process.env.NODE_ENV === 'production') {
    console.error('[POST /api/webhooks/abacatepay] ABACATEPAY_WEBHOOK_SECRET not configured in production!')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let body: WebhookBody
  try {
    body = await request.json() as WebhookBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const admin = createAdminClient()

  await logEvent(admin, 'webhook.abacatepay.received', {
    payload: body as Record<string, unknown>,
  })

  try {
    switch (body.event) {
      case 'billing.paid':
        await handleBillingPaid(admin, body.billing)
        break

      case 'billing.disputed':
        await handleBillingDisputed(admin, body.billing)
        break

      case 'withdraw.done':
      case 'withdraw.failed':
        // No action needed — just logged above for observability
        break

      default:
        // Unknown event — acknowledge and move on
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[POST /api/webhooks/abacatepay]', error)
    // Return 500 so AbacatePay retries the delivery
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

async function handleBillingPaid(
  admin: ReturnType<typeof createAdminClient>,
  billing: BillingPayload | undefined,
) {
  if (!billing?.id) return

  const payment = await getPaymentByProviderId(admin, billing.id).catch(() => null)
  if (!payment) {
    console.warn('[webhook/abacatepay] billing.paid — no payment found for', billing.id)
    return
  }

  if (payment.status === 'approved') return // idempotent

  await updatePaymentStatus(admin, payment.id, 'approved', billing.id)

  const project = await getProjectById(admin, payment.project_id).catch(() => null)
  if (project) {
    try {
      await publishProject(admin, project.id, payment.user_id, project.slug)

      // Send email (fire-and-forget — never fail the webhook)
      void sendPostPaymentEmail(admin, payment, project).catch(
        (emailErr) => console.error('[webhook/abacatepay] email failed', emailErr),
      )
    } catch (publishError) {
      console.error('[webhook/abacatepay] auto-publish failed', publishError)
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
    // Get email from payment metadata (captured at checkout)
    const customerEmail = (payment.metadata as Record<string, unknown> | null)?.['customer_email'] as string | undefined
    if (!customerEmail) return

    // Upgrade anonymous user to real account by linking email
    await admin.auth.admin.updateUserById(payment.user_id, { email: customerEmail }).catch(
      (e) => console.error('[webhook] updateUserById failed', e),
    )

    // Generate a password-setup link
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
) {
  if (!billing?.id) return

  const payment = await getPaymentByProviderId(admin, billing.id).catch(() => null)
  if (!payment) return

  // Only revert if not already in a terminal state
  if (payment.status !== 'approved' && payment.status !== 'cancelled') return

  await updatePaymentStatus(admin, payment.id, 'rejected', billing.id)

  await logEvent(admin, 'payment.pix.disputed', {
    projectId: payment.project_id,
    userId: payment.user_id,
    payload: { provider_payment_id: billing.id },
  })
}
