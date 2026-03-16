-- 0005_add_short_description.sql
-- Adds short_description column to memories for photo card preview text.
-- Nullable for full backward compatibility with existing memories.

ALTER TABLE public.memories
  ADD COLUMN IF NOT EXISTS short_description TEXT;

ALTER TABLE public.memories
  ADD CONSTRAINT memories_short_description_length
  CHECK (short_description IS NULL OR char_length(short_description) <= 80);
