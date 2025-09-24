import { CiprelNavigation } from '@/components/ciprel/CiprelNavigation'
import { DialectiqueContent } from '@/components/ciprel/DialectiqueContent'

export const metadata = {
  title: 'Dialectique de la Démarche Compétence | CIPREL',
  description: 'Comprendre la démarche compétence : définition, éléments clés et bénéfices pour CIPREL',
}

export default function DialectiquePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CiprelNavigation />
      <DialectiqueContent />
    </div>
  )
}
