-- Insert a default admin user (you can change the email and password)
-- This will create an admin user with email: admin@store.com and password: admin123
-- Make sure to change these credentials in production!

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@store.com',
  crypt('admin123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Store Admin"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Add the admin user to admin_users table
INSERT INTO public.admin_users (id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'admin@store.com'
ON CONFLICT (id) DO NOTHING;
