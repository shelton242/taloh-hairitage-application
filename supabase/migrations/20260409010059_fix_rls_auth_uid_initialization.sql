/*
  # Fix RLS Auth UID Initialization Plan

  ## Problem
  RLS policies on reminder_settings, application_logs, and progress_photos tables
  were calling auth.uid() directly, which causes it to be re-evaluated for every row.
  This is suboptimal at scale.

  ## Fix
  Replace auth.uid() with (select auth.uid()) in all affected policies so the
  auth function is called once per query rather than once per row.

  ## Affected Tables
  - public.reminder_settings (4 policies)
  - public.application_logs (4 policies)
  - public.progress_photos (4 policies)
*/

-- ============================================================
-- reminder_settings
-- ============================================================

DROP POLICY IF EXISTS "Users can view own reminder settings" ON public.reminder_settings;
DROP POLICY IF EXISTS "Users can insert own reminder settings" ON public.reminder_settings;
DROP POLICY IF EXISTS "Users can update own reminder settings" ON public.reminder_settings;
DROP POLICY IF EXISTS "Users can delete own reminder settings" ON public.reminder_settings;

CREATE POLICY "Users can view own reminder settings"
  ON public.reminder_settings FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own reminder settings"
  ON public.reminder_settings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own reminder settings"
  ON public.reminder_settings FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own reminder settings"
  ON public.reminder_settings FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- ============================================================
-- application_logs
-- ============================================================

DROP POLICY IF EXISTS "Users can view own application logs" ON public.application_logs;
DROP POLICY IF EXISTS "Users can insert own application logs" ON public.application_logs;
DROP POLICY IF EXISTS "Users can update own application logs" ON public.application_logs;
DROP POLICY IF EXISTS "Users can delete own application logs" ON public.application_logs;

CREATE POLICY "Users can view own application logs"
  ON public.application_logs FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own application logs"
  ON public.application_logs FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own application logs"
  ON public.application_logs FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own application logs"
  ON public.application_logs FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- ============================================================
-- progress_photos
-- ============================================================

DROP POLICY IF EXISTS "Users can view own progress photos" ON public.progress_photos;
DROP POLICY IF EXISTS "Users can insert own progress photos" ON public.progress_photos;
DROP POLICY IF EXISTS "Users can update own progress photos" ON public.progress_photos;
DROP POLICY IF EXISTS "Users can delete own progress photos" ON public.progress_photos;

CREATE POLICY "Users can view own progress photos"
  ON public.progress_photos FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own progress photos"
  ON public.progress_photos FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own progress photos"
  ON public.progress_photos FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own progress photos"
  ON public.progress_photos FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));
