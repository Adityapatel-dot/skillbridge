import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, IndianRupee, MapPin, Calendar, CheckCircle, XCircle, Info, FileText } from 'lucide-react'
import { requestsApi } from '../api/requests'
import { applicationsApi } from '../api/applications'
import { useAuth } from '../context/AuthContext'
import { Avatar } from '../components/ui/Avatar'
import { StatusBadge } from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { CardSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { formatDate, formatCurrency, cn } from '../lib/utils'

export default function WorkRequests() {
  const { user } = useAuth()
  const [sent, setSent] = useState([])
  const [received, setReceived] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('received')

  useEffect(() => {
    const fetch = async () => {
      try {
        const isWorker = user?.role === 'WORKER'
        const calls = [
          requestsApi.getSent(),
          requestsApi.getReceived(),
        ]
        if (!isWorker) {
          calls.push(applicationsApi.getReceived())
        }
        const [sentRes, receivedRes, appsRes] = await Promise.all(calls)

        let receivedList = Array.isArray(receivedRes.data) ? receivedRes.data : []

        if (!isWorker && appsRes) {
          const apps = Array.isArray(appsRes.data) ? appsRes.data : []
          const normalized = apps.map(a => ({
            _type: 'application',
            id: a.id,
            jobTitle: a.jobTitle,
            description: a.coverLetter || '',
            budget: null,
            clientName: a.workerName,
            workerName: a.workerName,
            status: a.status,
            createdAt: a.createdAt,
            address: null,
            jobId: a.jobId,
          }))
          receivedList = [...receivedList, ...normalized]
        }

        setSent(Array.isArray(sentRes.data) ? sentRes.data : [])
        setReceived(receivedList)
      } catch {
        setSent([])
        setReceived([])
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const list = tab === 'received' ? received : sent
  const isWorker = user?.role === 'WORKER'

  const handleAction = async (id, action) => {
    try {
      const item = received.find(r => r.id === id)
      if (item?._type === 'application') {
        if (action === 'accept') {
          await applicationsApi.accept(id)
        } else {
          await applicationsApi.reject(id)
        }
        setReceived(prev => prev.map(r => r.id === id ? { ...r, status: action === 'accept' ? 'ACCEPTED' : 'REJECTED' } : r))
      } else {
        if (action === 'accept') {
          await requestsApi.accept(id)
        } else {
          await requestsApi.reject(id)
        }
        setReceived(prev => prev.map(r => r.id === id ? { ...r, status: action === 'accept' ? 'ACCEPTED' : 'REJECTED' } : r))
      }
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div>
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-heading-2 text-primary-500">
          Work Requests
        </motion.h1>
        <p className="text-body text-muted mt-1">
          {tab === 'received' ? 'Requests received from others' : 'Requests you have sent'}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab('received')}
          className={cn(
            'px-4 py-2 rounded-xl text-body-sm font-medium transition-all border',
            tab === 'received'
              ? 'bg-primary-500 text-white border-primary-500 shadow-soft'
              : 'bg-white text-muted border-primary-500/5 hover:border-primary-500/20 hover:text-primary-500'
          )}
        >
          Received ({received.length})
        </button>
        <button
          onClick={() => setTab('sent')}
          className={cn(
            'px-4 py-2 rounded-xl text-body-sm font-medium transition-all border',
            tab === 'sent'
              ? 'bg-primary-500 text-white border-primary-500 shadow-soft'
              : 'bg-white text-muted border-primary-500/5 hover:border-primary-500/20 hover:text-primary-500'
          )}
        >
          Sent ({sent.length})
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          icon={Send}
          title="No requests yet"
          description={tab === 'received' ? 'Nothing received yet.' : 'You haven\'t sent any requests.'}
        />
      ) : (
        <div className="space-y-4">
          {list.map((req, i) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white rounded-2xl border border-primary-500/5 p-5 hover:shadow-elevated transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar name={tab === 'received' ? req.clientName : req.workerName} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-body-sm font-semibold text-primary-500">{req.jobTitle}</h3>
                      {req._type === 'application' && (
                        <span className="text-caption px-1.5 py-0.5 bg-secondary-50 text-secondary-600 rounded-md font-medium">Application</span>
                      )}
                    </div>
                    <p className="text-caption text-muted">
                      {tab === 'received' ? req.clientName : req.workerName} · {formatDate(req.createdAt)}
                    </p>
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

              {tab === 'received' && req.status === 'PENDING' && (
                <div className="flex gap-2 pt-3 border-t border-primary-500/5">
                  <Button size="sm" icon={CheckCircle} variant="accent" onClick={() => handleAction(req.id, 'accept')} className="flex-1">
                    Accept
                  </Button>
                  <Button size="sm" icon={XCircle} variant="outline" onClick={() => handleAction(req.id, 'reject')} className="flex-1">
                    Decline
                  </Button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
