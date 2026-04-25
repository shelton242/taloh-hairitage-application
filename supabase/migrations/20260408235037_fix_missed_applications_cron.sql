/*
  # Fix pg_cron job to use direct project URL

  ## Summary
  Updates the cron job to call the check-missed-applications edge function
  using the project's Supabase URL directly, since the function uses
  SUPABASE_SERVICE_ROLE_KEY internally and the Authorization header just
  needs the anon key to pass through to the public edge function.

  ## Notes
  - The edge function is deployed with verify_jwt=false so no auth header is needed
  - The function itself uses SUPABASE_SERVICE_ROLE_KEY from its own environment
*/

select cron.unschedule('check-missed-applications') where exists (
  select 1 from cron.job where jobname = 'check-missed-applications'
);

select cron.schedule(
  'check-missed-applications',
  '*/30 * * * *',
  $$
  select net.http_post(
    url := 'https://hfgxoyksilxomdbwjquk.supabase.co/functions/v1/check-missed-applications',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
