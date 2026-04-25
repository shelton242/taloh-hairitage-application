/*
  # Improve Consistency Calculation

  1. Changes
    - Better handling of edge cases in consistency calculation
    - More accurate expected count calculation
    - Return sensible values for new users
  
  2. Notes
    - Consistency is calculated as (actual applications / expected applications) * 100
    - Caps at 100% even if user does more than expected
*/

CREATE OR REPLACE FUNCTION calculate_consistency_percentage(
  p_user_id uuid,
  p_reminder_type text
)
RETURNS numeric AS $$
DECLARE
  v_frequency_hours integer;
  v_first_app_time timestamptz;
  v_expected_count numeric;
  v_actual_count integer;
  v_consistency numeric;
  v_hours_since_first numeric;
BEGIN
  -- Get reminder settings
  SELECT frequency_hours INTO v_frequency_hours
  FROM reminder_settings
  WHERE user_id = p_user_id AND reminder_type = p_reminder_type;

  IF v_frequency_hours IS NULL THEN
    RETURN 0;
  END IF;

  -- Get actual application count
  SELECT COUNT(*) INTO v_actual_count
  FROM application_logs
  WHERE user_id = p_user_id AND reminder_type = p_reminder_type;

  -- If no applications yet, return 0
  IF v_actual_count = 0 THEN
    RETURN 0;
  END IF;

  -- Get first application time
  SELECT MIN(application_time) INTO v_first_app_time
  FROM application_logs
  WHERE user_id = p_user_id AND reminder_type = p_reminder_type;

  -- Calculate hours since first application
  v_hours_since_first := EXTRACT(EPOCH FROM (now() - v_first_app_time)) / 3600;

  -- If less than one frequency period has passed, return 100% (they've done what's expected)
  IF v_hours_since_first < v_frequency_hours THEN
    RETURN 100;
  END IF;

  -- Calculate expected applications since first application
  v_expected_count := GREATEST(1, FLOOR(v_hours_since_first / v_frequency_hours) + 1);

  -- Calculate consistency percentage (cap at 100%)
  v_consistency := LEAST(100, (v_actual_count::numeric / v_expected_count) * 100);

  RETURN ROUND(v_consistency, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;