import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api/auth'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Authenticate and check admin permissions
    const { user, supabase, error: authError } = await requireAdmin(request)

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: authError.status })
    }

    // Récupérer les activités récentes
    const activities: Array<{
      id: string;
      type: string;
      user_name: string;
      user_email: string;
      user_avatar: string | null;
      details: string;
      timestamp: string;
      status: string;
    }> = []

    // Run all 3 queries IN PARALLEL instead of sequentially
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const [usersResult, quizResult, videoResult] = await Promise.allSettled([
      // Nouvelles inscriptions (dernières 24h)
      supabase
        .from('profiles')
        .select('id, name, email, avatar_url, created_at')
        .gte('created_at', last24h)
        .order('created_at', { ascending: false })
        .limit(10),

      // Quiz complétés récemment
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

      // Vues vidéos récentes
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

    const newUsers = usersResult.status === 'fulfilled' ? usersResult.value.data : null
    const recentQuiz = quizResult.status === 'fulfilled' ? quizResult.value.data : null
    const recentVideoViews = videoResult.status === 'fulfilled' ? videoResult.value.data : null

    if (newUsers) {
      newUsers.forEach((user: any) => {
        activities.push({
          id: `signup_${user.id}`,
          type: 'user_signup',
          user_name: user.name || 'Utilisateur anonyme',
          user_email: user.email,
          user_avatar: user.avatar_url,
          details: 'S\'est inscrit sur la plateforme',
          timestamp: user.created_at,
          status: 'success'
        })
      })
    }

    if (recentQuiz) {
      recentQuiz.forEach((quiz: any) => {
        const profile = (quiz as any).profiles
        activities.push({
          id: `quiz_${quiz.id}`,
          type: 'quiz_completed',
          user_name: profile.name || 'Utilisateur anonyme',
          user_email: profile.email,
          user_avatar: profile.avatar_url,
          details: `A complété le quiz ${quiz.quiz_type} avec ${quiz.percentage}% de réussite`,
          timestamp: quiz.completed_at,
          status: (quiz.percentage || 0) >= 70 ? 'success' : 'warning'
        })
      })
    }

    if (recentVideoViews) {
      recentVideoViews.forEach((view: any) => {
        const profile = (view as any).profiles
        const video = (view as any).videos
        activities.push({
          id: `video_${view.id}`,
          type: 'video_viewed',
          user_name: profile.name || 'Utilisateur anonyme',
          user_email: profile.email,
          user_avatar: profile.avatar_url,
          details: `A regardé "${video.title}"${view.completed ? ' (complètement)' : ''}`,
          timestamp: view.viewed_at,
          status: 'success'
        })
      })
    }

    // Trier les activités par date décroissante
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    const response = NextResponse.json({
      activities: activities.slice(0, 20) // Limiter à 20 activités
    })
    // Cache for 30s on Vercel CDN, serve stale for 2min while revalidating
    response.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=120')
    return response
  } catch (error) {
    console.error('Erreur dans GET /api/admin/analytics/activity:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
