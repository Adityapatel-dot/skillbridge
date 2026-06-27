import { clsx } from 'clsx'

export function cn(...inputs) {
  return clsx(inputs)
}

export function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diff = now - d
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined })
}

export function formatCurrency(amount) {
  if (!amount && amount !== 0) return ''
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatRating(rating) {
  if (!rating) return '0.0'
  return Number(rating).toFixed(1)
}

export function truncate(str, length = 100) {
  if (!str) return ''
  if (str.length <= length) return str
  return str.slice(0, length).trim() + '...'
}

export function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getStatusColor(status) {
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
  return colors[status] || 'bg-primary-100 text-primary-700'
}

export function getStatusLabel(status) {
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
  return labels[status] || status
}
