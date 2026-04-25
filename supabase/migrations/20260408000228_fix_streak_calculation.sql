/*
  # Fix Streak Calculation Function

  1. Changes
    - Improve the update_streak function to correctly handle:
      - First application (should return 1, not 0)
      - Consecutive applications within the grace period
      - Better streak counting logic
  
  2. Notes
    - The previous version returned 0 for the first application
    - Now properly counts each consecutive application
*/

CREATE OR REPLACE FUNCTION update_streak(
  p_user_id uuid,
  p_reminder_type text
)
RETURNS integer AS $$
DECLARE
  v_frequency_hours integer;
  v_streak integer := 0;
  v_grace_hours integer := 2;
BEGIN
  -- Get reminder frequency
  SELECT frequency_hours INTO v_frequency_hours
  FROM reminder_settings
  WHERE user_id = p_user_id AND reminder_type = p_reminder_type;

  IF v_frequency_hours IS NULL THEN
    RETURN 0;
  END IF;

  -- Count consecutive applications within acceptable time windows
  WITH ordered_apps AS (
    SELECT 
      application_time,
      LAG(application_time) OVER (ORDER BY application_time) as prev_time
    FROM application_logs
    WHERE user_id = p_user_id AND reminder_type = p_reminder_type
    ORDER BY application_time DESC
  ),
  streak_check AS (
    SELECT 
      application_time,
      prev_time,
      CASE 
        -- First application
        WHEN prev_time IS NULL THEN true
        -- Within expected interval + grace period
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
$$ LANGUAGE plpgsql SECURITY DEFINER;