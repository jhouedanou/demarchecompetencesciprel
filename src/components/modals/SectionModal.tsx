'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { X, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useUser } from '@/hooks/useUser'
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
  const contentRef = useRef<HTMLDivElement>(null)
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)

  const section = sections.find(s => s.id === sectionId)
  const isAlreadyRead = section?.completed || false

  useEffect(() => {
    if (isOpen) {
      startTime.current = Date.now()
      document.body.style.overflow = 'hidden'
      setHasScrolledToBottom(false)
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Détection du scroll pour activer le bouton
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = contentRef.current
      const scrollThreshold = 0.9 // 90% du contenu doit être scrollé

      if (scrollTop + clientHeight >= scrollHeight * scrollThreshold) {
        setHasScrolledToBottom(true)
      }
    }

    const contentElement = contentRef.current
    if (contentElement && isOpen) {
      contentElement.addEventListener('scroll', handleScroll)
      // Vérifier immédiatement si le contenu est assez court pour être visible entièrement
      handleScroll()

      return () => contentElement.removeEventListener('scroll', handleScroll)
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
    if (!user) {
      toast.error('Connectez-vous pour valider cette étape.')
      return
    }

    if (!canMarkAsRead) {
      toast.error('Vous ne pouvez pas valider cette étape pour le moment.')
      return
    }

    try {
      const success = await markSectionCompleted(sectionId, 0)

      if (success) {
        toast.success('✅ Vous avez bien compris cette étape de la démarche !', {
          duration: 4000,
          style: {
            background: '#16a34a',
            color: '#fff',
            fontWeight: '600',
          },
        })
        onClose()
      } else {
        toast.error('Impossible de valider cette étape. Réessayez plus tard.')
      }
    } catch (error) {
      toast.error('Une erreur est survenue lors de la validation.')
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
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-ciprel-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-ciprel-green-600 to-ciprel-orange-500 text-white p-6 flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white white-text">{title}</h2>
            {isAlreadyRead && (
              <div className="flex items-center mt-2 text-ciprel-green-100">
                <Check className="h-4 w-4 mr-2" />
                <span className="text-sm">Section déjà lue</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-orange-100 transition-colors p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {isAlreadyRead
                ? 'Vous avez déjà validé cette étape de la démarche'
                : hasScrolledToBottom
                ? 'Vous pouvez maintenant valider cette étape'
                : 'Scrollez jusqu\'en bas pour pouvoir valider cette étape'
              }
            </p>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Fermer
              </button>

              {user && canMarkAsRead && !isAlreadyRead && (
                <button
                  onClick={handleMarkAsRead}
                  disabled={!hasScrolledToBottom}
                  className={`px-6 py-2 rounded-lg transition-colors flex items-center font-medium ${
                    hasScrolledToBottom
                      ? 'bg-ciprel-green-600 text-white hover:bg-ciprel-green-700'
                      : 'bg-ciprel-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Check className="h-4 w-4 mr-2" />
                  J'ai compris cette étape de la démarche
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
