import { type NextRequest } from 'next/server'
import { reorderMemoriesSchema } from '@loverecap/validation'
import { getProjectById, reorderMemories } from '@loverecap/database'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth'
import {
  ok,
  validationError,
  unauthorizedError,
  notFoundError,
  forbiddenError,
  serverError,
} from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createRouteHandlerClient()
    const user = await requireUser(supabase).catch(() => null)
    if (!user) return unauthorizedError()

    const body: unknown = await request.json()
    const parsed = reorderMemoriesSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const { project_id, order } = parsed.data

    const project = await getProjectById(supabase, project_id).catch(
      (e: { code?: string }) => {
        if (e?.code === 'PGRST116') return null
        throw e
      },
    )
    if (!project) return notFoundError('Project')
    if (project.user_id !== user.id) return forbiddenError()

    const updated = await reorderMemories(supabase, order)
    return ok(updated)
  } catch (error) {
    console.error('[POST /api/memories/reorder]', error)
    return serverError()
  }
}
