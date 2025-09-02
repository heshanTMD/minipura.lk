-- This script should be run AFTER the user signs up through the website
-- Step 1: First sign up at /auth/signup with:
-- Updated admin email to bishanpankaja@icloud.com
-- Email: bishanpankaja@icloud.com  
-- Password: BP18@live

-- Step 2: After successful signup and email verification, run this script
-- to grant admin privileges to the user

-- Grant admin privileges to a user after signup and email verification

-- Insert or update the user as an admin
INSERT INTO public.admin_users (id, role, created_at)
SELECT 
    u.id,
    'admin',
    NOW()
FROM auth.users u
WHERE u.email = 'bishanpankaja@icloud.com'
ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    created_at = EXCLUDED.created_at;

-- Verify the admin assignment
SELECT 
    u.email,
    u.created_at AS user_created,
    a.role,
    a.created_at AS admin_created
FROM auth.users u
JOIN public.admin_users a ON u.id = a.id
WHERE u.email = 'bishanpankaja@icloud.com';
