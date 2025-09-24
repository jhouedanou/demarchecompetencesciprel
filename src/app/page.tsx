import { CiprelHeroCorporate } from '@/components/ciprel/CiprelHeroCorporate'
import { CiprelNavigation } from '@/components/ciprel/CiprelNavigation'
import { SitePasswordGate } from '@/components/auth/SitePasswordGate'

export default function HomePage() {
  return (
    <SitePasswordGate>
      <div className="min-h-screen bg-white">
        <CiprelNavigation />
        <CiprelHeroCorporate />
      </div>
    </SitePasswordGate>
  )
}