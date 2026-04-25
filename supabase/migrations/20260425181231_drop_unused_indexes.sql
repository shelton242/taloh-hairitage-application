/*
  # Drop unused indexes

  ## Summary
  Removes indexes that are not being used by the query planner,
  reducing storage waste and improving write performance.

  ## Dropped Indexes
  - idx_reminder_settings_user_id
  - idx_application_logs_user_id
  - idx_application_logs_user_reminder
  - idx_application_logs_time
  - idx_progress_photos_user_id
  - idx_progress_photos_created_at
*/

DROP INDEX IF EXISTS public.idx_reminder_settings_user_id;
DROP INDEX IF EXISTS public.idx_application_logs_user_id;
DROP INDEX IF EXISTS public.idx_application_logs_user_reminder;
DROP INDEX IF EXISTS public.idx_application_logs_time;
DROP INDEX IF EXISTS public.idx_progress_photos_user_id;
DROP INDEX IF EXISTS public.idx_progress_photos_created_at;