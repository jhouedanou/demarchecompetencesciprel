import { NextRequest, NextResponse } from 'next/server'
import { createUserServerClient } from '@/lib/supabase/server'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createUserServerClient()

    // Vérifier l'authentification et les permissions
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
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

    // Récupérer les paramètres de requête
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const category = url.searchParams.get('category')
    const quiz_type = url.searchParams.get('quiz_type')
    const active = url.searchParams.get('active')

    const offset = (page - 1) * limit

    // Construire la requête avec filtres
    let query = supabase
      .from('questions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category) {
      query = query.eq('category', category)
    }

    if (quiz_type) {
      query = query.eq('quiz_type', quiz_type)
    }

    if (active !== null && active !== undefined) {
      query = query.eq('active', active === 'true')
    }

    const { data: questions, error, count } = await query

    if (error) {
      console.error('Erreur lors de la récupération des questions:', error)
      return NextResponse.json({ error: 'Erreur lors de la récupération des questions' }, { status: 500 })
    }

    return NextResponse.json({
      questions: questions || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    })
  } catch (error) {
    console.error('Erreur dans GET /api/admin/questions:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createUserServerClient()

    // Vérifier l'authentification et les permissions
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
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

    const body = await request.json()

    // Validation des données
    const requiredFields = ['title', 'question', 'option_a', 'option_b', 'option_c', 'correct_answer', 'category', 'quiz_type', 'points']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Le champ ${field} est requis` }, { status: 400 })
      }
    }

    // Valider que correct_answer est un tableau
    if (!Array.isArray(body.correct_answer)) {
      return NextResponse.json({ error: 'correct_answer doit être un tableau' }, { status: 400 })
    }

    // Valider la catégorie
    const validCategories = ['DEFINITION', 'RESPONSABILITE', 'COMPETENCES', 'ETAPES', 'OPINION']
    if (!validCategories.includes(body.category)) {
      return NextResponse.json({ error: 'Catégorie invalide' }, { status: 400 })
    }

    // Valider le type de quiz
    const validQuizTypes = ['INTRODUCTION', 'SONDAGE']
    if (!validQuizTypes.includes(body.quiz_type)) {
      return NextResponse.json({ error: 'Type de quiz invalide' }, { status: 400 })
    }

    // Valider les points
    if (typeof body.points !== 'number' || body.points < 0) {
      return NextResponse.json({ error: 'Les points doivent être un nombre positif' }, { status: 400 })
    }

    // Obtenir le prochain order_index si non fourni
    let order_index = body.order_index
    if (order_index === undefined || order_index === null) {
      const { data: lastQuestion } = await supabase
        .from('questions')
        .select('order_index')
        .eq('quiz_type', body.quiz_type)
        .order('order_index', { ascending: false })
        .limit(1)
        .single()

      order_index = (lastQuestion?.order_index || 0) + 1
    }

    // Créer la question
    const questionData = {
      title: body.title,
      question: body.question,
      option_a: body.option_a,
      option_b: body.option_b,
      option_c: body.option_c,
      option_d: body.option_d || null,
      correct_answer: body.correct_answer,
      category: body.category,
      quiz_type: body.quiz_type,
      points: body.points,
      feedback: body.feedback || null,
      explanation: body.explanation || null,
      order_index,
      active: body.active !== undefined ? body.active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: question, error } = await supabase
      .from('questions')
      .insert([questionData])
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la création de la question:', error)
      return NextResponse.json({ error: 'Erreur lors de la création de la question' }, { status: 500 })
    }

    return NextResponse.json({ question }, { status: 201 })
  } catch (error) {
    console.error('Erreur dans POST /api/admin/questions:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}