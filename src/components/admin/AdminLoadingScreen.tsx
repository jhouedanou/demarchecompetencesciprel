'use client'

import { useEffect, useState } from 'react'

interface AdminLoadingScreenProps {
  message?: string
}

export function AdminLoadingScreen({ message = 'Chargement en cours...' }: AdminLoadingScreenProps) {
  const [dots, setDots] = useState('')

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        {/* Logo Animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Outer ring */}
            <div className="w-16 h-16 rounded-full border-4 border-gray-200 animate-pulse" />
            {/* Spinning ring */}
            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-transparent border-t-green-600 animate-spin" />
            {/* Inner circle */}
            <div className="absolute inset-2 w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Administration CIPREL
          </h2>
          <p className="text-gray-500 min-w-[180px]">
            {message}{dots}
          </p>
        </div>

        {/* Progress bar animation */}
        <div className="mt-6 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-400 via-green-600 to-green-400 rounded-full animate-loading-bar" />
        </div>

        {/* Skeleton preview */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-2 bg-gray-100 rounded w-1/2 animate-pulse" />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
              <div className="h-2 bg-gray-100 rounded w-1/3 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Compact version for inline loading
export function AdminLoadingInline({ message = 'Chargement...' }: AdminLoadingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative mb-4">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200" />
        <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-green-600 animate-spin" />
      </div>
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  )
}
