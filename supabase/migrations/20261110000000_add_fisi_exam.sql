-- Eighth exam: Fachinformatiker/in Systemintegration, the system-administration counterpart to Anwendungsentwicklung.
-- Same engine, new rows only. The topics follow the exam areas; questions are
-- seeded in the following migrations. The name deliberately carries no chamber
-- name, so it cannot read like an official product of a chamber.

insert into exams (slug, name, description, is_active, sort_order)
values (
  'fisi',
  'Fachinformatiker/in Systemintegration',
  'Übungsfragen zu Netzwerktechnik, Betriebssystemen und Servern, IT-Sicherheit sowie IT-Service, Projekten und Wirtschafts- und Sozialkunde.',
  true,
  7
);

insert into topics (exam_id, slug, name, is_premium, sort_order)
select e.id, v.slug, v.name, false, v.sort_order
from exams e
join (values
  ('netzwerktechnik', 'Netzwerktechnik', 0),
  ('systeme-server', 'Betriebssysteme, Server & Virtualisierung', 1),
  ('it-sicherheit', 'IT-Sicherheit & Datenschutz', 2),
  ('service-projekte-wiso', 'IT-Service, Projekte & Wirtschafts- und Sozialkunde', 3)
) as v(slug, name, sort_order) on true
where e.slug = 'fisi';
