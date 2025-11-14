import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api/auth'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate and check admin permissions
    const { user, supabase, error: authError } = await requireAdmin(request)

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: authError.status })
    }

    const { data: question, error } = await supabase
      .from('questions')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Question non trouvée' }, { status: 404 })
      }
      console.error('Erreur lors de la récupération de la question:', error)
      return NextResponse.json({ error: 'Erreur lors de la récupération de la question' }, { status: 500 })
    }

    return NextResponse.json({ question })
  } catch (error) {
    console.error('Erreur dans GET /api/admin/questions/[id]:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate and check admin permissions
    const { user, supabase, error: authError } = await requireAdmin(request)

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: authError.status })
    }

    const body = await request.json()

    // Vérifier que la question existe
    const { data: existingQuestion, error: fetchError } = await supabase
      .from('questions')
      .select('id')
      .eq('id', params.id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Question non trouvée' }, { status: 404 })
      }
      console.error('Erreur lors de la vérification de la question:', fetchError)
      return NextResponse.json({ error: 'Erreur lors de la vérification de la question' }, { status: 500 })
    }

    // Validation des données si fournies
    if (body.correct_answer && !Array.isArray(body.correct_answer)) {
      return NextResponse.json({ error: 'correct_answer doit être un tableau' }, { status: 400 })
    }

    if (body.category) {
      const validCategories = ['DEFINITION', 'RESPONSABILITE', 'COMPETENCES', 'ETAPES', 'OPINION']
      if (!validCategories.includes(body.category)) {
        return NextResponse.json({ error: 'Catégorie invalide' }, { status: 400 })
      }
    }

    if (body.quiz_type) {
      const validQuizTypes = ['INTRODUCTION', 'SONDAGE']
      if (!validQuizTypes.includes(body.quiz_type)) {
        return NextResponse.json({ error: 'Type de quiz invalide' }, { status: 400 })
      }
    }

    if (body.points !== undefined && (typeof body.points !== 'number' || body.points < 0)) {
      return NextResponse.json({ error: 'Les points doivent être un nombre positif' }, { status: 400 })
    }

    // Préparer les données de mise à jour
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    // Ajouter seulement les champs fournis
    const allowedFields = ['title', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer', 'category', 'quiz_type', 'points', 'feedback', 'explanation', 'order_index', 'active']

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    const { data: question, error } = await supabase
      .from('questions')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la mise à jour de la question:', error)
      return NextResponse.json({ error: 'Erreur lors de la mise à jour de la question' }, { status: 500 })
    }

    return NextResponse.json({ question })
  } catch (error) {
    console.error('Erreur dans PUT /api/admin/questions/[id]:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate and check admin permissions
    const { user, supabase, error: authError } = await requireAdmin(request)

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: authError.status })
    }

    // Vérifier que la question existe
    const { data: existingQuestion, error: fetchError } = await supabase
      .from('questions')
      .select('id')
      .eq('id', params.id)
      .single()

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Question non trouvée' }, { status: 404 })
      }
      console.error('Erreur lors de la vérification de la question:', fetchError)
      return NextResponse.json({ error: 'Erreur lors de la vérification de la question' }, { status: 500 })
    }

    // Supprimer la question (soft delete en désactivant)
    const { error } = await supabase
      .from('questions')
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq('id', params.id)

    if (error) {
      console.error('Erreur lors de la suppression de la question:', error)
      return NextResponse.json({ error: 'Erreur lors de la suppression de la question' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Question supprimée avec succès' })
  } catch (error) {
    console.error('Erreur dans DELETE /api/admin/questions/[id]:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}