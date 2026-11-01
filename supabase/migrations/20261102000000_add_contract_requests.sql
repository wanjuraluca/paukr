-- Withdrawals and cancellations sent through the public forms. Kept as proof of
-- receipt. RLS stays on without policies: only the service role can read or write.
create table contract_requests (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('withdrawal', 'cancellation')),
  name text not null,
  email text not null,
  contract text not null,
  details text,
  created_at timestamptz not null default now(),
  confirmation_sent boolean not null default false,
  processed_at timestamptz
);

create index contract_requests_email_created_idx on contract_requests (lower(email), created_at);

alter table contract_requests enable row level security;

-- Product names must not read like a product of the chambers themselves.
update exams
set name = 'Fachinformatiker/in Anwendungsentwicklung',
    description = 'Übungsfragen zur Vorbereitung auf die Abschlussprüfung.'
where slug = 'fiae-ae';

update exams
set name = 'Industriekaufmann/-frau',
    description = 'Übungsfragen zu Geschäftsprozessen, Rechnungswesen, Personalwirtschaft sowie Wirtschafts- und Sozialkunde.'
where name = 'IHK Industriekaufmann/-frau';
