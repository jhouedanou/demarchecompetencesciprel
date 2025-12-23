// Types pour les workshops métiers (structure V3 avec JSONB)

export interface WorkshopRole {
  titre: string
  role: string
}

// Structure pour les fonctions (organisation)
export interface WorkshopFonction {
  titre: string
  role: string
}

// Structure du contenu JSONB pour chaque workshop
export interface WorkshopContenu {
  // Pour le workshop introduction
  sections_specifiques?: Array<{
    titre: string
    slide: number
    contenu?: any
    etapes?: string[]
    tableau?: any
    facteurs?: string[]
  }>

  // Pour les workshops métiers
  presentation?: {
    description?: string
    entites?: string[]
    mission?: string | string[]
    axes?: string[]
    piliers?: any
    domaines?: string[]
    rh?: any
    juridique?: any
  }

  organisation?: {
    fonctions?: WorkshopFonction[]
    fonctions_rh?: WorkshopFonction[]
    fonctions_juridique?: WorkshopFonction[]
  }

  referentiel?: {
    savoir?: string[]
    savoir_faire?: string[]
    savoir_etre?: string[]
    rh?: {
      savoir: string[]
      savoir_faire: string[]
      savoir_etre: string[]
    }
    juridique?: {
      savoir: string[]
      savoir_faire: string[]
      savoir_etre: string[]
    }
  }

  partenariats?: {
    internes?: string[]
    externes?: string[]
    rh?: {
      internes: string[]
      externes: string[]
    }
    juridique?: {
      internes: string[]
      externes: string[]
    }
  }

  temoignage?: {
    citation?: string
    signature?: string
    points_fierte?: string[]
    points_impact?: string[]
    rh?: string[]
    juridique?: string[]
  } | string
}

// Structure de la base de données (avec JSONB)
export interface WorkshopMetierDB {
  id: string
  titre: string
  fichier: string
  nombre_slides: number
  type: 'introduction_generale' | 'job_focus'
  contenu: WorkshopContenu
  icon: string
  color: string
  ordre: number
  is_active: boolean
  video?: string           // URL de la vidéo du workshop
  onedrive?: string        // Lien OneDrive pour les ressources
  support_url?: string     // URL du support/référentiel à télécharger
  referentiel_url?: string // URL du référentiel de compétences
  created_at?: string
  updated_at?: string
}

// Structure utilisée dans les composants (directement depuis la DB)
export interface WorkshopMetier extends WorkshopMetierDB {}

// Configuration globale des workshops
export interface WorkshopsConfig {
  id: string
  metadata: {
    organisation: string
    type: string
    lieu: string
    annee: number
    contexte: string
  }
  structure_commune: {
    sections: Array<{
      id: number
      titre: string
      contenu_type: string
      elements: any
      objectifs_types?: string[]
    }>
  }
  valeurs_feeric: {
    F: string
    E: string
    E2: string
    R: string
    I: string
    C: string
  }
  application_web: {
    suggestions_composants: any
    fonctionnalites_recommandees: string[]
  }
  is_active: boolean
  created_at?: string
  updated_at?: string
}

// Fonctions utilitaires pour extraire les données du contenu JSONB

/**
 * Extrait les objectifs d'un workshop
 */
export function getObjectifs(workshop: WorkshopMetier): string[] {
  if (workshop.contenu.sections_specifiques) {
    // Workshop introduction
    const introSection = workshop.contenu.sections_specifiques.find(
      s => s.titre === "Introduction"
    )
    return introSection?.contenu?.objectifs_types || []
  }
  // Autres workshops - pas d'objectifs directs
  return []
}

/**
 * Extrait la description/présentation d'un workshop
 */
export function getPresentation(workshop: WorkshopMetier): string {
  return workshop.contenu.presentation?.description || ''
}

/**
 * Extrait les rôles/fonctions d'un workshop
 */
export function getRoles(workshop: WorkshopMetier): WorkshopFonction[] {
  return workshop.contenu.organisation?.fonctions || []
}

/**
 * Extrait les compétences (savoir, savoir-faire, savoir-être)
 */
export function getCompetences(workshop: WorkshopMetier) {
  const ref = workshop.contenu.referentiel
  return {
    savoirs: ref?.savoir || [],
    savoir_faire: ref?.savoir_faire || [],
    savoir_etre: ref?.savoir_etre || []
  }
}

/**
 * Extrait les partenariats (internes, externes)
 */
export function getPartenariats(workshop: WorkshopMetier) {
  const part = workshop.contenu.partenariats
  return {
    internes: part?.internes || [],
    externes: part?.externes || []
  }
}

/**
 * Extrait le témoignage
 */
export function getTemoignage(workshop: WorkshopMetier): string {
  const temoignage = workshop.contenu.temoignage
  if (typeof temoignage === 'string') {
    return temoignage
  }
  if (temoignage && typeof temoignage === 'object') {
    return temoignage.citation || ''
  }
  return ''
}

/**
 * Vérifie si c'est le workshop introduction
 */
export function isIntroductionWorkshop(workshop: WorkshopMetier): boolean {
  return workshop.type === 'introduction_generale'
}

/**
 * Vérifie si c'est un workshop métier
 */
export function isJobFocusWorkshop(workshop: WorkshopMetier): boolean {
  return workshop.type === 'job_focus'
}
