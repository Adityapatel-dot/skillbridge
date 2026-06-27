import { useNavigate } from 'react-router-dom'
import { cn } from '../../lib/utils'

export function Logo({ className, size = 'default' }) {
  const navigate = useNavigate()
  const heights = {
    sm: 'h-10',
    default: 'h-16',
    lg: 'h-20',
  }

  return (
    <div className={cn('flex items-center cursor-pointer', className)} onClick={() => navigate('/')}>
      <img
        src="/logo.png"
        alt="SkillBridge"
        className={cn('w-auto object-contain', heights[size])}
      />
    </div>
  )
}
