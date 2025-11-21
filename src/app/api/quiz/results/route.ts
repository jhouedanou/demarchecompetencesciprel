import { NextRequest, NextResponse } from 'next/server'
import { createUserServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createUserServerClient()

    // Check authentication
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Non autorisé', message: 'Vous devez être connecté.' },
        { status: 401 }
      )
    }

    console.log('📊 [GET /api/quiz/results] Fetching results for user:', session.user.id)

    // Fetch quiz results for the authenticated user
    const { data: results, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', session.user.id)
      .order('completed_at', { ascending: false })

    if (error) {
      console.error('❌ [GET /api/quiz/results] Database error:', error)
      return NextResponse.json(
        { error: 'Erreur de base de données', message: error.message },
        { status: 500 }
      )
    }

    console.log(`✅ [GET /api/quiz/results] Found ${results?.length || 0} results`)

    return NextResponse.json({
      success: true,
      results: results || [],
      total: results?.length || 0
    })
  } catch (error: any) {
    console.error('❌ [GET /api/quiz/results] Server error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur', message: error.message },
      { status: 500 }
    )
  }
}
