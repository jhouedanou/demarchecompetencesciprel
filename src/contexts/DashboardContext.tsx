'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { useDashboard } from '@/hooks/useDashboard'

type DashboardContextType = ReturnType<typeof useDashboard>

// Default no-op values for when the provider hasn't loaded data yet
const defaultValue: DashboardContextType = {
  data: null,
  stats: null,
  activities: [],
  chartData: null,
  isLoading: false,
  isRefreshing: false,
  error: null,
  refresh: async () => {},
  lastFetched: null,
}

const DashboardContext = createContext<DashboardContextType>(defaultValue)

/**
 * Provider that wraps all dashboard layout and shares a single data fetch.
 * Lives in the layout so data persists across page navigations.
 */
export function DashboardProvider({ children }: { children: ReactNode }) {
  const dashboard = useDashboard()

  return (
    <DashboardContext.Provider value={dashboard}>
      {children}
    </DashboardContext.Provider>
  )
}

/**
 * Hook to access shared dashboard data from any child component.
 * Safe to use on any page within the dashboard layout.
 */
export function useDashboardContext(): DashboardContextType {
  return useContext(DashboardContext)
}
