import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api/auth'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('[API] stats - Authenticating request...')

    // Authenticate and check admin permissions
    const { user, supabase, error: authError } = await requireAdmin(request)

    if (authError) {
      console.warn('[API] stats - Authentication failed:', authError.message)
      return NextResponse.json({ error: authError.message }, { status: authError.status })
    }

    console.log('[API] stats - User authenticated:', user.email)

    // Calculer les statistiques individuellement pour éviter qu'une erreur bloque tout
    // Use head:true for count-only queries to avoid transferring row data
    const results = await Promise.allSettled([
      // Total utilisateurs (count only, no data transfer)
      supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true }),

      // Total quiz complétés (count only)
      supabase
        .from('quiz_results')
        .select('id', { count: 'exact', head: true }),

      // Total vidéos (count only)
      supabase
        .from('videos')
        .select('id', { count: 'exact', head: true })
        .eq('active', true),

      // Score moyen des quiz - limit to last 1000 for performance
      supabase
        .from('quiz_results')
        .select('percentage')
        .order('completed_at', { ascending: false })
        .limit(1000),

      // Utilisateurs actifs aujourd'hui (count only)
      supabase
        .from('visits')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
    ])

    const usersResult = results[0].status === 'fulfilled' ? results[0].value : { count: 0, data: [] }
    const quizAttemptsResult = results[1].status === 'fulfilled' ? results[1].value : { count: 0, data: [] }
    const videosResult = results[2].status === 'fulfilled' ? results[2].value : { count: 0, data: [] }
    const averageScoreResult = results[3].status === 'fulfilled' ? results[3].value : { data: [] }
    const activeTodayResult = results[4].status === 'fulfilled' ? results[4].value : { count: 0, data: [] }

    // Calculer le score moyen
    const scores = averageScoreResult.data || []
    const averageScore = scores.length > 0
      ? scores.reduce((sum: number, result: any) => sum + (result.percentage || 0), 0) / scores.length
      : 0

    // Calculer le taux de complétion (approximation)
    const totalAttempts = quizAttemptsResult.count || 0
    const totalUsers = usersResult.count || 1
    const completionRate = totalUsers > 0 ? (totalAttempts / totalUsers) * 100 : 0

    // Fetch total questions count
    let totalQuestions = 0
    try {
      const { count } = await supabase
        .from('questions')
        .select('id', { count: 'exact' })
      totalQuestions = count || 0
    } catch {
      // Ignore - table might not exist
    }

    const stats = {
      totalUsers: usersResult.count || 0,
      totalQuizAttempts: totalAttempts,
      totalQuizResults: totalAttempts,
      totalVideos: videosResult.count || 0,
      totalQuestions,
      averageScore: Math.round(averageScore),
      completionRate: Math.round(completionRate),
      activeToday: activeTodayResult.count || 0,
      quizzesByType: {},
      recentActivity: []
    }

    const response = NextResponse.json(stats)
    // Cache for 60s on Vercel CDN, serve stale for 5min while revalidating
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
    return response
  } catch (error) {
    console.error('Erreur dans GET /api/admin/analytics/stats:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
