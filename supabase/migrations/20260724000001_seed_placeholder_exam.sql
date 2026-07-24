-- Placeholder content so the exam-selection UI has something to render
-- during development. Not a final decision on which exam ships first
-- (see PROJECT_BRIEF.md "Erste Prüfung" - still open).

insert into exams (slug, name, description, sort_order)
values (
  'fiae-platzhalter',
  'Fachinformatiker AE (Platzhalter)',
  'Vorläufiger Platzhalter zum Testen des Lern-Flows - keine finale Entscheidung.',
  0
);

insert into topics (exam_id, slug, name, sort_order)
select id, 'grundlagen-platzhalter', 'Grundlagen (Platzhalter)', 0
from exams where slug = 'fiae-platzhalter';

insert into questions (topic_id, question_text, explanation)
select topics.id,
  'Welche Aussage zu TCP ist korrekt?',
  'TCP ist verbindungsorientiert und stellt eine zuverlässige, geordnete Zustellung sicher - im Gegensatz zu UDP.'
from topics where slug = 'grundlagen-platzhalter';

insert into answer_options (question_id, option_text, is_correct, sort_order)
select questions.id, opt.option_text, opt.is_correct, opt.sort_order
from questions,
  (values
    ('TCP ist verbindungslos.', false, 0),
    ('TCP stellt eine zuverlässige, geordnete Zustellung sicher.', true, 1),
    ('TCP garantiert keine Reihenfolge der Pakete.', false, 2),
    ('TCP wird ausschließlich für Streaming verwendet.', false, 3)
  ) as opt(option_text, is_correct, sort_order)
where questions.question_text = 'Welche Aussage zu TCP ist korrekt?';
