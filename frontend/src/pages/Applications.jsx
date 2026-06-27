import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FileText, IndianRupee, MapPin, CheckCircle, XCircle, Eye, Send } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { requestsApi } from '../api/requests'
import { Avatar } from '../components/ui/Avatar'
import { StatusBadge } from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { CardSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { formatDate, formatCurrency, cn } from '../lib/utils'

export default function Applications() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await requestsApi.getReceived()
        setRequests(Array.isArray(data) ? data : [])
      } catch {
        setRequests([])
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter.toUpperCase())

  const handleAction = async (id, action) => {
    try {
      if (action === 'accept') {
        await requestsApi.accept(id)
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'ACCEPTED' } : r))
      } else {
        await requestsApi.reject(id)
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r))
      }
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div>
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-heading-2 text-primary-500">
          Work Requests
        </motion.h1>
        <p className="text-body text-muted mt-1">Work requests sent to you by clients</p>
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {[
          { id: 'all', label: 'All' },
          { id: 'pending', label: 'Pending' },
          { id: 'accepted', label: 'Accepted' },
          { id: 'rejected', label: 'Rejected' },
        ].map(tab => (
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
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Send}
          title={filter === 'rejected' ? 'No rejected requests' : filter === 'accepted' ? 'No accepted requests' : filter === 'pending' ? 'No pending requests' : 'No work requests yet'}
          description={filter === 'rejected' ? 'Rejected requests will appear here.' : filter === 'accepted' ? 'Accepted requests will appear here.' : filter === 'pending' ? 'Pending requests will appear here.' : 'When a client sends you a work request, it will appear here.'}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((req, i) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white rounded-2xl border border-primary-500/5 p-5 hover:shadow-elevated transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={req.clientName} size="md" />
                  <div className="min-w-0">
                    <h3 className="text-body-sm font-semibold text-primary-500 truncate">{req.jobTitle}</h3>
                    <p className="text-caption text-muted">from {req.clientName} · {formatDate(req.createdAt)}</p>
                  </div>
                </div>
                <StatusBadge status={req.status} />
              </div>

              <p className="text-body-sm text-muted line-clamp-2 mb-4">{req.description}</p>

              <div className="flex flex-wrap gap-3 mb-4">
                {req.budget && (
                  <div className="flex items-center gap-1.5 text-body-sm">
                    <IndianRupee className="w-4 h-4 text-accent-500" />
                    <span className="font-semibold text-primary-500">{formatCurrency(req.budget)}</span>
                  </div>
                )}
                {req.address && (
                  <div className="flex items-center gap-1.5 text-caption text-muted">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[200px]">{req.address}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-3 border-t border-primary-500/5">
                {req.status === 'PENDING' && (
                  <>
                    <Button size="sm" icon={CheckCircle} variant="accent" onClick={() => handleAction(req.id, 'accept')} className="flex-1">
                      Accept
                    </Button>
                    <Button size="sm" icon={XCircle} variant="outline" onClick={() => handleAction(req.id, 'reject')} className="flex-1">
                      Decline
                    </Button>
                  </>
                )}
                {req.status === 'ACCEPTED' && (
                  <Button size="sm" icon={Eye} className="flex-1" onClick={() => navigate('/worker/messages')}>
                    Message Client
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
