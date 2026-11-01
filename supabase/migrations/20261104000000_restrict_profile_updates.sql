-- The "users update own profile" policy only limits WHICH row a user may
-- update, not which columns. Without column privileges any signed-in user
-- could call the API with the public anon key and set subscription_tier =
-- 'pro', is_admin = true or someone else's stripe_customer_id on their own
-- row. Restrict direct updates to the columns the app writes with the user's
-- session; everything billing- or role-related is written server-side with
-- the service-role client only.

revoke update on profiles from anon, authenticated;

grant update (display_name, xp_total, current_streak, longest_streak, last_activity_date)
  on profiles to authenticated;
