import { NextRequest, NextResponse } from 'next/server'
import { executeQuery, executeRun } from '@/lib/db'
import { parse } from 'cookie'

// Helper pour obtenir l'utilisateur de la session
async function getUserFromSession(request: NextRequest) {
  const cookies = parse(request.headers.get('cookie') || '')
  const sessionToken = cookies.session

  if (!sessionToken) {
    return null
  }

  try {
    const sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString())
    return sessionData.userId
  } catch (e) {
    return null
  }
}

// GET - Récupérer la progression
export async function GET(request: NextRequest) {
  const startTime = performance.now()
  console.log('📊 [API /progress] GET request')

  try {
    const userId = await getUserFromSession(request)

    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const progress = await executeQuery(
      'SELECT * FROM user_reading_progress WHERE user_id = ?',
      [userId]
    )

    const elapsed = performance.now() - startTime
    console.log(`✅ [API /progress] GET completed in ${elapsed.toFixed(0)}ms, ${progress.length} items`)

    return NextResponse.json({ progress }, { status: 200 })
  } catch (error) {
    const elapsed = performance.now() - startTime
    console.error(`❌ [API /progress] GET error after ${elapsed.toFixed(0)}ms:`, error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST - Marquer une section comme complétée
export async function POST(request: NextRequest) {
  const startTime = performance.now()
  console.log('📝 [API /progress] POST request')

  try {
    const userId = await getUserFromSession(request)

    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { section_id, reading_time_seconds = 0 } = body

    if (!section_id) {
      return NextResponse.json({ error: 'section_id requis' }, { status: 400 })
    }

    const now = new Date().toISOString()

    // Insert ou update
    await executeRun(
      `INSERT INTO user_reading_progress (user_id, section_id, reading_time_seconds, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(user_id, section_id)
       DO UPDATE SET reading_time_seconds = ?, updated_at = ?`,
      [userId, section_id, reading_time_seconds, now, now, reading_time_seconds, now]
    )

    const elapsed = performance.now() - startTime
    console.log(`✅ [API /progress] POST completed in ${elapsed.toFixed(0)}ms`)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    const elapsed = performance.now() - startTime
    console.error(`❌ [API /progress] POST error after ${elapsed.toFixed(0)}ms:`, error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE - Réinitialiser la progression
export async function DELETE(request: NextRequest) {
  const startTime = performance.now()
  console.log('🗑️ [API /progress] DELETE request')

  try {
    const userId = await getUserFromSession(request)

    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    await executeRun('DELETE FROM user_reading_progress WHERE user_id = ?', [userId])

    const elapsed = performance.now() - startTime
    console.log(`✅ [API /progress] DELETE completed in ${elapsed.toFixed(0)}ms`)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    const elapsed = performance.now() - startTime
    console.error(`❌ [API /progress] DELETE error after ${elapsed.toFixed(0)}ms:`, error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
