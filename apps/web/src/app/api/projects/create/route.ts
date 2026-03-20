import { type NextRequest } from 'next/server'
import { createProjectSchema } from '@loverecap/validation'
import { createProject, createAdminClient, logEvent } from '@loverecap/database'
import { generateSlug, slugify } from '@loverecap/utils'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth'
import {
  ok,
  err,
  validationError,
  unauthorizedError,
  serverError,
} from '@/lib/api-response'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createRouteHandlerClient()
    const user = await requireUser(supabase).catch(() => null)
    if (!user) return unauthorizedError()

    const rl = rateLimit(`create_project:${user.id}`, 5, 60 * 60_000)
    if (!rl.success) {
      return err('Too many projects created. Please wait before trying again.', 429, 'RATE_LIMITED')
    }

    const body: unknown = await request.json()
    const parsed = createProjectSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const { title, partner_name_1, partner_name_2, relationship_start_date, theme_id } =
      parsed.data

    const slug = `${slugify(partner_name_1)}-${slugify(partner_name_2)}-${generateSlug(8)}`

    const project = await createProject(supabase, {
      user_id: user.id,
      title,
      slug,
      partner_name_1,
      partner_name_2,
      relationship_start_date,
      theme_id: theme_id ?? null,
      status: 'draft',
    })

    const admin = createAdminClient()
    void logEvent(admin, 'project.draft_created', {
      projectId: project.id,
      userId: user.id,
    })

    return ok(project, 201)
  } catch (error) {
    console.error('[POST /api/projects/create]', error)
    return serverError()
  }
}
