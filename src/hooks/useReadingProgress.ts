'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export interface ReadingProgress {
  section_id: string
  section_title: string
  completed_at: string
  reading_time_seconds: number
}

export interface ReadingSection {
  id: string
  title: string
  required: boolean
  completed: boolean
  reading_time?: number
}

const REQUIRED_SECTIONS: ReadingSection[] = [
  { id: 'accueil', title: 'Page d\'accueil', required: true, completed: false },
  { id: 'dialectique', title: 'Dialectique de la démarche compétence', required: true, completed: false },
  { id: 'synoptique', title: 'Synoptique de la démarche compétence', required: true, completed: false },
  { id: 'leviers', title: 'Leviers et facteurs clés de succès', required: true, completed: false },
  { id: 'ressources', title: 'Ressources documentaires', required: true, completed: false }
]

export function useReadingProgress(user: User | null) {
  const [sections, setSections] = useState<ReadingSection[]>(REQUIRED_SECTIONS)
  const [allCompleted, setAllCompleted] = useState(false)
  const [loading, setLoading] = useState(true)

  // supabase client is imported directly

  // Load user's reading progress
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    loadProgress()
  }, [user])

  const loadProgress = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_reading_progress')
        .select('*')
        .eq('user_id', user.id)

      if (error) {
        console.error('Error loading reading progress:', error)
        return
      }

      // Update sections with completed status
      const updatedSections = REQUIRED_SECTIONS.map(section => {
        const progress = data?.find(p => p.section_id === section.id)
        return {
          ...section,
          completed: !!progress,
          reading_time: progress?.reading_time_seconds || 0
        }
      })

      setSections(updatedSections)
      setAllCompleted(updatedSections.every(s => s.completed))
    } catch (error) {
      console.error('Error in loadProgress:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mark a section as completed
  const markSectionCompleted = async (sectionId: string, readingTimeSeconds: number = 0) => {
    if (!user) return false

    try {
      const section = REQUIRED_SECTIONS.find(s => s.id === sectionId)
      if (!section) return false

      const { error } = await supabase
        .from('user_reading_progress')
        .upsert({
          user_id: user.id,
          section_id: sectionId,
          section_title: section.title,
          reading_time_seconds: readingTimeSeconds,
          completed_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error marking section as completed:', error)
        return false
      }

      // Reload progress
      await loadProgress()
      return true
    } catch (error) {
      console.error('Error in markSectionCompleted:', error)
      return false
    }
  }

  // Check if user can access quiz/survey
  const canAccessQuiz = () => {
    return allCompleted
  }

  // Get completion percentage
  const getCompletionPercentage = () => {
    const completed = sections.filter(s => s.completed).length
    return Math.round((completed / sections.length) * 100)
  }

  // Get next section to complete
  const getNextSection = () => {
    return sections.find(s => s.required && !s.completed)
  }

  return {
    sections,
    allCompleted,
    loading,
    canAccessQuiz,
    markSectionCompleted,
    getCompletionPercentage,
    getNextSection,
    refreshProgress: loadProgress
  }
}