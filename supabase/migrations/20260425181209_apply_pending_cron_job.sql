/*
  # Set up cron job for missed application checks

  ## Summary
  Creates a cron job that runs every 30 minutes to call the
  check-missed-applications edge function via HTTP.

  ## Changes
  - Unschedules existing job if present
  - Schedules new cron job every 30 minutes
*/

SELECT cron.unschedule('check-missed-applications') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'check-missed-applications'
);

SELECT cron.schedule(
  'check-missed-applications',
  '*/30 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://hfgxoyksilxomdbwjquk.supabase.co/functions/v1/check-missed-applications',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);