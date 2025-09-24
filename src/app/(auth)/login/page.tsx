import { LoginForm } from '@/components/auth/LoginForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Se connecter',
  description: 'Connectez-vous à votre compte CIPREL Compétences',
}

export default function LoginPage() {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Se connecter
        </h2>
        <p className="text-gray-600 mt-2 text-sm">
          Accédez à vos formations et quiz
        </p>
      </div>
      
      <LoginForm />
    </div>
  )
}
