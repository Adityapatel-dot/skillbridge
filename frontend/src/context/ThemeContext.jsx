import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

const STORAGE_KEY = 'skillbridge_appearance'

function applyTheme(theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else if (theme === 'light') {
    root.classList.remove('dark')
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('dark', prefersDark)
  }
}

function applyColorScheme(scheme) {
  document.documentElement.setAttribute('data-color-scheme', scheme)
}

function applyFontSize(size) {
  const sizes = { small: '14px', medium: '16px', large: '18px', 'extra-large': '20px' }
  document.documentElement.style.fontSize = sizes[size] || '16px'
}

function applyAll(settings) {
  applyTheme(settings.theme)
  applyColorScheme(settings.colorScheme)
  applyFontSize(settings.fontSize)
}

const DEFAULTS = {
  theme: 'system',
  colorScheme: 'blue',
  fontSize: 'medium',
  language: 'en',
}

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return { ...DEFAULTS, ...JSON.parse(saved) }
  } catch {}
  return { ...DEFAULTS }
}

// Apply settings to DOM immediately before any React render
const PRELOAD = loadSettings()
applyAll(PRELOAD)

export function ThemeProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings)

  useEffect(() => {
    applyAll(settings)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    if (settings.theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme('system')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [settings.theme])

  const updateSetting = (key, value) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value }
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ settings, updateSetting }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
