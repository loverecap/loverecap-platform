import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { deleteAsset, getAssetsByProject } from '@loverecap/database'
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
  asset_id: z.string().uuid(),
})

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createRouteHandlerClient()
    const user = await requireUser(supabase).catch(() => null)
    if (!user) return unauthorizedError()

    const body: unknown = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const { asset_id } = parsed.data

    // Fetch asset to verify ownership via its project
    const { data: asset, error: fetchError } = await supabase
      .from('assets')
      .select('id, project_id, projects(user_id)')
      .eq('id', asset_id)
      .single()

    if (fetchError || !asset) return notFoundError('Asset')

    const projectUserId = (asset.projects as { user_id: string } | null)?.user_id
    if (projectUserId !== user.id) return forbiddenError()

    await deleteAsset(supabase, asset_id)

    return ok({ deleted: true })
  } catch (error) {
    console.error('[DELETE /api/uploads/delete]', error)
    return serverError()
  }
}
