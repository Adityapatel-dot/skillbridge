import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, IndianRupee, Clock, Send, CheckCircle, AlertCircle, Navigation } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { formatDate, formatCurrency } from '../../lib/utils'
import { StatusBadge } from '../ui/Badge'
import { Avatar } from '../ui/Avatar'
import Button from '../ui/Button'
import { applicationsApi } from '../../api/applications'

export function JobCard({ job, index = 0, isWorker, appliedJobs }) {
  const navigate = useNavigate()
  const [applying, setApplying] = useState(false)
  const [error, setError] = useState(null)
  const [locallyApplied, setLocallyApplied] = useState(false)
  const hasApplied = appliedJobs?.has(job.id) || locallyApplied

  const handleApply = async (e) => {
    e.stopPropagation()
    setError(null)
    setApplying(true)
    try {
      await applicationsApi.create({ jobId: job.id, coverLetter: '' })
      setLocallyApplied(true)
    } catch (err) {
      if (err?.response?.status === 400) {
        setLocallyApplied(true)
        return
      }
      const msg = err?.response?.data?.message || err?.response?.data || err?.message || 'Something went wrong'
      setError(msg)
      setTimeout(() => setError(null), 3000)
    }
    setApplying(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="group bg-white rounded-2xl border border-primary-500/5 overflow-hidden hover:shadow-elevated hover:border-primary-500/10 transition-all duration-200"
    >
      <div className="p-5 cursor-pointer" onClick={() => navigate(`/${isWorker ? 'worker' : 'customer'}/jobs/${job.id}`)}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar name={job.clientName || 'Client'} size="md" />
            <div>
              <h3 className="text-body-sm font-semibold text-primary-500 group-hover:text-secondary-500 transition-colors">
                {job.title}
              </h3>
              <p className="text-caption text-muted">{job.clientName || 'Client'} · {formatDate(job.createdAt)}</p>
            </div>
          </div>
          <StatusBadge status={job.status} />
        </div>

        <p className="text-body-sm text-muted line-clamp-2 mb-3">{job.description}</p>

        <div className="flex flex-wrap items-center gap-3 mb-3">
          {job.budget && (
            <div className="flex items-center gap-1.5 text-body-sm">
              <IndianRupee className="w-4 h-4 text-accent-500" />
              <span className="font-semibold text-primary-500">{formatCurrency(job.budget)}</span>
            </div>
          )}
          {job.deadline && (
            <div className="flex items-center gap-1.5 text-caption text-muted">
              <Clock className="w-3.5 h-3.5" />
              <span>Due {formatDate(job.deadline)}</span>
            </div>
          )}
          {job.address && (
            <div className="flex items-center gap-1.5 text-caption text-muted">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate max-w-[120px]">{job.address}</span>
            </div>
          )}
        </div>

        {job.requiredSkills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {job.requiredSkills.map(skill => (
              <span key={skill} className="px-2.5 py-1 bg-primary-50 text-primary-500 text-caption rounded-lg font-medium">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {isWorker && job.status === 'OPEN' && (
        <div className="px-5 pb-4" onClick={e => e.stopPropagation()}>
          {hasApplied ? (
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-primary-50 text-primary-500 rounded-xl text-body-sm font-medium flex-1">
                <CheckCircle className="w-4 h-4" />
                Applied
              </div>
              {job.address && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const dest = job.latitude && job.longitude
                      ? `${job.latitude},${job.longitude}`
                      : encodeURIComponent(job.address)
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, '_blank')
                  }}
                  className="flex items-center gap-1.5 px-3 py-2.5 text-body-sm font-medium text-secondary-500 bg-secondary-50 hover:bg-secondary-100 rounded-xl transition-colors shrink-0"
                  title="Open in Google Maps"
                >
                  <Navigation className="w-4 h-4" />
                  Navigate
                </button>
              )}
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-danger/10 text-danger rounded-xl text-body-sm font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" icon={Send} className="flex-1" loading={applying} onClick={handleApply}>
                Apply Now
              </Button>
              {job.address && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    const dest = job.latitude && job.longitude
                      ? `${job.latitude},${job.longitude}`
                      : encodeURIComponent(job.address)
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, '_blank')
                  }}
                  className="flex items-center gap-1.5 px-3 py-2.5 text-body-sm font-medium text-secondary-500 bg-secondary-50 hover:bg-secondary-100 rounded-xl transition-colors shrink-0"
                  title="Open in Google Maps"
                >
                  <Navigation className="w-4 h-4" />
                  Navigate
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
