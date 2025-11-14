import { NextRequest, NextResponse } from 'next/server'
import { createUserServerClient } from '@/lib/supabase/server'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createUserServerClient()

    console.log('[API] stats - Checking session...')
    // Vérifier l'authentification et les permissions
    const {
      data: { session },
    } = await supabase.auth.getSession()

    console.log('[API] stats - Session:', session ? `authenticated as ${session.user.email}` : 'not authenticated')

    if (!session) {
      console.warn('[API] stats - No session, returning 401')
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    // Vérifier les permissions admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['ADMIN', 'MANAGER'].includes(profile.role)) {
      return NextResponse.json({ error: 'Permissions insuffisantes' }, { status: 403 })
    }

    // Calculer les statistiques
    const [
      usersResult,
      quizAttemptsResult,
      videosResult,
      averageScoreResult,
      activeTodayResult
    ] = await Promise.all([
      // Total utilisateurs
      supabase
        .from('profiles')
        .select('id', { count: 'exact' }),
      
      // Total quiz complétés
      supabase
        .from('quiz_results')
        .select('id', { count: 'exact' }),
      
      // Total vidéos
      supabase
        .from('videos')
        .select('id', { count: 'exact' })
        .eq('active', true),
      
      // Score moyen des quiz
      supabase
        .from('quiz_results')
        .select('percentage'),
      
      // Utilisateurs actifs aujourd'hui
      supabase
        .from('visits')
        .select('user_id', { count: 'exact' })
        .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
    ])

    // Calculer le score moyen
    const scores = averageScoreResult.data || []
    const averageScore = scores.length > 0 
      ? scores.reduce((sum, result) => sum + (result.percentage || 0), 0) / scores.length 
      : 0

    // Calculer le taux de complétion (approximation)
    const totalAttempts = quizAttemptsResult.count || 0
    const totalUsers = usersResult.count || 1
    const completionRate = totalUsers > 0 ? (totalAttempts / totalUsers) * 100 : 0

    const stats = {
      totalUsers: usersResult.count || 0,
      totalQuizAttempts: totalAttempts,
      totalVideos: videosResult.count || 0,
      averageScore: Math.round(averageScore),
      completionRate: Math.round(completionRate),
      activeToday: activeTodayResult.count || 0
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erreur dans GET /api/admin/analytics/stats:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
