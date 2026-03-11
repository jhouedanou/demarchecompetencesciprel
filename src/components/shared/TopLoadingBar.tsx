'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'

export function TopLoadingBar() {
    const pathname = usePathname()
    const [isLoading, setIsLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const prevPathname = useRef(pathname)

    useEffect(() => {
        // Only trigger on actual route changes, not initial render
        if (prevPathname.current === pathname) return
        prevPathname.current = pathname

        // Start the progress bar
        setIsLoading(true)
        setProgress(30)

        // Quick ramp up
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(progressInterval)
                    return 90
                }
                return prev + Math.random() * 15
            })
        }, 50)

        // Complete quickly - client-side navigations are fast
        const completeTimeout = setTimeout(() => {
            setProgress(100)
            setTimeout(() => {
                setIsLoading(false)
                setProgress(0)
            }, 150)
        }, 200)

        return () => {
            clearInterval(progressInterval)
            clearTimeout(completeTimeout)
        }
    }, [pathname])

    if (!isLoading && progress === 0) {
        return null
    }

    return (
        <div
            className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
        >
            <div
                className="h-full bg-gradient-to-r from-ciprel-green-500 via-ciprel-orange-500 to-ciprel-green-600 transition-all duration-150 ease-out"
                style={{
                    width: `${progress}%`,
                    opacity: isLoading ? 1 : 0,
                }}
            />
        </div>
    )
}
