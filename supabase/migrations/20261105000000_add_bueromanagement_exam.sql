-- Third exam: Kaufmann/-frau für Büromanagement, one of the largest
-- commercial apprenticeships. Same engine, new rows only. The four topics
-- follow the exam areas (information-technology office management, customer
-- relationship processes, commercial control and personnel, economics and
-- social studies). Questions are seeded in the following migrations.
-- The name deliberately carries no chamber name, so it cannot read like an
-- official IHK product.

insert into exams (slug, name, description, is_active, sort_order)
values (
  'bueromanagement',
  'Kaufmann/-frau für Büromanagement',
  'Übungsfragen zu Büroorganisation, Kundenbeziehungen, Rechnungswesen und Personal sowie Wirtschafts- und Sozialkunde.',
  true,
  2
);

insert into topics (exam_id, slug, name, is_premium, sort_order)
select e.id, v.slug, v.name, false, v.sort_order
from exams e
join (values
  ('buero-informationsmanagement', 'Büro- & Informationsmanagement', 0),
  ('kundenbeziehungsprozesse', 'Kundenbeziehungsprozesse', 1),
  ('kaufmaennische-steuerung-personal', 'Kaufmännische Steuerung & Personal', 2),
  ('wirtschafts-sozialkunde', 'Wirtschafts- & Sozialkunde', 3)
) as v(slug, name, sort_order) on true
where e.slug = 'bueromanagement';
