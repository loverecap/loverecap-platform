-- ─────────────────────────────────────────────────────────────────
-- Phase 2: Music Player
-- ─────────────────────────────────────────────────────────────────

create table if not exists project_music (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references projects(id) on delete cascade,
  track_title  text not null,
  artist_name  text,
  storage_path text,       -- null when using external_url
  external_url text,       -- null when stored in Supabase Storage
  created_at   timestamptz not null default now()
);

create unique index if not exists project_music_project_id_key
  on project_music(project_id);

-- RLS
alter table project_music enable row level security;

-- Owners can manage their own music rows
create policy "owners manage project_music"
  on project_music
  for all
  using (
    project_id in (
      select id from projects where user_id = auth.uid()
    )
  );

-- Anyone can read music for published projects
create policy "public read published project_music"
  on project_music
  for select
  using (
    project_id in (
      select id from projects where status = 'published'
    )
  );


-- ─────────────────────────────────────────────────────────────────
-- Phase 3: Hidden Surprises
-- ─────────────────────────────────────────────────────────────────

create table if not exists hidden_surprises (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references projects(id) on delete cascade,
  memory_id    uuid references memories(id) on delete set null,
  message      text not null,
  emoji        text not null default '💌',
  position     int  not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists hidden_surprises_project_id_idx
  on hidden_surprises(project_id);

alter table hidden_surprises enable row level security;

create policy "owners manage hidden_surprises"
  on hidden_surprises
  for all
  using (
    project_id in (
      select id from projects where user_id = auth.uid()
    )
  );

create policy "public read published hidden_surprises"
  on hidden_surprises
  for select
  using (
    project_id in (
      select id from projects where status = 'published'
    )
  );


-- ─────────────────────────────────────────────────────────────────
-- Phase 4: Future Messages
-- ─────────────────────────────────────────────────────────────────

create table if not exists future_messages (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references projects(id) on delete cascade,
  message      text not null,
  reveal_at    timestamptz not null,
  hint_text    text,         -- e.g. "Abra no nosso aniversário"
  created_at   timestamptz not null default now()
);

create unique index if not exists future_messages_project_id_key
  on future_messages(project_id);

alter table future_messages enable row level security;

create policy "owners manage future_messages"
  on future_messages
  for all
  using (
    project_id in (
      select id from projects where user_id = auth.uid()
    )
  );

create policy "public read published future_messages"
  on future_messages
  for select
  using (
    project_id in (
      select id from projects where status = 'published'
    )
  );
