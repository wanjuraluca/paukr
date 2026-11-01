-- Errors in questions reported by learners. RLS stays on without policies:
-- reads and writes go through server actions using the service role.
create table question_reports (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  message text not null,
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index question_reports_open_idx on question_reports (created_at) where resolved_at is null;

alter table question_reports enable row level security;
