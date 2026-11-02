-- Fourth exam: Kaufmann/-frau im Einzelhandel, the largest apprenticeship in Germany (Verkäufer/in covers the same first part).
-- Same engine, new rows only. The topics follow the exam areas; questions are
-- seeded in the following migrations. The name deliberately carries no chamber
-- name, so it cannot read like an official product of a chamber.

insert into exams (slug, name, description, is_active, sort_order)
values (
  'einzelhandel',
  'Kaufmann/-frau im Einzelhandel',
  'Übungsfragen zu Verkauf und Kundenberatung, Warenwirtschaft, Kalkulation sowie Handelsrecht und Wirtschafts- und Sozialkunde.',
  true,
  3
);

insert into topics (exam_id, slug, name, is_premium, sort_order)
select e.id, v.slug, v.name, false, v.sort_order
from exams e
join (values
  ('verkauf-kundenberatung', 'Verkauf & Kundenberatung', 0),
  ('warenwirtschaft-logistik', 'Warenwirtschaft & Logistik', 1),
  ('kalkulation-rechnungswesen', 'Kalkulation & Rechnungswesen', 2),
  ('recht-wirtschaft', 'Handelsrecht & Wirtschafts- und Sozialkunde', 3)
) as v(slug, name, sort_order) on true
where e.slug = 'einzelhandel';
