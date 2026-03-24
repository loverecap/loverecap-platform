import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth'
import {
  createAdminClient,
  getProjectById,
  updatePaymentStatus,
  publishProject,
} from '@loverecap/database'
import { ok, err, unauthorizedError, serverError } from '@/lib/api-response'

const schema = z.object({
  payment_id: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  const devToolsEnabled =
    process.env.NODE_ENV !== 'production' ||
    process.env['NEXT_PUBLIC_ENABLE_DEV_TOOLS'] === 'true'

  if (!devToolsEnabled) {
    return err('Not available in production', 403, 'FORBIDDEN')
  }

  const supabase = await createRouteHandlerClient()
  const user = await requireUser(supabase).catch(() => null)
  if (!user) return unauthorizedError()

  try {
    const body: unknown = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return err('payment_id é obrigatório', 400, 'VALIDATION_ERROR')

    const { payment_id } = parsed.data

    // Verify the payment belongs to the current user
    const { data: payment } = await supabase
      .from('payments')
      .select('id, project_id, user_id, provider_payment_id, status')
      .eq('id', payment_id)
      .eq('user_id', user.id)
      .single()

    if (!payment) return err('Payment not found', 404, 'NOT_FOUND')
    if (payment.status === 'approved') return ok({ simulated: true, already: true })

    const admin = createAdminClient()

    // Mark payment as approved directly — bypasses AbacatePay entirely
    await updatePaymentStatus(admin, payment.id, 'approved', payment.provider_payment_id ?? 'dev-simulated')

    const project = await getProjectById(admin, payment.project_id).catch(() => null)
    const slug = project?.slug ?? ''

    await publishProject(admin, payment.project_id, payment.user_id, slug)

    return ok({ simulated: true, slug })
  } catch (error) {
    console.error('[POST /api/payments/dev-simulate]', error)
    return serverError()
  }
}
