-- Fix infinite recursion in RLS policies
-- The issue is that policies referencing public.profiles create circular dependencies

-- Drop the problematic policies first
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can read all quiz results" ON public.quiz_results;
DROP POLICY IF EXISTS "Admins can read all sondage responses" ON public.sondage_responses;
DROP POLICY IF EXISTS "Admins can manage questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can manage videos" ON public.videos;

-- Create a security definer function to check user roles safely
-- This function bypasses RLS and can access the profiles table directly
CREATE OR REPLACE FUNCTION public.is_admin_or_manager(user_uid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Get user role directly without triggering RLS
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = user_uid;

  -- Return true if user is ADMIN or MANAGER
  RETURN user_role IN ('ADMIN', 'MANAGER');
END;
$$;

-- Recreate the admin policies using the security definer function
CREATE POLICY "Admins can read all profiles" ON public.profiles
  FOR SELECT USING (
    public.is_admin_or_manager(auth.uid())
  );

CREATE POLICY "Admins can read all quiz results" ON public.quiz_results
  FOR SELECT USING (
    public.is_admin_or_manager(auth.uid())
  );

CREATE POLICY "Admins can read all sondage responses" ON public.sondage_responses
  FOR SELECT USING (
    public.is_admin_or_manager(auth.uid())
  );

CREATE POLICY "Admins can manage questions" ON public.questions
  FOR ALL USING (
    public.is_admin_or_manager(auth.uid())
  );

CREATE POLICY "Admins can manage videos" ON public.videos
  FOR ALL USING (
    public.is_admin_or_manager(auth.uid())
  );

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin_or_manager(UUID) TO authenticated;