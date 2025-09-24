import { CiprelNavigation } from '@/components/ciprel/CiprelNavigation'
import { RessourcesContent } from '@/components/ciprel/RessourcesContent'

export const metadata = {
  title: 'Ressources Documentaires | CIPREL',
  description: 'Téléchargez les guides et documents sur la démarche compétence CIPREL',
}

export default function RessourcesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CiprelNavigation />
      <RessourcesContent />
    </div>
  )
}
