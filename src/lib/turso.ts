import { createClient, type Client } from '@libsql/client'

// Configuration Turso
const tursoUrl = process.env.NEXT_PUBLIC_TURSO_DATABASE_URL
const tursoAuthToken = process.env.NEXT_PUBLIC_TURSO_AUTH_TOKEN

if (!tursoUrl) {
  console.warn('⚠️ [Turso] NEXT_PUBLIC_TURSO_DATABASE_URL is not set')
}

console.log('⚡ [Turso Config] Initializing Turso client...')
console.log('🔑 [Turso Config] URL:', tursoUrl ? `✅ ${tursoUrl}` : '❌ Not set')
console.log('🔑 [Turso Config] Token:', tursoAuthToken ? `✅ Set (${tursoAuthToken.substring(0, 20)}...)` : '❌ Not set')

// Créer le client Turso
export const turso: Client = createClient({
  url: tursoUrl || 'file:local.db', // Fallback vers base locale pour développement
  authToken: tursoAuthToken,
})

console.log('✨ [Turso Config] Client initialized successfully')

// Helper pour logger les queries
export async function executeQuery<T = any>(
  sql: string,
  args?: any[]
): Promise<T[]> {
  const startTime = performance.now()
  console.log('📡 [Turso Query]', sql, args)

  try {
    const result = await turso.execute({ sql, args: args || [] })
    const elapsed = performance.now() - startTime

    console.log(`✅ [Turso Query] Completed in ${elapsed.toFixed(0)}ms, ${result.rows.length} rows`)

    return result.rows as T[]
  } catch (error) {
    const elapsed = performance.now() - startTime
    console.error(`❌ [Turso Query] Failed after ${elapsed.toFixed(0)}ms:`, error)
    throw error
  }
}

// Helper pour les transactions
export async function transaction<T>(
  callback: (tx: Client) => Promise<T>
): Promise<T> {
  console.log('🔄 [Turso] Starting transaction...')
  const startTime = performance.now()

  try {
    await turso.execute('BEGIN TRANSACTION')
    const result = await callback(turso)
    await turso.execute('COMMIT')

    const elapsed = performance.now() - startTime
    console.log(`✅ [Turso] Transaction completed in ${elapsed.toFixed(0)}ms`)

    return result
  } catch (error) {
    await turso.execute('ROLLBACK')
    const elapsed = performance.now() - startTime
    console.error(`❌ [Turso] Transaction failed after ${elapsed.toFixed(0)}ms:`, error)
    throw error
  }
}

export default turso
