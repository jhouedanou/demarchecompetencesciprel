-- =============================================================================
-- CIPREL Compétences — Schéma de base de données (Supabase self-hosted)
-- Reconstruit depuis le projet Supabase cloud de production (septembre 2026).
-- Idempotent : ré-exécutable sans erreur (IF NOT EXISTS / OR REPLACE / DROP POLICY IF EXISTS).
-- Import : docker exec -i supabase-db psql -U postgres -d postgres -f - < schema.sql
-- =============================================================================

BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pgcrypto     WITH SCHEMA extensions;

-- -----------------------------------------------------------------------------
-- 1. TABLES
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL,
  email text NOT NULL,
  name text,
  role text DEFAULT 'USER'::text,
  avatar_url text,
  phone text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_email_key UNIQUE (email),
  CONSTRAINT profiles_role_check CHECK ((role = ANY (ARRAY['USER'::text, 'ADMIN'::text, 'MANAGER'::text]))),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.questions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  question text NOT NULL,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  option_d text,
  correct_answer text[] NOT NULL,
  category text NOT NULL,
  quiz_type text NOT NULL,
  points integer DEFAULT 1,
  active boolean DEFAULT true,
  order_index integer DEFAULT 0,
  feedback text,
  explanation text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  etape text DEFAULT 'INTRODUCTION'::text,
  metier_id integer,
  workshop_id text,
  CONSTRAINT questions_pkey PRIMARY KEY (id),
  CONSTRAINT questions_category_check CHECK ((category = ANY (ARRAY['DEFINITION'::text, 'RESPONSABILITE'::text, 'COMPETENCES'::text, 'ETAPES'::text, 'OPINION'::text]))),
  CONSTRAINT questions_etape_check CHECK ((etape = ANY (ARRAY['INTRODUCTION'::text, 'SONDAGE'::text, 'WORKSHOP'::text, 'AUTRE'::text]))),
  CONSTRAINT questions_quiz_type_check CHECK ((quiz_type = ANY (ARRAY['INTRODUCTION'::text, 'SONDAGE'::text, 'WORKSHOP'::text])))
);

CREATE TABLE IF NOT EXISTS public.quiz_results (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  quiz_type text NOT NULL,
  score integer DEFAULT 0,
  max_score integer DEFAULT 0,
  total_questions integer NOT NULL,
  correct_answers integer DEFAULT 0,
  responses jsonb NOT NULL,
  duration integer DEFAULT 0,
  percentage numeric(5,2) DEFAULT 0.00,
  attempt_number integer DEFAULT 1,
  completed_at timestamp with time zone DEFAULT now(),
  started_at timestamp with time zone DEFAULT now(),
  metier_id integer,
  CONSTRAINT quiz_results_pkey PRIMARY KEY (id),
  CONSTRAINT quiz_results_duration_check CHECK ((duration >= 0)),
  CONSTRAINT quiz_results_percentage_check CHECK (((percentage >= (0)::numeric) AND (percentage <= (100)::numeric))),
  CONSTRAINT quiz_results_quiz_type_check CHECK ((quiz_type = ANY (ARRAY['INTRODUCTION'::text, 'SONDAGE'::text, 'WORKSHOP'::text]))),
  CONSTRAINT quiz_results_score_check CHECK (((score >= 0) AND (score <= max_score))),
  CONSTRAINT quiz_results_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);
COMMENT ON TABLE public.quiz_results IS 'Stocke les résultats des quiz complétés par les utilisateurs';
COMMENT ON COLUMN public.quiz_results.attempt_number IS 'Numéro de tentative pour ce type de quiz';
COMMENT ON COLUMN public.quiz_results.metier_id IS 'ID du métier pour les quiz de type WORKSHOP';
COMMENT ON COLUMN public.quiz_results.percentage IS 'Pourcentage de réussite (0-100)';
COMMENT ON COLUMN public.quiz_results.responses IS 'Réponses détaillées au format JSON avec metadata';

CREATE TABLE IF NOT EXISTS public.sondage_responses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  q1_connaissance text,
  q2_definition text,
  q3_benefices text[],
  q4_attentes text,
  q5_inquietudes text,
  q6_informations text[],
  additional_comments text,
  submitted_at timestamp with time zone DEFAULT now(),
  session_duration integer,
  CONSTRAINT sondage_responses_pkey PRIMARY KEY (id),
  CONSTRAINT sondage_responses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.videos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  filename text NOT NULL,
  url text NOT NULL,
  thumbnail text,
  duration integer,
  views integer DEFAULT 0,
  likes integer DEFAULT 0,
  file_size bigint,
  mime_type text,
  resolution text,
  active boolean DEFAULT true,
  featured boolean DEFAULT false,
  order_index integer DEFAULT 0,
  uploaded_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT videos_pkey PRIMARY KEY (id),
  CONSTRAINT videos_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.video_views (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  video_id uuid,
  session_id text,
  viewed_at timestamp with time zone DEFAULT now(),
  watch_duration integer,
  total_duration integer,
  completion_percentage numeric(5,2),
  completed boolean DEFAULT false,
  device_type text,
  user_agent text,
  ip_address inet,
  CONSTRAINT video_views_pkey PRIMARY KEY (id),
  CONSTRAINT video_views_user_id_video_id_session_id_key UNIQUE (user_id, video_id, session_id),
  CONSTRAINT video_views_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT video_views_video_id_fkey FOREIGN KEY (video_id) REFERENCES public.videos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.video_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  video_id uuid,
  liked_at timestamp with time zone DEFAULT now(),
  CONSTRAINT video_likes_pkey PRIMARY KEY (id),
  CONSTRAINT video_likes_user_id_video_id_key UNIQUE (user_id, video_id),
  CONSTRAINT video_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT video_likes_video_id_fkey FOREIGN KEY (video_id) REFERENCES public.videos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.consent_records (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  session_id text,
  essential boolean DEFAULT true,
  analytics boolean DEFAULT false,
  marketing boolean DEFAULT false,
  functional boolean DEFAULT false,
  ip_address inet,
  user_agent text,
  country text,
  city text,
  consent_version text DEFAULT '1.0'::text,
  consented_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT consent_records_pkey PRIMARY KEY (id),
  CONSTRAINT consent_records_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.data_processing_log (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  data_type text NOT NULL,
  action text NOT NULL,
  purpose text NOT NULL,
  legal_basis text NOT NULL,
  data_subject uuid,
  retention_period text,
  details jsonb,
  processed_at timestamp with time zone DEFAULT now(),
  processed_by uuid,
  CONSTRAINT data_processing_log_pkey PRIMARY KEY (id),
  CONSTRAINT data_processing_log_action_check CHECK ((action = ANY (ARRAY['CREATE'::text, 'READ'::text, 'UPDATE'::text, 'DELETE'::text, 'EXPORT'::text, 'ANONYMIZE'::text]))),
  CONSTRAINT data_processing_log_data_type_check CHECK ((data_type = ANY (ARRAY['PERSONAL_INFO'::text, 'QUIZ_RESPONSES'::text, 'VIDEO_VIEWING'::text, 'ANALYTICS'::text, 'TECHNICAL'::text, 'CONSENT'::text]))),
  CONSTRAINT data_processing_log_legal_basis_check CHECK ((legal_basis = ANY (ARRAY['CONSENT'::text, 'LEGITIMATE_INTEREST'::text, 'CONTRACT'::text, 'LEGAL_OBLIGATION'::text]))),
  CONSTRAINT data_processing_log_data_subject_fkey FOREIGN KEY (data_subject) REFERENCES public.profiles(id) ON DELETE SET NULL,
  CONSTRAINT data_processing_log_processed_by_fkey FOREIGN KEY (processed_by) REFERENCES public.profiles(id) ON DELETE SET NULL,
  CONSTRAINT data_processing_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.visits (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  session_id text NOT NULL,
  page text NOT NULL,
  title text,
  user_agent text,
  ip_address inet,
  country text,
  city text,
  referrer text,
  duration integer,
  device_type text,
  browser text,
  os text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT visits_pkey PRIMARY KEY (id),
  CONSTRAINT visits_device_type_check CHECK ((device_type = ANY (ARRAY['mobile'::text, 'desktop'::text, 'tablet'::text]))),
  CONSTRAINT visits_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.user_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  session_id text NOT NULL,
  started_at timestamp with time zone DEFAULT now(),
  last_activity timestamp with time zone DEFAULT now(),
  ended_at timestamp with time zone,
  ip_address inet,
  user_agent text,
  device_type text,
  pages_visited integer DEFAULT 0,
  total_duration integer DEFAULT 0,
  CONSTRAINT user_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT user_sessions_session_id_key UNIQUE (session_id),
  CONSTRAINT user_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  action_url text,
  created_at timestamp with time zone DEFAULT now(),
  read_at timestamp with time zone,
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_type_check CHECK ((type = ANY (ARRAY['QUIZ_COMPLETED'::text, 'VIDEO_UPLOADED'::text, 'SYSTEM_MESSAGE'::text, 'GDPR_REQUEST'::text]))),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.user_reading_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  section_id text NOT NULL,
  section_title text NOT NULL,
  completed_at timestamp with time zone DEFAULT now(),
  reading_time_seconds integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_reading_progress_pkey PRIMARY KEY (id),
  CONSTRAINT user_reading_progress_user_id_section_id_key UNIQUE (user_id, section_id),
  CONSTRAINT user_reading_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

CREATE SEQUENCE IF NOT EXISTS public.workshops_id_seq;
CREATE TABLE IF NOT EXISTS public.workshops (
  id bigint NOT NULL DEFAULT nextval('public.workshops_id_seq'::regclass),
  metier_id integer NOT NULL,
  metier_nom character varying(100) NOT NULL,
  is_active boolean NOT NULL DEFAULT false,
  publication_date timestamp with time zone,
  onedrive_link text,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  video_url text,
  CONSTRAINT workshops_pkey PRIMARY KEY (id),
  CONSTRAINT workshops_unique_metier UNIQUE (metier_id)
);
ALTER SEQUENCE public.workshops_id_seq OWNED BY public.workshops.id;
COMMENT ON TABLE public.workshops IS 'Gestion des workshops métiers avec liens OneDrive et configuration de publication';
COMMENT ON COLUMN public.workshops.is_active IS 'Indique si le workshop est actif';
COMMENT ON COLUMN public.workshops.metier_id IS 'ID unique du métier';
COMMENT ON COLUMN public.workshops.metier_nom IS 'Nom du métier';
COMMENT ON COLUMN public.workshops.onedrive_link IS 'Lien OneDrive vers les ressources du workshop';
COMMENT ON COLUMN public.workshops.publication_date IS 'Date de publication du workshop';

CREATE TABLE IF NOT EXISTS public.workshops_config (
  id text NOT NULL DEFAULT 'global_config'::text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  structure_commune jsonb NOT NULL DEFAULT '{}'::jsonb,
  valeurs_feeric jsonb NOT NULL DEFAULT '{}'::jsonb,
  application_web jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT workshops_config_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.workshops_metiers (
  id text NOT NULL,
  titre text NOT NULL,
  fichier text DEFAULT ''::text,
  nombre_slides integer DEFAULT 10,
  type text DEFAULT 'job_focus'::text,
  contenu jsonb NOT NULL DEFAULT '{}'::jsonb,
  icon text DEFAULT '📋'::text,
  color text DEFAULT 'from-gray-500 to-gray-600'::text,
  ordre integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  video text DEFAULT ''::text,
  onedrive text DEFAULT ''::text,
  support_url text,
  referentiel_url text,
  CONSTRAINT workshops_metiers_pkey PRIMARY KEY (id)
);
COMMENT ON COLUMN public.workshops_metiers.onedrive IS 'Lien OneDrive vers les ressources du workshop';
COMMENT ON COLUMN public.workshops_metiers.referentiel_url IS 'URL du référentiel de compétences (OneDrive, Google Drive, etc.)';
COMMENT ON COLUMN public.workshops_metiers.support_url IS 'URL du support de présentation (OneDrive, Google Drive, etc.)';
COMMENT ON COLUMN public.workshops_metiers.video IS 'URL de la vidéo du workshop (YouTube, Vimeo, etc.)';

-- -----------------------------------------------------------------------------
-- 2. INDEX
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_data_processing_log_processed_at ON public.data_processing_log USING btree (processed_at);
CREATE INDEX IF NOT EXISTS idx_data_processing_log_user ON public.data_processing_log USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications USING btree (user_id, read);
CREATE INDEX IF NOT EXISTS idx_questions_category ON public.questions USING btree (category);
CREATE INDEX IF NOT EXISTS idx_questions_etape ON public.questions USING btree (etape);
CREATE INDEX IF NOT EXISTS idx_questions_etape_active ON public.questions USING btree (etape, active);
CREATE INDEX IF NOT EXISTS idx_questions_metier_id ON public.questions USING btree (metier_id) WHERE (metier_id IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_questions_quiz_type_metier ON public.questions USING btree (quiz_type, metier_id);
CREATE INDEX IF NOT EXISTS idx_questions_type_active ON public.questions USING btree (quiz_type, active);
CREATE INDEX IF NOT EXISTS idx_questions_workshop_id ON public.questions USING btree (workshop_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_completed_at ON public.quiz_results USING btree (completed_at);
CREATE INDEX IF NOT EXISTS idx_quiz_results_metier_id ON public.quiz_results USING btree (metier_id) WHERE (metier_id IS NOT NULL);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_quiz_attempt ON public.quiz_results USING btree (user_id, quiz_type, attempt_number);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_type ON public.quiz_results USING btree (user_id, quiz_type);
CREATE INDEX IF NOT EXISTS idx_user_reading_progress_completed ON public.user_reading_progress USING btree (completed_at);
CREATE INDEX IF NOT EXISTS idx_user_reading_progress_section ON public.user_reading_progress USING btree (section_id);
CREATE INDEX IF NOT EXISTS idx_user_reading_progress_user ON public.user_reading_progress USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_video_views_user_video ON public.video_views USING btree (user_id, video_id);
CREATE INDEX IF NOT EXISTS idx_video_views_viewed_at ON public.video_views USING btree (viewed_at);
CREATE INDEX IF NOT EXISTS idx_videos_active_featured ON public.videos USING btree (active, featured);
CREATE INDEX IF NOT EXISTS idx_visits_created_at ON public.visits USING btree (created_at);
CREATE INDEX IF NOT EXISTS idx_visits_session_page ON public.visits USING btree (session_id, page);
CREATE INDEX IF NOT EXISTS idx_workshops_config_is_active ON public.workshops_config USING btree (is_active);
CREATE INDEX IF NOT EXISTS idx_workshops_is_active ON public.workshops USING btree (is_active);
CREATE INDEX IF NOT EXISTS idx_workshops_metier_id ON public.workshops USING btree (metier_id);
CREATE INDEX IF NOT EXISTS idx_workshops_metiers_is_active ON public.workshops_metiers USING btree (is_active);
CREATE INDEX IF NOT EXISTS idx_workshops_metiers_ordre ON public.workshops_metiers USING btree (ordre);
CREATE INDEX IF NOT EXISTS idx_workshops_metiers_type ON public.workshops_metiers USING btree (type);
CREATE INDEX IF NOT EXISTS idx_workshops_publication_date ON public.workshops USING btree (publication_date);

-- -----------------------------------------------------------------------------
-- 3. VUE
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.questions_by_etape AS
 SELECT id, title, question, option_a, option_b, option_c, option_d, correct_answer,
        category, quiz_type, etape, points, active, order_index, feedback, explanation,
        created_at, updated_at
   FROM public.questions q
  ORDER BY etape, quiz_type, order_index;

-- -----------------------------------------------------------------------------
-- 4. FONCTIONS
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name')
  ON CONFLICT (id) DO NOTHING;

  -- Log the user creation
  INSERT INTO public.data_processing_log (user_id, data_type, action, purpose, legal_basis)
  VALUES (NEW.id, 'PERSONAL_INFO', 'CREATE', 'User registration', 'CONSENT');

  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_workshops_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_workshops_metiers_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_admin_or_manager(user_uid uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  DECLARE
    user_role TEXT;
  BEGIN
    SELECT role INTO user_role
    FROM public.profiles
    WHERE id = user_uid;
    RETURN user_role IN ('ADMIN', 'MANAGER');
  END;
  $function$;

CREATE OR REPLACE FUNCTION public.user_has_completed_all_sections(user_uid uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
  SELECT COUNT(*) INTO completed_count
  FROM public.user_reading_progress
  WHERE user_id = user_uid
    AND section_id = ANY(required_sections);

  RETURN completed_count >= array_length(required_sections, 1);
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_video_likes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.update_video_views()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  UPDATE public.videos
  SET views = views + 1,
      updated_at = NOW()
  WHERE id = NEW.video_id;

  RETURN NEW;
END;
$function$;

-- Fonction appelée par l'application via .rpc('get_questions_summary')
-- (absente du projet cloud : l'application gère l'erreur, fournie ici pour complétude)
CREATE OR REPLACE FUNCTION public.get_questions_summary()
 RETURNS TABLE(quiz_type text, etape text, category text, total bigint, active_count bigint)
 LANGUAGE sql
 STABLE
AS $function$
  SELECT quiz_type, etape, category, count(*) AS total, count(*) FILTER (WHERE active) AS active_count
  FROM public.questions
  GROUP BY quiz_type, etape, category
  ORDER BY quiz_type, etape, category;
$function$;

-- -----------------------------------------------------------------------------
-- 5. TRIGGERS
-- -----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
CREATE TRIGGER handle_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_questions_updated_at ON public.questions;
CREATE TRIGGER handle_questions_updated_at BEFORE UPDATE ON public.questions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_videos_updated_at ON public.videos;
CREATE TRIGGER handle_videos_updated_at BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_video_view_created ON public.video_views;
CREATE TRIGGER on_video_view_created AFTER INSERT ON public.video_views FOR EACH ROW EXECUTE FUNCTION public.update_video_views();

DROP TRIGGER IF EXISTS on_video_like_created ON public.video_likes;
CREATE TRIGGER on_video_like_created AFTER INSERT ON public.video_likes FOR EACH ROW EXECUTE FUNCTION public.update_video_likes();

DROP TRIGGER IF EXISTS on_video_like_deleted ON public.video_likes;
CREATE TRIGGER on_video_like_deleted AFTER DELETE ON public.video_likes FOR EACH ROW EXECUTE FUNCTION public.update_video_likes();

DROP TRIGGER IF EXISTS workshops_update_timestamp ON public.workshops;
CREATE TRIGGER workshops_update_timestamp BEFORE UPDATE ON public.workshops FOR EACH ROW EXECUTE FUNCTION public.update_workshops_updated_at();

DROP TRIGGER IF EXISTS trigger_workshops_metiers_updated_at ON public.workshops_metiers;
CREATE TRIGGER trigger_workshops_metiers_updated_at BEFORE UPDATE ON public.workshops_metiers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS trigger_workshops_config_updated_at ON public.workshops_config;
CREATE TRIGGER trigger_workshops_config_updated_at BEFORE UPDATE ON public.workshops_config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- -----------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sondage_responses     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_views           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_likes           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_records       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshops             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshops_config      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshops_metiers     ENABLE ROW LEVEL SECURITY;
-- Tables techniques écrites par le serveur (clé service_role, qui contourne RLS).
-- RLS activé ici par sécurité (elles étaient exposées sans RLS dans le projet cloud).
ALTER TABLE public.data_processing_log   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits                ENABLE ROW LEVEL SECURITY;

-- profiles
DROP POLICY IF EXISTS "Users can manage own profile" ON public.profiles;
CREATE POLICY "Users can manage own profile" ON public.profiles FOR ALL USING ((auth.uid() = id));
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT USING (public.is_admin_or_manager(auth.uid()));

-- questions
DROP POLICY IF EXISTS "Anyone can read active questions" ON public.questions;
CREATE POLICY "Anyone can read active questions" ON public.questions FOR SELECT USING ((active = true));
DROP POLICY IF EXISTS "Admins can read all questions" ON public.questions;
CREATE POLICY "Admins can read all questions" ON public.questions FOR SELECT USING (((auth.uid() IS NOT NULL) AND public.is_admin_or_manager(auth.uid())));
DROP POLICY IF EXISTS "Admins can insert questions" ON public.questions;
CREATE POLICY "Admins can insert questions" ON public.questions FOR INSERT WITH CHECK (((auth.uid() IS NOT NULL) AND public.is_admin_or_manager(auth.uid())));
DROP POLICY IF EXISTS "Admins can update questions" ON public.questions;
CREATE POLICY "Admins can update questions" ON public.questions FOR UPDATE USING (((auth.uid() IS NOT NULL) AND public.is_admin_or_manager(auth.uid()))) WITH CHECK (((auth.uid() IS NOT NULL) AND public.is_admin_or_manager(auth.uid())));
DROP POLICY IF EXISTS "Admins can delete questions" ON public.questions;
CREATE POLICY "Admins can delete questions" ON public.questions FOR DELETE USING (((auth.uid() IS NOT NULL) AND public.is_admin_or_manager(auth.uid())));

-- quiz_results
DROP POLICY IF EXISTS "Users can read own quiz results" ON public.quiz_results;
CREATE POLICY "Users can read own quiz results" ON public.quiz_results FOR SELECT USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can insert own quiz results" ON public.quiz_results;
CREATE POLICY "Users can insert own quiz results" ON public.quiz_results FOR INSERT WITH CHECK ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Admins can read all quiz results" ON public.quiz_results;
CREATE POLICY "Admins can read all quiz results" ON public.quiz_results FOR SELECT USING (public.is_admin_or_manager(auth.uid()));

-- sondage_responses
DROP POLICY IF EXISTS "Users can manage own sondage responses" ON public.sondage_responses;
CREATE POLICY "Users can manage own sondage responses" ON public.sondage_responses FOR ALL USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Admins can read all sondage responses" ON public.sondage_responses;
CREATE POLICY "Admins can read all sondage responses" ON public.sondage_responses FOR SELECT USING (public.is_admin_or_manager(auth.uid()));

-- videos / video_views / video_likes
DROP POLICY IF EXISTS "Anyone can read active videos" ON public.videos;
CREATE POLICY "Anyone can read active videos" ON public.videos FOR SELECT USING ((active = true));
DROP POLICY IF EXISTS "Admins can manage videos" ON public.videos;
CREATE POLICY "Admins can manage videos" ON public.videos FOR ALL USING (public.is_admin_or_manager(auth.uid()));
DROP POLICY IF EXISTS "Users can manage own video views" ON public.video_views;
CREATE POLICY "Users can manage own video views" ON public.video_views FOR ALL USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can manage own video likes" ON public.video_likes;
CREATE POLICY "Users can manage own video likes" ON public.video_likes FOR ALL USING ((auth.uid() = user_id));

-- consent_records / user_sessions / notifications / user_reading_progress
DROP POLICY IF EXISTS "Users can manage own consent" ON public.consent_records;
CREATE POLICY "Users can manage own consent" ON public.consent_records FOR ALL USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can manage own sessions" ON public.user_sessions;
CREATE POLICY "Users can manage own sessions" ON public.user_sessions FOR ALL USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can manage own notifications" ON public.notifications;
CREATE POLICY "Users can manage own notifications" ON public.notifications FOR ALL USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Users can manage own reading progress" ON public.user_reading_progress;
CREATE POLICY "Users can manage own reading progress" ON public.user_reading_progress FOR ALL USING ((auth.uid() = user_id));
DROP POLICY IF EXISTS "Admins can view all reading progress" ON public.user_reading_progress;
CREATE POLICY "Admins can view all reading progress" ON public.user_reading_progress FOR SELECT USING (public.is_admin_or_manager(auth.uid()));

-- workshops
DROP POLICY IF EXISTS "Anyone can view active workshops" ON public.workshops;
CREATE POLICY "Anyone can view active workshops" ON public.workshops FOR SELECT USING ((is_active = true));
DROP POLICY IF EXISTS "Public can view active workshops" ON public.workshops;
DROP POLICY IF EXISTS "Admins can view all workshops" ON public.workshops;
CREATE POLICY "Admins can view all workshops" ON public.workshops FOR SELECT USING (((auth.uid() IS NOT NULL) AND public.is_admin_or_manager(auth.uid())));
DROP POLICY IF EXISTS "Admins can manage workshops" ON public.workshops;
CREATE POLICY "Admins can manage workshops" ON public.workshops FOR ALL USING (public.is_admin_or_manager(auth.uid()));
DROP POLICY IF EXISTS "Admins can insert workshops" ON public.workshops;
DROP POLICY IF EXISTS "Admins can update workshops" ON public.workshops;
DROP POLICY IF EXISTS "Admins can delete workshops" ON public.workshops;

-- workshops_config / workshops_metiers
DROP POLICY IF EXISTS "workshops_config_select_public" ON public.workshops_config;
CREATE POLICY "workshops_config_select_public" ON public.workshops_config FOR SELECT USING (true);
DROP POLICY IF EXISTS "workshops_config_all_admin" ON public.workshops_config;
CREATE POLICY "workshops_config_all_admin" ON public.workshops_config FOR ALL USING ((auth.role() = 'authenticated'::text)) WITH CHECK ((auth.role() = 'authenticated'::text));
DROP POLICY IF EXISTS "workshops_metiers_select_public" ON public.workshops_metiers;
CREATE POLICY "workshops_metiers_select_public" ON public.workshops_metiers FOR SELECT USING ((is_active = true));
DROP POLICY IF EXISTS "workshops_metiers_select_admin" ON public.workshops_metiers;
CREATE POLICY "workshops_metiers_select_admin" ON public.workshops_metiers FOR SELECT USING ((auth.role() = 'authenticated'::text));
DROP POLICY IF EXISTS "workshops_metiers_all_admin" ON public.workshops_metiers;
CREATE POLICY "workshops_metiers_all_admin" ON public.workshops_metiers FOR ALL USING ((auth.role() = 'authenticated'::text)) WITH CHECK ((auth.role() = 'authenticated'::text));

-- data_processing_log / visits : lecture réservée aux admins, écriture par le serveur (service_role)
DROP POLICY IF EXISTS "Admins can read processing log" ON public.data_processing_log;
CREATE POLICY "Admins can read processing log" ON public.data_processing_log FOR SELECT USING (public.is_admin_or_manager(auth.uid()));
DROP POLICY IF EXISTS "Admins can read visits" ON public.visits;
CREATE POLICY "Admins can read visits" ON public.visits FOR SELECT USING (public.is_admin_or_manager(auth.uid()));
DROP POLICY IF EXISTS "Anyone can insert visits" ON public.visits;
CREATE POLICY "Anyone can insert visits" ON public.visits FOR INSERT WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- 7. DROITS (identiques aux défauts Supabase)
-- -----------------------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;

-- -----------------------------------------------------------------------------
-- 8. REALTIME (l'application écoute les changements sur les workshops)
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND tablename='workshops') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.workshops;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND tablename='workshops_metiers') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.workshops_metiers;
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 9. STORAGE : buckets publics (vides dans le projet cloud, créés pour compatibilité)
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true) ON CONFLICT (id) DO NOTHING;

COMMIT;
