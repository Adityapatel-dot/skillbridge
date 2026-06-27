import { cn } from '../../lib/utils'

export function Badge({ className, variant = 'default', children }) {
  const variants = {
    default: 'bg-primary-100 text-primary-700',
    success: 'bg-accent-100 text-accent-700',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
    info: 'bg-secondary-100 text-secondary-700',
  }

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-lg text-caption font-medium', variants[variant], className)}>
      {children}
    </span>
  )
}

export function StatusBadge({ status, className }) {
  const colors = {
    OPEN: 'bg-accent-100 text-accent-700',
    ASSIGNED: 'bg-secondary-100 text-secondary-700',
    IN_PROGRESS: 'bg-warning/10 text-warning',
    COMPLETED: 'bg-accent-100 text-accent-700',
    APPROVED: 'bg-success/10 text-success',
    REVIEWED: 'bg-primary-100 text-primary-700',
    CANCELLED: 'bg-danger/10 text-danger',
    PENDING: 'bg-warning/10 text-warning',
    ACCEPTED: 'bg-success/10 text-success',
    REJECTED: 'bg-danger/10 text-danger',
  }

  const labels = {
    OPEN: 'Open',
    ASSIGNED: 'Assigned',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    APPROVED: 'Approved',
    REVIEWED: 'Reviewed',
    CANCELLED: 'Cancelled',
    PENDING: 'Pending',
    ACCEPTED: 'Accepted',
    REJECTED: 'Rejected',
  }

  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-caption font-medium', colors[status] || colors.OPEN, className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full', status === 'OPEN' && 'bg-accent-500', status === 'ASSIGNED' && 'bg-secondary-500', status === 'IN_PROGRESS' && 'bg-warning', status === 'COMPLETED' && 'bg-accent-500', status === 'APPROVED' && 'bg-success', status === 'REVIEWED' && 'bg-primary-500', status === 'CANCELLED' && 'bg-danger', (!status || status === 'PENDING') && 'bg-warning', status === 'ACCEPTED' && 'bg-success', status === 'REJECTED' && 'bg-danger')} />
      {labels[status] || status}
    </span>
  )
}
