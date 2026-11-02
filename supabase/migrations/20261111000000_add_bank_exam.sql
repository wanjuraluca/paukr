-- Ninth exam: Bankkaufmann/-frau.
-- Same engine, new rows only. The topics follow the exam areas; questions are
-- seeded in the following migrations. The name deliberately carries no chamber
-- name, so it cannot read like an official product of a chamber.

insert into exams (slug, name, description, is_active, sort_order)
values (
  'bank',
  'Bankkaufmann/-frau',
  'Übungsfragen zu Konto und Zahlungsverkehr, Geld- und Vermögensanlage, Krediten und Finanzierung sowie Bankbetrieb, Recht und Wirtschafts- und Sozialkunde.',
  true,
  8
);

insert into topics (exam_id, slug, name, is_premium, sort_order)
select e.id, v.slug, v.name, false, v.sort_order
from exams e
join (values
  ('konto-zahlungsverkehr', 'Konto & Zahlungsverkehr', 0),
  ('geld-vermoegensanlage', 'Geld- & Vermögensanlage', 1),
  ('kredite-finanzierung', 'Kredite & Finanzierung', 2),
  ('bankbetrieb-wiso', 'Bankbetrieb, Recht & Wirtschafts- und Sozialkunde', 3)
) as v(slug, name, sort_order) on true
where e.slug = 'bank';
