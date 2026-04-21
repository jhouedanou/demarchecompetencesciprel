'use client'

export default function DashboardLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner animé CIPREL */}
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-gray-200 border-t-green-600 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-green-600 font-bold text-sm">C</span>
          </div>
        </div>
        {/* Texte avec animation pulse */}
        <p className="text-sm text-gray-500 animate-pulse">
          Chargement en cours...
        </p>
        {/* Barre de progression animée */}
        <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full animate-loading-bar" />
        </div>
      </div>
    </div>
  )
}
