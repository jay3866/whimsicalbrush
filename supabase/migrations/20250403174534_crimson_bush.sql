/*
  # Add create_admin_user function

  1. New Functions
    - `create_admin_user`: Function to set a user's role as admin
      - Takes `admin_email` parameter of type text
      - Returns void
      - Can only be executed by authenticated users
  
  2. Security
    - Function is accessible to authenticated users only
    - Validates that the email matches the authenticated user
*/

-- Create the function to set a user as admin
create or replace function public.create_admin_user(admin_email text)
returns void
language plpgsql
security definer
as $$
begin
  -- Verify the user is trying to set their own email as admin
  if admin_email = auth.email() then
    -- Insert or update the user role in auth.users
    update auth.users
    set raw_user_meta_data = jsonb_set(
      coalesce(raw_user_meta_data, '{}'::jsonb),
      '{role}',
      '"admin"'
    )
    where email = admin_email;
  else
    raise exception 'Unauthorized: Can only set admin role for your own account';
  end if;
end;
$$;