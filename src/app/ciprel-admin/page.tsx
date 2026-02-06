'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminAccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the unified admin login page
    router.replace('/admin-login')
  }, [router])

  return null
}
