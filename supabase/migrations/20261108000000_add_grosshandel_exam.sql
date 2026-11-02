-- Sixth exam: Kaufmann/-frau im Groß- und Außenhandelsmanagement.
-- Same engine, new rows only. The topics follow the exam areas; questions are
-- seeded in the following migrations. The name deliberately carries no chamber
-- name, so it cannot read like an official product of a chamber.

insert into exams (slug, name, description, is_active, sort_order)
values (
  'grosshandel',
  'Kaufmann/-frau im Groß- und Außenhandelsmanagement',
  'Übungsfragen zu Sortiment und Beschaffung, Vertrieb, Außenhandel sowie kaufmännischer Steuerung und Wirtschafts- und Sozialkunde.',
  true,
  5
);

insert into topics (exam_id, slug, name, is_premium, sort_order)
select e.id, v.slug, v.name, false, v.sort_order
from exams e
join (values
  ('sortiment-beschaffung', 'Sortiment & Beschaffung', 0),
  ('vertrieb-kunden', 'Vertrieb & Kundenbeziehungen', 1),
  ('aussenhandel', 'Außenhandel', 2),
  ('steuerung-wiso', 'Kaufmännische Steuerung & Wirtschafts- und Sozialkunde', 3)
) as v(slug, name, sort_order) on true
where e.slug = 'grosshandel';
