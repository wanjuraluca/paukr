-- Freemium try limit: free-tier users get 3 total learning-session starts per
-- exam (practice sessions and exam simulations share one counter), then hit a
-- hard paywall until they upgrade to Pro. Pro users are never limited.

-- Practice mode had no server-side "session start" event before this, it was
-- built client-side from question_attempts rows. That means an abandoned
-- practice run (started but never answered) would not have counted toward
-- anything. We add an explicit row per session start so it counts even if the
-- user never answers a question. Exam-simulation starts are already recorded
-- as one row per run in exam_attempts, so that table is reused as-is instead
-- of being duplicated here.
create table practice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  exam_id uuid not null references exams (id) on delete cascade,
  started_at timestamptz not null default now()
);

create index practice_sessions_user_exam_idx on practice_sessions (user_id, exam_id);

alter table practice_sessions enable row level security;

create policy "users read own practice sessions" on practice_sessions
  for select using (auth.uid() = user_id);

create policy "users insert own practice sessions" on practice_sessions
  for insert with check (auth.uid() = user_id);

-- Server-side guarantee behind the app-level check in actions.ts (defense in
-- depth, this is a paid product and the actions could otherwise be called
-- directly). Counts practice_sessions + exam_attempts for the same
-- user/exam and rejects a new row past the limit, unless the user is Pro.
create function enforce_free_try_limit()
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
  into tries_used;

  if tries_used >= free_try_limit then
    raise exception 'free_try_limit_reached' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

create trigger practice_sessions_enforce_try_limit
  before insert on practice_sessions
  for each row execute procedure enforce_free_try_limit();

create trigger exam_attempts_enforce_try_limit
  before insert on exam_attempts
  for each row execute procedure enforce_free_try_limit();
