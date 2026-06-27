import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, IndianRupee, Star, Clock, Plus } from 'lucide-react'
import { AnalyticsCard } from '../components/dashboard/AnalyticsCard'
import { QuickActions } from '../components/dashboard/QuickActions'
import { RecentActivity } from '../components/dashboard/RecentActivity'
import Button from '../components/ui/Button'
import { useTheme } from '../context/ThemeContext'
import { useTranslate } from '../lib/i18n'

export default function CustomerDashboard() {
  const navigate = useNavigate()
  const { settings } = useTheme()
  const t = useTranslate(settings.language)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-heading-2 text-primary-500">
            {t('dashboard.customer-title')}
          </motion.h1>
          <p className="text-body text-muted mt-1">{t('dashboard.customer-desc')}</p>
        </div>
        <Button icon={Plus} size="lg" onClick={() => navigate('/customer/jobs')}>
          {t('dashboard.post-job')}
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard icon={Briefcase} label="Active Jobs" value="8" change="+12%" trend="up" onClick={() => navigate('/customer/jobs')} />
        <AnalyticsCard icon={IndianRupee} label="Total Spent" value="₹12,450" change="+8%" trend="up" variant="primary" />
        <AnalyticsCard icon={Star} label="Average Rating" value="4.8" change="+0.2" trend="up" variant="accent" />
        <AnalyticsCard icon={Clock} label="Response Time" value="2.4hr" change="-15%" trend="up" variant="secondary" />
      </div>

      <QuickActions />

      <div className="grid lg:grid-cols-2 gap-6">
        <RecentActivity />
        <div className="bg-white rounded-2xl border border-primary-500/5 shadow-card p-6">
          <h3 className="text-heading-4 text-primary-500 mb-4">Active Jobs</h3>
          <div className="space-y-4">
            {[
              { title: 'Kitchen Renovation', worker: 'James Wilson', status: 'In Progress', budget: '₹3,500' },
              { title: 'Electrical Wiring', worker: 'Sarah Chen', status: 'Assigned', budget: '₹1,200' },
              { title: 'Plumbing Repair', worker: 'Unassigned', status: 'Open', budget: '₹800' },
            ].map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-4 rounded-xl bg-primary-50/50 hover:bg-primary-100/50 transition-colors cursor-pointer"
                onClick={() => navigate('/customer/jobs')}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-medium text-primary-500 truncate">{job.title}</p>
                  <p className="text-caption text-muted mt-0.5">{job.worker} · {job.budget}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-caption font-medium ${
                  job.status === 'In Progress' ? 'bg-warning/10 text-warning' :
                  job.status === 'Assigned' ? 'bg-secondary-100 text-secondary-700' :
                  'bg-accent-100 text-accent-700'
                }`}>
                  {job.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
