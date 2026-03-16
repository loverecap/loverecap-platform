import { z } from 'zod'

export const createStorySchema = z.object({
  title: z.string().min(1).max(120),
  partner_name_1: z.string().min(1).max(60),
  partner_name_2: z.string().min(1).max(60),
  relationship_start_date: z.string().date(),
})

export const createStoryEventSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  occurred_at: z.string().date(),
  position: z.number().int().nonnegative(),
})

export type CreateStoryInput = z.infer<typeof createStorySchema>
export type CreateStoryEventInput = z.infer<typeof createStoryEventSchema>
