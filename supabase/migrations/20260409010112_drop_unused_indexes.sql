/*
  # Drop Unused Indexes

  ## Problem
  Several indexes exist on tables but have never been used by the query planner.
  Unused indexes waste storage and slow down INSERT/UPDATE/DELETE operations
  without providing any query performance benefit.

  ## Dropped Indexes
  - idx_reminder_settings_user_id on public.reminder_settings
  - idx_application_logs_user_id on public.application_logs
  - idx_application_logs_user_reminder on public.application_logs
  - idx_application_logs_time on public.application_logs
  - idx_progress_photos_user_id on public.progress_photos
  - idx_progress_photos_created_at on public.progress_photos
*/

DROP INDEX IF EXISTS public.idx_reminder_settings_user_id;
DROP INDEX IF EXISTS public.idx_application_logs_user_id;
DROP INDEX IF EXISTS public.idx_application_logs_user_reminder;
DROP INDEX IF EXISTS public.idx_application_logs_time;
DROP INDEX IF EXISTS public.idx_progress_photos_user_id;
DROP INDEX IF EXISTS public.idx_progress_photos_created_at;
