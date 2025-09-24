'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import {
  LayoutDashboard,
  Users,
  Brain,
  Video,
  BarChart3,
  Settings,
  Shield,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const navigation = [
  {
    name: 'Tableau de bord',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Utilisateurs',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Questions Quiz',
    href: '/admin/questions',
    icon: Brain,
  },
  {
    name: 'Vidéos',
    href: '/admin/videos',
    icon: Video,
  },
  {
    name: 'Résultats',
    href: '/admin/results',
    icon: BarChart3,
  },
  {
    name: 'RGPD',
    href: '/admin/gdpr',
    icon: Shield,
  },
  {
    name: 'Rapports',
    href: '/admin/reports',
    icon: FileText,
  },
  {
    name: 'Paramètres',
    href: '/admin/settings',
    icon: Settings,
  },
]

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={cn(
      'fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <img 
              src="/images/logo-ciprel.png" 
              alt="CIPREL" 
              className="h-8 w-auto" 
            />
            <span className="text-xl font-bold text-gray-900">
              Admin
            </span>
          </div>
        )}
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex w-full flex-col items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-center transition-all duration-200',
                isActive
                  ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                collapsed && 'gap-1 px-2 py-2 text-xs'
              )}
              title={collapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && (
                <span className="truncate">{item.name}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className={cn(
          'text-xs text-gray-500',
          collapsed ? 'text-center' : 'space-y-1'
        )}>
          {!collapsed && (
            <>
              <div>CIPREL Compétences</div>
              <div>Administration v1.0</div>
            </>
          )}
          {collapsed && <div>v1.0</div>}
        </div>
      </div>
    </div>
  )
}
