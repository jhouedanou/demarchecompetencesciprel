import { NextRequest, NextResponse } from 'next/server'
import { createUserServerClient } from '@/lib/supabase/server'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = createUserServerClient()
    const { searchParams } = new URL(request.url)
    const quizType = searchParams.get('type') as 'INTRODUCTION' | 'SONDAGE'
    
    if (!quizType || !['INTRODUCTION', 'SONDAGE'].includes(quizType)) {
      return NextResponse.json({ error: 'Type de quiz invalide' }, { status: 400 })
    }

    // Récupérer les questions du quiz
    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_type', quizType)
      .eq('active', true)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Erreur lors de la récupération des questions:', error)
      return NextResponse.json({ error: 'Erreur de base de données' }, { status: 500 })
    }

    return NextResponse.json({
      questions: questions || [],
      total: questions?.length || 0
    })
  } catch (error) {
    console.error('Erreur dans GET /api/quiz:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createUserServerClient()
    
    // Vérifier l'authentification
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const {
      quiz_type,
      responses,
      score,
      max_score,
      total_questions,
      correct_answers,
      duration,
      started_at
    } = body

    // Validation des données
    if (!quiz_type || !['INTRODUCTION', 'SONDAGE'].includes(quiz_type)) {
      return NextResponse.json({ error: 'Type de quiz invalide' }, { status: 400 })
    }

    if (!responses || !Array.isArray(responses)) {
      return NextResponse.json({ error: 'Réponses manquantes' }, { status: 400 })
    }

    // Calculer le pourcentage
    const percentage = max_score > 0 ? (score / max_score) * 100 : 0

    // Déterminer le numéro de tentative
    const { data: previousAttempts } = await supabase
      .from('quiz_results')
      .select('attempt_number')
      .eq('user_id', session.user.id)
      .eq('quiz_type', quiz_type)
      .order('attempt_number', { ascending: false })
      .limit(1)

    const attemptNumber = previousAttempts?.[0]?.attempt_number ? 
      previousAttempts[0].attempt_number + 1 : 1

    // Sauvegarder le résultat
    const { data: result, error } = await supabase
      .from('quiz_results')
      .insert({
        user_id: session.user.id,
        quiz_type,
        score,
        max_score,
        total_questions,
        correct_answers,
        responses: {
          answers: responses,
          metadata: {
            started_at: started_at || new Date().toISOString(),
            duration,
            attempt_number: attemptNumber
          }
        },
        duration,
        percentage: parseFloat(percentage.toFixed(2)),
        attempt_number: attemptNumber,
        started_at: started_at || new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la sauvegarde du résultat:', error)
      return NextResponse.json({ error: 'Erreur lors de la sauvegarde' }, { status: 500 })
    }

    // Log pour audit
    await supabase
      .from('data_processing_log')
      .insert({
        user_id: session.user.id,
        data_type: 'QUIZ_RESPONSES',
        action: 'CREATE',
        purpose: 'Quiz completion and results storage',
        legal_basis: 'LEGITIMATE_INTEREST',
      })

    return NextResponse.json({
      success: true,
      result: {
        id: result.id,
        score,
        max_score,
        percentage,
        attempt_number: attemptNumber,
        completed_at: result.completed_at
      }
    })
  } catch (error) {
    console.error('Erreur dans POST /api/quiz:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
