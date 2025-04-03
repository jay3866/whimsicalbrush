/*
  # Set up admin role system and policies

  1. New Types
    - `user_role` enum type for role management
  
  2. Schema Changes
    - Add role column to auth.users
    - Create admin check function
  
  3. Security
    - Update RLS policies for admin-only operations
*/

-- Create admin role type if it doesn't exist
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add role column to auth.users if it doesn't exist
DO $$ BEGIN
  ALTER TABLE auth.users ADD COLUMN role user_role DEFAULT 'user';
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

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
DO $$ BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Allow admin update" ON artworks;
  DROP POLICY IF EXISTS "Allow admin insert" ON artworks;
  DROP POLICY IF EXISTS "Allow admin delete" ON artworks;
  
  -- Create new policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'artworks' AND policyname = 'Allow admin update'
  ) THEN
    CREATE POLICY "Allow admin update"
      ON artworks
      FOR UPDATE
      TO authenticated
      USING (auth.is_admin())
      WITH CHECK (auth.is_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'artworks' AND policyname = 'Allow admin insert'
  ) THEN
    CREATE POLICY "Allow admin insert"
      ON artworks
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.is_admin());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'artworks' AND policyname = 'Allow admin delete'
  ) THEN
    CREATE POLICY "Allow admin delete"
      ON artworks
      FOR DELETE
      TO authenticated
      USING (auth.is_admin());
  END IF;
EXCEPTION
  WHEN others THEN null;
END $$;

-- Create a function to set up the admin user
CREATE OR REPLACE FUNCTION auth.create_admin_user(admin_email text)
RETURNS void AS $$
BEGIN
  UPDATE auth.users
  SET role = 'admin'
  WHERE email = admin_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;