/*
  # Fix Mutable Search Path on Functions

  ## Problem
  Functions public.update_streak and public.calculate_consistency_percentage
  have a mutable search_path, which is a security risk. An attacker could
  potentially inject malicious objects into the search path.

  ## Fix
  Recreate both functions with SET search_path = '' and fully-qualified
  object references to ensure they always use the correct schema.
*/

CREATE OR REPLACE FUNCTION public.calculate_consistency_percentage(
  p_user_id uuid,
  p_reminder_type text
)
RETURNS numeric
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  v_frequency_hours integer;
  v_first_app_time timestamptz;
  v_expected_count numeric;
  v_actual_count integer;
  v_consistency numeric;
  v_hours_since_first numeric;
BEGIN
  SELECT frequency_hours INTO v_frequency_hours
  FROM public.reminder_settings
  WHERE user_id = p_user_id AND reminder_type = p_reminder_type;

  IF v_frequency_hours IS NULL THEN
    RETURN 0;
  END IF;

  SELECT COUNT(*) INTO v_actual_count
  FROM public.application_logs
  WHERE user_id = p_user_id AND reminder_type = p_reminder_type;

  IF v_actual_count = 0 THEN
    RETURN 0;
  END IF;

  SELECT MIN(application_time) INTO v_first_app_time
  FROM public.application_logs
  WHERE user_id = p_user_id AND reminder_type = p_reminder_type;

  v_hours_since_first := EXTRACT(EPOCH FROM (now() - v_first_app_time)) / 3600;

  IF v_hours_since_first < v_frequency_hours THEN
    RETURN 100;
  END IF;

  v_expected_count := GREATEST(1, FLOOR(v_hours_since_first / v_frequency_hours) + 1);

  v_consistency := LEAST(100, (v_actual_count::numeric / v_expected_count) * 100);

  RETURN ROUND(v_consistency, 2);
END;
$$;

CREATE OR REPLACE FUNCTION public.update_streak(
  p_user_id uuid,
  p_reminder_type text
)
RETURNS integer
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  v_frequency_hours integer;
  v_streak integer := 0;
  v_grace_hours integer := 2;
BEGIN
  SELECT frequency_hours INTO v_frequency_hours
  FROM public.reminder_settings
  WHERE user_id = p_user_id AND reminder_type = p_reminder_type;

  IF v_frequency_hours IS NULL THEN
    RETURN 0;
  END IF;

  WITH ordered_apps AS (
    SELECT
      application_time,
      LAG(application_time) OVER (ORDER BY application_time) as prev_time
    FROM public.application_logs
    WHERE user_id = p_user_id AND reminder_type = p_reminder_type
    ORDER BY application_time DESC
  ),
  streak_check AS (
    SELECT
      application_time,
      prev_time,
      CASE
        WHEN prev_time IS NULL THEN true
        WHEN prev_time - application_time <= make_interval(hours => v_frequency_hours + v_grace_hours) THEN true
        ELSE false
      END as is_consecutive
    FROM ordered_apps
  )
  SELECT COUNT(*) INTO v_streak
  FROM (
    SELECT
      application_time,
      is_consecutive,
      SUM(CASE WHEN is_consecutive THEN 0 ELSE 1 END) OVER (ORDER BY application_time DESC) as break_group
    FROM streak_check
  ) grouped
  WHERE break_group = 0;

  RETURN GREATEST(v_streak, 0);
END;
$$;
