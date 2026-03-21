import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { deleteMemory, getMemoryById, deleteAsset } from '@loverecap/database'
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

const schema = z.object({
  memory_id: z.string().uuid(),
})

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createRouteHandlerClient()
    const user = await requireUser(supabase).catch(() => null)
    if (!user) return unauthorizedError()

    const body: unknown = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const { memory_id } = parsed.data

    // Fetch memory with its assets to verify ownership
    const memory = await getMemoryById(supabase, memory_id).catch(() => null)
    if (!memory) return notFoundError('Memory')

    // Verify user owns this memory via its project
    const { data: project } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', memory.project_id)
      .single()

    if (!project || project.user_id !== user.id) return forbiddenError()

    // Delete assets from storage + DB first (storage won't cascade on memory delete)
    const assets = Array.isArray(memory.assets) ? memory.assets : []
    await Promise.all(assets.map((asset: { id: string }) => deleteAsset(supabase, asset.id)))

    // Delete the memory row (DB cascade will clean up any remaining asset rows)
    await deleteMemory(supabase, memory_id)

    return ok({ deleted: true })
  } catch (error) {
    console.error('[DELETE /api/memories/delete]', error)
    return serverError()
  }
}
