import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/api/auth'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Authenticate and check admin permissions
    const { user: currentUser, supabase, error: authError } = await requireAdmin(request)

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: authError.status })
    }

    // Récupérer l'utilisateur
    const { data: user, error: dbError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', params.id)
      .single()

    if (dbError) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Erreur dans GET /api/admin/users/[id]:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Authenticate and check admin permissions
    const { user, supabase, error: authError } = await requireAdmin(request)

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: authError.status })
    }

    const body = await request.json()
    const { name, phone, role, avatar_url } = body

    // Validation du rôle
    if (role && !['USER', 'MANAGER', 'ADMIN'].includes(role)) {
      return NextResponse.json({ error: 'Rôle invalide' }, { status: 400 })
    }

    // Mettre à jour le profil
    const { data: updatedUser, error: dbError } = await supabase
      .from('profiles')
      .update({
        name,
        phone,
        role,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (dbError) {
      console.error('Erreur lors de la mise à jour:', dbError)
      return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
    }

    // Log de l'action pour audit
    await supabase
      .from('data_processing_log')
      .insert({
        user_id: params.id,
        data_type: 'PERSONAL_INFO',
        action: 'UPDATE',
        purpose: 'User profile update by admin',
        legal_basis: 'LEGITIMATE_INTEREST',
        processed_by: user.id,
      })

    return NextResponse.json({
      success: true,
      user: updatedUser
    })
  } catch (error) {
    console.error('Erreur dans PUT /api/admin/users/[id]:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Authenticate and check admin permissions
    const { user, supabase, error: authError } = await requireAdmin(request)

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: authError.status })
    }

    // Additional check: Only ADMIN can delete users
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Seuls les administrateurs peuvent supprimer des utilisateurs' }, { status: 403 })
    }

    // Empêcher la suppression de son propre compte
    if (params.id === user.id) {
      return NextResponse.json({ error: 'Impossible de supprimer votre propre compte' }, { status: 400 })
    }

    // Log de l'action avant suppression
    await supabase
      .from('data_processing_log')
      .insert({
        user_id: params.id,
        data_type: 'PERSONAL_INFO',
        action: 'DELETE',
        purpose: 'User account deletion by admin',
        legal_basis: 'LEGITIMATE_INTEREST',
        processed_by: user.id,
      })

    // Supprimer l'utilisateur de Supabase Auth (cela supprimera automatiquement le profil grâce à la cascade)
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(params.id)

    if (deleteAuthError) {
      console.error('Erreur lors de la suppression auth:', deleteAuthError)
      return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    })
  } catch (error) {
    console.error('Erreur dans DELETE /api/admin/users/[id]:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
