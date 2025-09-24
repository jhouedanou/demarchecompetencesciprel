import { CiprelNavigation } from '@/components/ciprel/CiprelNavigation'
import { CiprelQuizContent } from '@/components/ciprel/CiprelQuizContent'

export const metadata = {
  title: 'Quiz Phase Introductive | CIPREL',
  description: 'Testez vos connaissances sur la démarche compétence CIPREL',
}

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CiprelNavigation />
      <CiprelQuizContent />
    </div>
  )
}
