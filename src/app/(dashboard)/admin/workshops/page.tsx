'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function WorkshopsPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/admin/workshops-metiers')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ciprel-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection vers la gestion des workshops...</p>
      </div>
    </div>
  )
}

