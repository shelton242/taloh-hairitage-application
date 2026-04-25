/*
  # Set up pg_cron job to check for missed applications

  ## Summary
  Enables the pg_cron and pg_net extensions and creates a cron job that
  automatically calls the `check-missed-applications` edge function every
  30 minutes. This ensures users receive alerts when they miss an application
  after their grace period expires.

  ## Changes
  - Enables `pg_cron` extension for scheduled jobs
  - Enables `pg_net` extension for HTTP requests from the database
  - Creates a cron job that runs every 30 minutes to check for missed applications

  ## Notes
  - The job runs every 30 minutes: at :00 and :30 of every hour
  - It calls the check-missed-applications edge function via HTTP
  - The function itself handles deduplication via last_notified_at
*/

create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.unschedule('check-missed-applications') where exists (
  select 1 from cron.job where jobname = 'check-missed-applications'
);

select cron.schedule(
  'check-missed-applications',
  '*/30 * * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'SUPABASE_URL' limit 1) || '/functions/v1/check-missed-applications',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'SUPABASE_SERVICE_ROLE_KEY' limit 1)
    ),
    body := '{}'::jsonb
  );
  $$
);
