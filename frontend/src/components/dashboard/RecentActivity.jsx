import { motion } from 'framer-motion'
import { FileText, UserCheck, MessageSquare, Star, Briefcase } from 'lucide-react'
import { cn, formatDate } from '../../lib/utils'

const activities = [
  { icon: FileText, text: 'New job posted: Kitchen Renovation', time: new Date(Date.now() - 3600000), color: 'bg-secondary-100 text-secondary-600' },
  { icon: UserCheck, text: 'Sarah Chen accepted your job', time: new Date(Date.now() - 7200000), color: 'bg-accent-100 text-accent-600' },
  { icon: MessageSquare, text: 'New message from Marcus Johnson', time: new Date(Date.now() - 14400000), color: 'bg-primary-100 text-primary-600' },
  { icon: Star, text: 'New 5-star review received', time: new Date(Date.now() - 86400000), color: 'bg-warning/10 text-warning' },
  { icon: Briefcase, text: 'Job completed: Office Painting', time: new Date(Date.now() - 172800000), color: 'bg-accent-100 text-accent-600' },
]

export function RecentActivity() {
  return (
    <div className="bg-white rounded-2xl border border-primary-500/5 shadow-card">
      <div className="px-6 pt-6 pb-4 border-b border-primary-500/5">
        <h3 className="text-heading-4 text-primary-500">Recent Activity</h3>
      </div>
      <div className="divide-y divide-primary-500/5">
        {activities.map((item, i) => {
          const Icon = item.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-4 px-6 py-4 hover:bg-primary-50/50 transition-colors cursor-pointer"
            >
              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', item.color)}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body-sm text-primary-500">{item.text}</p>
                <p className="text-caption text-muted mt-0.5">{formatDate(item.time)}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
