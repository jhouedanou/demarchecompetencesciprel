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
      console.error('Erreur lors de la récupération de la question:', error)
      return NextResponse.json({ error: 'Question non trouvée' }, { status: 404 })
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

    // Validation
    const validCategories = ['DEFINITION', 'RESPONSABILITE', 'COMPETENCES', 'ETAPES', 'OPINION']
    const validQuizTypes = ['INTRODUCTION', 'SONDAGE', 'WORKSHOP']

    if (body.category && !validCategories.includes(body.category)) {
      return NextResponse.json({ error: 'Catégorie invalide' }, { status: 400 })
    }

    if (body.quiz_type && !validQuizTypes.includes(body.quiz_type)) {
      return NextResponse.json({ error: 'Type de quiz invalide' }, { status: 400 })
    }

    // Mettre à jour la question
    const { data: question, error } = await supabase
      .from('questions')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Erreur lors de la mise à jour:', error)
      return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
    }

    if (!question) {
      return NextResponse.json({ error: 'Question non trouvée' }, { status: 404 })
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

    // Supprimer la question
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Erreur lors de la suppression:', error)
      return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Erreur dans DELETE /api/admin/questions/[id]:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
