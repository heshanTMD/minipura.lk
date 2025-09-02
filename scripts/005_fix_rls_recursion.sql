-- Fix infinite recursion in admin_users policies

-- Drop old or problematic policies
DROP POLICY IF EXISTS "Only admins can view admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Only admins can manage admin users" ON public.admin_users;

-- Allow all authenticated users to SELECT from admin_users (for admin status checks)
CREATE POLICY "Authenticated users can view admin users" ON public.admin_users
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only allow existing admins to INSERT into admin_users
CREATE POLICY "Only existing admins can insert admin users" ON public.admin_users
  FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM public.admin_users));

-- Only allow existing admins to UPDATE admin_users
CREATE POLICY "Only existing admins can update admin users" ON public.admin_users
  FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM public.admin_users));

-- Only allow existing admins to DELETE admin_users
CREATE POLICY "Only existing admins can delete admin users" ON public.admin_users
  FOR DELETE
  USING (auth.uid() IN (SELECT id FROM public.admin_users));
