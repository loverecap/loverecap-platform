-- ─────────────────────────────────────────────────────────────────────────────
-- 0004_music_youtube.sql
-- Migrate music storage from file-upload to YouTube-based selection
-- ─────────────────────────────────────────────────────────────────────────────

-- Add YouTube columns to the existing project_music table
ALTER TABLE project_music
  ADD COLUMN IF NOT EXISTS provider      text NOT NULL DEFAULT 'youtube',
  ADD COLUMN IF NOT EXISTS video_id      text,
  ADD COLUMN IF NOT EXISTS thumbnail_url text,
  ADD COLUMN IF NOT EXISTS duration      text;

-- Backfill legacy rows so provider reflects how they were originally stored
UPDATE project_music
  SET provider = 'file'
  WHERE storage_path IS NOT NULL AND provider = 'youtube';

UPDATE project_music
  SET provider = 'external_url'
  WHERE external_url IS NOT NULL AND storage_path IS NULL AND provider = 'youtube';
