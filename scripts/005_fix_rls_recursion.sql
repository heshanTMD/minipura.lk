-- Fix infinite recursion in admin_users policies
-- Drop the problematic policies first
DROP POLICY IF EXISTS "Only admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Only admins can manage admin users" ON public.admin_users;

-- Allow authenticated users to read admin_users table to check admin status
-- This prevents infinite recursion when other policies check admin status
CREATE POLICY "Authenticated users can view admin users" ON public.admin_users
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only allow admins to insert/update/delete admin users
CREATE POLICY "Only existing admins can manage admin users" ON public.admin_users
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM public.admin_users)
  );

CREATE POLICY "Only existing admins can update admin users" ON public.admin_users
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM public.admin_users)
  );

CREATE POLICY "Only existing admins can delete admin users" ON public.admin_users
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM public.admin_users)
  );
