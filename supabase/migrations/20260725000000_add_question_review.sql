-- Content review gate: questions are drafts until a domain expert approves
-- them. Only reviewed questions are readable by the public/anon client, so
-- unreviewed drafts never reach the live app.

alter table questions add column reviewed boolean not null default false;
alter table questions add column source_key text unique;

-- Rebuild the public read policies to also require reviewed = true.
drop policy "questions readable per topic tier" on questions;
create policy "questions readable per topic tier" on questions
  for select using (
    reviewed
    and exists (
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

drop policy "answer options readable per topic tier" on answer_options;
create policy "answer options readable per topic tier" on answer_options
  for select using (
    exists (
      select 1 from questions
      join topics on topics.id = questions.topic_id
      where questions.id = answer_options.question_id
        and questions.reviewed
        and (
          not topics.is_premium
          or exists (
            select 1 from profiles
            where profiles.id = auth.uid() and profiles.subscription_tier = 'pro'
          )
        )
    )
  );
