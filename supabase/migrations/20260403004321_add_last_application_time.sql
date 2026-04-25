/*
  # Add last application time tracking

  1. Changes
    - Add `last_application_time` column to `reminder_settings` table
      - Stores the timestamp of the last application marked as done
      - Used to calculate next application time
      - Nullable to support users who haven't marked any applications yet
  
  2. Notes
    - Uses timestamptz for timezone-aware tracking
    - No RLS changes needed as table already has proper policies
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reminder_settings' AND column_name = 'last_application_time'
  ) THEN
    ALTER TABLE reminder_settings ADD COLUMN last_application_time timestamptz;
  END IF;
END $$;