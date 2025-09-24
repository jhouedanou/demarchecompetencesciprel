import { createMiddlewareClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes protégées nécessitant une authentification
const protectedRoutes = ['/competences', '/profile', '/admin']

// Routes admin nécessitant le rôle ADMIN ou MANAGER
const adminRoutes = ['/admin']

// Routes publiques toujours accessibles
const publicRoutes = ['/', '/login', '/register', '/legal']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Vérifier la session utilisateur
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const url = req.nextUrl.clone()
  const pathname = url.pathname

  // Permettre les routes publiques
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return res
  }

  // Rediriger vers login si pas authentifié sur route protégée
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !session) {
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Vérifier les permissions admin
  if (adminRoutes.some(route => pathname.startsWith(route)) && session) {
    // Récupérer le profil utilisateur pour vérifier le rôle
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['ADMIN', 'MANAGER'].includes(profile.role)) {
      // Rediriger vers une page d'erreur ou l'accueil si pas les bonnes permissions
      url.pathname = '/competences'
      return NextResponse.redirect(url)
    }
  }

  // Si authentifié et tentative d'accès aux pages d'auth, rediriger
  if (session && ['/login', '/register'].includes(pathname)) {
    const profile = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile.data?.role === 'ADMIN') {
      url.pathname = '/admin'
    } else {
      url.pathname = '/competences'
    }
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, videos, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|videos|icons).*)',
  ],
}
