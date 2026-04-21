import { Loader2 } from 'lucide-react'
import Image from 'next/image'

interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({ message = 'Chargement...' }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-ciprel-green-50 via-white to-ciprel-orange-50">
      <div className="flex flex-col items-center justify-center space-y-6 px-4">
        {/* Logo CIPREL */}
        <Image
          src="/images/logo.webp"
          alt="CIPREL"
          width={240}
          height={96}
          className="h-24 w-auto object-contain drop-shadow-lg animate-pulse"
        />

        {/* Spinner */}
        <div className="relative">
          <Loader2 className="h-12 w-12 text-ciprel-orange-600 animate-spin" />
        </div>

        {/* Message */}
        <div className="text-center">
          <p className="text-lg font-semibold text-ciprel-black mb-2">
            {message}
          </p>
          <p className="text-sm text-gray-600">
            Veuillez patienter un instant...
          </p>
        </div>
      </div>
    </div>
  )
}
