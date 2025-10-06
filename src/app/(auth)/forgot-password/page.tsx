'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { ArrowLeft, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase/client'

const forgotPasswordSchema = z.object({
  email: z.string().email('Adresse email invalide'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  })

  const email = watch('email')

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setEmailSent(true)
      toast.success('Email de réinitialisation envoyé !')
    } catch (error: any) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de l\'envoi de l\'email')
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ciprel-green-50 via-white to-ciprel-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Email envoyé !
              </h1>
              <p className="text-gray-600">
                Nous avons envoyé un lien de réinitialisation à{' '}
                <strong className="text-ciprel-green-600">{email}</strong>
              </p>
            </div>

            <div className="bg-ciprel-orange-50 border border-ciprel-orange-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700">
                <strong>Important :</strong> Le lien est valable pendant 60 minutes. 
                Vérifiez également votre dossier spam si vous ne recevez pas l'email.
              </p>
            </div>

            <Button
              onClick={() => router.push('/login')}
              className="w-full bg-ciprel-green-600 hover:bg-ciprel-green-700 text-white"
            >
              Retour à la connexion
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ciprel-green-50 via-white to-ciprel-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="mb-6">
          <Link
            href="/login"
            className="inline-flex items-center text-ciprel-orange-600 hover:text-ciprel-orange-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la connexion
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mot de passe oublié ?
            </h1>
            <p className="text-gray-600">
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="pl-10"
                  placeholder="votre@email.com"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-ciprel-green-600 hover:bg-ciprel-green-700 text-white"
            >
              {isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
