import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, MapPin, IndianRupee, Calendar, Play, CheckCircle, XCircle, UserCheck, X, Navigation, AlertCircle, CreditCard, ShieldCheck, Clock, Star } from 'lucide-react'
import { jobsApi } from '../api/jobs'
import { applicationsApi } from '../api/applications'
import { requestsApi } from '../api/requests'
import { paymentsApi } from '../api/payments'
import { reviewsApi } from '../api/reviews'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useTranslate } from '../lib/i18n'
import { Avatar } from '../components/ui/Avatar'
import { StatusBadge } from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { CardSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { formatDate, formatCurrency, cn } from '../lib/utils'

export default function MyJobs() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { settings } = useTheme()
  const t = useTranslate(settings.language)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', budget: '', deadline: '', address: '', requiredSkills: '' })
  const [showPayment, setShowPayment] = useState(false)
  const [payingJob, setPayingJob] = useState(null)
  const [paymentProcessing, setPaymentProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState({})
  const [showRating, setShowRating] = useState(false)
  const [ratingJob, setRatingJob] = useState(null)
  const [ratingValue, setRatingValue] = useState(0)
  const [ratingComment, setRatingComment] = useState('')
  const [ratingSubmitting, setRatingSubmitting] = useState(false)
  const [ratingError, setRatingError] = useState(null)
  const isWorker = user?.role === 'WORKER'

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const [jobsRes, appsRes, reqRes, payRes] = await Promise.all([
          jobsApi.getMy(),
          isWorker ? applicationsApi.getMy().catch(() => ({ data: [] })) : { data: [] },
          isWorker ? requestsApi.getReceived() : requestsApi.getSent(),
          paymentsApi.getMy().catch(() => ({ data: [] })),
        ])
        let jobList = Array.isArray(jobsRes.data) ? jobsRes.data : []
        const reqList = Array.isArray(reqRes.data) ? reqRes.data : []
        const paidIds = new Set((Array.isArray(payRes.data) ? payRes.data : []).filter(p => p.status === 'COMPLETED').flatMap(p => [p.jobId, p.workRequestId].filter(Boolean)))

        reqList
          .filter(r => r.status === 'ACCEPTED' || r.status === 'IN_PROGRESS' || r.status === 'COMPLETED' || r.status === 'APPROVED')
          .forEach(req => {
            const statusMap = {
              ACCEPTED: 'ASSIGNED',
              IN_PROGRESS: 'IN_PROGRESS',
              COMPLETED: 'COMPLETED',
              APPROVED: 'APPROVED',
            }
            jobList.push({
              id: `req_${req.id}`,
              title: req.jobTitle,
              description: req.description || '',
              budget: req.budget,
              status: statusMap[req.status] || 'ASSIGNED',
              clientName: req.clientName,
              clientId: req.clientId,
              assignedWorkerName: req.workerName,
              assignedWorkerId: req.workerId,
              requiredSkills: [],
              address: req.address,
              createdAt: req.createdAt,
              deadline: null,
              completedAt: null,
              latitude: req.latitude,
              longitude: req.longitude,
            })
          })

        const appsList = Array.isArray(appsRes.data) ? appsRes.data : []
        const existingJobIds = new Set(jobList.map(j => j.id))
        const missingJobs = await Promise.allSettled(
          appsList
            .filter(a => !existingJobIds.has(a.jobId))
            .map(a => jobsApi.getById(a.jobId))
        )
        missingJobs.forEach(result => {
          if (result.status === 'fulfilled' && result.value?.data) {
            jobList.push(result.value.data)
          }
        })

        setJobs(jobList.map(j => {
          const jobId = typeof j.id === 'string' && j.id.startsWith('req_') ? Number(j.id.replace('req_', '')) : j.id
          return { ...j, _paid: paidIds.has(jobId) }
        }))
      } catch {
        setJobs([])
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [isWorker])

  const filterStatuses = {
    open: ['OPEN'],
    assigned: ['ASSIGNED'],
    in_progress: ['IN_PROGRESS'],
    completed: ['COMPLETED'],
    payment: ['APPROVED', 'REVIEWED'],
  }

  const filteredJobs = filter === 'all' ? jobs : jobs.filter(j => {
    let statuses = filterStatuses[filter] || [filter.toUpperCase()]
    if (filter === 'payment') {
      statuses = ['APPROVED']
    }
    return statuses.includes(j.status)
  }).sort((a, b) => {
    if (filter === 'payment') {
      const dateA = new Date(a.createdAt || 0)
      const dateB = new Date(b.createdAt || 0)
      return dateA - dateB
    }
    return 0
  })

  const handleStatusAction = async (jobId, action) => {
    setError(null)
    setActionLoading(jobId)
    try {
      if (typeof jobId === 'string' && jobId.startsWith('req_')) {
        const realId = Number(jobId.replace('req_', ''))
        const actionMap = {
          start: requestsApi.start,
          complete: requestsApi.complete,
          cancel: requestsApi.reject,
          approve: requestsApi.approve,
        }
        if (actionMap[action]) {
          await actionMap[action](realId)
        }
        setJobs(prev => prev.map(j => {
          if (j.id !== jobId) return j
          if (action === 'start') return { ...j, status: 'IN_PROGRESS' }
          if (action === 'complete') return { ...j, status: 'COMPLETED' }
          if (action === 'cancel') return { ...j, status: 'CANCELLED' }
          if (action === 'approve') return { ...j, status: 'APPROVED' }
          return j
        }))
        return
      }
      const actionMap = {
        start: jobsApi.start,
        complete: jobsApi.complete,
        approve: jobsApi.approve,
        cancel: jobsApi.delete,
      }
      if (actionMap[action]) {
        await actionMap[action](jobId)
      }
      setJobs(prev => prev.map(j => {
        if (j.id === jobId) {
          if (action === 'cancel') return { ...j, status: 'CANCELLED' }
          if (action === 'start') return { ...j, status: 'IN_PROGRESS' }
          if (action === 'complete') return { ...j, status: 'COMPLETED' }
          if (action === 'approve') return { ...j, status: 'APPROVED' }
        }
        return j
      }))
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Action failed. Please try again.'
      setError(msg)
    } finally {
      setActionLoading(null)
    }
  }

  const openPayment = (job) => {
    setError(null)
    setPayingJob(job)
    setShowPayment(true)
  }

  const handlePayment = async () => {
    if (!payingJob) return
    setPaymentProcessing(true)
    setError(null)
    try {
      const payload = typeof payingJob.id === 'string' && payingJob.id.startsWith('req_')
        ? { workRequestId: Number(payingJob.id.replace('req_', '')) }
        : { jobId: payingJob.id }
      await paymentsApi.process(payload)
      setShowPayment(false)
      setPayingJob(null)
      navigate('/customer/payments')
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Payment failed. Please try again.'
      setError(msg)
    } finally {
      setPaymentProcessing(false)
    }
  }

  const handleWorkerPaymentCheck = async (jobId) => {
    if (paymentStatus[jobId] === 'paid' || paymentStatus[jobId] === 'loading') return
    setPaymentStatus(prev => ({ ...prev, [jobId]: 'loading' }))
    try {
      const isRequest = typeof jobId === 'string' && jobId.startsWith('req_')
      const realId = isRequest ? Number(jobId.replace('req_', '')) : jobId
      const { data } = isRequest ? await paymentsApi.getByWorkRequest(realId) : await paymentsApi.getByJob(realId)
      setPaymentStatus(prev => ({ ...prev, [jobId]: data.status === 'COMPLETED' ? 'paid' : 'pending' }))
    } catch {
      setPaymentStatus(prev => ({ ...prev, [jobId]: 'pending' }))
    }
  }

  const openRating = (job) => {
    setRatingError(null)
    setRatingValue(0)
    setRatingComment('')
    setRatingJob(job)
    setShowRating(true)
  }

  const handleRatingSubmit = async () => {
    if (!ratingJob || ratingValue === 0) return
    setRatingSubmitting(true)
    setRatingError(null)
    try {
      const jobId = typeof ratingJob.id === 'string' && ratingJob.id.startsWith('req_')
        ? Number(ratingJob.id.replace('req_', ''))
        : ratingJob.id
      await reviewsApi.create({ jobId, rating: ratingValue, comment: ratingComment })
      setShowRating(false)
      setRatingJob(null)
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to submit rating. Please try again.'
      setRatingError(msg)
    } finally {
      setRatingSubmitting(false)
    }
  }

  const tabs = [
    { id: 'all', label: t('my-jobs.all') },
    ...(isWorker ? [{ id: 'open', label: t('my-jobs.open') }] : []),
    { id: 'assigned', label: t('my-jobs.assigned') },
    { id: 'in_progress', label: t('my-jobs.in-progress') },
    { id: 'completed', label: t('my-jobs.completed') },
    { id: 'payment', label: t('my-jobs.payment') },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-heading-2 text-primary-500">
            {t('my-jobs.title')}
          </motion.h1>
          <p className="text-body text-muted mt-1">
            {t('my-jobs.desc')}
          </p>
        </div>
        {!isWorker && (
          <Button icon={Plus} onClick={() => setShowCreate(true)}>
            {t('my-jobs.post-job')}
          </Button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={cn(
              'px-4 py-2 rounded-xl text-body-sm font-medium whitespace-nowrap transition-all shrink-0 border',
              filter === tab.id
                ? 'bg-primary-500 text-white border-primary-500 shadow-soft'
                : 'bg-white text-muted border-primary-500/5 hover:border-primary-500/20 hover:text-primary-500'
            )}
          >
            {tab.label}
            {tab.id !== 'all' && (
              <span className="ml-1.5 text-caption opacity-60">
                ({jobs.filter(j => (filterStatuses[tab.id] || [tab.id.toUpperCase()]).includes(j.status)).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-danger/10 text-danger rounded-xl border border-danger/20 text-body-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto p-0.5 hover:bg-danger/20 rounded transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          title={filter === 'all' ? t('my-jobs.no-jobs') : t('my-jobs.no-jobs-filter', { filter: filter.replace('_', ' ') })}
          description={isWorker ? t('my-jobs.browse-marketplace') : t('my-jobs.post-first-job')}
          action={{
            children: isWorker ? t('my-jobs.find-jobs') : t('my-jobs.post-job-action'),
            onClick: () => isWorker ? navigate('/worker/marketplace') : setShowCreate(true)
          }}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white rounded-2xl border border-primary-500/5 p-5 hover:shadow-elevated hover:border-primary-500/10 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={isWorker ? job.clientName : job.assignedWorkerName} size="md" />
                  <div className="min-w-0">
                    <h3 className="text-body-sm font-semibold text-primary-500 truncate">{job.title}</h3>
                    <p className="text-caption text-muted truncate">
                      {isWorker ? job.clientName || 'Client' : job.assignedWorkerName || 'Unassigned'}
                    </p>
                  </div>
                </div>
                <StatusBadge status={job.status} className="shrink-0" />
              </div>

              <p className="text-body-sm text-muted line-clamp-2 mb-4">{job.description}</p>

              <div className="flex flex-wrap gap-3 mb-4">
                {job.budget && (
                  <div className="flex items-center gap-1.5 text-body-sm">
                    <IndianRupee className="w-4 h-4 text-accent-500" />
                    <span className="font-semibold text-primary-500">{formatCurrency(job.budget)}</span>
                  </div>
                )}
                {job.deadline && (
                  <div className="flex items-center gap-1.5 text-caption text-muted">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{t('jobs.due')} {formatDate(job.deadline)}</span>
                  </div>
                )}
                {job.address && (
                  <div className="flex items-center gap-1.5 text-caption text-muted">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[120px]">{job.address}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {(job.requiredSkills || []).slice(0, 3).map(skill => (
                  <span key={skill} className="px-2.5 py-1 bg-primary-50 text-primary-500 text-caption rounded-lg font-medium">{skill}</span>
                ))}
              </div>

              <div className="flex gap-2 pt-3 border-t border-primary-500/5">
                {isWorker && job.status === 'ASSIGNED' && (
                  <Button size="sm" icon={Play} loading={actionLoading === job.id} onClick={() => handleStatusAction(job.id, 'start')} className="flex-1">{t('my-jobs.start')}</Button>
                )}
                {isWorker && job.status === 'IN_PROGRESS' && (
                  <Button size="sm" icon={CheckCircle} variant="accent" loading={actionLoading === job.id} onClick={() => handleStatusAction(job.id, 'complete')} className="flex-1">{t('my-jobs.complete')}</Button>
                )}
                {isWorker && job.status === 'COMPLETED' && (
                  <Button size="sm" variant="ghost" icon={Clock} disabled className="flex-1 text-warning">{t('my-jobs.approval-pending')}</Button>
                )}
                {isWorker && (job.status === 'APPROVED' || job.status === 'REVIEWED') && !job._paid && (
                  <Button size="sm" variant="outline" icon={Clock} onClick={() => handleWorkerPaymentCheck(job.id)} className="flex-1 text-warning">{t('my-jobs.payment-pending')}</Button>
                )}
                {isWorker && (job.status === 'APPROVED' || job.status === 'REVIEWED') && job._paid && (
                  <Button size="sm" icon={ShieldCheck} variant="ghost" disabled className="flex-1 text-success">{t('my-jobs.paid')}</Button>
                )}
                {!isWorker && job.status === 'COMPLETED' && (
                  <Button size="sm" icon={CheckCircle} variant="accent" loading={actionLoading === job.id} onClick={() => handleStatusAction(job.id, 'approve')} className="flex-1">{t('my-jobs.approve')}</Button>
                )}
                {!isWorker && job.status === 'APPROVED' && !job._paid && (
                  <Button size="sm" icon={CreditCard} variant="accent" onClick={() => openPayment(job)} className="flex-1">{t('my-jobs.pay-now')}</Button>
                )}
                {!isWorker && job._paid && (
                  <Button size="sm" icon={ShieldCheck} variant="ghost" disabled className="flex-1 text-success">{t('my-jobs.paid')}</Button>
                )}
                {!isWorker && job.status === 'OPEN' && (
                  <Button size="sm" variant="outline" icon={UserCheck} onClick={() => navigate(`/customer/jobs/${job.id}`)} className="flex-1">{t('my-jobs.manage')}</Button>
                )}
                {((!isWorker && job.status === 'OPEN') || job.status === 'ASSIGNED') && (
                  <Button size="sm" variant="ghost" icon={XCircle} className="text-danger" onClick={() => handleStatusAction(job.id, 'cancel')} />
                )}
                {isWorker && job.status === 'ASSIGNED' ? (
                  <Button size="sm" variant="outline" icon={Navigation} onClick={() => {
                    const dest = job.latitude && job.longitude
                      ? `${job.latitude},${job.longitude}`
                      : encodeURIComponent(job.address || '')
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, '_blank')
                  }} className="flex-1">{t('my-jobs.navigate')}</Button>
                ) : job.status === 'COMPLETED' ? (
                  <>
                    <Button size="sm" variant="ghost" onClick={() => {
                      const isReq = typeof job.id === 'string' && job.id.startsWith('req_')
                      if (isReq) {
                        navigate(isWorker ? '/worker/requests' : '/customer/requests')
                      } else {
                        navigate(isWorker ? `/worker/jobs/${job.id}` : `/customer/jobs/${job.id}`)
                      }
                    }}>
                      {t('my-jobs.view')}
                    </Button>
                    <Button size="sm" variant="outline" icon={Star} onClick={() => openRating(job)}>{t('my-jobs.rate')}</Button>
                  </>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => {
                    const isReq = typeof job.id === 'string' && job.id.startsWith('req_')
                    if (isReq) {
                      navigate(isWorker ? '/worker/requests' : '/customer/requests')
                    } else {
                      navigate(isWorker ? `/worker/jobs/${job.id}` : `/customer/jobs/${job.id}`)
                    }
                  }}>
                    {t('my-jobs.view')}
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showRating && ratingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => !ratingSubmitting && setShowRating(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-heading-4 text-primary-500 mb-1">{t('my-jobs.rate-title')}</h3>
            <p className="text-body-sm text-muted mb-4">{ratingJob.title}</p>

            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setRatingValue(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      'w-8 h-8 transition-colors',
                      star <= ratingValue ? 'fill-warning text-warning' : 'fill-primary-200 text-primary-200 dark:fill-slate-600 dark:text-slate-600'
                    )}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={ratingComment}
              onChange={e => setRatingComment(e.target.value)}
              placeholder={t('my-jobs.rate-placeholder')}
              className="w-full px-4 py-3 rounded-xl border border-primary-500/10 bg-primary-50/50 text-body-sm text-primary-500 placeholder:text-muted resize-none focus:outline-none focus:border-primary-500/30 transition-colors mb-4"
              rows={3}
              maxLength={1000}
            />

            {ratingError && (
              <p className="text-body-sm text-danger mb-3">{ratingError}</p>
            )}

            <div className="flex gap-3">
              <Button size="sm" variant="ghost" className="flex-1" onClick={() => setShowRating(false)} disabled={ratingSubmitting}>{t('my-jobs.rate-cancel')}</Button>
              <Button size="sm" icon={Star} className="flex-1" onClick={handleRatingSubmit} loading={ratingSubmitting} disabled={ratingValue === 0}>{t('my-jobs.rate-submit')}</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
