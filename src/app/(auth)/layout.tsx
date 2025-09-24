import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authentification - CIPREL Compétences',
  description: 'Connectez-vous à votre compte CIPREL Compétences',
}

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img
              src="/images/logo-ciprel.png"
              alt="CIPREL"
              className="mx-auto h-12 w-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900">
              CIPREL Compétences
            </h1>
            <p className="text-gray-600 mt-2">
              Développez vos compétences professionnelles
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
