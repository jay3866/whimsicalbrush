/*
  # Create artworks management system

  1. New Tables
    - `artworks`
      - `id` (uuid, primary key)
      - `title` (text)
      - `image_url` (text)
      - `medium` (text)
      - `year` (text)
      - `dimensions` (text)
      - `status` (text)
      - `description` (text)
      - `is_featured` (boolean)
      - `display_order` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on artworks table
    - Add policies for public read access
    - Add policies for authenticated admin write access
*/

-- Create artworks table
CREATE TABLE artworks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  medium text,
  year text,
  dimensions text,
  status text,
  description text,
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE artworks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access"
  ON artworks
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated insert"
  ON artworks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update"
  ON artworks
  FOR UPDATE
  TO authenticated
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete"
  ON artworks
  FOR DELETE
  TO authenticated
  USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_artworks_updated_at
  BEFORE UPDATE ON artworks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();