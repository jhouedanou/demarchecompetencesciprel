import { CiprelHero } from '@/components/ciprel/CiprelHero'
import { CiprelNavigation } from '@/components/ciprel/CiprelNavigation'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <CiprelNavigation />
      <CiprelHero />
    </div>
  )
}