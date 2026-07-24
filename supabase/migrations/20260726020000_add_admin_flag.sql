-- Marks a user as an admin, allowed to access the internal /review page.
-- Not self-service: only settable via the admin/service-role client (or
-- directly in the Supabase dashboard), never through a user-facing action.

alter table profiles add column is_admin boolean not null default false;
