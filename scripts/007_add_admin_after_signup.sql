-- This script should be run AFTER the user signs up through the website
-- Step 1: First sign up at /auth/signup with:
-- Updated admin email to bishanpankaja@icloud.com
-- Email: bishanpankaja@icloud.com  
-- Password: BP18@live

-- Step 2: After successful signup and email verification, run this script
-- to grant admin privileges to the user

-- Find the user by email and add them to admin_users
INSERT INTO public.admin_users (id, role, created_at)
SELECT 
    au.id,
    'admin',
    NOW()
FROM auth.users au
-- Updated email in WHERE clause
WHERE au.email = 'bishanpankaja@icloud.com'
ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    created_at = EXCLUDED.created_at;

-- Verify the admin was added
SELECT 
    au.email,
    au.created_at as user_created,
    admin.role,
    admin.created_at as admin_created
FROM auth.users au
JOIN public.admin_users admin ON au.id = admin.id
-- Updated email in verification query
WHERE au.email = 'bishanpankaja@icloud.com';
