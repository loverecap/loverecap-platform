-- 0007_add_engagement.sql
-- Adds view_count to projects and story_reactions table for engagement features.

-- View counter on projects
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS view_count INTEGER NOT NULL DEFAULT 0;

-- Reactions table (public, no auth needed)
CREATE TABLE IF NOT EXISTS public.story_reactions (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  emoji       TEXT        NOT NULL,
  count       INTEGER     NOT NULL DEFAULT 1,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT story_reactions_project_emoji_unique UNIQUE(project_id, emoji),
  CONSTRAINT story_reactions_emoji_check CHECK (emoji IN ('❤️', '😭', '🥰', '🔥'))
);

ALTER TABLE public.story_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "story_reactions_public_read"
  ON public.story_reactions FOR SELECT USING (true);

-- Atomic view count increment (SECURITY DEFINER runs as postgres, bypasses RLS)
CREATE OR REPLACE FUNCTION public.increment_view_count(p_project_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE public.projects
  SET view_count = view_count + 1
  WHERE id = p_project_id
  RETURNING view_count INTO new_count;
  RETURN COALESCE(new_count, 0);
END;
$$;

-- Atomic reaction upsert (insert 1 or increment existing)
CREATE OR REPLACE FUNCTION public.upsert_reaction(p_project_id UUID, p_emoji TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  INSERT INTO public.story_reactions (project_id, emoji, count)
  VALUES (p_project_id, p_emoji, 1)
  ON CONFLICT (project_id, emoji)
  DO UPDATE SET count = story_reactions.count + 1, updated_at = NOW()
  RETURNING count INTO new_count;
  RETURN COALESCE(new_count, 0);
END;
$$;
