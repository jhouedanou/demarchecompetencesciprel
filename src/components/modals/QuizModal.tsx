'use client'

import { QuizEngine } from '@/components/quiz/QuizEngine'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

interface QuizModalProps {
  isOpen: boolean
  onClose: () => void
  quizType: 'INTRODUCTION' | 'SONDAGE'
  title: string
  description: string
}

export function QuizModal({ isOpen, onClose, quizType, title, description }: QuizModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-2xl font-semibold text-ciprel-black">
          {title}
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-600">
          {description}
        </DialogDescription>
        <div className="mt-6">
          <QuizEngine quizType={quizType} className="" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
