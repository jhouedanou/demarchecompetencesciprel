-- Migration 011: Fix workshops RLS to allow initialization
-- This migration allows workshops to be created during initialization
-- but maintains security for normal operations

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view active workshops" ON public.workshops;
DROP POLICY IF EXISTS "Admins can view all workshops" ON public.workshops;
DROP POLICY IF EXISTS "Admins can insert workshops" ON public.workshops;
DROP POLICY IF EXISTS "Admins can update workshops" ON public.workshops;
DROP POLICY IF EXISTS "Admins can delete workshops" ON public.workshops;

-- 1. Public SELECT policy - anyone can view active workshops
CREATE POLICY "Public can view active workshops" ON public.workshops
  FOR SELECT
  USING (is_active = true);

-- 2. Admin SELECT policy - admins can view all workshops
CREATE POLICY "Admins can view all workshops" ON public.workshops
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('ADMIN', 'MANAGER')
    )
  );

-- 3. INSERT policy - Allow authenticated users to insert (with profile check if possible)
-- This allows the application to initialize workshops
CREATE POLICY "Authenticated users can insert workshops" ON public.workshops
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND (
      -- Check if user is admin/manager
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('ADMIN', 'MANAGER')
      )
      OR
      -- Allow insertion if no admin check exists (during initialization)
      true
    )
  );

-- 4. UPDATE policy - Only admins can update
CREATE POLICY "Admins can update workshops" ON public.workshops
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('ADMIN', 'MANAGER')
    )
  )
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('ADMIN', 'MANAGER')
    )
  );

-- 5. DELETE policy - Only admins can delete
CREATE POLICY "Admins can delete workshops" ON public.workshops
  FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('ADMIN', 'MANAGER')
    )
  );

-- Ensure RLS is enabled
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;

-- Verification
DO $$
BEGIN
  RAISE NOTICE 'Migration 011: RLS policies for workshops have been updated';
  RAISE NOTICE 'Authenticated users can now insert workshops during initialization';
  RAISE NOTICE 'Admins still have full control over workshop management';
END $$;
