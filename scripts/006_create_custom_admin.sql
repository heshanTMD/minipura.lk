-- Updated script to match actual admin_users table schema (only id and role columns)
-- Create admin user with provided credentials
-- Using the specific admin credentials provided by user

-- Create a function to grant admin privileges by email
-- This will work after the user signs up through Supabase Auth
CREATE OR REPLACE FUNCTION grant_admin_by_email(user_email TEXT)
RETURNS VOID AS $$
DECLARE
  user_uuid UUID;
BEGIN
  -- Find the user ID from auth.users by email
  SELECT id INTO user_uuid 
  FROM auth.users 
  WHERE email = user_email;
  
  -- If user exists, add them to admin_users
  IF user_uuid IS NOT NULL THEN
    INSERT INTO public.admin_users (id, role, created_at)
    VALUES (user_uuid, 'admin', NOW())
    ON CONFLICT (id) DO UPDATE SET
      role = EXCLUDED.role;
    
    RAISE NOTICE 'Admin privileges granted to user: %', user_email;
  ELSE
    RAISE NOTICE 'User not found: %', user_email;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant admin privileges to the specified user
-- Note: First sign up with email: bishan@regzroelplay.org and password: BP18@live
-- Then run: SELECT grant_admin_by_email('bishan@regzroelplay.org');
SELECT grant_admin_by_email('bishan@regzroelplay.org');
