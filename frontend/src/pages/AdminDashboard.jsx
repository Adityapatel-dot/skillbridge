import { motion } from 'framer-motion'
import { Users, Briefcase, IndianRupee, TrendingUp, Activity, Shield, UserCheck, BarChart3 } from 'lucide-react'
import { AnalyticsCard } from '../components/dashboard/AnalyticsCard'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { cn } from '../lib/utils'
import { Avatar } from '../components/ui/Avatar'
import { useTheme } from '../context/ThemeContext'
import { useTranslate } from '../lib/i18n'

const recentUsers = [
  { id: 1, name: 'James Wilson', role: 'WORKER', status: 'Active', date: '2 min ago', earnings: '₹12,450', jobs: 47 },
  { id: 2, name: 'Sarah Chen', role: 'WORKER', status: 'Active', date: '15 min ago', earnings: '₹8,920', jobs: 32 },
  { id: 3, name: 'David Park', role: 'CLIENT', status: 'Active', date: '1 hour ago', spent: '₹5,200', jobs: 8 },
  { id: 4, name: 'Lisa Thompson', role: 'CLIENT', status: 'Suspended', date: '3 hours ago', spent: '₹15,800', jobs: 24 },
  { id: 5, name: 'Marcus Johnson', role: 'WORKER', status: 'Active', date: '5 hours ago', earnings: '₹22,100', jobs: 89 },
]

const platformStats = [
  { label: 'Total Users', value: '52,847', change: '+12%', icon: Users },
  { label: 'Active Jobs', value: '3,421', change: '+8%', icon: Briefcase },
  { label: 'Total Revenue', value: '₹1.2M', change: '+23%', icon: IndianRupee },
  { label: 'Growth Rate', value: '18.5%', change: '+4.2%', icon: TrendingUp },
]

export default function AdminDashboard() {
  const { settings } = useTheme()
  const t = useTranslate(settings.language)
  return (
    <div className="space-y-6">
      <div>
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-heading-2 text-primary-500">
          {t('dashboard.admin-title')}
        </motion.h1>
        <p className="text-body text-muted mt-1">{t('dashboard.admin-desc')}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {platformStats.map((stat, i) => (
          <AnalyticsCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} change={stat.change} variant={i === 0 ? 'primary' : i === 2 ? 'accent' : 'default'} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-heading-4 text-primary-500">Platform Overview</h3>
                <Badge variant="info">Live</Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'New Users', value: '847', change: '+12%', color: 'text-secondary-500' },
                  { label: 'Jobs Posted', value: '234', change: '+8%', color: 'text-accent-500' },
                  { label: 'Completed', value: '189', change: '+15%', color: 'text-success' },
                  { label: 'Disputes', value: '3', change: '-50%', color: 'text-danger' },
                ].map(item => (
                  <div key={item.label} className="p-4 bg-primary-50/50 rounded-xl">
                    <p className="text-caption text-muted">{item.label}</p>
                    <p className={cn('text-heading-3 font-bold mt-1', item.color)}>{item.value}</p>
                    <p className="text-caption text-muted">{item.change}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="pt-6">
              <h3 className="text-heading-4 text-primary-500 mb-4">Recent Users</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-primary-500/5">
                      <th className="pb-3 text-caption text-muted font-medium">User</th>
                      <th className="pb-3 text-caption text-muted font-medium">Role</th>
                      <th className="pb-3 text-caption text-muted font-medium">Status</th>
                      <th className="pb-3 text-caption text-muted font-medium">Activity</th>
                      <th className="pb-3 text-caption text-muted font-medium text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary-500/5">
                    {recentUsers.map(user => (
                      <tr key={user.id} className="hover:bg-primary-50/50 transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={user.name} size="sm" />
                            <span className="text-body-sm font-medium text-primary-500">{user.name}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge variant={user.role === 'WORKER' ? 'info' : 'default'}>{user.role}</Badge>
                        </td>
                        <td className="py-3">
                          <span className={`text-caption ${user.status === 'Active' ? 'text-accent-600' : 'text-danger'}`}>{user.status}</span>
                        </td>
                        <td className="py-3 text-caption text-muted">{user.date}</td>
                        <td className="py-3 text-body-sm font-medium text-right text-primary-500">
                          {user.earnings || user.spent}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-heading-4 text-primary-500 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { icon: Shield, label: 'Review Reports', desc: '3 pending reports' },
                  { icon: UserCheck, label: 'Verify Workers', desc: '12 pending verifications' },
                  { icon: BarChart3, label: 'View Analytics', desc: 'Full platform analytics' },
                  { icon: Activity, label: 'System Health', desc: 'All systems operational' },
                ].map((action, i) => {
                  const Icon = action.icon
                  return (
                    <button key={i} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary-50 transition-colors text-left">
                      <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-primary-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-body-sm font-medium text-primary-500">{action.label}</p>
                        <p className="text-caption text-muted">{action.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-heading-4 text-primary-500 mb-4">Platform Health</h3>
              <div className="space-y-4">
                {[
                  { label: 'Server Uptime', value: '99.9%', color: 'bg-accent-500' },
                  { label: 'API Response', value: '45ms', color: 'bg-accent-500' },
                  { label: 'Error Rate', value: '0.02%', color: 'bg-accent-500' },
                  { label: 'Queue Depth', value: '12', color: 'bg-warning' },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-body-sm mb-1">
                      <span className="text-primary-500">{item.label}</span>
                      <span className="font-medium text-primary-500">{item.value}</span>
                    </div>
                    <div className="h-1.5 bg-primary-50 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${Math.random() * 30 + 70}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
