/*
  # Storage bucket and policies for site content images

  1. Storage Setup
    - Create a bucket for site content images
    - Set bucket to public access
  
  2. Security
    - Add policies for authenticated users to manage images
    - Add policy for public read access
*/

-- Create a bucket for site content images if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('site-content', 'site-content', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Drop existing policies if they exist
DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to update images" ON storage.objects;
  DROP POLICY IF EXISTS "Allow authenticated users to delete images" ON storage.objects;
  DROP POLICY IF EXISTS "Allow public to read images" ON storage.objects;
END $$;

-- Create new policies
CREATE POLICY "Allow authenticated users to upload images 1"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'site-content');

CREATE POLICY "Allow authenticated users to update images 1"
ON storage.objects FOR UPDATE
TO authenticated
WITH CHECK (bucket_id = 'site-content');

CREATE POLICY "Allow authenticated users to delete images 1"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'site-content');

CREATE POLICY "Allow public to read images 1"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'site-content');