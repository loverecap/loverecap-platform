import { type NextRequest } from 'next/server'
import { createMemorySchema } from '@loverecap/validation'
import { getProjectById, createMemory, getMemoriesByProject } from '@loverecap/database'
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
    const parsed = createMemorySchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const { project_id, title, short_description, description, occurred_at, emoji, position } = parsed.data

    const project = await getProjectById(supabase, project_id).catch(
      (e: { code?: string }) => {
        if (e?.code === 'PGRST116') return null
        throw e
      },
    )

    if (!project) return notFoundError('Project')
    if (project.user_id !== user.id) return forbiddenError()

    let resolvedPosition = position
    if (resolvedPosition === undefined) {
      const existing = await getMemoriesByProject(supabase, project_id)
      resolvedPosition = existing.length
    }

    const memory = await createMemory(supabase, {
      project_id,
      title,
      short_description: short_description ?? null,
      description: description ?? null,
      ...(occurred_at !== undefined ? { occurred_at } : {}),
      emoji: emoji ?? null,
      position: resolvedPosition,
    })

    return ok(memory, 201)
  } catch (error) {
    console.error('[POST /api/memories/create]', error)
    return serverError()
  }
}
