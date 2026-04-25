/*
  # Create Application Tracking System

  1. New Tables
    - `application_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `application_time` (timestamptz) - when the application was marked as done
      - `reminder_type` (text) - 'solution' or 'shampoo'
      - `created_at` (timestamptz)

  2. Changes to Existing Tables
    - Add columns to `reminder_settings`:
      - `total_applications` (integer) - total count of completed applications
      - `current_streak` (integer) - consecutive days with proper applications
      - `next_application_due` (timestamptz) - when next application is expected
      - `consistency_percentage` (numeric) - percentage of on-time applications

  3. Security
    - Enable RLS on `application_logs` table
    - Add policies for authenticated users to manage their own logs

  4. Functions
    - Create function to calculate consistency percentage
    - Create function to update streak based on application history
*/

-- Create application_logs table
CREATE TABLE IF NOT EXISTS application_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_time timestamptz NOT NULL DEFAULT now(),
  reminder_type text NOT NULL CHECK (reminder_type IN ('solution', 'shampoo')),
  created_at timestamptz DEFAULT now()
);

-- Add new columns to reminder_settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reminder_settings' AND column_name = 'total_applications'
  ) THEN
    ALTER TABLE reminder_settings ADD COLUMN total_applications integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reminder_settings' AND column_name = 'current_streak'
  ) THEN
    ALTER TABLE reminder_settings ADD COLUMN current_streak integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reminder_settings' AND column_name = 'next_application_due'
  ) THEN
    ALTER TABLE reminder_settings ADD COLUMN next_application_due timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reminder_settings' AND column_name = 'consistency_percentage'
  ) THEN
    ALTER TABLE reminder_settings ADD COLUMN consistency_percentage numeric(5,2) DEFAULT 0;
  END IF;
END $$;

-- Enable RLS on application_logs
ALTER TABLE application_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for application_logs
CREATE POLICY "Users can view own application logs"
  ON application_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own application logs"
  ON application_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own application logs"
  ON application_logs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own application logs"
  ON application_logs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_application_logs_user_id ON application_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_application_logs_user_reminder ON application_logs(user_id, reminder_type);
CREATE INDEX IF NOT EXISTS idx_application_logs_time ON application_logs(application_time DESC);

-- Function to calculate consistency percentage
CREATE OR REPLACE FUNCTION calculate_consistency_percentage(
  p_user_id uuid,
  p_reminder_type text
)
RETURNS numeric AS $$
DECLARE
  v_frequency_hours integer;
  v_start_date timestamptz;
  v_expected_count integer;
  v_actual_count integer;
  v_consistency numeric;
BEGIN
  -- Get reminder settings
  SELECT frequency_hours, created_at INTO v_frequency_hours, v_start_date
  FROM reminder_settings
  WHERE user_id = p_user_id AND reminder_type = p_reminder_type;

  IF v_frequency_hours IS NULL THEN
    RETURN 0;
  END IF;

  -- Calculate expected applications since start
  v_expected_count := GREATEST(1, FLOOR(EXTRACT(EPOCH FROM (now() - v_start_date)) / (v_frequency_hours * 3600)));

  -- Get actual application count
  SELECT COUNT(*) INTO v_actual_count
  FROM application_logs
  WHERE user_id = p_user_id AND reminder_type = p_reminder_type;

  -- Calculate consistency percentage
  IF v_expected_count > 0 THEN
    v_consistency := LEAST(100, (v_actual_count::numeric / v_expected_count) * 100);
  ELSE
    v_consistency := 0;
  END IF;

  RETURN ROUND(v_consistency, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update streak
CREATE OR REPLACE FUNCTION update_streak(
  p_user_id uuid,
  p_reminder_type text
)
RETURNS integer AS $$
DECLARE
  v_frequency_hours integer;
  v_last_app_time timestamptz;
  v_second_last_app_time timestamptz;
  v_current_streak integer := 0;
  v_time_diff interval;
  v_expected_interval interval;
BEGIN
  -- Get reminder frequency
  SELECT frequency_hours INTO v_frequency_hours
  FROM reminder_settings
  WHERE user_id = p_user_id AND reminder_type = p_reminder_type;

  IF v_frequency_hours IS NULL THEN
    RETURN 0;
  END IF;

  v_expected_interval := make_interval(hours => v_frequency_hours);

  -- Get last two application times
  SELECT application_time INTO v_last_app_time
  FROM application_logs
  WHERE user_id = p_user_id AND reminder_type = p_reminder_type
  ORDER BY application_time DESC
  LIMIT 1;

  IF v_last_app_time IS NULL THEN
    RETURN 0;
  END IF;

  -- Check if last application was within acceptable window (frequency + 2 hours grace)
  v_time_diff := now() - v_last_app_time;
  IF v_time_diff > (v_expected_interval + interval '2 hours') THEN
    RETURN 0;
  END IF;

  -- Count consecutive on-time applications
  WITH RECURSIVE streak_calc AS (
    SELECT 
      application_time,
      ROW_NUMBER() OVER (ORDER BY application_time DESC) as rn,
      application_time as current_time,
      NULL::timestamptz as prev_time
    FROM application_logs
    WHERE user_id = p_user_id AND reminder_type = p_reminder_type
  ),
  streak_check AS (
    SELECT 
      sc1.application_time,
      sc1.rn,
      sc2.application_time as prev_time,
      CASE 
        WHEN sc2.application_time IS NULL THEN true
        WHEN sc1.application_time - sc2.application_time <= (v_expected_interval + interval '2 hours') THEN true
        ELSE false
      END as is_consecutive
    FROM streak_calc sc1
    LEFT JOIN streak_calc sc2 ON sc1.rn = sc2.rn - 1
  )
  SELECT COUNT(*) INTO v_current_streak
  FROM streak_check
  WHERE is_consecutive = true
  ORDER BY rn;

  RETURN v_current_streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;