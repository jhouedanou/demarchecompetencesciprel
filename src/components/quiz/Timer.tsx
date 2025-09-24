'use client'

import { useEffect, useState } from 'react'
import { Clock, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface TimerProps {
  startTime: number
  duration: number // en secondes
  onTimeUp: () => void
  className?: string
}

export function Timer({ startTime, duration, onTimeUp, className }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isWarning, setIsWarning] = useState(false)
  const [isCritical, setIsCritical] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000)
      const remaining = Math.max(0, duration - elapsed)
      
      setTimeLeft(remaining)
      
      // Alertes selon le temps restant
      if (remaining <= 60) { // 1 minute
        setIsCritical(true)
      } else if (remaining <= 300) { // 5 minutes
        setIsWarning(true)
      }
      
      if (remaining === 0) {
        clearInterval(interval)
        onTimeUp()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime, duration, onTimeUp])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getTimerColor = () => {
    if (isCritical) return 'text-red-600 bg-red-50 border-red-200'
    if (isWarning) return 'text-orange-600 bg-orange-50 border-orange-200'
    return 'text-gray-700 bg-gray-50 border-gray-200'
  }

  const getIconColor = () => {
    if (isCritical) return 'text-red-500'
    if (isWarning) return 'text-orange-500'
    return 'text-gray-500'
  }

  return (
    <div className={cn(
      'flex items-center space-x-2 px-3 py-2 rounded-lg border',
      getTimerColor(),
      isCritical && 'animate-pulse',
      className
    )}>
      {isCritical ? (
        <AlertTriangle className={cn('h-4 w-4', getIconColor())} />
      ) : (
        <Clock className={cn('h-4 w-4', getIconColor())} />
      )}
      
      <span className={cn(
        'font-mono font-semibold text-sm',
        isCritical && 'font-bold'
      )}>
        {formatTime(timeLeft)}
      </span>
      
      {isWarning && !isCritical && (
        <span className="text-xs">
          restant
        </span>
      )}
      
      {isCritical && (
        <span className="text-xs font-medium">
          Dépêchez-vous !
        </span>
      )}
    </div>
  )
}
