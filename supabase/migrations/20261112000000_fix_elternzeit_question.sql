-- Two Industriekaufmann questions had the same text. This one also claimed that
-- moving part of the parental leave needs the employer's consent, which no longer
-- applies to children born since 1 July 2015 (section 15 BEEG).
update questions
set
  question_text = 'Welche Aussagen zu Dauer und Schutz der Elternzeit treffen zu?',
  explanation = 'Der Anspruch besteht grundsätzlich bis zur Vollendung des dritten Lebensjahres des Kindes. Bis zu 24 Monate davon können auch zwischen dem dritten und dem achten Geburtstag genommen werden, und während der Elternzeit besteht ein besonderer Kündigungsschutz. Beide Elternteile müssen die Elternzeit dabei nicht gleichzeitig nehmen.'
where source_key = 'ik-wiso-m-elternzeit-anspruch';

update answer_options
set option_text = 'Bis zu 24 Monate können auch zwischen dem dritten und dem achten Geburtstag des Kindes genommen werden'
where option_text = 'Ein Anteil kann mit Zustimmung des Arbeitgebers auf einen späteren Zeitraum übertragen werden'
  and question_id = (select id from questions where source_key = 'ik-wiso-m-elternzeit-anspruch');
