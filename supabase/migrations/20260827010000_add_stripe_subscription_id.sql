-- Stores the active Stripe subscription id so the webhook can find the
-- profile again on cancellation without relying only on the customer id.
-- Not self-service: only ever written by the Stripe webhook (service-role).

alter table profiles add column stripe_subscription_id text;
