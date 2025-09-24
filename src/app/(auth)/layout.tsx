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
    <div id="backroud" className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-100">
          <div className="text-center mb-8">
            <img
              src="/images/logo.webp"
              alt="CIPREL"
              className="mx-auto h-12 w-auto mb-4"
            />
       
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
