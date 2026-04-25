/*
  # Enable RLS on reminder_settings and application_logs

  ## Summary
  These two tables have RLS disabled, making them publicly accessible.
  This migration enables RLS and adds the four standard CRUD policies
  for each table so only the owning authenticated user can access their data.

  ## Changes
  - Enable RLS on public.reminder_settings
  - Enable RLS on public.application_logs
  - Add SELECT / INSERT / UPDATE / DELETE policies on both tables
*/

ALTER TABLE public.reminder_settings ENABLE ROW LEVEL SECURITY;

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

-- ----

ALTER TABLE public.application_logs ENABLE ROW LEVEL SECURITY;

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
