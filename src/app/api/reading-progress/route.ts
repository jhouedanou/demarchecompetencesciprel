import { NextRequest, NextResponse } from 'next/server'
import { createUserServerClient } from '@/lib/supabase/server'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createUserServerClient()
    
    // Vérifier l'authentification
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Récupérer la progression de lecture
    const { data, error } = await supabase
      .from('user_reading_progress')
      .select('*')
      .eq('user_id', session.user.id)

    if (error) {
      console.error('Error loading reading progress:', error)
      return NextResponse.json({ error: 'Erreur de base de données' }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error in GET /api/reading-progress:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createUserServerClient()
    
    // Vérifier l'authentification
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { section_id, section_title, reading_time_seconds, completed_at } = body

    // Validation
    if (!section_id || !section_title) {
      return NextResponse.json({ 
        error: 'Données manquantes',
        message: 'section_id et section_title sont requis' 
      }, { status: 400 })
    }

    // Sauvegarder la progression
    const { data, error } = await supabase
      .from('user_reading_progress')
      .upsert({
        user_id: session.user.id,
        section_id,
        section_title,
        reading_time_seconds: reading_time_seconds || 0,
        completed_at: completed_at || new Date().toISOString()
      }, {
        onConflict: 'user_id,section_id'
      })
      .select()

    if (error) {
      console.error('Error saving reading progress:', error)
      return NextResponse.json({ 
        error: 'Erreur lors de la sauvegarde',
        message: error.message 
      }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error in POST /api/reading-progress:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
