import { type NextRequest } from 'next/server'
import { updateMemorySchema } from '@loverecap/validation'
import { getMemoryById, getProjectById, updateMemory } from '@loverecap/database'
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

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createRouteHandlerClient()
    const user = await requireUser(supabase).catch(() => null)
    if (!user) return unauthorizedError()

    const body: unknown = await request.json()
    const parsed = updateMemorySchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const { memory_id, ...rawUpdates } = parsed.data
    const updates = Object.fromEntries(
      Object.entries(rawUpdates).filter(([, v]) => v !== undefined),
    ) as {
      title?: string
      short_description?: string | null
      description?: string | null
      occurred_at?: string
      emoji?: string | null
      position?: number
    }

    const memory = await getMemoryById(supabase, memory_id).catch(
      (e: { code?: string }) => {
        if (e?.code === 'PGRST116') return null
        throw e
      },
    )
    if (!memory) return notFoundError('Memory')

    const project = await getProjectById(supabase, memory.project_id).catch(
      (e: { code?: string }) => {
        if (e?.code === 'PGRST116') return null
        throw e
      },
    )
    if (!project) return notFoundError('Project')
    if (project.user_id !== user.id) return forbiddenError()

    const updated = await updateMemory(supabase, memory_id, updates)
    return ok(updated)
  } catch (error) {
    console.error('[PATCH /api/memories/update]', error)
    return serverError()
  }
}
