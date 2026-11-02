-- Which link a signup came from, so ad spend can be compared with real signups.
alter table profiles add column signup_source text;

-- Numbers for the admin page. Read with the service role only.
create view signup_source_stats as
select
  coalesce(signup_source, 'ohne Angabe') as source,
  count(*)::int as signups,
  count(last_activity_date)::int as active,
  (count(*) filter (where subscription_tier = 'pro'))::int as pro
from profiles
group by 1;

revoke all on signup_source_stats from public, anon, authenticated;
