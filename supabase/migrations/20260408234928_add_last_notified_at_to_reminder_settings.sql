/*
  # Add last_notified_at to reminder_settings

  ## Summary
  Adds a `last_notified_at` column to the `reminder_settings` table to track
  when the last missed-application alert was sent for each reminder. This prevents
  duplicate alerts from being sent every time the check function runs.

  ## Changes
  - `reminder_settings`: New column `last_notified_at` (timestamptz, nullable)
    - Stores the timestamp of the last missed-application push notification sent
    - Used to ensure only one alert is sent per overdue cycle (not one per check interval)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reminder_settings' AND column_name = 'last_notified_at'
  ) THEN
    ALTER TABLE reminder_settings ADD COLUMN last_notified_at timestamptz;
  END IF;
END $$;
