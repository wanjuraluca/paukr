-- Core content model: Exam > Topic > Question > Answer option
-- Designed so a new exam is just new rows, never a schema change.

create table exams (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table topics (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references exams (id) on delete cascade,
  slug text not null,
  name text not null,
  is_premium boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  unique (exam_id, slug)
);

create table questions (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references topics (id) on delete cascade,
  question_text text not null,
  explanation text,
  difficulty smallint not null default 1 check (difficulty between 1 and 5),
  created_at timestamptz not null default now()
);

create table answer_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions (id) on delete cascade,
  option_text text not null,
  is_correct boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index questions_topic_id_idx on questions (topic_id);
create index answer_options_question_id_idx on answer_options (question_id);
create index topics_exam_id_idx on topics (exam_id);

-- One row per registered user, extends auth.users. Also carries the
-- Free/Pro tier since Stripe status gates content access via RLS below.
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'pro')),
  stripe_customer_id text,
  xp_total int not null default 0,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_activity_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

create function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on profiles
  for each row execute procedure set_updated_at();

-- Aggregated per-topic progress bar, updated as the user practices.
create table user_topic_progress (
  user_id uuid not null references profiles (id) on delete cascade,
  topic_id uuid not null references topics (id) on delete cascade,
  questions_answered int not null default 0,
  questions_correct int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, topic_id)
);

-- Practice-mode answer log (history, later spaced-repetition candidate).
create table question_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  question_id uuid not null references questions (id) on delete cascade,
  selected_option_id uuid references answer_options (id) on delete set null,
  is_correct boolean not null,
  answered_at timestamptz not null default now()
);

create index question_attempts_user_id_idx on question_attempts (user_id);

-- Timed exam-simulation runs, scored at the end.
create table exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  exam_id uuid not null references exams (id) on delete cascade,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  time_limit_seconds int not null,
  score_correct int,
  score_total int
);

create table exam_attempt_answers (
  id uuid primary key default gen_random_uuid(),
  exam_attempt_id uuid not null references exam_attempts (id) on delete cascade,
  question_id uuid not null references questions (id) on delete cascade,
  selected_option_id uuid references answer_options (id) on delete set null,
  is_correct boolean not null
);

create index exam_attempts_user_id_idx on exam_attempts (user_id);
create index exam_attempt_answers_attempt_id_idx on exam_attempt_answers (exam_attempt_id);

-- Row Level Security -----------------------------------------------------

alter table exams enable row level security;
alter table topics enable row level security;
alter table questions enable row level security;
alter table answer_options enable row level security;
alter table profiles enable row level security;
alter table user_topic_progress enable row level security;
alter table question_attempts enable row level security;
alter table exam_attempts enable row level security;
alter table exam_attempt_answers enable row level security;

-- Content tables: readable by anyone for free topics; premium topics
-- require an authenticated profile with subscription_tier = 'pro'.
create policy "exams are publicly readable" on exams
  for select using (is_active);

create policy "topics readable per tier" on topics
  for select using (
    not is_premium
    or exists (
      select 1 from profiles
      where profiles.id = auth.uid() and profiles.subscription_tier = 'pro'
    )
  );

create policy "questions readable per topic tier" on questions
  for select using (
    exists (
      select 1 from topics
      where topics.id = questions.topic_id
        and (
          not topics.is_premium
          or exists (
            select 1 from profiles
            where profiles.id = auth.uid() and profiles.subscription_tier = 'pro'
          )
        )
    )
  );

create policy "answer options readable per topic tier" on answer_options
  for select using (
    exists (
      select 1 from questions
      join topics on topics.id = questions.topic_id
      where questions.id = answer_options.question_id
        and (
          not topics.is_premium
          or exists (
            select 1 from profiles
            where profiles.id = auth.uid() and profiles.subscription_tier = 'pro'
          )
        )
    )
  );

-- User-owned tables: strictly self-access only.
create policy "users read own profile" on profiles
  for select using (auth.uid() = id);

create policy "users update own profile" on profiles
  for update using (auth.uid() = id);

create policy "users read own topic progress" on user_topic_progress
  for select using (auth.uid() = user_id);

create policy "users upsert own topic progress" on user_topic_progress
  for insert with check (auth.uid() = user_id);

create policy "users update own topic progress" on user_topic_progress
  for update using (auth.uid() = user_id);

create policy "users read own question attempts" on question_attempts
  for select using (auth.uid() = user_id);

create policy "users insert own question attempts" on question_attempts
  for insert with check (auth.uid() = user_id);

create policy "users read own exam attempts" on exam_attempts
  for select using (auth.uid() = user_id);

create policy "users insert own exam attempts" on exam_attempts
  for insert with check (auth.uid() = user_id);

create policy "users update own exam attempts" on exam_attempts
  for update using (auth.uid() = user_id);

create policy "users read own exam attempt answers" on exam_attempt_answers
  for select using (
    exists (
      select 1 from exam_attempts
      where exam_attempts.id = exam_attempt_answers.exam_attempt_id
        and exam_attempts.user_id = auth.uid()
    )
  );

create policy "users insert own exam attempt answers" on exam_attempt_answers
  for insert with check (
    exists (
      select 1 from exam_attempts
      where exam_attempts.id = exam_attempt_answers.exam_attempt_id
        and exam_attempts.user_id = auth.uid()
    )
  );
