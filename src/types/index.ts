export * from './database'

// Profile alias for compatibility
export interface Profile {
  id: string
  email: string
  name: string | null
  role: 'USER' | 'ADMIN' | 'MANAGER'
  avatar_url: string | null
  phone: string | null
  created_at: string
  updated_at: string
}

// Quiz Types
export type QuestionCategory = 'DEFINITION' | 'RESPONSABILITE' | 'COMPETENCES' | 'ETAPES' | 'OPINION'
export type QuizType = 'INTRODUCTION' | 'SONDAGE'
export interface QuizQuestion {
  id: string
  title: string
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d?: string
  correct_answer: string[]
  category: QuestionCategory
  quiz_type: QuizType
  points: number
  feedback?: string
  explanation?: string
  order_index: number
  active?: boolean
}

export interface QuizAnswer {
  questionId: string
  selectedAnswers: string[]
  isCorrect: boolean
  timeSpent: number
  timestamp: string
}

export interface QuizState {
  currentQuestion: number
  answers: QuizAnswer[]
  startTime: number
  totalQuestions: number
  timeLimit?: number
  isCompleted: boolean
  score?: number
  percentage?: number
}

export interface QuizResult {
  id: string
  user_id: string
  quiz_type: QuizType
  score: number
  max_score: number
  percentage: number
  completed_at: string
  duration_seconds: number
  attempt_number: number
  answers: QuizAnswer[]
}

// Sondage Types
export interface SondageQuestion {
  id: string
  question: string
  type: 'single_choice' | 'multiple_choice' | 'text' | 'rating'
  options?: string[]
  required: boolean
  order_index: number
}

export interface SondageAnswer {
  questionId: string
  answer: string | string[]
  type: string
}

export interface SondageFormData {
  q1_connaissance: string
  q2_definition: string
  q3_benefices: string[]
  q4_attentes: string
  q5_inquietudes: string
  q6_informations: string[]
  additional_comments?: string
}

// Video Types
export interface VideoMetadata {
  id: string
  title: string
  description?: string
  filename: string
  url: string
  thumbnail?: string
  duration: number
  views: number
  likes: number
  file_size: number
  mime_type: string
  resolution?: string
  active: boolean
  featured: boolean
  order_index: number
  created_at: string
  uploaded_by?: string
}

export interface VideoPlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  isFullscreen: boolean
  playbackRate: number
  buffered: TimeRanges | null
}

// GDPR Types
export interface ConsentPreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
}

// Types manquants pour GDPR
export interface SondageResponse {
  id: string
  user_id: string
  question_id: string
  response_value: string
  response_text?: string
  submitted_at: string
}

export interface VideoView {
  id: string
  user_id: string
  video_id: string
  viewed_at: string
  watch_duration: number
  completed: boolean
}

export interface VideoLike {
  id: string
  user_id: string
  video_id: string
  liked: boolean
  created_at: string
}

export interface ConsentRecord {
  id: string
  user_id: string
  consent_type: string
  granted: boolean
  timestamp: string
  version: string
}

export interface Visit {
  id: string
  user_id: string
  page: string
  timestamp: string
}

export interface GDPRExportData {
  profile: Profile
  quiz_results: QuizResult[]
  sondage_responses: SondageResponse[]
  video_views: VideoView[]
  video_likes: VideoLike[]
  consent_records: ConsentRecord[]
  visits: Visit[]
}

// Authentication Types
export type UserRole = 'USER' | 'ADMIN' | 'MANAGER'

export interface AuthUser {
  id: string
  email: string
  name?: string
  role: UserRole
  avatar_url?: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  name: string
  confirmPassword: string
}

// Analytics Types
export interface AnalyticsData {
  totalUsers: number
  totalQuizAttempts: number
  averageQuizScore: number
  totalVideoViews: number
  uniqueVideoViewers: number
  dailyActiveUsers: number
  completionRate: number
  topPerformingVideos: VideoAnalytics[]
  quizPerformance: QuizAnalytics[]
  userActivity: UserActivityData[]
}

export interface VideoAnalytics {
  video_id: string
  title: string
  views: number
  likes: number
  completion_rate: number
  average_watch_time: number
  engagement_score: number
}

export interface QuizAnalytics {
  quiz_type: QuizType
  total_attempts: number
  average_score: number
  completion_rate: number
  most_difficult_questions: string[]
  performance_by_category: Record<QuestionCategory, number>
}

export interface UserActivityData {
  date: string
  active_users: number
  new_signups: number
  quiz_completions: number
  video_views: number
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

// Form Types
export interface FormErrors {
  [key: string]: string | undefined
}

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

// Notification Types
export interface NotificationData {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  action_url?: string
  read: boolean
  created_at: string
}

// Upload Types
export interface FileUpload {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
  url?: string
}

// Theme Types
export interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  borderRadius: string
  fontFamily: string
}

// Device Detection Types
export type DeviceType = 'mobile' | 'tablet' | 'desktop'

export interface DeviceInfo {
  type: DeviceType
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  userAgent: string
  viewport: {
    width: number
    height: number
  }
}

// Search and Filter Types
export interface SearchFilters {
  query?: string
  category?: QuestionCategory
  quiz_type?: QuizType
  date_from?: string
  date_to?: string
  user_role?: UserRole
  active?: boolean
  featured?: boolean
}

export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

// Navigation Types
export interface NavItem {
  label: string
  href: string
  icon?: string
  children?: NavItem[]
  requiresAuth?: boolean
  roles?: UserRole[]
}

// Constants
export const QUIZ_TIME_LIMIT_MINUTES = 30
export const AUTO_SAVE_INTERVAL_SECONDS = 30
export const MAX_QUIZ_ATTEMPTS = 3
export const MAX_VIDEO_SIZE_MB = 100
export const MAX_IMAGE_SIZE_MB = 10

export const QUIZ_CATEGORIES: Record<QuestionCategory, string> = {
  DEFINITION: 'Définition',
  RESPONSABILITE: 'Responsabilité',
  COMPETENCES: 'Compétences',
  ETAPES: 'Étapes',
  OPINION: 'Opinion'
}

export const USER_ROLES: Record<UserRole, string> = {
  USER: 'Utilisateur',
  ADMIN: 'Administrateur',
  MANAGER: 'Manager'
}