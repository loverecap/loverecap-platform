import { type NextRequest } from 'next/server'
import { publishProjectSchema } from '@loverecap/validation'
import {
  getProjectById,
  publishProject,
  getMemoriesByProject,
  createAdminClient,
  logEvent,
} from '@loverecap/database'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth'
import {
  ok,
  err,
  validationError,
  unauthorizedError,
  notFoundError,
  forbiddenError,
  serverError,
} from '@/lib/api-response'
import { rateLimit } from '@/lib/rate-limit'

const PUBLISHABLE_STATUSES = ['draft', 'paid'] as const

// POST /api/projects/publish
// Transitions a project to "published" and makes it accessible via /story/[slug].
// Requirements: project must be owned by the caller and have at least one memory.
// Rate limit: 10 publish attempts per user per hour.
export async function POST(request: NextRequest) {
  try {
    const supabase = await createRouteHandlerClient()
    const user = await requireUser(supabase).catch(() => null)
    if (!user) return unauthorizedError()

    const rl = rateLimit(`publish_project:${user.id}`, 10, 60 * 60_000)
    if (!rl.success) {
      return err('Too many publish attempts. Please wait before trying again.', 429, 'RATE_LIMITED')
    }

    const body: unknown = await request.json()
    const parsed = publishProjectSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const { project_id } = parsed.data

    // Load project — RLS ensures only the owner can see it
    const project = await getProjectById(supabase, project_id).catch(
      (e: { code?: string }) => {
        if (e?.code === 'PGRST116') return null
        throw e
      },
    )

    if (!project) return notFoundError('Project')
    if (project.user_id !== user.id) return forbiddenError()

    if (!(PUBLISHABLE_STATUSES as readonly string[]).includes(project.status)) {
      return err(
        `Project cannot be published from status "${project.status}"`,
        422,
        'INVALID_STATUS',
      )
    }

    // Must have at least one memory
    const memories = await getMemoriesByProject(supabase, project_id)
    if (memories.length === 0) {
      return err('Add at least one memory before publishing', 422, 'NO_MEMORIES')
    }

    // Slug is already set at creation — re-use it
    const published = await publishProject(supabase, project_id, user.id, project.slug)

    // Fire-and-forget analytics
    const admin = createAdminClient()
    void logEvent(admin, 'project.published', {
      projectId: published.id,
      userId: user.id,
    })

    return ok({
      project: published,
      public_url: `/story/${published.slug}`,
    })
  } catch (error) {
    console.error('[POST /api/projects/publish]', error)
    return serverError()
  }
}
