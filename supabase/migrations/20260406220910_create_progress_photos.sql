/*
  # Create Progress Photos Table and Storage

  1. New Tables
    - `progress_photos`
      - `id` (uuid, primary key) - Unique identifier for each photo
      - `user_id` (uuid, foreign key) - References auth.users
      - `photo_url` (text) - URL to the stored photo in Supabase Storage
      - `note` (text, optional) - User notes about this progress photo
      - `created_at` (timestamptz) - When the photo was uploaded
      - `updated_at` (timestamptz) - Last update timestamp

  2. Storage
    - Create `progress-photos` bucket for storing user progress images
    - Configure bucket to be private (authenticated access only)

  3. Security
    - Enable RLS on `progress_photos` table
    - Users can only view their own progress photos
    - Users can only insert their own progress photos
    - Users can only update their own progress photos
    - Users can only delete their own progress photos
    - Storage policies to ensure users can only access their own photos
*/

-- Create progress_photos table
CREATE TABLE IF NOT EXISTS progress_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  note text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE progress_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for progress_photos table
CREATE POLICY "Users can view own progress photos"
  ON progress_photos
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress photos"
  ON progress_photos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress photos"
  ON progress_photos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress photos"
  ON progress_photos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create storage bucket for progress photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('progress-photos', 'progress-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Users can upload own progress photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'progress-photos' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view own progress photos"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'progress-photos' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own progress photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'progress-photos' 
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_progress_photos_user_id ON progress_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_photos_created_at ON progress_photos(created_at);
