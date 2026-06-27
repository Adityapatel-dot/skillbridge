import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 shadow-soft hover:shadow-elevated active:scale-[0.98] dark:text-slate-900 dark:hover:text-slate-900',
  secondary: 'bg-white text-primary-500 border border-primary-500/10 hover:bg-primary-50 hover:border-primary-500/20 shadow-soft',
  accent: 'bg-accent-500 text-white hover:bg-accent-600 shadow-soft hover:shadow-glow-accent active:scale-[0.98] dark:text-slate-900 dark:hover:text-slate-900',
  ghost: 'text-primary-500 hover:bg-primary-50',
  danger: 'bg-danger text-white hover:bg-red-600 shadow-soft',
  outline: 'bg-transparent text-primary-500 border border-primary-500/10 hover:border-primary-500/30',
}

const sizes = {
  sm: 'px-3 py-1.5 text-body-sm',
  md: 'px-4 py-2 text-body-sm',
  lg: 'px-6 py-2.5 text-body',
  xl: 'px-8 py-3 text-body-lg',
}

const Button = forwardRef(({ className, variant = 'primary', size = 'md', loading, icon: Icon, children, disabled, ...props }, ref) => {
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.99 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </motion.button>
  )
})

Button.displayName = 'Button'
export default Button
