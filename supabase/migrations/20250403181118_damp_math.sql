/*
  # Update artworks table RLS policies

  1. Changes
    - Enable RLS on artworks table
    - Add policies for authenticated users to perform CRUD operations
    - Add policy for public read access

  2. Security
    - Authenticated users can manage artworks
    - Public users can only view artworks
*/

-- Enable RLS on artworks table
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert artworks
CREATE POLICY "Allow authenticated users to insert artworks"
ON artworks FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update artworks
CREATE POLICY "Allow authenticated users to update artworks"
ON artworks FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete artworks
CREATE POLICY "Allow authenticated users to delete artworks"
ON artworks FOR DELETE
TO authenticated
USING (true);

-- Allow public read access to artworks
CREATE POLICY "Allow public read access to artworks"
ON artworks FOR SELECT
TO public
USING (true);