'use client'

import { cn } from '@/lib/utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  text?: string
  variant?: 'default' | 'ciprel'
}

export function LoadingSpinner({ size = 'md', className, text, variant = 'ciprel' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-[3px]',
    xl: 'h-16 w-16 border-4'
  }

  const colorClasses = variant === 'ciprel'
    ? 'border-gray-200 border-t-green-600'
    : 'border-gray-300 border-t-blue-600'

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div className="relative">
        <div className={cn(
          'animate-spin rounded-full',
          sizeClasses[size],
          colorClasses
        )} />
        {size === 'xl' && variant === 'ciprel' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-green-600 font-bold text-sm">C</span>
          </div>
        )}
      </div>
      {text && (
        <p className="text-sm text-gray-500 animate-pulse">{text}</p>
      )}
    </div>
  )
}

// Skeleton loader for cards
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white rounded-lg shadow p-4 animate-pulse', className)}>
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-200 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-3/4" />
          <div className="h-2 bg-gray-100 rounded w-1/2" />
        </div>
      </div>
    </div>
  )
}

// Skeleton loader for lists
export function SkeletonList({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-200 rounded" style={{ width: `${70 + Math.random() * 20}%` }} />
              <div className="h-2 bg-gray-100 rounded" style={{ width: `${40 + Math.random() * 30}%` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
