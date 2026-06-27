import { cn, getInitials } from '../../lib/utils'

export function Avatar({ src, name, size = 'md', className }) {
  const sizes = {
    sm: 'w-8 h-8 text-caption',
    md: 'w-10 h-10 text-body-sm',
    lg: 'w-12 h-12 text-body',
    xl: 'w-16 h-16 text-heading-4',
    '2xl': 'w-20 h-20 text-heading-3',
  }

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover ring-2 ring-white', sizes[size], className)}
      />
    )
  }

  return (
    <div className={cn('rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 text-white flex items-center justify-center font-semibold ring-2 ring-white', sizes[size], className)}>
      {getInitials(name)}
    </div>
  )
}

export function AvatarGroup({ users, max = 3, size = 'sm' }) {
  const visible = users.slice(0, max)
  const remaining = users.length - max

  return (
    <div className="flex -space-x-2">
      {visible.map((user, i) => (
        <Avatar key={i} src={user.image} name={user.name} size={size} className="ring-2 ring-white" />
      ))}
      {remaining > 0 && (
        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center text-caption font-medium ring-2 ring-white">
          +{remaining}
        </div>
      )}
    </div>
  )
}
