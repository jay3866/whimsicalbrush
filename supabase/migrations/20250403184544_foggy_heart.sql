/*
  # Create events table and site settings

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `date` (text)
      - `time` (text)
      - `location` (text)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. New Content
    - Add site settings to site_content table
    - Add default events

  3. Security
    - Enable RLS on events table
    - Add policies for authenticated users to manage events
    - Add policy for public to read events
*/

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date text NOT NULL,
  time text NOT NULL,
  location text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to manage events"
ON events FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public to read events"
ON events FOR SELECT
TO public
USING (true);

-- Add site settings to site_content
INSERT INTO site_content (key, value, type)
VALUES
  -- Site Settings
  ('site_logo', 'flower2', 'text'),
  ('site_name', 'A Whimsical Brush', 'text'),
  ('primary_color', '#c026d3', 'color'),
  ('instagram_feed_1', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38', 'image_url'),
  ('instagram_feed_2', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5', 'image_url'),
  ('instagram_feed_3', 'https://images.unsplash.com/photo-1574182245530-967d9b3831af', 'image_url'),

  -- Events Page Content
  ('events_title', 'Events & Exhibitions', 'text'),
  ('events_intro', 'Join us at our upcoming events and exhibitions.', 'text'),
  ('events_cta_title', 'Interested in Hosting an Event?', 'text'),
  ('events_cta_text', 'The studio is available for private events, workshops, and exhibitions. Get in touch to discuss your ideas.', 'text')
ON CONFLICT (key) DO NOTHING;

-- Insert sample events
INSERT INTO events (title, date, time, location, description, image_url)
VALUES
  (
    'Spring Garden Exhibition',
    'April 15-30, 2024',
    '10:00 AM - 6:00 PM',
    'Botanical Gardens Gallery',
    'A celebration of spring featuring new floral works inspired by the awakening garden.',
    'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'Artist Workshop: Nature Journaling',
    'May 5, 2024',
    '2:00 PM - 4:00 PM',
    'Studio Space',
    'Join us for an intimate workshop exploring the art of nature journaling through various mediums.',
    'https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&w=800&q=80'
  ),
  (
    'Summer Art Fair',
    'June 10-12, 2024',
    '11:00 AM - 7:00 PM',
    'City Park Plaza',
    'Annual outdoor art fair featuring local artists and live demonstrations.',
    'https://images.unsplash.com/photo-1577083552431-6e5fd2bbf78e?auto=format&fit=crop&w=800&q=80'
  );