import { NextRequest, NextResponse } from 'next/server'
import { serialize } from 'cookie'

export async function POST(request: NextRequest) {
  console.log('👋 [API /auth/logout] Logout request received')

  // Supprimer le cookie de session
  const cookie = serialize('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expire immédiatement
    path: '/',
  })

  console.log('✅ [API /auth/logout] Logout successful')

  const response = NextResponse.json({ success: true }, { status: 200 })
  response.headers.set('Set-Cookie', cookie)

  return response
}
