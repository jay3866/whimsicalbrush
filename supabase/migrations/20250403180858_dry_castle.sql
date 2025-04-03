/*
  # Add storage bucket policies

  1. Storage Changes
    - Create 'artwork-images' storage bucket if it doesn't exist
    - Add RLS policies for admin access to the bucket
    
  2. Security
    - Enable RLS on the bucket
    - Add policies for admin users to manage images
*/

-- Create the storage bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('artwork-images', 'artwork-images', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for the storage bucket
DO $$
BEGIN
  -- Clean up any existing policies
  DROP POLICY IF EXISTS "Allow admin select artwork images" ON storage.objects;
  DROP POLICY IF EXISTS "Allow admin insert artwork images" ON storage.objects;
  DROP POLICY IF EXISTS "Allow admin update artwork images" ON storage.objects;
  DROP POLICY IF EXISTS "Allow admin delete artwork images" ON storage.objects;
  DROP POLICY IF EXISTS "Allow public view artwork images" ON storage.objects;

  -- Create new policies
  CREATE POLICY "Allow admin select artwork images"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'artwork-images' AND (auth.jwt() ->> 'role')::text = 'admin');

  CREATE POLICY "Allow admin insert artwork images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'artwork-images' AND (auth.jwt() ->> 'role')::text = 'admin');

  CREATE POLICY "Allow admin update artwork images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'artwork-images' AND (auth.jwt() ->> 'role')::text = 'admin')
    WITH CHECK (bucket_id = 'artwork-images' AND (auth.jwt() ->> 'role')::text = 'admin');

  CREATE POLICY "Allow admin delete artwork images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'artwork-images' AND (auth.jwt() ->> 'role')::text = 'admin');

  CREATE POLICY "Allow public view artwork images"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'artwork-images');
END $$;