import { RegisterForm } from '@/components/auth/RegisterForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Créer un compte',
  description: 'Créez votre compte CIPREL Compétences',
}

export default function RegisterPage() {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Créer un compte
        </h2>
        <p className="text-gray-600 mt-2 text-sm">
          Rejoignez la communauté CIPREL
        </p>
      </div>
      
      <RegisterForm />
    </div>
  )
}
