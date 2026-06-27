import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, CheckCheck, Briefcase, MessageSquare, Star, UserCheck, FileText, ShieldAlert } from 'lucide-react'
import { cn, formatDate } from '../lib/utils'
import { EmptyState } from '../components/ui/EmptyState'
import Button from '../components/ui/Button'

const sampleNotifications = [
  { id: 1, type: 'application', icon: FileText, text: 'Marcus Johnson applied for Kitchen Renovation', time: new Date(Date.now() - 1800000), read: false, color: 'bg-secondary-100 text-secondary-600' },
  { id: 2, type: 'message', icon: MessageSquare, text: 'New message from Sarah Chen regarding Plumbing job', time: new Date(Date.now() - 3600000), read: false, color: 'bg-primary-100 text-primary-600' },
  { id: 3, type: 'job', icon: Briefcase, text: 'Job "Office Painting" has been completed', time: new Date(Date.now() - 14400000), read: false, color: 'bg-accent-100 text-accent-600' },
  { id: 4, type: 'review', icon: Star, text: 'You received a new 5-star review!', time: new Date(Date.now() - 86400000), read: true, color: 'bg-warning/10 text-warning' },
  { id: 5, type: 'hire', icon: UserCheck, text: 'You have been hired for "Bathroom Renovation"', time: new Date(Date.now() - 172800000), read: true, color: 'bg-accent-100 text-accent-600' },
  { id: 6, type: 'alert', icon: ShieldAlert, text: 'Profile verification completed successfully', time: new Date(Date.now() - 259200000), read: true, color: 'bg-primary-100 text-primary-600' },
]

export default function Notifications() {
  const [notifications, setNotifications] = useState(sampleNotifications)

  const unread = notifications.filter(n => !n.read).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-2 text-primary-500">Notifications</h1>
          <p className="text-body text-muted mt-1">{unread} unread notifications</p>
        </div>
        {unread > 0 && (
          <Button variant="ghost" size="sm" icon={CheckCheck} onClick={markAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up!" />
      ) : (
        <div className="bg-white rounded-2xl border border-primary-500/5 shadow-card divide-y divide-primary-500/5 overflow-hidden">
          {notifications.map((notif, i) => {
            const Icon = notif.icon
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => markRead(notif.id)}
                className={cn(
                  'flex items-start gap-4 px-6 py-4 cursor-pointer transition-colors hover:bg-primary-50/50',
                  !notif.read && 'bg-secondary-50/30'
                )}
              >
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', notif.color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-body-sm', !notif.read ? 'text-primary-500 font-medium' : 'text-muted')}>
                    {notif.text}
                  </p>
                  <p className="text-caption text-muted mt-1">{formatDate(notif.time)}</p>
                </div>
                {!notif.read && (
                  <span className="w-2 h-2 bg-secondary-500 rounded-full shrink-0 mt-2" />
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
