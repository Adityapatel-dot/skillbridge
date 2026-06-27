import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { cn } from '../../lib/utils'
import { Logo } from '../ui/Logo'
import { SIDEBAR_ITEMS } from '../../lib/constants'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useTranslate } from '../../lib/i18n'

export function Sidebar({ open, setOpen }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const { settings } = useTheme()
  const t = useTranslate(settings.language)
  const role = user?.role?.toLowerCase()
  const roleKey = role === 'client' ? 'customer' : role
  const items = SIDEBAR_ITEMS[roleKey] || SIDEBAR_ITEMS.customer

  const routePaths = {
    dashboard: 'dashboard',
    marketplace: 'marketplace',
    'job-map': 'job-map',
    'my-jobs': 'jobs',
    requests: 'requests',
    payments: 'payments',
    applications: 'applications',
    messages: 'messages',
    notifications: 'notifications',
    settings: 'settings',
    users: '/admin/users',
    disputes: '/admin/disputes',
    analytics: '/admin/analytics',
  }

  const handleNavigate = (id) => {
    const base = role === 'admin' ? '/admin' : `/${roleKey}`
    const path = routePaths[id]
    navigate(path?.startsWith('/') ? path : `${base}/${path}`)
    setOpen?.(false)
  }

  const isActiveRoute = (id) => {
    const path = routePaths[id]
    if (path?.startsWith('/')) return location.pathname.startsWith(path)
    return location.pathname === `/${roleKey}/${path}` || location.pathname.startsWith(`/${roleKey}/${path}/`)
  }

  const avatarGradient = 'from-[#60a5fa] to-[#2563eb]'

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-primary-500/20 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} />
      )}
      <aside className={cn(
        'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-primary-500/5 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="px-5 py-5 border-b border-primary-500/5">
          <Logo />
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {items.map(item => {
            const Icon = Icons[item.icon]
            const isActive = isActiveRoute(item.id)
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-body-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary-500 text-white shadow-soft'
                    : 'text-muted hover:text-primary-500 hover:bg-primary-50'
                )}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {t('nav.' + item.id)}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-primary-500/5">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className={cn('w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-caption font-semibold', avatarGradient)}>
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-body-sm font-medium text-primary-500 truncate">{user?.fullName}</p>
              <p className="text-caption text-muted capitalize">{roleKey}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
