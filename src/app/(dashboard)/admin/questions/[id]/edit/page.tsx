import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import QuestionForm from '@/components/dashboard/QuestionForm'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Use generateMetadata for dynamic metadata
export async function generateMetadata({
  params
}: {
  params: { id: string }
}): Promise<Metadata> {
  return {
    title: 'Modifier Question - Admin CIPREL',
    description: 'Modifier une question de quiz existante',
  }
}

interface EditQuestionPageProps {
  params: {
    id: string
  }
}

export default function EditQuestionPage({ params }: EditQuestionPageProps) {
  console.log('[EditQuestionPage] Page loaded with params:', params)
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
          Modifier Question
        </h1>
        <p className="text-gray-600 mt-2">
          Modifiez les détails de cette question
        </p>
      </div>

      <QuestionForm mode="edit" questionId={params.id} />
    </div>
  )
}