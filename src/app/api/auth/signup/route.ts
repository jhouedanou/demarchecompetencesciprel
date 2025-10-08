import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/auth-helpers'
import { serialize } from 'cookie'

export async function POST(request: NextRequest) {
  const startTime = performance.now()
  console.log('📝 [API /auth/signup] Signup request received')

  try {
    const body = await request.json()
    const { email, password, name, confirmPassword } = body

    // Validations
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, nom et mot de passe requis' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Les mots de passe ne correspondent pas' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      )
    }

    // Vérifier le domaine email
    const allowed = /@((ciprel\.ci)|(bigfiveabidjan\.com))$/i.test(email)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Seules les adresses se terminant par ciprel.ci ou bigfiveabidjan.com sont autorisées' },
        { status: 403 }
      )
    }

    console.log('📧 [API /auth/signup] Creating user:', email)
    const user = await createUser(email, password, name)

    if (!user) {
      const elapsed = performance.now() - startTime
      console.warn(`❌ [API /auth/signup] Failed after ${elapsed.toFixed(0)}ms`)
      return NextResponse.json(
        { error: 'Erreur lors de la création du compte' },
        { status: 500 }
      )
    }

    // Créer une session
    const sessionToken = Buffer.from(JSON.stringify({
      userId: user.id,
      email: user.email,
      timestamp: Date.now()
    })).toString('base64')

    const cookie = serialize('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: '/',
    })

    const elapsed = performance.now() - startTime
    console.log(`✅ [API /auth/signup] Success in ${elapsed.toFixed(0)}ms`)

    const response = NextResponse.json({ user }, { status: 201 })
    response.headers.set('Set-Cookie', cookie)

    return response
  } catch (error: any) {
    const elapsed = performance.now() - startTime
    console.error(`❌ [API /auth/signup] Error after ${elapsed.toFixed(0)}ms:`, error)

    if (error.message?.includes('existe déjà')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
