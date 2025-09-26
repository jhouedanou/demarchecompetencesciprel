'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores/auth-store'

const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const signIn = useAuthStore(state => state.signIn)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)

    try {
      const { error } = await signIn({ email: data.email, password: data.password })

      if (error) throw new Error(error)

      toast.success('Connexion réussie !')

      // Get user from store after successful sign in
      const currentUser = useAuthStore.getState().user

      // Redirection basée sur le rôle
      if (currentUser?.role === 'ADMIN') {
        router.push('/admin')
      } // Les autres rôles restent sur la page courante; le portail se fermera automatiquement
    } catch (error: any) {
      console.error('Erreur de connexion:', error)
      
      let message = 'Erreur de connexion'
      if (error.message === 'Invalid login credentials') {
        message = 'Email ou mot de passe incorrect'
      } else if (error.message === 'Email not confirmed') {
        message = 'Veuillez confirmer votre email avant de vous connecter'
      }
      
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
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

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Mot de passe
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            className="pl-10 pr-10"
            placeholder="••••••••"
            {...register('password')}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Link
          href="/auth/forgot-password"
          className="text-sm text-blue-600 hover:text-blue-500"
        >
          Mot de passe oublié ?
        </Link>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isLoading ? 'Connexion...' : 'Se connecter'}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Pas encore de compte ?{' '}
          <Link
            href="/auth/register"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </form>
  )
}
