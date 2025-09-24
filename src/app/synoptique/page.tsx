import { CiprelNavigation } from '@/components/ciprel/CiprelNavigation'
import { SynoptiqueContent } from '@/components/ciprel/SynoptiqueContent'

export const metadata = {
  title: 'Synoptique de la Démarche Compétence | CIPREL',
  description: 'Les 5 étapes cycliques de la démarche compétence chez CIPREL',
}

export default function SynoptiquePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CiprelNavigation />
      <SynoptiqueContent />
    </div>
  )
}
