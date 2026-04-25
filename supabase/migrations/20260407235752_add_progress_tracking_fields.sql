/*
  # Add Progress Tracking Fields to Reminder Settings

  1. Changes
    - Add `next_application_due` column to track when the next application is scheduled
    - Add `current_streak` column to track consecutive successful applications
    - Add `consistency_percentage` column to track overall consistency
    - Add `total_applications` column to count total applications logged
  
  2. Notes
    - All fields are nullable to support existing users
    - These fields will be updated by the application when users mark applications as done
    - Default values provided where appropriate
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reminder_settings' AND column_name = 'next_application_due'
  ) THEN
    ALTER TABLE reminder_settings ADD COLUMN next_application_due timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reminder_settings' AND column_name = 'current_streak'
  ) THEN
    ALTER TABLE reminder_settings ADD COLUMN current_streak integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reminder_settings' AND column_name = 'consistency_percentage'
  ) THEN
    ALTER TABLE reminder_settings ADD COLUMN consistency_percentage numeric(5,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reminder_settings' AND column_name = 'total_applications'
  ) THEN
    ALTER TABLE reminder_settings ADD COLUMN total_applications integer DEFAULT 0;
  END IF;
END $$;