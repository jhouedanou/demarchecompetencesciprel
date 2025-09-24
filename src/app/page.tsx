'use client'

import { CiprelHeroCorporate } from '@/components/ciprel/CiprelHeroCorporate'
import { CiprelNavigation } from '@/components/ciprel/CiprelNavigation'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <CiprelNavigation />
      <CiprelHeroCorporate />
    </div>
  )
}