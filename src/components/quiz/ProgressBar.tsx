'use client'

import { cn } from '@/lib/utils/cn'

interface ProgressBarProps {
  current: number
  total: number
  className?: string
  showLabel?: boolean
}

export function ProgressBar({ current, total, className, showLabel = true }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100)
  
  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {current} sur {total}
          </span>
          <span className="text-sm text-gray-500">
            {percentage}%
          </span>
        </div>
      )}
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Points de progression */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: total }, (_, index) => (
          <div
            key={index}
            className={cn(
              'w-2 h-2 rounded-full transition-colors duration-200',
              index < current
                ? 'bg-blue-500'
                : index === current - 1
                ? 'bg-purple-500 animate-pulse'
                : 'bg-gray-300'
            )}
          />
        ))}
      </div>
    </div>
  )
}
