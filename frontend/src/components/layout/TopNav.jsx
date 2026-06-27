import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, MessageSquare, Menu, LogOut, ChevronDown, Search, Sun, Moon, Globe, Check } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Avatar } from '../ui/Avatar'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useTranslate } from '../../lib/i18n'
import { notificationsApi } from '../../api/notifications'
import { chatApi } from '../../api/chat'

export function TopNav({ setSidebarOpen }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const rolePath = user?.role?.toLowerCase() === 'client' ? 'customer' : user?.role?.toLowerCase()
  const [unreadNotif, setUnreadNotif] = useState(0)
  const [unreadChat, setUnreadChat] = useState(0)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [notifRes, chatRes] = await Promise.all([
          notificationsApi.getUnreadCount(),
          chatApi.getUnreadCount(),
        ])
        setUnreadNotif(notifRes.data.count)
        setUnreadChat(chatRes.data.count)
      } catch {}
    }
    fetchCounts()
    const interval = setInterval(fetchCounts, 30000)
    return () => clearInterval(interval)
  }, [])

  const { settings, updateSetting } = useTheme()
  const t = useTranslate(settings.language)
  const isDark = settings.theme === 'dark'
  const [showLangMenu, setShowLangMenu] = useState(false)

  const languages = [
    { id: 'en', label: 'English' },
    { id: 'hi', label: 'हिन्दी (Hindi)' },
    { id: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { id: 'te', label: 'తెలుగు (Telugu)' },
  ]

  const toggleTheme = () => {
    updateSetting('theme', isDark ? 'light' : 'dark')
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-primary-500/5">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        <div className="flex items-center gap-3">
          <button className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-primary-50" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-muted" />
          </button>
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder={t('topnav.search')}
                className="w-64 bg-primary-50/50 rounded-xl pl-9 pr-4 py-2 text-body-sm text-primary-500 placeholder:text-muted/50 outline-none focus:bg-white focus:ring-2 focus:ring-secondary-500/10 transition-all"
              />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => navigate(`/${rolePath}/messages`)} className="relative p-2 rounded-xl hover:bg-primary-50 transition-colors">
            <MessageSquare className="w-5 h-5 text-muted" />
            {unreadChat > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-secondary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadChat > 9 ? '9+' : unreadChat}
              </span>
            )}
          </button>
          <button onClick={() => navigate(`/${rolePath}/notifications`)} className="relative p-2 rounded-xl hover:bg-primary-50 transition-colors">
            <Bell className="w-5 h-5 text-muted" />
            {unreadNotif > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadNotif > 9 ? '9+' : unreadNotif}
              </span>
            )}
          </button>

          <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-primary-50 transition-colors">
            {isDark ? <Sun className="w-5 h-5 text-muted" /> : <Moon className="w-5 h-5 text-muted" />}
          </button>

          <div className="relative">
            <button onClick={() => setShowLangMenu(!showLangMenu)} className="p-2 rounded-xl hover:bg-primary-50 transition-colors">
              <Globe className="w-5 h-5 text-muted" />
            </button>

            {showLangMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowLangMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-modal border border-primary-500/5 py-2 z-20 animate-fade-in-down">
                  {languages.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => { updateSetting('language', lang.id); setShowLangMenu(false) }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-body-sm text-muted hover:bg-primary-50 hover:text-primary-500 transition-colors"
                    >
                      <span className="w-4 flex shrink-0">
                        {settings.language === lang.id && <Check className="w-4 h-4 text-secondary-500" />}
                      </span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 ml-2 p-1.5 rounded-xl hover:bg-primary-50 transition-colors"
            >
              <Avatar name={user?.fullName} size="sm" />
              <ChevronDown className="w-3.5 h-3.5 text-muted hidden sm:block" />
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-modal border border-primary-500/5 py-2 z-20 animate-fade-in-down">
                  <div className="px-4 py-3 border-b border-primary-500/5">
                    <p className="text-body-sm font-medium text-primary-500">{user?.fullName}</p>
                    <p className="text-caption text-muted">{user?.email}</p>
                  </div>
                  <button onClick={() => { setShowUserMenu(false); navigate(`/${rolePath}/settings`) }} className="w-full text-left px-4 py-2 text-body-sm text-muted hover:bg-primary-50 hover:text-primary-500 transition-colors">
                    {t('nav.settings')}
                  </button>
                  <button onClick={() => { setShowUserMenu(false); handleLogout() }} className="w-full text-left px-4 py-2 text-body-sm text-danger/70 hover:bg-danger/5 hover:text-danger transition-colors flex items-center gap-2">
                    <LogOut className="w-3.5 h-3.5" /> {t('topnav.sign-out')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
