import { type NextRequest } from 'next/server'
import { updateProjectSchema } from '@loverecap/validation'
import { updateProject } from '@loverecap/database'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth'
import {
  ok,
  validationError,
  unauthorizedError,
  notFoundError,
  serverError,
} from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createRouteHandlerClient()
    const user = await requireUser(supabase).catch(() => null)
    if (!user) return unauthorizedError()

    const body: unknown = await request.json()
    const parsed = updateProjectSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const { project_id, ...fields } = parsed.data

    const patch = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined),
    )

    if (Object.keys(patch).length === 0) {
      return ok({ message: 'No fields to update' })
    }

    const project = await updateProject(supabase, project_id, user.id, patch).catch(
      (e: { code?: string }) => {
        if (e?.code === 'PGRST116') return null
        throw e
      },
    )

    if (!project) return notFoundError('Project')

    return ok(project)
  } catch (error) {
    console.error('[POST /api/projects/update]', error)
    return serverError()
  }
}
