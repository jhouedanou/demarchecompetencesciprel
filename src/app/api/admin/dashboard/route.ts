import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api/auth'

/**
 * Combined dashboard endpoint - Returns ALL data needed for the admin dashboard
 * in a single request. This avoids multiple cold starts on Vercel.
 * 
 * Cache strategy: stale-while-revalidate for 60s, with 5min stale window.
 */

export const dynamic = 'force-dynamic'
export const maxDuration = 15 // Allow up to 15 seconds for this combined query

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Single auth check for all data
    const { user, supabase, error: authError } = await requireAdmin(request)

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: authError.status })
    }

    const authTime = Date.now() - startTime
    console.log(`[Dashboard API] Auth completed in ${authTime}ms`)

    // ======= ALL QUERIES IN PARALLEL =======
    const now = new Date()
    const todayStart = new Date(now.setHours(0, 0, 0, 0)).toISOString()
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const results = await Promise.allSettled([
      // 0: Total users (count only)
      supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true }),

      // 1: Total quiz results (count only)
      supabase
        .from('quiz_results')
        .select('id', { count: 'exact', head: true }),

      // 2: Total active videos (count only)
      supabase
        .from('videos')
        .select('id', { count: 'exact', head: true })
        .eq('active', true),

      // 3: Average score - use Supabase RPC or limit query
      // Only fetch percentage column, limit to last 1000 for performance
      supabase
        .from('quiz_results')
        .select('percentage')
        .order('completed_at', { ascending: false })
        .limit(1000),

      // 4: Active today (count only)
      supabase
        .from('visits')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', todayStart),

      // 5: Total questions (count only)
      supabase
        .from('questions')
        .select('id', { count: 'exact', head: true }),

      // 6: Recent signups (last 24h) for activity feed
      supabase
        .from('profiles')
        .select('id, name, email, avatar_url, created_at')
        .gte('created_at', last24h)
        .order('created_at', { ascending: false })
        .limit(10),

      // 7: Recent quiz completions for activity feed
      supabase
        .from('quiz_results')
        .select(`
          id,
          quiz_type,
          score,
          max_score,
          percentage,
          completed_at,
          profiles!inner(name, email, avatar_url)
        `)
        .gte('completed_at', last24h)
        .order('completed_at', { ascending: false })
        .limit(10),

      // 8: Recent video views for activity feed
      supabase
        .from('video_views')
        .select(`
          id,
          viewed_at,
          watch_duration,
          completed,
          profiles!inner(name, email, avatar_url),
          videos!inner(title)
        `)
        .gte('viewed_at', last24h)
        .order('viewed_at', { ascending: false })
        .limit(10),
    ])

    const queryTime = Date.now() - startTime - authTime
    console.log(`[Dashboard API] All queries completed in ${queryTime}ms`)

    // ======= PROCESS STATS =======
    const getValue = <T>(index: number, defaultVal: T): T => {
      if (results[index].status === 'fulfilled') {
        return results[index].value as T
      }
      console.warn(`[Dashboard API] Query ${index} failed:`, results[index].status === 'rejected' ? results[index].reason : 'unknown')
      return defaultVal
    }

    const usersResult = getValue<{ count: number | null; data: any[] | null }>(0, { count: 0, data: [] })
    const quizResult = getValue<{ count: number | null; data: any[] | null }>(1, { count: 0, data: [] })
    const videosResult = getValue<{ count: number | null; data: any[] | null }>(2, { count: 0, data: [] })
    const scoresResult = getValue<{ data: any[] | null }>(3, { data: [] })
    const activeTodayResult = getValue<{ count: number | null; data: any[] | null }>(4, { count: 0, data: [] })
    const questionsResult = getValue<{ count: number | null; data: any[] | null }>(5, { count: 0, data: [] })

    // Calculate average score from limited dataset
    const scores = scoresResult.data || []
    const averageScore = scores.length > 0
      ? scores.reduce((sum: number, r: any) => sum + (r.percentage || 0), 0) / scores.length
      : 0

    const totalAttempts = quizResult.count || 0
    const totalUsers = usersResult.count || 1
    const completionRate = totalUsers > 0 ? (totalAttempts / totalUsers) * 100 : 0

    const stats = {
      totalUsers: usersResult.count || 0,
      totalQuizAttempts: totalAttempts,
      totalQuizResults: totalAttempts,
      totalVideos: videosResult.count || 0,
      totalQuestions: questionsResult.count || 0,
      averageScore: Math.round(averageScore),
      completionRate: Math.round(completionRate),
      activeToday: activeTodayResult.count || 0,
    }

    // ======= PROCESS ACTIVITY FEED =======
    const activities: Array<{
      id: string
      type: string
      user_name: string
      user_email: string
      user_avatar: string | null
      details: string
      timestamp: string
      status: string
    }> = []

    // New users
    const newUsersResult = getValue<{ data: any[] | null }>(6, { data: [] })
    if (newUsersResult.data) {
      for (const u of newUsersResult.data) {
        activities.push({
          id: `signup_${u.id}`,
          type: 'user_signup',
          user_name: u.name || 'Utilisateur anonyme',
          user_email: u.email,
          user_avatar: u.avatar_url,
          details: 'S\'est inscrit sur la plateforme',
          timestamp: u.created_at,
          status: 'success',
        })
      }
    }

    // Recent quizzes
    const recentQuizResult = getValue<{ data: any[] | null }>(7, { data: [] })
    if (recentQuizResult.data) {
      for (const quiz of recentQuizResult.data) {
        const profile = (quiz as any).profiles
        activities.push({
          id: `quiz_${quiz.id}`,
          type: 'quiz_completed',
          user_name: profile?.name || 'Utilisateur anonyme',
          user_email: profile?.email || '',
          user_avatar: profile?.avatar_url || null,
          details: `A complété le quiz ${quiz.quiz_type} avec ${quiz.percentage}% de réussite`,
          timestamp: quiz.completed_at,
          status: (quiz.percentage || 0) >= 70 ? 'success' : 'warning',
        })
      }
    }

    // Recent video views
    const recentViewsResult = getValue<{ data: any[] | null }>(8, { data: [] })
    if (recentViewsResult.data) {
      for (const view of recentViewsResult.data) {
        const profile = (view as any).profiles
        const video = (view as any).videos
        activities.push({
          id: `video_${view.id}`,
          type: 'video_viewed',
          user_name: profile?.name || 'Utilisateur anonyme',
          user_email: profile?.email || '',
          user_avatar: profile?.avatar_url || null,
          details: `A regardé "${video?.title || 'Vidéo'}"${view.completed ? ' (complètement)' : ''}`,
          timestamp: view.viewed_at,
          status: 'success',
        })
      }
    }

    // Sort by timestamp descending
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // ======= PROCESS CHART DATA (lightweight simulation) =======
    const period = 7
    const userActivity = []
    const baseDate = new Date()
    for (let i = period; i >= 0; i--) {
      const date = new Date(baseDate)
      date.setDate(baseDate.getDate() - i)
      userActivity.push({
        date: date.toISOString().split('T')[0],
        users: Math.floor(Math.random() * 50) + 10,
        quiz_completions: Math.floor(Math.random() * 20) + 5,
        video_views: Math.floor(Math.random() * 100) + 20,
      })
    }

    const categories = ['DEFINITION', 'RESPONSABILITE', 'COMPETENCES', 'ETAPES']
    const quizPerformanceData = categories.map(category => ({
      category,
      average_score: Math.floor(Math.random() * 30) + 60,
      attempts: Math.floor(Math.random() * 100) + 10,
    }))

    const deviceStats = [
      { name: 'Mobile', value: 45, color: '#3B82F6' },
      { name: 'Desktop', value: 35, color: '#10B981' },
      { name: 'Tablet', value: 20, color: '#8B5CF6' },
    ]

    const chartData = {
      userActivity,
      quizPerformance: quizPerformanceData,
      deviceStats,
    }

    const totalTime = Date.now() - startTime
    console.log(`[Dashboard API] Total response time: ${totalTime}ms`)

    // ======= RESPONSE WITH CACHE HEADERS =======
    const response = NextResponse.json({
      stats,
      activities: activities.slice(0, 20),
      chartData,
      _meta: {
        fetchedAt: new Date().toISOString(),
        responseTimeMs: totalTime,
      },
    })

    // Cache for 60s on Vercel CDN, serve stale for up to 5min while revalidating
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300'
    )

    return response
  } catch (error) {
    console.error('[Dashboard API] Error:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
