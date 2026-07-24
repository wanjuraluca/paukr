-- Spaced-repetition state (SM-2) per user+question. One row is created the
-- first time a user answers a question; each subsequent answer updates the
-- ease factor, interval and due date so the app can schedule reviews and
-- surface questions the user keeps getting wrong.

create table question_reviews (
  user_id uuid not null references profiles (id) on delete cascade,
  question_id uuid not null references questions (id) on delete cascade,
  -- SM-2 core state.
  ease_factor real not null default 2.5,
  interval_days real not null default 0,
  repetitions int not null default 0,
  due_at timestamptz not null default now(),
  -- Lightweight stats used for the "practice wrong questions" mode and UI.
  last_reviewed_at timestamptz,
  last_correct boolean,
  total_attempts int not null default 0,
  total_correct int not null default 0,
  consecutive_wrong int not null default 0,
  primary key (user_id, question_id)
);

-- Fast lookups for "what's due for this user" and "what did they get wrong".
create index question_reviews_due_idx on question_reviews (user_id, due_at);
create index question_reviews_wrong_idx on question_reviews (user_id, last_correct);

alter table question_reviews enable row level security;

create policy "users read own question reviews" on question_reviews
  for select using (auth.uid() = user_id);

create policy "users insert own question reviews" on question_reviews
  for insert with check (auth.uid() = user_id);

create policy "users update own question reviews" on question_reviews
  for update using (auth.uid() = user_id);
