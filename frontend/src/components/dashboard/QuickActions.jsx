import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PlusCircle, Search, MessageSquare, FileText } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useAuth } from '../../context/AuthContext'

export function QuickActions() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isWorker = user?.role === 'WORKER'

  const actions = isWorker
    ? [
        { icon: Search, label: 'Find Jobs', desc: 'Browse available jobs', path: '/worker/marketplace', color: 'bg-secondary-100 text-secondary-600' },
        { icon: FileText, label: 'Applications', desc: 'Track your applications', path: '/worker/applications', color: 'bg-accent-100 text-accent-600' },
        { icon: MessageSquare, label: 'Messages', desc: 'Chat with clients', path: '/worker/messages', color: 'bg-primary-100 text-primary-600' },
        { icon: PlusCircle, label: 'Update Profile', desc: 'Edit your skills', path: '/worker/settings', color: 'bg-warning/10 text-warning' },
      ]
    : [
        { icon: PlusCircle, label: 'Post a Job', desc: 'Describe what you need', path: '/customer/jobs', color: 'bg-secondary-100 text-secondary-600' },
        { icon: Search, label: 'Find Workers', desc: 'Browse professionals', path: '/customer/marketplace', color: 'bg-accent-100 text-accent-600' },
        { icon: MessageSquare, label: 'Messages', desc: 'Chat with workers', path: '/customer/messages', color: 'bg-primary-100 text-primary-600' },
        { icon: FileText, label: 'My Jobs', desc: 'Track progress', path: '/customer/jobs', color: 'bg-warning/10 text-warning' },
      ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {actions.map((action, i) => {
        const Icon = action.icon
        return (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => navigate(action.path)}
            className="group bg-white rounded-2xl border border-primary-500/5 p-5 text-left hover:shadow-elevated hover:border-primary-500/10 transition-all duration-200"
          >
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform', action.color)}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-body-sm font-medium text-primary-500">{action.label}</p>
            <p className="text-caption text-muted mt-0.5">{action.desc}</p>
          </motion.button>
        )
      })}
    </div>
  )
}
