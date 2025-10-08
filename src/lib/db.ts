import { createClient } from '@libsql/client'

// Configuration pour Turso (compatible Vercel) ou SQLite local
const isTurso = !!(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN)

console.log(`⚡ [Database] Initializing ${isTurso ? 'Turso (remote)' : 'SQLite (local)'}...`)

export const db = isTurso
  ? createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    })
  : createClient({
      url: 'file:./data/ciprel.db',
    })

console.log('✅ [Database] Initialized successfully')

// Fonction pour initialiser le schéma
export async function initializeSchema() {
  console.log('🔧 [Database] Initializing schema...')

  const statements = [
    // Table des utilisateurs/profils
    `CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'USER' CHECK(role IN ('USER', 'ADMIN', 'MANAGER')),
      avatar_url TEXT,
      phone TEXT,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,

    // Table de progression de lecture
    `CREATE TABLE IF NOT EXISTS user_reading_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      section_id TEXT NOT NULL,
      reading_time_seconds INTEGER DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
      UNIQUE(user_id, section_id)
    )`,

    // Table des résultats de quiz
    `CREATE TABLE IF NOT EXISTS quiz_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      quiz_type TEXT NOT NULL,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      passed BOOLEAN NOT NULL,
      answers TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
    )`,

    // Table des réponses au sondage
    `CREATE TABLE IF NOT EXISTS survey_responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      answer TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
    )`,

    // Index pour performance
    `CREATE INDEX IF NOT EXISTS idx_reading_progress_user ON user_reading_progress(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_quiz_results_user ON quiz_results(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_survey_responses_user ON survey_responses(user_id)`,
    `CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email)`,
  ]

  try {
    await db.batch(statements, 'write')
    console.log('✨ [Database] Schema initialized successfully')
  } catch (error) {
    console.error('❌ [Database] Schema initialization failed:', error)
  }
}

// Initialiser le schéma au démarrage
initializeSchema()

// Helper pour les queries avec logs de performance
export async function executeQuery<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const startTime = performance.now()

  try {
    const result = await db.execute({ sql, args: params })

    const elapsed = performance.now() - startTime
    console.log(`✅ [Database] Query completed in ${elapsed.toFixed(1)}ms, ${result.rows.length} rows`)

    return result.rows as T[]
  } catch (error) {
    const elapsed = performance.now() - startTime
    console.error(`❌ [Database] Query failed after ${elapsed.toFixed(1)}ms:`, error)
    console.error('SQL:', sql)
    console.error('Params:', params)
    throw error
  }
}

// Helper pour les insertions/updates
export async function executeRun(sql: string, params: any[] = []): Promise<any> {
  const startTime = performance.now()

  try {
    const result = await db.execute({ sql, args: params })

    const elapsed = performance.now() - startTime
    console.log(`✅ [Database] Run completed in ${elapsed.toFixed(1)}ms, changes: ${result.rowsAffected}`)

    return result
  } catch (error) {
    const elapsed = performance.now() - startTime
    console.error(`❌ [Database] Run failed after ${elapsed.toFixed(1)}ms:`, error)
    console.error('SQL:', sql)
    console.error('Params:', params)
    throw error
  }
}

// Helper pour les transactions
export async function transaction<T>(statements: Array<{ sql: string; args?: any[] }>): Promise<void> {
  const startTime = performance.now()
  console.log('🔄 [Database] Starting transaction...')

  try {
    await db.batch(statements, 'write')

    const elapsed = performance.now() - startTime
    console.log(`✅ [Database] Transaction completed in ${elapsed.toFixed(1)}ms`)
  } catch (error) {
    const elapsed = performance.now() - startTime
    console.error(`❌ [Database] Transaction failed after ${elapsed.toFixed(1)}ms:`, error)
    throw error
  }
}

export default db
