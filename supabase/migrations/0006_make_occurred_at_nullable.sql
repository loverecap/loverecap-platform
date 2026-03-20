-- Make occurred_at optional on memories
ALTER TABLE public.memories
  ALTER COLUMN occurred_at DROP NOT NULL;
