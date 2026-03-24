import { type NextRequest } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth'
import { getProjectsByUser, getMemoriesByProject } from '@loverecap/database'
import { ok, unauthorizedError, serverError } from '@/lib/api-response'

/**
 * GET /api/projects/draft
 * Returns the most recent draft or awaiting_payment project for the current user,
 * including its memories, so the builder can recover session from the DB.
 */
export async function GET(_request: NextRequest) {
  try {
    const supabase = await createRouteHandlerClient()
    const user = await requireUser(supabase).catch(() => null)
    if (!user) return unauthorizedError()

    const projects = await getProjectsByUser(supabase, user.id).catch(() => null)
    if (!projects) return ok(null)

    const draft = projects.find(
      (p) => p.status === 'draft' || p.status === 'awaiting_payment',
    )
    if (!draft) return ok(null)

    const memories = await getMemoriesByProject(supabase, draft.id).catch(() => [])

    return ok({ project: draft, memories })
  } catch (error) {
    console.error('[GET /api/projects/draft]', error)
    return serverError()
  }
}
