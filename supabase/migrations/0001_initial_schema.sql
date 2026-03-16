-- ============================================================
-- LoveRecap — Initial Schema
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- Enums
-- ============================================================

CREATE TYPE public.project_status AS ENUM (
  'draft',
  'awaiting_payment',
  'paid',
  'pending_manual_creation',
  'processing',
  'published',
  'delivery_sent',
  'archived',
  'deleted'
);

CREATE TYPE public.payment_status AS ENUM (
  'pending',
  'approved',
  'rejected',
  'cancelled',
  'refunded'
);

CREATE TYPE public.asset_type AS ENUM (
  'image',
  'video'
);

-- ============================================================
-- Themes (no FK dependencies — define first)
-- ============================================================

CREATE TABLE public.themes (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL UNIQUE,
  description TEXT,
  preview_url TEXT,
  is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active themes"
  ON public.themes FOR SELECT
  USING (is_active = TRUE);

-- ============================================================
-- Projects
-- ============================================================

CREATE TABLE public.projects (
  id                      UUID                   PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID                   NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title                   TEXT                   NOT NULL,
  slug                    TEXT                   NOT NULL UNIQUE,
  status                  public.project_status  NOT NULL DEFAULT 'draft',
  partner_name_1          TEXT                   NOT NULL,
  partner_name_2          TEXT                   NOT NULL,
  relationship_start_date DATE                   NOT NULL,
  theme_id                UUID                   REFERENCES public.themes(id) ON DELETE SET NULL,
  cover_asset_id          UUID,                  -- FK added after assets table
  published_at            TIMESTAMPTZ,
  created_at              TIMESTAMPTZ            NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ            NOT NULL DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Users see their own projects OR any published project
CREATE POLICY "Users can view own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view published projects"
  ON public.projects FOR SELECT
  USING (status = 'published');

CREATE POLICY "Users can insert own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================
-- Memories (timeline events)
-- ============================================================

CREATE TABLE public.memories (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID        NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  description TEXT,
  occurred_at DATE        NOT NULL,
  position    INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage memories of own projects"
  ON public.memories FOR ALL
  USING (
    project_id IN (
      SELECT id FROM public.projects WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- Assets (photos / videos stored in Supabase Storage)
-- ============================================================

CREATE TABLE public.assets (
  id             UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id     UUID               NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  memory_id      UUID               REFERENCES public.memories(id) ON DELETE SET NULL,
  storage_path   TEXT               NOT NULL,
  storage_bucket TEXT               NOT NULL DEFAULT 'project-assets',
  mime_type      TEXT               NOT NULL,
  size_bytes     INTEGER            NOT NULL,
  asset_type     public.asset_type  NOT NULL DEFAULT 'image',
  width          INTEGER,
  height         INTEGER,
  created_at     TIMESTAMPTZ        NOT NULL DEFAULT NOW()
);

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage assets of own projects"
  ON public.assets FOR ALL
  USING (
    project_id IN (
      SELECT id FROM public.projects WHERE user_id = auth.uid()
    )
  );

-- Now that assets exists, add cover_asset_id FK
ALTER TABLE public.projects
  ADD CONSTRAINT projects_cover_asset_id_fkey
  FOREIGN KEY (cover_asset_id) REFERENCES public.assets(id) ON DELETE SET NULL;

-- ============================================================
-- Payments
-- ============================================================

CREATE TABLE public.payments (
  id                  UUID                  PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id          UUID                  NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id             UUID                  NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider            TEXT                  NOT NULL DEFAULT 'mercado_pago',
  provider_payment_id TEXT,
  status              public.payment_status NOT NULL DEFAULT 'pending',
  amount_cents        INTEGER               NOT NULL,
  currency            TEXT                  NOT NULL DEFAULT 'BRL',
  metadata            JSONB,
  created_at          TIMESTAMPTZ           NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ           NOT NULL DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================
-- Event Logs (audit trail)
-- ============================================================

CREATE TABLE public.event_logs (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID        REFERENCES public.projects(id) ON DELETE SET NULL,
  user_id    UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  event      TEXT        NOT NULL,
  payload    JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.event_logs ENABLE ROW LEVEL SECURITY;

-- Only service role reads event logs; no user-facing policy needed.

-- ============================================================
-- Leads (email capture — no auth required)
-- ============================================================

CREATE TABLE public.leads (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT        NOT NULL UNIQUE,
  source     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert a lead"
  ON public.leads FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_projects_user_id   ON public.projects(user_id);
CREATE INDEX idx_projects_slug      ON public.projects(slug);
CREATE INDEX idx_projects_status    ON public.projects(status);

CREATE INDEX idx_memories_project_id ON public.memories(project_id);
CREATE INDEX idx_memories_position   ON public.memories(project_id, position);

CREATE INDEX idx_assets_project_id  ON public.assets(project_id);
CREATE INDEX idx_assets_memory_id   ON public.assets(memory_id);

CREATE INDEX idx_payments_project_id ON public.payments(project_id);
CREATE INDEX idx_payments_user_id    ON public.payments(user_id);
CREATE INDEX idx_payments_provider   ON public.payments(provider_payment_id);

CREATE INDEX idx_event_logs_project_id ON public.event_logs(project_id);
CREATE INDEX idx_event_logs_user_id    ON public.event_logs(user_id);

-- ============================================================
-- updated_at trigger
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_memories_updated_at
  BEFORE UPDATE ON public.memories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Storage — bucket and policies
-- (Execute after enabling the Storage extension)
-- ============================================================

-- Bucket: project-assets (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-assets', 'project-assets', false)
ON CONFLICT DO NOTHING;

-- Storage path convention: {user_id}/{project_id}/{filename}

CREATE POLICY "Users can upload to own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'project-assets'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can read own assets"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'project-assets'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own assets"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'project-assets'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Published project assets are readable by anyone"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'project-assets'
    AND EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.status = 'published'
      AND p.user_id::text = (storage.foldername(name))[1]
    )
  );

-- ============================================================
-- Seed — default themes
-- ============================================================

INSERT INTO public.themes (name, description, is_active) VALUES
  ('classic',  'Timeless and elegant with soft neutral tones.',   true),
  ('modern',   'Clean and minimal with bold typography.',          true),
  ('romantic', 'Warm pinks and florals for a romantic feel.',      true);
