/*
  # Create Reminder Settings Table

  1. New Tables
    - `reminder_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `reminder_type` (text) - 'solution' or 'shampoo'
      - `enabled` (boolean) - whether the reminder is active
      - `start_time` (time) - time of day for first reminder (HH:MM format)
      - `frequency_hours` (integer) - frequency in hours (12, 24, or 48)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `reminder_settings` table
    - Add policy for authenticated users to read their own settings
    - Add policy for authenticated users to insert their own settings
    - Add policy for authenticated users to update their own settings
    - Add policy for authenticated users to delete their own settings

  3. Constraints
    - Unique constraint on (user_id, reminder_type) to prevent duplicates
*/

CREATE TABLE IF NOT EXISTS reminder_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_type text NOT NULL CHECK (reminder_type IN ('solution', 'shampoo')),
  enabled boolean NOT NULL DEFAULT true,
  start_time time NOT NULL,
  frequency_hours integer NOT NULL CHECK (frequency_hours IN (12, 24, 48)),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, reminder_type)
);

ALTER TABLE reminder_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reminder settings"
  ON reminder_settings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reminder settings"
  ON reminder_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminder settings"
  ON reminder_settings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminder settings"
  ON reminder_settings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_reminder_settings_user_id ON reminder_settings(user_id);
