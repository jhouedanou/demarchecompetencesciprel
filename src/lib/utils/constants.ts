// Environment variables avec fallbacks
export const ENV = {
  // Supabase
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',

  // App Configuration
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  SITE_NAME: 'CIPREL Compétences',
  COMPANY_NAME: process.env.NEXT_PUBLIC_COMPANY_NAME || 'CIPREL',
  COMPANY_EMAIL: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'contact@ciprel.ci',

  // GDPR Configuration
  GDPR_ENABLED: process.env.NEXT_PUBLIC_GDPR_ENABLED === 'true',
  DATA_RETENTION_DAYS: parseInt(process.env.NEXT_PUBLIC_DATA_RETENTION_DAYS || '730'),
  PRIVACY_OFFICER_EMAIL: process.env.NEXT_PUBLIC_PRIVACY_OFFICER_EMAIL || 'dpo@ciprel.ci',
  COMPANY_ADDRESS: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'Abidjan, Côte d\'Ivoire',

  // Analytics
  GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',

  // File Upload
  MAX_VIDEO_SIZE_MB: parseInt(process.env.NEXT_PUBLIC_MAX_VIDEO_SIZE_MB || '100'),
  MAX_IMAGE_SIZE_MB: parseInt(process.env.NEXT_PUBLIC_MAX_IMAGE_SIZE_MB || '10'),
  ALLOWED_VIDEO_TYPES: (process.env.NEXT_PUBLIC_ALLOWED_VIDEO_TYPES || 'mp4,webm,mov').split(','),
  ALLOWED_IMAGE_TYPES: ['jpg', 'jpeg', 'png', 'gif', 'webp'],

  // Rate Limiting
  QUIZ_ATTEMPTS_LIMIT: parseInt(process.env.NEXT_PUBLIC_QUIZ_ATTEMPTS_LIMIT || '3'),
  QUIZ_TIME_LIMIT_MINUTES: parseInt(process.env.NEXT_PUBLIC_QUIZ_TIME_LIMIT_MINUTES || '30'),
}

// Quiz Configuration
export const QUIZ_CONFIG = {
  TIME_LIMIT_MINUTES: 30,
  AUTO_SAVE_INTERVAL_SECONDS: 30,
  MAX_ATTEMPTS: 3,
  PASSING_SCORE_PERCENTAGE: 70,
  WARNING_TIME_MINUTES: 5,
  CRITICAL_TIME_MINUTES: 1,
}

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_USER: 'ciprel-auth-user',
  QUIZ_PROGRESS: 'ciprel-quiz-progress',
  GDPR_CONSENT: 'ciprel-gdpr-consent',
  CONSENT_PREFERENCES: 'ciprel-consent-preferences',
  VIDEO_PREFERENCES: 'ciprel-video-preferences',
  THEME_PREFERENCE: 'ciprel-theme',
}

// App Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  DIALECTIQUE: '/dialectique',
  SYNOPTIQUE: '/synoptique',
  QUIZ: '/quiz',
  QUIZ_INTRODUCTION: '/quiz',
  SONDAGE: '/sondage',
  FACTEURS_CLES: '/facteurs-cles',
  RESSOURCES: '/ressources',
  CONTACT: '/contact',
  VIDEOS: '/videos',
  PROFILE: '/profile',
  ADMIN: '/admin',
  COMPETENCES: '/competences',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  GDPR: '/gdpr'
}

// GDPR Configuration
export const GDPR_CONFIG = {
  ENABLED: ENV.GDPR_ENABLED,
  DATA_RETENTION_DAYS: ENV.DATA_RETENTION_DAYS,
  PRIVACY_OFFICER_EMAIL: ENV.PRIVACY_OFFICER_EMAIL,
  COMPANY_ADDRESS: ENV.COMPANY_ADDRESS,
  COOKIE_BANNER_TIMEOUT: 3000,
  CONSENT_VERSION: '1.0',
  CONSENT_CATEGORIES: {
    NECESSARY: 'necessary',
    ANALYTICS: 'analytics',
    MARKETING: 'marketing',
    PREFERENCES: 'preferences'
  },
  COOKIE_NAMES: {
    CONSENT: 'ciprel-cookie-consent',
    ANALYTICS: 'ciprel-analytics-consent',
    MARKETING: 'ciprel-marketing-consent',
    PREFERENCES: 'ciprel-preferences-consent'
  }
}

// API Routes
export const API_ROUTES = {
  // Auth
  AUTH_LOGIN: '/api/auth/login',
  AUTH_REGISTER: '/api/auth/register',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_REFRESH: '/api/auth/refresh',

  // Quiz
  QUIZ_QUESTIONS: '/api/quiz',
  QUIZ_SUBMIT: '/api/quiz',
  QUIZ_RESULTS: '/api/quiz/results',

  // Videos
  VIDEOS_LIST: '/api/videos',
  VIDEO_UPLOAD: '/api/videos/upload',
  VIDEO_VIEW: '/api/videos/view',

  // Admin
  ADMIN_USERS: '/api/admin/users',
  ADMIN_ANALYTICS: '/api/admin/analytics',
  ADMIN_QUESTIONS: '/api/admin/questions',

  // GDPR
  GDPR_CONSENT: '/api/gdpr/consent',
  GDPR_EXPORT: '/api/gdpr/export',
  GDPR_DELETE: '/api/gdpr/delete',
}

// File Types
export const MIME_TYPES = {
  VIDEO: {
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo',
  },
  IMAGE: {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
  }
}

// Quiz Categories
export const QUIZ_CATEGORIES = {
  DEFINITION: 'Définition',
  RESPONSABILITE: 'Responsabilité',
  COMPETENCES: 'Compétences',
  ETAPES: 'Étapes',
  OPINION: 'Opinion'
} as const

// User Roles
export const USER_ROLES = {
  USER: 'Utilisateur',
  MANAGER: 'Manager',
  ADMIN: 'Administrateur'
} as const

// Device Types
export const DEVICE_TYPES = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop'
} as const

// GDPR Legal Bases
export const GDPR_LEGAL_BASES = {
  CONSENT: 'Consentement',
  CONTRACT: 'Contrat',
  LEGAL_OBLIGATION: 'Obligation légale',
  VITAL_INTERESTS: 'Intérêts vitaux',
  PUBLIC_TASK: 'Mission de service public',
  LEGITIMATE_INTEREST: 'Intérêt légitime'
} as const

// Data Types for GDPR
export const DATA_TYPES = {
  PERSONAL_INFO: 'Informations personnelles',
  QUIZ_RESPONSES: 'Réponses aux quiz',
  VIDEO_VIEWING: 'Visionnage vidéos',
  ANALYTICS: 'Données analytiques',
  TECHNICAL: 'Données techniques'
} as const

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
} as const

// Theme Configuration - Palette CIPREL Officielle
export const CIPREL_COLORS = {
  // Couleurs principales CIPREL
  PIGMENT_GREEN: '#36A24C', // Vert principal - couleur corporate
  TANGERINE: '#EC7E05',     // Orange secondaire - couleur d'accent
  RICH_BLACK: '#0A0E12',    // Noir profond - texte principal
  WHITE: '#FFFFFF',         // Blanc - arrière-plans
  
  // Déclinaisons du vert CIPREL
  GREEN: {
    50: '#f0fdf4',
    100: '#dcfce7', 
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#36A24C', // Couleur de base
    600: '#2d8540',
    700: '#256835',
    800: '#1f5429',
    900: '#1a4622'
  },
  
  // Déclinaisons de l'orange CIPREL
  ORANGE: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa', 
    300: '#fdba74',
    400: '#fb923c',
    500: '#EC7E05', // Couleur de base
    600: '#dc6803',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f'
  }
}

export const THEME_CONFIG = {
  COLORS: {
    PRIMARY: CIPREL_COLORS.PIGMENT_GREEN,
    SECONDARY: CIPREL_COLORS.TANGERINE,
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#06B6D4'
  },
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px'
  }
}

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+225|0)[0-9]{8,10}$/,
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100
  }
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion réseau',
  UNAUTHORIZED: 'Accès non autorisé',
  FORBIDDEN: 'Accès interdit',
  NOT_FOUND: 'Ressource non trouvée',
  VALIDATION_ERROR: 'Données invalides',
  SERVER_ERROR: 'Erreur serveur interne'
}

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Connexion réussie',
  LOGOUT_SUCCESS: 'Déconnexion réussie',
  REGISTER_SUCCESS: 'Inscription réussie',
  QUIZ_COMPLETED: 'Quiz complété avec succès',
  PROFILE_UPDATED: 'Profil mis à jour',
  DATA_SAVED: 'Données sauvegardées'
}