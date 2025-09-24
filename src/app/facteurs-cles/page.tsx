import { CiprelNavigation } from '@/components/ciprel/CiprelNavigation'
import { FacteursClesContent } from '@/components/ciprel/FacteursClesContent'

export const metadata = {
  title: 'Leviers et Facteurs Clés de Succès | CIPREL',
  description: 'Les 4 facteurs clés pour réussir la démarche compétence chez CIPREL',
}

export default function FacteursClesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CiprelNavigation />
      <FacteursClesContent />
    </div>
  )
}
