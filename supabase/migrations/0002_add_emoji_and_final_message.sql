-- Add emoji to memories
ALTER TABLE public.memories
  ADD COLUMN IF NOT EXISTS emoji TEXT;

-- Add final_message to projects
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS final_message TEXT;
