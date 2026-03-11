'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const prevPathname = useRef(pathname)

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname
      // Brief fade - no artificial delay, render new children immediately
      setIsVisible(false)
      // Use requestAnimationFrame for a single-frame fade, not setTimeout
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true)
        })
      })
    }
  }, [pathname])

  return (
    <div
      className={`transition-opacity duration-150 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  )
}
