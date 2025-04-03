/*
  # Fix Storage Policies for Admin Access

  1. Changes
    - Update storage policies to check for admin role
    - Keep public read access
    - Restrict write operations to admin users only
  
  2. Security
    - Only admin users can upload/update/delete images
    - Public read access remains unchanged
*/

-- Set up storage policy for authenticated admin users to upload
DO $$
BEGIN
    DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
    
    CREATE POLICY "Admin users can upload images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'artwork-images'
        AND auth.is_admin()
    );
END $$;

-- Set up storage policy for authenticated admin users to update
DO $$
BEGIN
    DROP POLICY IF EXISTS "Authenticated users can update their images" ON storage.objects;
    
    CREATE POLICY "Admin users can update images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING ( 
        bucket_id = 'artwork-images'
        AND auth.is_admin()
    )
    WITH CHECK ( 
        bucket_id = 'artwork-images'
        AND auth.is_admin()
    );
END $$;

-- Set up storage policy for authenticated admin users to delete
DO $$
BEGIN
    DROP POLICY IF EXISTS "Authenticated users can delete their images" ON storage.objects;
    
    CREATE POLICY "Admin users can delete images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING ( 
        bucket_id = 'artwork-images'
        AND auth.is_admin()
    );
END $$;