'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function TopLoadingBar() {
    const pathname = usePathname()
    const [isLoading, setIsLoading] = useState(false)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        // Démarrer la barre de progression lors du changement de route
        setIsLoading(true)
        setProgress(0)

        // Animation de la progression
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(progressInterval)
                    return 90
                }
                return prev + Math.random() * 10
            })
        }, 100)

        // Terminer la progression après un court délai
        const completeTimeout = setTimeout(() => {
            setProgress(100)
            setTimeout(() => {
                setIsLoading(false)
                setProgress(0)
            }, 200)
        }, 400)

        return () => {
            clearInterval(progressInterval)
            clearTimeout(completeTimeout)
        }
    }, [pathname])

    if (!isLoading && progress === 0) {
        return null
    }

    return (
        <>
            {/* Barre de progression en haut - TRÈS VISIBLE */}
            <div
                className="fixed top-0 left-0 right-0 z-[9999] h-2 bg-gray-200"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <div
                    className="h-full bg-gradient-to-r from-ciprel-green-500 via-ciprel-orange-500 to-ciprel-green-600 transition-all duration-200 ease-out shadow-lg"
                    style={{
                        width: `${progress}%`,
                        opacity: isLoading ? 1 : 0,
                        boxShadow: '0 0 10px rgba(238, 127, 0, 0.5)'
                    }}
                >
                    {/* Effet de brillance */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                </div>
            </div>

            {/* Overlay avec spinner central - TRÈS VISIBLE */}
            {isLoading && (
                <div className="fixed inset-0 z-[9998] pointer-events-none">
                    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl px-8 py-6 flex flex-col items-center gap-4 border-4 border-ciprel-orange-500">
                        {/* Spinner géant */}
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-8 border-ciprel-orange-200 rounded-full"></div>
                            <div className="absolute inset-0 border-8 border-transparent border-t-ciprel-orange-600 rounded-full animate-spin"></div>
                        </div>

                        {/* Texte de chargement */}
                        <div className="text-center">
                            <p className="text-xl font-bold text-ciprel-orange-600 mb-1">
                                Chargement...
                            </p>
                            <p className="text-2xl font-extrabold text-ciprel-green-600">
                                {Math.round(progress)}%
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
