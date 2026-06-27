import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '../../lib/utils'

export function AnalyticsCard({ icon: Icon, label, value, change, trend = 'up', variant = 'default', onClick }) {
  const variants = {
    default: 'bg-white',
    primary: 'bg-primary-500 text-white dark:text-slate-900',
    accent: 'bg-accent-500 text-white dark:text-slate-900',
    secondary: 'bg-secondary-500 text-white dark:text-slate-900',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={cn('rounded-2xl p-6 border border-primary-500/5 shadow-card', variants[variant], onClick && 'cursor-pointer hover:opacity-80 transition-opacity')}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', variant === 'default' ? 'bg-primary-50' : 'bg-white/20')}>
          <Icon className={cn('w-5 h-5', variant === 'default' ? 'text-secondary-500' : 'text-white dark:text-slate-900')} />
        </div>
        {change && (
          <div className={cn('flex items-center gap-1 px-2 py-1 rounded-lg text-caption font-medium', trend === 'up' ? 'bg-accent-100 text-accent-700' : 'bg-danger/10 text-danger')}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>
      <p className={cn('text-caption font-medium', variant === 'default' ? 'text-muted' : 'text-white/70 dark:text-slate-900/70')}>{label}</p>
      <p className={cn('text-heading-2 font-bold mt-1', variant === 'default' ? 'text-primary-500' : 'text-white dark:text-slate-900')}>{value}</p>
    </motion.div>
  )
}
