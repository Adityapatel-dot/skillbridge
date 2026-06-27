import { Star } from 'lucide-react'
import { cn } from '../../lib/utils'

export function Rating({ value = 0, max = 5, size = 'sm', showValue = false, className }) {
  const sizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizes[size],
            i < Math.round(value) ? 'fill-warning text-warning' : 'fill-primary-200 text-primary-200 dark:fill-slate-600 dark:text-slate-600'
          )}
        />
      ))}
      {showValue && (
        <span className="text-body-sm font-medium text-primary-500 ml-1">{value.toFixed(1)}</span>
      )}
    </div>
  )
}
