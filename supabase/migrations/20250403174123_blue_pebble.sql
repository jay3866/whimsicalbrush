/*
  # Set up admin role system

  1. New Types
    - `user_role` enum type for role management
  
  2. Schema Changes
    - Add role column to auth.users
    - Create admin check function
  
  3. Security
    - Update RLS policies for admin-only operations
*/

-- Create admin role type
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- Add role column to auth.users
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user';

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin'
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies for artworks
DROP POLICY IF EXISTS "Allow authenticated update" ON artworks;
DROP POLICY IF EXISTS "Allow authenticated insert" ON artworks;
DROP POLICY IF EXISTS "Allow authenticated delete" ON artworks;

CREATE POLICY "Allow admin update"
  ON artworks
  FOR UPDATE
  TO authenticated
  USING (auth.is_admin())
  WITH CHECK (auth.is_admin());

CREATE POLICY "Allow admin insert"
  ON artworks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.is_admin());

CREATE POLICY "Allow admin delete"
  ON artworks
  FOR DELETE
  TO authenticated
  USING (auth.is_admin());

-- Set up initial admin user through a function
CREATE OR REPLACE FUNCTION setup_initial_admin()
RETURNS void AS $$
BEGIN
  UPDATE auth.users
  SET role = 'admin'
  WHERE email = 'reachjaybrown@gmail.com';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function
SELECT setup_initial_admin();