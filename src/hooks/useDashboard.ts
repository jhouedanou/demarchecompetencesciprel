'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { authFetch } from '@/lib/api/client'

/**
 * Dashboard data types
 */
interface DashboardStats {
  totalUsers: number
  totalQuizAttempts: number
  totalQuizResults: number
  totalVideos: number
  totalQuestions: number
  averageScore: number
  completionRate: number
  activeToday: number
}

interface ActivityItem {
  id: string
  type: 'user_signup' | 'quiz_completed' | 'video_viewed' | 'login'
  user_name: string
  user_email: string
  user_avatar?: string | null
  details: string
  timestamp: string
  status?: 'success' | 'warning' | 'error'
}

interface ChartData {
  userActivity: Array<{
    date: string
    users: number
    quiz_completions: number
    video_views: number
  }>
  quizPerformance: Array<{
    category: string
    average_score: number
    attempts: number
  }>
  deviceStats: Array<{
    name: string
    value: number
    color: string
  }>
}

interface DashboardData {
  stats: DashboardStats
  activities: ActivityItem[]
  chartData: ChartData
  _meta?: {
    fetchedAt: string
    responseTimeMs: number
  }
}

interface UseDashboardReturn {
  /** All dashboard data */
  data: DashboardData | null
  /** Quick access to stats */
  stats: DashboardStats | null
  /** Quick access to activities */
  activities: ActivityItem[]
  /** Quick access to chart data */
  chartData: ChartData | null
  /** Whether the initial fetch is in progress */
  isLoading: boolean
  /** Whether a background refresh is in progress */
  isRefreshing: boolean
  /** Error message if fetch failed */
  error: string | null
  /** Manually trigger a refresh */
  refresh: () => Promise<void>
  /** Time of last successful fetch */
  lastFetched: Date | null
}

// Module-level cache to persist data across component remounts
let cachedData: DashboardData | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION_MS = 60 * 1000 // 60 seconds

/**
 * Custom hook for loading all admin dashboard data in a single request.
 * 
 * Features:
 * - Single API call instead of 3 separate ones (avoids multiple cold starts)
 * - Module-level cache (persists across remounts within same session)
 * - Stale-while-revalidate pattern (shows cached data immediately, refreshes in background)
 * - Auto-refresh interval (every 60 seconds)
 * - Manual refresh capability
 */
export function useDashboard(): UseDashboardReturn {
  const [data, setData] = useState<DashboardData | null>(cachedData)
  const [isLoading, setIsLoading] = useState(!cachedData)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetched, setLastFetched] = useState<Date | null>(
    cacheTimestamp ? new Date(cacheTimestamp) : null
  )
  const mountedRef = useRef(true)
  const fetchingRef = useRef(false)

  const fetchDashboard = useCallback(async (isBackgroundRefresh = false) => {
    // Prevent concurrent fetches
    if (fetchingRef.current) return
    fetchingRef.current = true

    if (!isBackgroundRefresh) {
      setIsLoading(true)
    } else {
      setIsRefreshing(true)
    }

    try {
      const response = await authFetch('/api/admin/dashboard')

      if (!mountedRef.current) return

      if (response.ok) {
        const newData = await response.json()

        // Update module-level cache
        cachedData = newData
        cacheTimestamp = Date.now()

        setData(newData)
        setError(null)
        setLastFetched(new Date())
      } else {
        const errBody = await response.json().catch(() => ({}))
        const errMsg = errBody.error || `Erreur ${response.status}`

        // Only set error if no cached data is available
        if (!cachedData) {
          setError(errMsg)
        }
        console.error('[useDashboard] Fetch error:', errMsg)
      }
    } catch (err) {
      if (!mountedRef.current) return

      const errMsg = err instanceof Error ? err.message : 'Erreur réseau'
      if (!cachedData) {
        setError(errMsg)
      }
      console.error('[useDashboard] Network error:', err)
    } finally {
      if (mountedRef.current) {
        setIsLoading(false)
        setIsRefreshing(false)
      }
      fetchingRef.current = false
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true

    // If we have fresh cached data, use it and schedule background refresh
    const isCacheFresh = cachedData && (Date.now() - cacheTimestamp < CACHE_DURATION_MS)

    if (isCacheFresh) {
      // Show cached data immediately — no background refresh needed
      setData(cachedData)
      setIsLoading(false)

      // Set up auto-refresh interval (every 60s)
      const interval = setInterval(() => {
        fetchDashboard(true)
      }, 60000)

      return () => {
        mountedRef.current = false
        clearInterval(interval)
      }
    }

    // No cache - fetch immediately
    fetchDashboard(false)

    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      fetchDashboard(true)
    }, 60000)

    return () => {
      mountedRef.current = false
      clearInterval(interval)
    }
  }, [fetchDashboard])

  return {
    data,
    stats: data?.stats || null,
    activities: data?.activities || [],
    chartData: data?.chartData || null,
    isLoading,
    isRefreshing,
    error,
    refresh: () => fetchDashboard(false),
    lastFetched,
  }
}
