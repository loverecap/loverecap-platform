import { z } from 'zod'

// ──────────────────────────────────────────────
// Create
// ──────────────────────────────────────────────

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(120),
  partner_name_1: z.string().min(1, 'Partner 1 name is required').max(60),
  partner_name_2: z.string().min(1, 'Partner 2 name is required').max(60),
  relationship_start_date: z.string().date('Must be a valid date (YYYY-MM-DD)'),
  theme_id: z.string().uuid().optional(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>

// ──────────────────────────────────────────────
// Update
// ──────────────────────────────────────────────

export const updateProjectSchema = z.object({
  project_id: z.string().uuid('Invalid project ID'),
  title: z.string().min(1).max(120).optional(),
  partner_name_1: z.string().min(1).max(60).optional(),
  partner_name_2: z.string().min(1).max(60).optional(),
  relationship_start_date: z.string().date().optional(),
  theme_id: z.string().uuid().nullable().optional(),
  cover_asset_id: z.string().uuid().nullable().optional(),
  final_message: z.string().max(1000).nullable().optional(),
})

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>

// ──────────────────────────────────────────────
// Publish
// ──────────────────────────────────────────────

export const publishProjectSchema = z.object({
  project_id: z.string().uuid('Invalid project ID'),
})

export type PublishProjectInput = z.infer<typeof publishProjectSchema>
