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

    // Récupérer la liste des utilisateurs
    const { data: users, error: dbError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (dbError) {
      console.error('Erreur lors de la récupération des utilisateurs:', dbError)
      return NextResponse.json({ error: 'Erreur de base de données' }, { status: 500 })
    }

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Erreur dans GET /api/admin/users:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate and check admin permissions
    const { user, supabase, error: authError } = await requireAdmin(request)

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: authError.status })
    }

    const body = await request.json()
    const { name, email, phone, role, password } = body

    // Validation des données
    if (!name || !email || !role || !password) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
    }

    if (!['USER', 'MANAGER', 'ADMIN'].includes(role)) {
      return NextResponse.json({ error: 'Rôle invalide' }, { status: 400 })
    }

    // Créer l'utilisateur avec Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role,
      }
    })

    if (authError) {
      console.error('Erreur lors de la création de l\'utilisateur:', authError)
      
      if (authError.message.includes('already exists')) {
        return NextResponse.json({ error: 'Un utilisateur avec cet email existe déjà' }, { status: 400 })
      }
      
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Erreur lors de la création de l\'utilisateur' }, { status: 500 })
    }

    // Créer le profil dans la table profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        name,
        phone,
        role,
      })

    if (profileError) {
      console.error('Erreur lors de la création du profil:', profileError)
      
      // Supprimer l'utilisateur auth si le profil n'a pas pu être créé
      await supabase.auth.admin.deleteUser(authData.user.id)
      
      return NextResponse.json({ error: 'Erreur lors de la création du profil' }, { status: 500 })
    }

    // Log de l'action pour audit
    await supabase
      .from('data_processing_log')
      .insert({
        user_id: authData.user.id,
        data_type: 'PERSONAL_INFO',
        action: 'CREATE',
        purpose: 'User account creation by admin',
        legal_basis: 'LEGITIMATE_INTEREST',
        processed_by: user.id,
      })

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email,
        name,
        role,
        phone,
      }
    })
  } catch (error) {
    console.error('Erreur dans POST /api/admin/users:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
