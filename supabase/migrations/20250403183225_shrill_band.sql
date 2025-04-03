/*
  # Add default site content

  1. New Content
    - Add default content for Home, About, and Contact pages
    - Includes text content and image URLs
    - Sets up initial hero section content
    - Adds about page content
    - Adds contact information

  2. Changes
    - Inserts initial records into site_content table
    - Each record has a unique key, value, and content type
*/

-- Insert default content if it doesn't exist
INSERT INTO site_content (key, value, type)
VALUES
  -- Home Page Content
  ('home_hero_image', 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80', 'image_url'),
  ('home_hero_title', 'What keeps my heart awake is colorful silence.', 'text'),
  ('home_hero_subtitle', '- Claude Monet', 'text'),
  ('home_welcome_title', 'Welcome to My World', 'text'),
  ('home_welcome_text', 'Through my art, I explore the delicate balance between nature''s raw beauty and human emotion. Each piece is a journey through color, texture, and light.', 'text'),
  ('home_featured_title', 'Featured Works', 'text'),
  ('home_instagram_title', 'Follow My Journey', 'text'),
  ('home_instagram_text', '@a_whimsical_brush', 'text'),
  ('home_newsletter_title', 'Stay Inspired', 'text'),
  ('home_newsletter_text', 'Join my newsletter to receive updates about new works, exhibitions, and artistic insights.', 'text'),

  -- About Page Content
  ('about_main_image', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c', 'image_url'),
  ('about_title', 'About Me', 'text'),
  ('about_intro', 'I''m an artist, teacher, and mom who rediscovered my creative passion in 2020 while designing art projects for my young child. I work with mostly watercolors and find great joy in painting botanicals and whimsy creatures like birds and butterflies.', 'text'),
  ('about_journey', 'Always drawn to the arts, I studied photography in college, but it wasn''t until 2020 that I truly rekindled my creative spirit. After becoming both a teacher and a mom, I found little time for my own artistic expression.', 'text'),
  ('about_statement', 'As an intuitive artist, my work is rooted in the quiet, intricate beauty of the natural world. I find inspiration in the elements that often go unnoticed— tiny details that add a touch of whimsy to our everyday lives.', 'text'),

  -- Contact Page Content
  ('contact_title', 'Get in Touch', 'text'),
  ('contact_intro', 'I''d love to hear from you. Whether you''re interested in my artwork, have questions about commissions, or just want to say hello.', 'text'),
  ('contact_email', 'A.Whimsical.Brush@gmail.com', 'text'),
  ('contact_instagram', '@a_whimsical_brush', 'text'),
  ('contact_location', 'Studio Location\nBy Appointment Only\nContact for Details', 'text')
ON CONFLICT (key) DO NOTHING;