export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      consent_records: {
        Row: {
          analytics: boolean | null
          city: string | null
          consent_version: string | null
          consented_at: string | null
          country: string | null
          essential: boolean | null
          functional: boolean | null
          id: string
          ip_address: string | null
          marketing: boolean | null
          session_id: string | null
          updated_at: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          analytics?: boolean | null
          city?: string | null
          consent_version?: string | null
          consented_at?: string | null
          country?: string | null
          essential?: boolean | null
          functional?: boolean | null
          id?: string
          ip_address?: string | null
          marketing?: boolean | null
          session_id?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          analytics?: boolean | null
          city?: string | null
          consent_version?: string | null
          consented_at?: string | null
          country?: string | null
          essential?: boolean | null
          functional?: boolean | null
          id?: string
          ip_address?: string | null
          marketing?: boolean | null
          session_id?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consent_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      data_processing_log: {
        Row: {
          action: Database["public"]["Enums"]["processing_action"]
          data_subject: string | null
          data_type: Database["public"]["Enums"]["data_type"]
          details: Json | null
          id: string
          legal_basis: Database["public"]["Enums"]["legal_basis"]
          processed_at: string | null
          processed_by: string | null
          purpose: string
          retention_period: string | null
          user_id: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["processing_action"]
          data_subject?: string | null
          data_type: Database["public"]["Enums"]["data_type"]
          details?: Json | null
          id?: string
          legal_basis: Database["public"]["Enums"]["legal_basis"]
          processed_at?: string | null
          processed_by?: string | null
          purpose: string
          retention_period?: string | null
          user_id?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["processing_action"]
          data_subject?: string | null
          data_type?: Database["public"]["Enums"]["data_type"]
          details?: Json | null
          id?: string
          legal_basis?: Database["public"]["Enums"]["legal_basis"]
          processed_at?: string | null
          processed_by?: string | null
          purpose?: string
          retention_period?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_processing_log_data_subject_fkey"
            columns: ["data_subject"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_processing_log_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_processing_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          read_at: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          read_at?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          read_at?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          name: string | null
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id: string
          name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      questions: {
        Row: {
          active: boolean | null
          category: Database["public"]["Enums"]["question_category"]
          correct_answer: string[]
          created_at: string | null
          explanation: string | null
          feedback: string | null
          id: string
          option_a: string
          option_b: string
          option_c: string
          option_d: string | null
          order_index: number | null
          points: number | null
          question: string
          quiz_type: Database["public"]["Enums"]["quiz_type"]
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          category: Database["public"]["Enums"]["question_category"]
          correct_answer: string[]
          created_at?: string | null
          explanation?: string | null
          feedback?: string | null
          id?: string
          option_a: string
          option_b: string
          option_c: string
          option_d?: string | null
          order_index?: number | null
          points?: number | null
          question: string
          quiz_type: Database["public"]["Enums"]["quiz_type"]
          title: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          category?: Database["public"]["Enums"]["question_category"]
          correct_answer?: string[]
          created_at?: string | null
          explanation?: string | null
          feedback?: string | null
          id?: string
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string | null
          order_index?: number | null
          points?: number | null
          question?: string
          quiz_type?: Database["public"]["Enums"]["quiz_type"]
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      quiz_results: {
        Row: {
          attempt_number: number | null
          completed_at: string | null
          correct_answers: number | null
          duration: number | null
          id: string
          max_score: number | null
          percentage: number | null
          quiz_type: Database["public"]["Enums"]["quiz_type"]
          responses: Json
          score: number | null
          started_at: string | null
          total_questions: number
          user_id: string | null
        }
        Insert: {
          attempt_number?: number | null
          completed_at?: string | null
          correct_answers?: number | null
          duration?: number | null
          id?: string
          max_score?: number | null
          percentage?: number | null
          quiz_type: Database["public"]["Enums"]["quiz_type"]
          responses: Json
          score?: number | null
          started_at?: string | null
          total_questions: number
          user_id?: string | null
        }
        Update: {
          attempt_number?: number | null
          completed_at?: string | null
          correct_answers?: number | null
          duration?: number | null
          id?: string
          max_score?: number | null
          percentage?: number | null
          quiz_type?: Database["public"]["Enums"]["quiz_type"]
          responses?: Json
          score?: number | null
          started_at?: string | null
          total_questions?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      sondage_responses: {
        Row: {
          additional_comments: string | null
          id: string
          q1_connaissance: string | null
          q2_definition: string | null
          q3_benefices: string[] | null
          q4_attentes: string | null
          q5_inquietudes: string | null
          q6_informations: string[] | null
          session_duration: number | null
          submitted_at: string | null
          user_id: string | null
        }
        Insert: {
          additional_comments?: string | null
          id?: string
          q1_connaissance?: string | null
          q2_definition?: string | null
          q3_benefices?: string[] | null
          q4_attentes?: string | null
          q5_inquietudes?: string | null
          q6_informations?: string[] | null
          session_duration?: number | null
          submitted_at?: string | null
          user_id?: string | null
        }
        Update: {
          additional_comments?: string | null
          id?: string
          q1_connaissance?: string | null
          q2_definition?: string | null
          q3_benefices?: string[] | null
          q4_attentes?: string | null
          q5_inquietudes?: string | null
          q6_informations?: string[] | null
          session_duration?: number | null
          submitted_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sondage_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      user_sessions: {
        Row: {
          device_type: string | null
          ended_at: string | null
          id: string
          ip_address: string | null
          last_activity: string | null
          pages_visited: number | null
          session_id: string
          started_at: string | null
          total_duration: number | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          device_type?: string | null
          ended_at?: string | null
          id?: string
          ip_address?: string | null
          last_activity?: string | null
          pages_visited?: number | null
          session_id: string
          started_at?: string | null
          total_duration?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          device_type?: string | null
          ended_at?: string | null
          id?: string
          ip_address?: string | null
          last_activity?: string | null
          pages_visited?: number | null
          session_id?: string
          started_at?: string | null
          total_duration?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      video_likes: {
        Row: {
          id: string
          liked_at: string | null
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          id?: string
          liked_at?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          id?: string
          liked_at?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_likes_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          }
        ]
      }
      video_views: {
        Row: {
          completion_percentage: number | null
          completed: boolean | null
          device_type: string | null
          id: string
          ip_address: string | null
          session_id: string | null
          total_duration: number | null
          user_agent: string | null
          user_id: string | null
          video_id: string | null
          viewed_at: string | null
          watch_duration: number | null
        }
        Insert: {
          completion_percentage?: number | null
          completed?: boolean | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          session_id?: string | null
          total_duration?: number | null
          user_agent?: string | null
          user_id?: string | null
          video_id?: string | null
          viewed_at?: string | null
          watch_duration?: number | null
        }
        Update: {
          completion_percentage?: number | null
          completed?: boolean | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          session_id?: string | null
          total_duration?: number | null
          user_agent?: string | null
          user_id?: string | null
          video_id?: string | null
          viewed_at?: string | null
          watch_duration?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "video_views_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_views_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          }
        ]
      }
      videos: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          duration: number | null
          featured: boolean | null
          file_size: number | null
          filename: string
          id: string
          likes: number | null
          mime_type: string | null
          order_index: number | null
          resolution: string | null
          thumbnail: string | null
          title: string
          updated_at: string | null
          uploaded_by: string | null
          url: string
          views: number | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          featured?: boolean | null
          file_size?: number | null
          filename: string
          id?: string
          likes?: number | null
          mime_type?: string | null
          order_index?: number | null
          resolution?: string | null
          thumbnail?: string | null
          title: string
          updated_at?: string | null
          uploaded_by?: string | null
          url: string
          views?: number | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          featured?: boolean | null
          file_size?: number | null
          filename?: string
          id?: string
          likes?: number | null
          mime_type?: string | null
          order_index?: number | null
          resolution?: string | null
          thumbnail?: string | null
          title?: string
          updated_at?: string | null
          uploaded_by?: string | null
          url?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      visits: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          created_at: string | null
          device_type: Database["public"]["Enums"]["device_type"] | null
          duration: number | null
          id: string
          ip_address: string | null
          os: string | null
          page: string
          referrer: string | null
          session_id: string
          title: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: Database["public"]["Enums"]["device_type"] | null
          duration?: number | null
          id?: string
          ip_address?: string | null
          os?: string | null
          page: string
          referrer?: string | null
          session_id: string
          title?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: Database["public"]["Enums"]["device_type"] | null
          duration?: number | null
          id?: string
          ip_address?: string | null
          os?: string | null
          page?: string
          referrer?: string | null
          session_id?: string
          title?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      data_type: "PERSONAL_INFO" | "QUIZ_RESPONSES" | "VIDEO_VIEWING" | "ANALYTICS" | "TECHNICAL" | "CONSENT"
      device_type: "mobile" | "desktop" | "tablet"
      legal_basis: "CONSENT" | "LEGITIMATE_INTEREST" | "CONTRACT" | "LEGAL_OBLIGATION"
      notification_type: "QUIZ_COMPLETED" | "VIDEO_UPLOADED" | "SYSTEM_MESSAGE" | "GDPR_REQUEST"
      processing_action: "CREATE" | "READ" | "UPDATE" | "DELETE" | "EXPORT" | "ANONYMIZE"
      question_category: "DEFINITION" | "RESPONSABILITE" | "COMPETENCES" | "ETAPES" | "OPINION"
      quiz_type: "INTRODUCTION" | "SONDAGE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Additional type definitions for application use
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Question = Database['public']['Tables']['questions']['Row']
export type QuizResult = Database['public']['Tables']['quiz_results']['Row']
export type SondageResponse = Database['public']['Tables']['sondage_responses']['Row']
export type Video = Database['public']['Tables']['videos']['Row']
export type VideoView = Database['public']['Tables']['video_views']['Row']
export type VideoLike = Database['public']['Tables']['video_likes']['Row']
export type ConsentRecord = Database['public']['Tables']['consent_records']['Row']
export type Visit = Database['public']['Tables']['visits']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']

export type QuizType = Database['public']['Enums']['quiz_type']
export type QuestionCategory = Database['public']['Enums']['question_category']
export type UserRole = 'USER' | 'ADMIN' | 'MANAGER'
export type DeviceType = Database['public']['Enums']['device_type']