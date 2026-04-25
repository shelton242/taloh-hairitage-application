/*
  # Optimize RLS policies with subselect for auth.uid()

  ## Summary
  Replaces auth.uid() with (SELECT auth.uid()) in all RLS policies so the
  auth function is evaluated once per query instead of once per row.

  ## Affected Tables
  - reminder_settings (4 policies)
  - application_logs (4 policies)
  - progress_photos (4 policies)
*/

-- reminder_settings
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

-- application_logs
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

-- progress_photos
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