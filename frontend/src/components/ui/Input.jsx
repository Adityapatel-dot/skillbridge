import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const inputVariants = {
  default: 'bg-white border border-primary-500/10 focus:border-secondary-500/30 focus:ring-2 focus:ring-secondary-500/10',
  ghost: 'bg-primary-50/50 border border-transparent focus:bg-white focus:border-secondary-500/30 focus:ring-2 focus:ring-secondary-500/10',
}

const Input = forwardRef(({ className, variant = 'default', icon: Icon, label, error, ...props }, ref) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-label text-muted">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Icon className="w-4 h-4 text-muted" />
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-xl px-3.5 py-2.5 text-body-sm text-primary-500 placeholder:text-muted/50 transition-all duration-200 outline-none',
            inputVariants[variant],
            Icon && 'pl-10',
            error && 'border-danger/50 focus:border-danger/50 focus:ring-danger/10',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-caption text-danger">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
