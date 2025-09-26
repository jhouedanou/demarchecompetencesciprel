-- Fix reading progress system errors
-- This migration fixes the missing function and RLS issues

-- The is_admin_or_manager function already exists and is used by other policies
-- We'll use the existing function instead of recreating it

-- Recreate the table if it doesn't exist (with proper structure)
CREATE TABLE IF NOT EXISTS public.user_reading_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  section_id TEXT NOT NULL,
  section_title TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  reading_time_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, section_id)
);

-- Enable RLS
ALTER TABLE public.user_reading_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can manage own reading progress" ON public.user_reading_progress;
DROP POLICY IF EXISTS "Admins can view all reading progress" ON public.user_reading_progress;

-- Create corrected policies
CREATE POLICY "Users can manage own reading progress" ON public.user_reading_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all reading progress" ON public.user_reading_progress
  FOR SELECT USING (public.is_admin_or_manager(auth.uid()));

-- Recreate indexes if they don't exist
DROP INDEX IF EXISTS idx_user_reading_progress_user;
DROP INDEX IF EXISTS idx_user_reading_progress_section;
DROP INDEX IF EXISTS idx_user_reading_progress_completed;

CREATE INDEX idx_user_reading_progress_user ON public.user_reading_progress(user_id);
CREATE INDEX idx_user_reading_progress_section ON public.user_reading_progress(section_id);
CREATE INDEX idx_user_reading_progress_completed ON public.user_reading_progress(completed_at);

-- Drop existing function to avoid conflicts
DROP FUNCTION IF EXISTS public.user_has_completed_all_sections(UUID);

-- Recreate the function for checking completion
CREATE OR REPLACE FUNCTION public.user_has_completed_all_sections(user_uid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  required_sections TEXT[] := ARRAY[
    'accueil',
    'dialectique',
    'synoptique',
    'leviers',
    'ressources'
  ];
  completed_count INTEGER;
BEGIN
  -- Count how many required sections the user has completed
  SELECT COUNT(*) INTO completed_count
  FROM public.user_reading_progress
  WHERE user_id = user_uid
    AND section_id = ANY(required_sections);

  -- Return true if user has completed all required sections
  RETURN completed_count >= array_length(required_sections, 1);
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.user_has_completed_all_sections(UUID) TO authenticated;