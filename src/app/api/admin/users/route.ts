import { NextRequest, NextResponse } from 'next/server'
import { createUserServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createUserServerClient()
    
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

    // Récupérer la liste des utilisateurs
    const { data: users, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error)
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
    const supabase = createUserServerClient()
    
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
        processed_by: session.user.id,
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
