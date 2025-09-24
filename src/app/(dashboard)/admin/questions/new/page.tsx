import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import QuestionForm from '@/components/dashboard/QuestionForm'

export const metadata: Metadata = {
  title: 'Nouvelle Question - Admin CIPREL',
  description: 'Créer une nouvelle question de quiz',
}

export default function NewQuestionPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/questions">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux questions
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Nouvelle Question
        </h1>
        <p className="text-gray-600 mt-2">
          Créez une nouvelle question pour les quiz
        </p>
      </div>

      <QuestionForm mode="create" />
    </div>
  )
}