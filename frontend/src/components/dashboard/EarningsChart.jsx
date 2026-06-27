import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { useTheme } from '../../context/ThemeContext'

const data = [
  { name: 'Mon', amount: 1200 },
  { name: 'Tue', amount: 900 },
  { name: 'Wed', amount: 1600 },
  { name: 'Thu', amount: 800 },
  { name: 'Fri', amount: 2100 },
  { name: 'Sat', amount: 1400 },
  { name: 'Sun', amount: 600 },
]

export function EarningsChart() {
  const { settings } = useTheme()
  const isDark = settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-primary-500/5 shadow-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-heading-4 text-primary-500">Earnings</h3>
          <p className="text-caption text-muted">This week</p>
        </div>
        <span className="text-heading-3 text-accent-500">₹8,600</span>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#64748B' }} />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: isDark ? '#334155' : '#f1f5f9' }}
              contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff', border: isDark ? '1px solid #334155' : '1px solid #e2e8f0', borderRadius: '12px', fontSize: '13px', color: isDark ? '#e2e8f0' : '#0f172a' }}
              formatter={(value) => [`₹${value}`, 'Earnings']}
            />
            <Bar dataKey="amount" fill={isDark ? '#60a5fa' : '#2563EB'} radius={[6, 6, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
