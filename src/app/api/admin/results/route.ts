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

    // Get query parameters
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const quiz_type = url.searchParams.get('quiz_type')
    const user_id = url.searchParams.get('user_id')

    const offset = (page - 1) * limit

    // Build the query
    let query = supabase
      .from('quiz_results')
      .select(`
        *,
        profiles:user_id (
          id,
          name,
          email
        )
      `, { count: 'exact' })
      .order('completed_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (quiz_type) {
      query = query.eq('quiz_type', quiz_type)
    }

    if (user_id) {
      query = query.eq('user_id', user_id)
    }

    const { data: results, error, count } = await query

    if (error) {
      console.error('Error fetching quiz results:', error)
      return NextResponse.json({ error: 'Erreur lors de la récupération des résultats' }, { status: 500 })
    }

    return NextResponse.json({
      results: results || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error) {
    console.error('Error in GET /api/admin/results:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
