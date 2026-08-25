-- Second exam: Industriekaufmann/-frau. Same engine, new rows only, per the
-- "one engine, multiple exams as swappable content" design. Content itself
-- (topics, questions, answer_options) is seeded in later migrations, once
-- written and dedupe-checked per topic.

insert into exams (slug, name, description, is_active, sort_order)
values (
  'industriekaufmann',
  'IHK Industriekaufmann/-frau',
  'Kaufmännischer Ausbildungsberuf in Industriebetrieben: Geschäftsprozesse steuern, Rechnungswesen, Personalwirtschaft und Wirtschafts- und Sozialkunde.',
  true,
  1
);

insert into topics (exam_id, slug, name, is_premium, sort_order)
select e.id, v.slug, v.name, false, v.sort_order
from exams e
join (values
  ('geschaeftsprozesse', 'Geschäftsprozesse', 0),
  ('kaufmaennische-steuerung', 'Kaufmännische Steuerung & Kontrolle', 1),
  ('personalwirtschaft', 'Personalwirtschaft', 2),
  ('wirtschafts-sozialkunde', 'Wirtschafts- & Sozialkunde', 3)
) as v(slug, name, sort_order) on true
where e.slug = 'industriekaufmann';
