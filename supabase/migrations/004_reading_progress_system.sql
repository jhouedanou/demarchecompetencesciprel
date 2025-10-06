-- Create reading progress tracking system
-- This tracks which sections users have read to unlock quiz/survey access

-- Create table to track user reading progress
CREATE TABLE public.user_reading_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  section_id TEXT NOT NULL, -- Section identifier (e.g., 'accueil', 'dialectique', 'synoptique', etc.)
  section_title TEXT NOT NULL, -- Human readable section title
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  reading_time_seconds INTEGER DEFAULT 0, -- Time spent reading this section
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, section_id)
);

-- Enable RLS for reading progress
ALTER TABLE public.user_reading_progress ENABLE ROW LEVEL SECURITY;

-- Users can manage their own reading progress
CREATE POLICY "Users can manage own reading progress" ON public.user_reading_progress
  FOR ALL USING (auth.uid() = user_id);

-- Admins can view all reading progress
CREATE POLICY "Admins can view all reading progress" ON public.user_reading_progress
  FOR SELECT USING (public.is_admin_or_manager(auth.uid()));

-- Create function to check if user has completed all required sections
CREATE OR REPLACE FUNCTION public.user_has_completed_all_sections(user_uid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  required_sections TEXT[] := ARRAY[
    'introduction',
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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.user_has_completed_all_sections(UUID) TO authenticated;

-- Create indexes for better performance
CREATE INDEX idx_user_reading_progress_user ON public.user_reading_progress(user_id);
CREATE INDEX idx_user_reading_progress_section ON public.user_reading_progress(section_id);
CREATE INDEX idx_user_reading_progress_completed ON public.user_reading_progress(completed_at);

-- Insert data processing log entry
INSERT INTO public.data_processing_log (data_type, action, purpose, legal_basis, details) VALUES
('TECHNICAL', 'CREATE', 'Reading progress tracking system setup', 'LEGITIMATE_INTEREST',
'{"description": "Database schema for tracking user reading progress to unlock quiz access"}');