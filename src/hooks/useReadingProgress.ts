'use client'

import { useState, useEffect, useCallback } from 'react'
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
  { id: 'introduction', title: 'Introduction à la démarche compétence', required: true, completed: false },
  { id: 'dialectique', title: 'Dialectique de la démarche compétence', required: true, completed: false },
  { id: 'synoptique', title: 'Synoptique de la démarche compétence', required: true, completed: false },
  { id: 'leviers', title: 'Leviers et facteurs clés de succès', required: true, completed: false },
  { id: 'ressources', title: 'Ressources documentaires', required: true, completed: false },
  { id: 'videos', title: 'Vidéos de formation', required: true, completed: false }
]

const areRequiredSectionsCompleted = (list: ReadingSection[]) =>
  list.filter(section => section.required).every(section => section.completed)

const calculateRequiredCompletionPercentage = (list: ReadingSection[]) => {
  const requiredSections = list.filter(section => section.required)
  if (requiredSections.length === 0) {
    return 0
  }
  const completed = requiredSections.filter(section => section.completed).length
  return Math.round((completed / requiredSections.length) * 100)
}

export function useReadingProgress(user: User | null) {
  const [sections, setSections] = useState<ReadingSection[]>(REQUIRED_SECTIONS)
  const [allCompleted, setAllCompleted] = useState(false)
  const [loading, setLoading] = useState(true)

  // Memoize loadProgress to prevent unnecessary event listener updates
  const loadProgress = useCallback(async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_reading_progress')
        .select('*')
        .eq('user_id', user.id)

      if (error) {
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
      setAllCompleted(areRequiredSectionsCompleted(updatedSections))
    } catch (error) {
      // Silent error handling
    } finally {
      setLoading(false)
    }
  }, [user])

  // Load user's reading progress on mount and when user changes
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    loadProgress()
  }, [user, loadProgress])

  // Listen for reading progress updates from other components
  useEffect(() => {
    const handleProgressUpdate = () => {
      if (user) {
        loadProgress()
      }
    }

    window.addEventListener('reading-progress-updated', handleProgressUpdate)
    return () => window.removeEventListener('reading-progress-updated', handleProgressUpdate)
  }, [user, loadProgress])

  // Mark a section as completed
  const markSectionCompleted = async (sectionId: string, readingTimeSeconds: number = 0) => {
    if (!user) {
      console.warn('No user found - cannot mark section as completed')
      return false
    }

    try {
      const section = REQUIRED_SECTIONS.find(s => s.id === sectionId)
      if (!section) {
        console.warn(`Section not found: ${sectionId}`)
        return false
      }

      const { data: progressData, error } = await supabase
        .from('user_reading_progress')
        .upsert({
          user_id: user.id,
          section_id: sectionId,
          section_title: section.title,
          reading_time_seconds: readingTimeSeconds,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,section_id'
        })
        .select()

      if (error) {
        // Fallback: Update local state even if DB fails
        const updatedSections = sections.map(s =>
          s.id === sectionId ? { ...s, completed: true, reading_time: readingTimeSeconds } : s
        )
        setSections(updatedSections)
        setAllCompleted(areRequiredSectionsCompleted(updatedSections))

        // Emit event for other components
        window.dispatchEvent(new CustomEvent('reading-progress-updated'))

        return true // Return true for UX, even if DB failed
      }

      // Reload progress from database
      await loadProgress()

      // Emit event to notify other components
      window.dispatchEvent(new CustomEvent('reading-progress-updated'))

      return true
    } catch (error) {
      // Fallback: Update local state even on error
      const updatedSections = sections.map(s =>
        s.id === sectionId ? { ...s, completed: true, reading_time: readingTimeSeconds } : s
      )
      setSections(updatedSections)
      setAllCompleted(areRequiredSectionsCompleted(updatedSections))

      // Emit event for other components
      window.dispatchEvent(new CustomEvent('reading-progress-updated'))

      return true // Return true for UX
    }
  }

  // Check if user can access quiz/survey
  const canAccessQuiz = () => {
    return allCompleted
  }

  // Get completion percentage
  const getCompletionPercentage = () => {
    return calculateRequiredCompletionPercentage(sections)
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
