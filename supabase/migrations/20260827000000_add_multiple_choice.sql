-- Adds real multiple-choice support: a question can now have more than one
-- correct answer option, selected via checkboxes in the UI, correct only if
-- the user's selected set matches the correct set exactly.
--
-- The existing question_attempts.selected_option_id and
-- exam_attempt_answers.selected_option_id columns stay untouched and keep
-- working exactly as before for question_type = 'single' (single uuid FK).
-- For question_type = 'multiple' those columns stay null and the full set of
-- chosen options is recorded in the two new join tables below instead.

alter table questions
  add column question_type text not null default 'single'
  check (question_type in ('single', 'multiple'));

-- One row per selected option on a practice attempt, only used when the
-- attempt's question is multiple-choice.
create table question_attempt_selections (
  attempt_id uuid not null references question_attempts (id) on delete cascade,
  option_id uuid not null references answer_options (id) on delete cascade,
  primary key (attempt_id, option_id)
);

-- Same idea for exam-simulation answers.
create table exam_attempt_answer_selections (
  answer_id uuid not null references exam_attempt_answers (id) on delete cascade,
  option_id uuid not null references answer_options (id) on delete cascade,
  primary key (answer_id, option_id)
);

alter table question_attempt_selections enable row level security;
alter table exam_attempt_answer_selections enable row level security;

-- Self-access only, same pattern as question_attempts / exam_attempt_answers:
-- reachable only through an attempt/answer row owned by the current user.
create policy "users read own question attempt selections" on question_attempt_selections
  for select using (
    exists (
      select 1 from question_attempts
      where question_attempts.id = question_attempt_selections.attempt_id
        and question_attempts.user_id = auth.uid()
    )
  );

create policy "users insert own question attempt selections" on question_attempt_selections
  for insert with check (
    exists (
      select 1 from question_attempts
      where question_attempts.id = question_attempt_selections.attempt_id
        and question_attempts.user_id = auth.uid()
    )
  );

create policy "users read own exam attempt answer selections" on exam_attempt_answer_selections
  for select using (
    exists (
      select 1 from exam_attempt_answers
      join exam_attempts on exam_attempts.id = exam_attempt_answers.exam_attempt_id
      where exam_attempt_answers.id = exam_attempt_answer_selections.answer_id
        and exam_attempts.user_id = auth.uid()
    )
  );

create policy "users insert own exam attempt answer selections" on exam_attempt_answer_selections
  for insert with check (
    exists (
      select 1 from exam_attempt_answers
      join exam_attempts on exam_attempts.id = exam_attempt_answers.exam_attempt_id
      where exam_attempt_answers.id = exam_attempt_answer_selections.answer_id
        and exam_attempts.user_id = auth.uid()
    )
  );
