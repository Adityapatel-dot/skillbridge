import { cn } from '../../lib/utils'

export function Card({ className, hover = true, children, ...props }) {
  return (
    <div
      className={cn(
        'bg-surface rounded-2xl border border-primary-500/5 shadow-card transition-all duration-200',
        hover && 'hover:shadow-elevated hover:border-primary-500/10',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }) {
  return <div className={cn('px-6 pt-6 pb-4', className)}>{children}</div>
}

export function CardContent({ className, children }) {
  return <div className={cn('px-6 pb-6', className)}>{children}</div>
}
