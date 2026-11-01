-- Fifth exam: Fachkraft für Lagerlogistik, one of the largest apprenticeships in logistics.
-- Same engine, new rows only. The topics follow the exam areas; questions are
-- seeded in the following migrations. The name deliberately carries no chamber
-- name, so it cannot read like an official product of a chamber.

insert into exams (slug, name, description, is_active, sort_order)
values (
  'lagerlogistik',
  'Fachkraft für Lagerlogistik',
  'Übungsfragen zu Wareneingang und Lagerung, Kommissionierung und Versand, Logistikprozessen und Kennzahlen sowie Arbeitssicherheit und Wirtschafts- und Sozialkunde.',
  true,
  4
);

insert into topics (exam_id, slug, name, is_premium, sort_order)
select e.id, v.slug, v.name, false, v.sort_order
from exams e
join (values
  ('wareneingang-lagerung', 'Wareneingang & Lagerung', 0),
  ('kommissionierung-versand', 'Kommissionierung, Verpackung & Versand', 1),
  ('logistikprozesse-kennzahlen', 'Logistikprozesse & Kennzahlen', 2),
  ('arbeitssicherheit-wiso', 'Arbeitssicherheit & Wirtschafts- und Sozialkunde', 3)
) as v(slug, name, sort_order) on true
where e.slug = 'lagerlogistik';
