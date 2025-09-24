import { CiprelNavigation } from '@/components/ciprel/CiprelNavigation'
import { CiprelSondageContent } from '@/components/ciprel/CiprelSondageContent'

export const metadata = {
  title: 'Sondage d\'Opinion | CIPREL',
  description: 'Partagez votre avis sur la démarche compétence CIPREL',
}

export default function SondagePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CiprelNavigation />
      <CiprelSondageContent />
    </div>
  )
}
