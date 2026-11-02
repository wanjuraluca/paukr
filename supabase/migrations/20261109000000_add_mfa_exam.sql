-- Seventh exam: Medizinische/r Fachangestellte/r, one of the largest apprenticeships, examined by the medical chambers.
-- Same engine, new rows only. The topics follow the exam areas; questions are
-- seeded in the following migrations. The name deliberately carries no chamber
-- name, so it cannot read like an official product of a chamber.

insert into exams (slug, name, description, is_active, sort_order)
values (
  'mfa',
  'Medizinische/r Fachangestellte/r',
  'Übungsfragen zu Anatomie und Krankheitslehre, Behandlungsassistenz und Notfall, Praxisorganisation und Abrechnung sowie Hygiene und Wirtschafts- und Sozialkunde.',
  true,
  6
);

insert into topics (exam_id, slug, name, is_premium, sort_order)
select e.id, v.slug, v.name, false, v.sort_order
from exams e
join (values
  ('anatomie-krankheitslehre', 'Anatomie & Krankheitslehre', 0),
  ('behandlungsassistenz-notfall', 'Behandlungsassistenz, Labor & Notfall', 1),
  ('praxisorganisation-abrechnung', 'Praxisorganisation & Abrechnung', 2),
  ('hygiene-wiso', 'Hygiene & Wirtschafts- und Sozialkunde', 3)
) as v(slug, name, sort_order) on true
where e.slug = 'mfa';
