import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, IndianRupee, Star, TrendingUp, Search } from 'lucide-react'
import { AnalyticsCard } from '../components/dashboard/AnalyticsCard'
import { QuickActions } from '../components/dashboard/QuickActions'
import { EarningsChart } from '../components/dashboard/EarningsChart'
import Button from '../components/ui/Button'
import { useTheme } from '../context/ThemeContext'
import { useTranslate } from '../lib/i18n'

export default function WorkerDashboard() {
  const navigate = useNavigate()
  const { settings } = useTheme()
  const t = useTranslate(settings.language)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-heading-2 text-primary-500">
            {t('dashboard.worker-title')}
          </motion.h1>
          <p className="text-body text-muted mt-1">{t('dashboard.worker-desc')}</p>
        </div>
        <Button icon={Search} size="lg" onClick={() => navigate('/worker/marketplace')}>
          {t('dashboard.find-jobs')}
        </Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard icon={Briefcase} label="Active Jobs" value="3" change="+1" trend="up" onClick={() => navigate('/worker/jobs')} />
        <AnalyticsCard icon={IndianRupee} label="Total Earned" value="₹18,240" change="+23%" trend="up" variant="primary" />
        <AnalyticsCard icon={Star} label="Rating" value="4.9" change="+0.1" trend="up" variant="accent" />
        <AnalyticsCard icon={TrendingUp} label="Completion Rate" value="97%" change="+2%" trend="up" variant="secondary" />
      </div>

      <QuickActions />

      <div className="grid lg:grid-cols-2 gap-6">
        <EarningsChart />
        <div className="bg-white rounded-2xl border border-primary-500/5 shadow-card p-6">
          <h3 className="text-heading-4 text-primary-500 mb-4">Upcoming Jobs</h3>
          <div className="space-y-4">
            {[
              { title: 'Home Electrical Audit', client: 'David Park', date: 'Tomorrow, 9:00 AM', budget: '₹450', status: 'Confirmed' },
              { title: 'Bathroom Plumbing Fix', client: 'Lisa Thompson', date: 'Jun 12, 2:00 PM', budget: '₹680', status: 'Pending' },
              { title: 'Cabinet Installation', client: 'Michael T.', date: 'Jun 15, 10:00 AM', budget: '₹1,200', status: 'Confirmed' },
            ].map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-4 rounded-xl bg-primary-50/50 hover:bg-primary-100/50 transition-colors cursor-pointer"
                onClick={() => navigate('/worker/jobs')}
              >
                <div className="flex-1 min-w-0 mr-4">
                  <p className="text-body-sm font-medium text-primary-500 truncate">{job.title}</p>
                  <p className="text-caption text-muted mt-0.5">{job.client} · {job.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-body-sm font-semibold text-accent-500">{job.budget}</p>
                  <span className={`text-caption font-medium ${
                    job.status === 'Confirmed' ? 'text-accent-600' : 'text-warning'
                  }`}>{job.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
