-- Schema Turso pour CIPREL Compétences App
-- Migration depuis Supabase

-- Table des utilisateurs/profils
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'USER' CHECK(role IN ('USER', 'ADMIN', 'MANAGER')),
  avatar_url TEXT,
  phone TEXT,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Table de progression de lecture
CREATE TABLE IF NOT EXISTS user_reading_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  section_id TEXT NOT NULL,
  reading_time_seconds INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
  UNIQUE(user_id, section_id)
);

-- Table des résultats de quiz
CREATE TABLE IF NOT EXISTS quiz_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  quiz_type TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  answers TEXT, -- JSON stringifié
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Table des réponses au sondage
CREATE TABLE IF NOT EXISTS survey_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_reading_progress_user ON user_reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_user ON survey_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
