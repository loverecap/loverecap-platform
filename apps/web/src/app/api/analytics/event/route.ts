import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { createAdminClient, logEvent } from '@loverecap/database'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import { ok, validationError, serverError } from '@/lib/api-response'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

const ALLOWED_EVENTS = [
  'hero_cta_clicked',
  'example_cta_clicked',
  'builder_started',
  'story_shared',
  'story_copy_link',
] as const

const schema = z.object({
  event: z.enum(ALLOWED_EVENTS),
  project_id: z.string().uuid().optional(),
  payload: z.record(z.unknown()).optional(),
})

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  const rl = rateLimit(`analytics:${ip}`, 30, 60_000)
  if (!rl.success) {
    return ok({ logged: false })
  }

  try {
    const body: unknown = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const { event, project_id, payload } = parsed.data

    let userId: string | undefined
    try {
      const supabase = await createRouteHandlerClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      userId = user?.id
    } catch {
    }

    const admin = createAdminClient()
    await logEvent(admin, event, {
      projectId: project_id,
      userId,
      payload: payload as Record<string, unknown> | undefined,
    })

    return ok({ logged: true })
  } catch (error) {
    console.error('[POST /api/analytics/event]', error)
    return serverError()
  }
}
