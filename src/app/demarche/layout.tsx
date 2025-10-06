'use client'

import ProgressTracker from '@/components/reading/ProgressTracker'

export default function DemarcheLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ciprel-orange-50 via-white to-ciprel-green-50">
      <div className="flex flex-row">
        {/* Sidebar - 30% à gauche */}
        <aside className="w-[30%] min-h-screen border-r border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 h-screen overflow-y-auto">
          <div className="p-6">
            <ProgressTracker />
          </div>
        </aside>

        {/* Main Content - 70% à droite */}
        <main className="w-[70%] min-h-screen">
          <div className="px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
