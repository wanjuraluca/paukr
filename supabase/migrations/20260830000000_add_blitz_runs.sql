-- Blitz: the third learning mode, a timed roguelike run. One run = one row.
-- The score of a run is its depth (questions answered), correct_count is
-- tracked separately so the summary can show both.
create table blitz_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  exam_id uuid not null references exams (id) on delete cascade,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  depth int not null default 0,
  correct_count int not null default 0,
  created_at timestamptz not null default now()
);

create index blitz_runs_user_exam_idx on blitz_runs (user_id, exam_id);

alter table blitz_runs enable row level security;

create policy "users read own blitz runs" on blitz_runs
  for select using (auth.uid() = user_id);

create policy "users insert own blitz runs" on blitz_runs
  for insert with check (auth.uid() = user_id);

create policy "users update own blitz runs" on blitz_runs
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- A Blitz run is a learning-session start like any other, so it joins the same
-- shared free-tier counter instead of opening a hole next to the paywall. The
-- trigger function is replaced to count all three tables.
create or replace function enforce_free_try_limit()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  tier text;
  tries_used int;
  free_try_limit constant int := 3;
begin
  select subscription_tier into tier from profiles where id = new.user_id;

  if tier = 'pro' then
    return new;
  end if;

  select
    (select count(*) from practice_sessions where user_id = new.user_id and exam_id = new.exam_id)
    + (select count(*) from exam_attempts where user_id = new.user_id and exam_id = new.exam_id)
    + (select count(*) from blitz_runs where user_id = new.user_id and exam_id = new.exam_id)
  into tries_used;

  if tries_used >= free_try_limit then
    raise exception 'free_try_limit_reached' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

create trigger blitz_runs_enforce_try_limit
  before insert on blitz_runs
  for each row execute procedure enforce_free_try_limit();
