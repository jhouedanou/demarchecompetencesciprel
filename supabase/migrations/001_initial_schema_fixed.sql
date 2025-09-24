-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN', 'MANAGER')),
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions table for quiz and survey
CREATE TABLE public.questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT, -- Optional fourth option
  correct_answer TEXT[] NOT NULL, -- Array for multiple correct answers
  category TEXT NOT NULL CHECK (category IN ('DEFINITION', 'RESPONSABILITE', 'COMPETENCES', 'ETAPES', 'OPINION')),
  quiz_type TEXT NOT NULL CHECK (quiz_type IN ('INTRODUCTION', 'SONDAGE')),
  points INTEGER DEFAULT 1,
  active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  feedback TEXT, -- Custom feedback per question
  explanation TEXT, -- Detailed explanation for learning
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz Results
CREATE TABLE public.quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  quiz_type TEXT NOT NULL CHECK (quiz_type IN ('INTRODUCTION', 'SONDAGE')),
  score INTEGER,
  max_score INTEGER,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER,
  responses JSONB NOT NULL, -- Detailed responses with timestamps
  duration INTEGER, -- Duration in seconds
  percentage DECIMAL(5,2),
  attempt_number INTEGER DEFAULT 1,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sondage Responses (structured separately)
CREATE TABLE public.sondage_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  q1_connaissance TEXT, -- "Savez-vous ce que c'est que la démarche compétence ?"
  q2_definition TEXT, -- Definition understanding
  q3_benefices TEXT[], -- Array for multiple choice benefits
  q4_attentes TEXT, -- Expectations
  q5_inquietudes TEXT, -- Concerns
  q6_informations TEXT[], -- Array for information sources
  additional_comments TEXT, -- Optional comments
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  session_duration INTEGER -- Time spent on survey
);

-- Videos table
CREATE TABLE public.videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail TEXT,
  duration INTEGER, -- Duration in seconds
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  file_size BIGINT, -- File size in bytes
  mime_type TEXT,
  resolution TEXT, -- e.g., "1920x1080"
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Video Views tracking
CREATE TABLE public.video_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  session_id TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  watch_duration INTEGER, -- Seconds actually watched
  total_duration INTEGER, -- Total video duration at time of viewing
  completion_percentage DECIMAL(5,2), -- Percentage watched
  completed BOOLEAN DEFAULT false, -- If video was watched completely
  device_type TEXT, -- mobile, desktop, tablet
  user_agent TEXT,
  ip_address INET,
  UNIQUE(user_id, video_id, session_id)
);

-- Video Likes
CREATE TABLE public.video_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  liked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

-- GDPR Consent Records
CREATE TABLE public.consent_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id TEXT,
  essential BOOLEAN DEFAULT true,
  analytics BOOLEAN DEFAULT false,
  marketing BOOLEAN DEFAULT false,
  functional BOOLEAN DEFAULT false,
  ip_address INET,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  consent_version TEXT DEFAULT '1.0',
  consented_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Data Processing Log (GDPR audit trail)
CREATE TABLE public.data_processing_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  data_type TEXT NOT NULL CHECK (data_type IN ('PERSONAL_INFO', 'QUIZ_RESPONSES', 'VIDEO_VIEWING', 'ANALYTICS', 'TECHNICAL', 'CONSENT')),
  action TEXT NOT NULL CHECK (action IN ('CREATE', 'READ', 'UPDATE', 'DELETE', 'EXPORT', 'ANONYMIZE')),
  purpose TEXT NOT NULL,
  legal_basis TEXT NOT NULL CHECK (legal_basis IN ('CONSENT', 'LEGITIMATE_INTEREST', 'CONTRACT', 'LEGAL_OBLIGATION')),
  data_subject UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  retention_period TEXT,
  details JSONB, -- Additional context about the processing
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  processed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Site Analytics and Visits
CREATE TABLE public.visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  page TEXT NOT NULL,
  title TEXT,
  user_agent TEXT,
  ip_address INET,
  country TEXT,
  city TEXT,
  referrer TEXT,
  duration INTEGER, -- Time spent on page in seconds
  device_type TEXT CHECK (device_type IN ('mobile', 'desktop', 'tablet')),
  browser TEXT,
  os TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Sessions
CREATE TABLE public.user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id TEXT UNIQUE NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  ip_address INET,
  user_agent TEXT,
  device_type TEXT,
  pages_visited INTEGER DEFAULT 0,
  total_duration INTEGER DEFAULT 0 -- Total session duration in seconds
);

-- Notifications/Messages system
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('QUIZ_COMPLETED', 'VIDEO_UPLOADED', 'SYSTEM_MESSAGE', 'GDPR_REQUEST')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sondage_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Profile policies
CREATE POLICY "Users can manage own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER')
    )
  );

-- Quiz results policies
CREATE POLICY "Users can read own quiz results" ON public.quiz_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz results" ON public.quiz_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can read all quiz results" ON public.quiz_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER')
    )
  );

-- Sondage responses policies
CREATE POLICY "Users can manage own sondage responses" ON public.sondage_responses
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all sondage responses" ON public.sondage_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER')
    )
  );

-- Video interaction policies
CREATE POLICY "Users can manage own video views" ON public.video_views
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own video likes" ON public.video_likes
  FOR ALL USING (auth.uid() = user_id);

-- Consent records policies
CREATE POLICY "Users can manage own consent" ON public.consent_records
  FOR ALL USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can manage own notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id);

-- Session policies
CREATE POLICY "Users can manage own sessions" ON public.user_sessions
  FOR ALL USING (auth.uid() = user_id);

-- Public read access for questions and videos
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active questions" ON public.questions
  FOR SELECT USING (active = true);

CREATE POLICY "Anyone can read active videos" ON public.videos
  FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage questions" ON public.questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER')
    )
  );

CREATE POLICY "Admins can manage videos" ON public.videos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('ADMIN', 'MANAGER')
    )
  );

-- Performance indexes
CREATE INDEX idx_quiz_results_user_type ON public.quiz_results(user_id, quiz_type);
CREATE INDEX idx_quiz_results_completed_at ON public.quiz_results(completed_at);
CREATE INDEX idx_video_views_user_video ON public.video_views(user_id, video_id);
CREATE INDEX idx_video_views_viewed_at ON public.video_views(viewed_at);
CREATE INDEX idx_visits_session_page ON public.visits(session_id, page);
CREATE INDEX idx_visits_created_at ON public.visits(created_at);
CREATE INDEX idx_questions_type_active ON public.questions(quiz_type, active);
CREATE INDEX idx_questions_category ON public.questions(category);
CREATE INDEX idx_videos_active_featured ON public.videos(active, featured);
CREATE INDEX idx_notifications_user_read ON public.notifications(user_id, read);
CREATE INDEX idx_data_processing_log_user ON public.data_processing_log(user_id);
CREATE INDEX idx_data_processing_log_processed_at ON public.data_processing_log(processed_at);

-- Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');

  -- Log the user creation
  INSERT INTO public.data_processing_log (user_id, data_type, action, purpose, legal_basis)
  VALUES (NEW.id, 'PERSONAL_INFO', 'CREATE', 'User registration', 'CONSENT');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update video view count
CREATE OR REPLACE FUNCTION public.update_video_views()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.videos
  SET views = views + 1,
      updated_at = NOW()
  WHERE id = NEW.video_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update view count
DROP TRIGGER IF EXISTS on_video_view_created ON public.video_views;
CREATE TRIGGER on_video_view_created
  AFTER INSERT ON public.video_views
  FOR EACH ROW EXECUTE FUNCTION public.update_video_views();

-- Function to update video like count
CREATE OR REPLACE FUNCTION public.update_video_likes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.videos
    SET likes = likes + 1,
        updated_at = NOW()
    WHERE id = NEW.video_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.videos
    SET likes = likes - 1,
        updated_at = NOW()
    WHERE id = OLD.video_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for like count
DROP TRIGGER IF EXISTS on_video_like_created ON public.video_likes;
DROP TRIGGER IF EXISTS on_video_like_deleted ON public.video_likes;

CREATE TRIGGER on_video_like_created
  AFTER INSERT ON public.video_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_video_likes();

CREATE TRIGGER on_video_like_deleted
  AFTER DELETE ON public.video_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_video_likes();

-- Function to update profile updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS handle_questions_updated_at ON public.questions;
DROP TRIGGER IF EXISTS handle_videos_updated_at ON public.videos;

CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_questions_updated_at
  BEFORE UPDATE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_videos_updated_at
  BEFORE UPDATE ON public.videos
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Storage buckets (create only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'videos') THEN
        INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'images') THEN
        INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);
    END IF;
END $$;

-- Storage policies (drop existing ones first to avoid conflicts)
DROP POLICY IF EXISTS "Videos Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Images Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own uploads" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own uploads" ON storage.objects;

-- Create new storage policies with unique names
CREATE POLICY "Videos Public Access" ON storage.objects 
  FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Images Public Access" ON storage.objects 
  FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload videos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own uploads" ON storage.objects
  FOR UPDATE USING (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own uploads" ON storage.objects
  FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);
