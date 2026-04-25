/*
  # Add age and gender to user_profiles

  ## Summary
  Adds age and gender fields to the user_profiles table so users can
  provide this information in their profile, and admins can view it
  in the backend.

  ## Changes
  - `user_profiles`: New column `age` (integer, nullable) — user's age in years
  - `user_profiles`: New column `gender` (text, nullable) — user's gender identity
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'age'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN age integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'gender'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN gender text;
  END IF;
END $$;
