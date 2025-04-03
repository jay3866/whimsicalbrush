/*
  # Add storage bucket policies

  1. Storage Setup
    - Create artwork-images bucket if it doesn't exist
    - Enable RLS on the bucket
  
  2. Security
    - Add policy for authenticated users to upload images
    - Add policy for public read access to images
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('artwork-images', 'artwork-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'artwork-images'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update files
CREATE POLICY "Allow authenticated users to update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'artwork-images'
  AND auth.role() = 'authenticated'
)
WITH CHECK (
  bucket_id = 'artwork-images'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete files
CREATE POLICY "Allow authenticated users to delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'artwork-images'
  AND auth.role() = 'authenticated'
);

-- Allow public read access to files
CREATE POLICY "Allow public read access to images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'artwork-images');