/*
  # Create site content table

  1. New Tables
    - `site_content`
      - `id` (uuid, primary key)
      - `key` (text, unique) - Identifier for the content (e.g., 'hero_image', 'welcome_title')
      - `value` (text) - The actual content
      - `type` (text) - Type of content (text, image_url, html)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `site_content` table
    - Add policies for authenticated users to manage content
    - Allow public read access
*/

CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  type text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Insert default content
INSERT INTO site_content (key, value, type) VALUES
  ('hero_image', 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80', 'image_url'),
  ('hero_title', '"What keeps my heart awake is colorful silence."', 'text'),
  ('hero_subtitle', '- Claude Monet', 'text'),
  ('welcome_title', 'Welcome to My World', 'text'),
  ('welcome_text', 'Through my art, I explore the delicate balance between nature''s raw beauty and human emotion. Each piece is a journey through color, texture, and light.', 'text'),
  ('about_image', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c', 'image_url'),
  ('about_title', 'Jessica Robinson-Brown', 'text'),
  ('about_intro', 'I''m an artist, teacher, and mom who rediscovered my creative passion in 2020 while designing art projects for my young child. I work with mostly watercolors and find great joy in painting botanicals and whimsy creatures like birds and butterflies. Acrylics and pastels on large canvases allow me to express big ideas, to recreate a moment in nature that stays in my mind.', 'text'),
  ('about_journey', 'Always drawn to the arts, I studied photography in college, but it wasn''t until 2020 that I truly rekindled my creative spirit. After becoming both a teacher and a mom, I found little time for my own artistic expression. However, the deep yearning to create never left, and I finally listened to it. I rediscovered my joy for art while designing projects for my young child, and through that process, I began to explore various styles and techniques. Making art is a way for me to model how to build the capacity to take risks, appreciate imperfection, and find beauty in the world around us.', 'text'),
  ('about_statement', 'As an intuitive artist, my work is rooted in the quiet, intricate beauty of the natural world. I find inspiration in the elements that often go unnoticed— tiny details that add a touch of whimsy to our everyday lives. It is the way light filters through leaves casting shadows around us, the boldness of bare trees against a winter sky, or the hints of pink as the sun is setting after a warm day at the beach. These moments stay in my mind''s eye until I am able to recreate them on paper.', 'text'),
  ('footer_text', '© {year} A Whimsical Brush. All rights reserved.', 'text');

-- Enable RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to update content
CREATE POLICY "Allow authenticated users to update site content"
ON site_content FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow public read access
CREATE POLICY "Allow public read access to site content"
ON site_content FOR SELECT
TO public
USING (true);