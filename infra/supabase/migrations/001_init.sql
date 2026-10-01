-- Inspired by zooniverse/Panoptes classification storage (adapted schema, not a copy).
create extension if not exists vector;

create table if not exists objects (
  id uuid primary key default gen_random_uuid(),
  seed bigint not null,
  type text not null check (type in ('planet', 'galaxy')),
  params_json jsonb not null,
  embedding vector(512),
  status text not null default 'unlabeled' check (status in ('unlabeled', 'queued', 'labeled')),
  created_at timestamptz not null default now()
);

create table if not exists labels (
  id uuid primary key default gen_random_uuid(),
  object_id uuid not null references objects(id),
  user_id uuid not null,
  tags text[] not null,
  confidence real not null check (confidence >= 0 and confidence <= 1),
  created_at timestamptz not null default now()
);

create table if not exists models (
  id uuid primary key default gen_random_uuid(),
  version int not null,
  weights_path text,
  metrics_json jsonb not null default '{}'::jsonb,
  trained_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  type text not null,
  payload_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table objects enable row level security;
alter table labels enable row level security;
alter table models enable row level security;
alter table events enable row level security;

create policy objects_read on objects for select using (true);
create policy objects_insert on objects for insert with check (true);
create policy objects_update on objects for update using (true);
create policy labels_read on labels for select using (true);
create policy labels_insert on labels for insert with check (auth.uid() = user_id);
create policy models_read on models for select using (true);
create policy events_insert on events for insert with check (true);
