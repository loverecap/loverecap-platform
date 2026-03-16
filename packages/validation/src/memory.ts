import { z } from 'zod'

export const createMemorySchema = z.object({
  project_id: z.string().uuid('Invalid project ID'),
  title: z.string().min(1, 'Title is required').max(120),
  short_description: z.string().max(80).optional(),
  description: z.string().max(1000).optional(),
  occurred_at: z.string().date('Must be a valid date (YYYY-MM-DD)').optional(),
  emoji: z.string().max(8).optional(),
  position: z.number().int().nonnegative().optional(),
})

export type CreateMemoryInput = z.infer<typeof createMemorySchema>

export const updateMemorySchema = z.object({
  memory_id: z.string().uuid('Invalid memory ID'),
  title: z.string().min(1).max(120).optional(),
  short_description: z.string().max(80).nullable().optional(),
  description: z.string().max(1000).nullable().optional(),
  occurred_at: z.string().date().optional(),
  emoji: z.string().max(8).nullable().optional(),
  position: z.number().int().nonnegative().optional(),
})

export type UpdateMemoryInput = z.infer<typeof updateMemorySchema>

export const reorderMemoriesSchema = z.object({
  project_id: z.string().uuid(),
  order: z
    .array(z.object({ id: z.string().uuid(), position: z.number().int().nonnegative() }))
    .min(1),
})

export type ReorderMemoriesInput = z.infer<typeof reorderMemoriesSchema>
