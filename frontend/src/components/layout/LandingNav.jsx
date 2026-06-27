import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Logo } from '../ui/Logo'
import Button from '../ui/Button'
import { useAuth } from '../../context/AuthContext'

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      scrolled ? 'glass shadow-soft' : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Logo />

          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-body-sm text-muted hover:text-primary-500 transition-colors">How it Works</a>
            <a href="#categories" className="text-body-sm text-muted hover:text-primary-500 transition-colors">Categories</a>
            <a href="#workers" className="text-body-sm text-muted hover:text-primary-500 transition-colors">Workers</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Button onClick={() => navigate(user.role === 'WORKER' ? '/worker/dashboard' : '/customer/dashboard')}>
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>Sign In</Button>
                <Button onClick={() => navigate('/register')}>Get Started</Button>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-primary-500/5 bg-white"
          >
            <div className="px-4 py-4 space-y-3">
              <a href="#how-it-works" className="block py-2 text-body-sm text-muted" onClick={() => setMobileOpen(false)}>How it Works</a>
              <a href="#categories" className="block py-2 text-body-sm text-muted" onClick={() => setMobileOpen(false)}>Categories</a>
              <a href="#workers" className="block py-2 text-body-sm text-muted" onClick={() => setMobileOpen(false)}>Workers</a>
              <div className="pt-2 space-y-2">
                {user ? (
                  <Button className="w-full" onClick={() => { setMobileOpen(false); navigate('/customer/dashboard') }}>Dashboard</Button>
                ) : (
                  <>
                    <Button variant="outline" className="w-full" onClick={() => { setMobileOpen(false); navigate('/login') }}>Sign In</Button>
                    <Button className="w-full" onClick={() => { setMobileOpen(false); navigate('/register') }}>Get Started</Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
