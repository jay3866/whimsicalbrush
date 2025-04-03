/*
  # Create storage buckets for artwork and event images

  1. New Storage Buckets
    - `artwork-images`: For storing artwork images
    - `event-images`: For storing event images
    - `site-content`: For storing site content images

  2. Security
    - Enable public access for viewing images
    - Restrict upload/delete to authenticated users only
*/

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('artwork-images', 'artwork-images', true),
  ('event-images', 'event-images', true),
  ('site-content', 'site-content', true)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for artwork-images
CREATE POLICY "Public can view artwork images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'artwork-images');

CREATE POLICY "Authenticated users can upload artwork images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'artwork-images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update artwork images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'artwork-images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete artwork images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'artwork-images'
    AND auth.role() = 'authenticated'
  );

-- Set up security policies for event-images
CREATE POLICY "Public can view event images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-images');

CREATE POLICY "Authenticated users can upload event images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'event-images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update event images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'event-images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete event images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'event-images'
    AND auth.role() = 'authenticated'
  );

-- Set up security policies for site-content
CREATE POLICY "Public can view site content images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-content');

CREATE POLICY "Authenticated users can upload site content images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'site-content'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update site content images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'site-content'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete site content images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'site-content'
    AND auth.role() = 'authenticated'
  );