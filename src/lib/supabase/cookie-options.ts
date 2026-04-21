/**
 * Options de cookies adaptées à l'embedding dans une iframe tierce
 * (SharePoint / Microsoft 365 / Teams).
 *
 * Pour qu'un cookie soit envoyé depuis une iframe cross-site, il doit être
 * émis avec `SameSite=None` et `Secure` (HTTPS obligatoire).
 *
 * On conserve un comportement "normal" en dev local (HTTP, SameSite=Lax)
 * car `SameSite=None` sans `Secure` est rejeté par les navigateurs.
 *
 * Active ce mode en définissant :
 *   NEXT_PUBLIC_ALLOW_IFRAME_EMBED=true
 * (activé par défaut en production si la variable n'est pas définie).
 */

export type SameSite = 'lax' | 'strict' | 'none' | boolean | undefined

export const isIframeEmbedEnabled = (): boolean => {
  const flag = process.env.NEXT_PUBLIC_ALLOW_IFRAME_EMBED
  if (flag === 'true') return true
  if (flag === 'false') return false
  // Par défaut : activé en production (HTTPS), désactivé en dev (HTTP local).
  return process.env.NODE_ENV === 'production'
}

/**
 * Applique `SameSite=None; Secure` si l'embedding iframe est activé.
 * Préserve les autres options (path, maxAge, httpOnly, etc.).
 */
export function applyIframeCookieOptions<
  T extends { sameSite?: SameSite; secure?: boolean }
>(options: T | undefined): T {
  const base = (options ?? ({} as T))
  if (!isIframeEmbedEnabled()) {
    return base
  }
  return {
    ...base,
    sameSite: 'none',
    secure: true,
  }
}
