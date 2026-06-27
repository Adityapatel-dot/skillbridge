import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, IndianRupee, Calendar, Briefcase, ArrowLeft, Send, CheckCircle, XCircle, Star } from 'lucide-react'
import { jobsApi } from '../api/jobs'
import { useAuth } from '../context/AuthContext'
import { StatusBadge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'
import { Rating } from '../components/ui/Rating'
import Button from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { formatDate, formatCurrency } from '../lib/utils'

export default function JobDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const isWorker = user?.role === 'WORKER'
  const isOwner = job?.clientId === user?.id

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await jobsApi.getById(id)
        setJob(data)
      } catch {
        navigate(-1)
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [id, navigate])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 shimmer rounded-xl" />
        <div className="h-64 shimmer rounded-2xl" />
      </div>
    )
  }

  if (!job) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-body-sm text-muted hover:text-primary-500 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar name={job.clientName} size="xl" />
                  <div>
                    <h1 className="text-heading-3 lg:text-heading-2 text-primary-500 mb-1">{job.title}</h1>
                    <p className="text-body-sm text-muted">Posted by {job.clientName} · {formatDate(job.createdAt)}</p>
                  </div>
                </div>
                <StatusBadge status={job.status} className="mb-4" />
                <p className="text-body text-muted leading-relaxed">{job.description}</p>

                <div className="flex flex-wrap gap-4 mt-6">
                  {job.budget && (
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-accent-50 rounded-xl">
                      <IndianRupee className="w-5 h-5 text-accent-500" />
                      <span className="text-heading-4 text-accent-700">{formatCurrency(job.budget)}</span>
                    </div>
                  )}
                  {job.deadline && (
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-primary-50 rounded-xl">
                      <Calendar className="w-4 h-4 text-primary-500" />
                      <span className="text-body-sm text-primary-500">Due {formatDate(job.deadline)}</span>
                    </div>
                  )}
                  {job.address && (
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-primary-50 rounded-xl">
                      <MapPin className="w-4 h-4 text-primary-500" />
                      <span className="text-body-sm text-primary-500">{job.address}</span>
                    </div>
                  )}
                </div>

                {job.requiredSkills?.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-label text-muted mb-3">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.map(skill => (
                        <span key={skill} className="px-3 py-1.5 bg-primary-50 text-primary-500 text-body-sm rounded-xl font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {job.assignedWorkerName && (
                  <div className="mt-6 p-4 bg-secondary-50 rounded-2xl">
                    <h4 className="text-label text-secondary-600 mb-2">ASSIGNED WORKER</h4>
                    <div className="flex items-center gap-3">
                      <Avatar name={job.assignedWorkerName} />
                      <span className="text-body-sm font-medium text-primary-500">{job.assignedWorkerName}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:w-64 space-y-3">
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>      
    </div>
  )
}
