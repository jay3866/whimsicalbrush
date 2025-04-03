/*
  # Create Storage Bucket for Artwork Images

  1. New Storage Bucket
    - Name: artwork-images
    - Public access enabled
    - File size limit: 10MB
    - Allowed mime types: image/*
  
  2. Security
    - Public read access
    - Authenticated write access
*/

-- Create a new storage bucket for artwork images if it doesn't exist
DO $$
BEGIN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
        'artwork-images',
        'artwork-images',
        true,
        10485760,  -- 10MB in bytes
        ARRAY['image/*']::text[]
    )
    ON CONFLICT (id) DO NOTHING;
END $$;

-- Set up storage policy for public read access
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public Access" ON storage.objects;
    
    CREATE POLICY "Public Access"
    ON storage.objects FOR SELECT
    USING ( bucket_id = 'artwork-images' );
END $$;

-- Set up storage policy for authenticated users to upload
DO $$
BEGIN
    DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
    
    CREATE POLICY "Authenticated users can upload images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'artwork-images'
        AND (storage.foldername(name))[1] != 'private'
    );
END $$;

-- Set up storage policy for authenticated users to update their uploads
DO $$
BEGIN
    DROP POLICY IF EXISTS "Authenticated users can update their images" ON storage.objects;
    
    CREATE POLICY "Authenticated users can update their images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING ( bucket_id = 'artwork-images' )
    WITH CHECK ( bucket_id = 'artwork-images' );
END $$;

-- Set up storage policy for authenticated users to delete their uploads
DO $$
BEGIN
    DROP POLICY IF EXISTS "Authenticated users can delete their images" ON storage.objects;
    
    CREATE POLICY "Authenticated users can delete their images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING ( bucket_id = 'artwork-images' );
END $$;