import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/auth-helpers'
import { serialize } from 'cookie'

export async function POST(request: NextRequest) {
  const startTime = performance.now()
  console.log('🔐 [API /auth/login] Login request received')

  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    console.log('📧 [API /auth/login] Authenticating:', email)
    const user = await authenticateUser(email, password)

    if (!user) {
      const elapsed = performance.now() - startTime
      console.warn(`❌ [API /auth/login] Failed after ${elapsed.toFixed(0)}ms`)
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.' },
        { status: 401 }
      )
    }

    // Créer une session (cookie)
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
    console.log(`✅ [API /auth/login] Success in ${elapsed.toFixed(0)}ms`)

    const response = NextResponse.json({ user }, { status: 200 })
    response.headers.set('Set-Cookie', cookie)

    return response
  } catch (error) {
    const elapsed = performance.now() - startTime
    console.error(`❌ [API /auth/login] Error after ${elapsed.toFixed(0)}ms:`, error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
