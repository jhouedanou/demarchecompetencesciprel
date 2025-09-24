'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { X, Check } from 'lucide-react'
import { useUser } from '@/lib/supabase/client'
import { useReadingProgress } from '@/hooks/useReadingProgress'

interface SectionModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  sectionId: string
  children: ReactNode
  canMarkAsRead?: boolean
}

export function SectionModal({
  isOpen,
  onClose,
  title,
  sectionId,
  children,
  canMarkAsRead = true
}: SectionModalProps) {
  const { user } = useUser()
  const { markSectionCompleted, sections } = useReadingProgress(user)
  const startTime = useRef<number>(Date.now())
  const modalRef = useRef<HTMLDivElement>(null)

  const section = sections.find(s => s.id === sectionId)
  const isAlreadyRead = section?.completed || false

  useEffect(() => {
    if (isOpen) {
      startTime.current = Date.now()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleMarkAsRead = async () => {
    if (user && canMarkAsRead) {
      const readingTime = Math.round((Date.now() - startTime.current) / 1000)
      const success = await markSectionCompleted(sectionId, readingTime)
      if (success) {
        onClose()
      }
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{title}</h2>
            {isAlreadyRead && (
              <div className="flex items-center mt-2 text-green-200">
                <Check className="h-4 w-4 mr-2" />
                <span className="text-sm">Section déjà lue</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {isAlreadyRead
                ? 'Vous avez déjà lu cette section'
                : 'Lisez entièrement cette section pour débloquer les quiz'
              }
            </p>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Fermer
              </button>

              {user && canMarkAsRead && !isAlreadyRead && (
                <button
                  onClick={handleMarkAsRead}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Marquer comme lu
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}