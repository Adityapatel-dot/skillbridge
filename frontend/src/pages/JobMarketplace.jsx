import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, LayoutGrid, List } from 'lucide-react'
import { JobCard } from '../components/jobs/JobCard'
import { JobFilters } from '../components/jobs/JobFilters'
import { EmptyState } from '../components/ui/EmptyState'
import { CardSkeleton } from '../components/ui/Skeleton'
import Button from '../components/ui/Button'
import { jobsApi } from '../api/jobs'
import { applicationsApi } from '../api/applications'
import { useAuth } from '../context/AuthContext'
import { cn } from '../lib/utils'

export default function JobMarketplace() {
  const [jobs, setJobs] = useState([])
  const [appliedJobs, setAppliedJobs] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('grid')
  const [filters, setFilters] = useState({ search: '', category: '', status: '', sort: 'newest' })
  const { user } = useAuth()
  const isWorker = user?.role === 'WORKER'

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          jobsApi.getAll(),
          isWorker ? applicationsApi.getMy().catch(() => ({ data: [] })) : { data: [] },
        ])
        setJobs(jobsRes.data)
        if (isWorker) {
          const apps = Array.isArray(appsRes.data) ? appsRes.data : []
          setAppliedJobs(new Set(apps.map(a => a.jobId)))
        }
      } catch {
        setJobs([])
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [isWorker])

  const filteredJobs = jobs.filter(job => {
    if (filters.search && !job.title?.toLowerCase().includes(filters.search.toLowerCase())) return false
    if (filters.status && job.status !== filters.status) return false
    return true
  }).sort((a, b) => {
    switch (filters.sort) {
      case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt)
      case 'budget_high': return (b.budget || 0) - (a.budget || 0)
      case 'budget_low': return (a.budget || 0) - (b.budget || 0)
      default: return new Date(b.createdAt) - new Date(a.createdAt)
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-heading-2 text-primary-500">
            {isWorker ? 'Find Jobs' : 'Job Marketplace'}
          </motion.h1>
          <p className="text-body text-muted mt-1">{isWorker ? 'Browse available jobs and apply' : 'Post jobs and find the perfect worker'}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-primary-50 rounded-xl p-1">
            <button onClick={() => setView('grid')} className={cn('p-2 rounded-lg transition-colors', view === 'grid' ? 'bg-white shadow-soft text-primary-500' : 'text-muted hover:text-primary-500')}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setView('list')} className={cn('p-2 rounded-lg transition-colors', view === 'list' ? 'bg-white shadow-soft text-primary-500' : 'text-muted hover:text-primary-500')}>
              <List className="w-4 h-4" />
            </button>
          </div>
          {!isWorker && (
            <Button icon={Plus} onClick={() => {}}>Post a Job</Button>
          )}
        </div>
      </div>

      <JobFilters filters={filters} setFilters={setFilters} />

      <motion.p layout className="text-body-sm text-muted">
        Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
      </motion.p>

      {loading ? (
        <div className={view === 'grid' ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          icon={isWorker ? undefined : undefined}
          title="No jobs found"
          description={isWorker ? "There are no jobs matching your criteria right now." : "Post your first job to get started."}
          action={!isWorker ? { children: 'Post a Job', onClick: () => {} } : undefined}
        />
      ) : (
        <div className={cn(
          view === 'grid' ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'
        )}>
          {filteredJobs.map((job, i) => (
            <JobCard key={job.id} job={job} index={i} isWorker={isWorker} appliedJobs={appliedJobs} />
          ))}
        </div>
      )}
    </div>
  )
}
