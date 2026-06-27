import { motion } from 'framer-motion'
import { Logo } from '../ui/Logo'

export function AuthLayout({ children, image = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80' }) {
  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex relative w-1/2 bg-primary-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/20 via-primary-500 to-accent-500/20" />
        <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="relative z-10 flex flex-col justify-between p-12">
          <Logo />
          <div className="max-w-sm">
            <blockquote className="text-white/80 text-body-lg leading-relaxed">
              "SkillBridge transformed how I find work. The quality of clients and the platform's ease of use is unmatched."
            </blockquote>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20" />
              <div>
                <p className="text-body-sm font-medium text-white">Marcus Johnson</p>
                <p className="text-caption text-white/50">Master Carpenter</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8">
            <Logo />
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  )
}
