import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, IndianRupee, ArrowUpRight, ArrowDownLeft, CheckCircle, XCircle, Clock, AlertCircle, X } from 'lucide-react'
import { paymentsApi } from '../api/payments'
import { useAuth } from '../context/AuthContext'
import { StatusBadge } from '../components/ui/Badge'
import { CardSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import { formatDate, formatCurrency, cn } from '../lib/utils'

const statusConfig = {
  COMPLETED: { icon: CheckCircle, color: 'text-success' },
  PENDING: { icon: Clock, color: 'text-warning' },
  REFUNDED: { icon: XCircle, color: 'text-danger' },
}

export default function Payments() {
  const { user } = useAuth()
  const isWorker = user?.role === 'WORKER'
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [payingId, setPayingId] = useState(null)
  const [payError, setPayError] = useState(null)

  const handlePayNow = async (payment) => {
    setPayingId(payment.id)
    setPayError(null)
    try {
      const payload = payment.workRequestId
        ? { workRequestId: payment.workRequestId }
        : { jobId: payment.jobId }
      await paymentsApi.process(payload)
      const { data } = await paymentsApi.getMy()
      setPayments(Array.isArray(data) ? data : [])
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Payment failed'
      setPayError(msg)
    } finally {
      setPayingId(null)
    }
  }

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data } = await paymentsApi.getMy()
        setPayments(Array.isArray(data) ? data : [])
      } catch {
        setPayments([])
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [])

  const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter)

  const totalAmount = payments
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + (p.amount || 0), 0)

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'COMPLETED', label: 'Completed' },
    { id: 'PENDING', label: 'Pending' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-heading-2 text-primary-500">
          Payments
        </motion.h1>
        <p className="text-body text-muted mt-1">
          {isWorker ? 'Payments received from clients' : 'Payments made to workers'}
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-primary-500/5 p-5">
          <p className="text-caption text-muted mb-1">{isWorker ? 'Total Earned' : 'Total Spent'}</p>
          <p className="text-heading-2 text-primary-500 font-bold">{formatCurrency(totalAmount)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-primary-500/5 p-5">
          <p className="text-caption text-muted mb-1">Completed</p>
          <p className="text-heading-2 text-success font-bold">{payments.filter(p => p.status === 'COMPLETED').length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-primary-500/5 p-5">
          <p className="text-caption text-muted mb-1">Pending</p>
          <p className="text-heading-2 text-warning font-bold">{payments.filter(p => p.status === 'PENDING').length}</p>
        </div>
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
                ({payments.filter(p => p.status === tab.id).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {payError && (
        <div className="flex items-center gap-2 px-4 py-3 bg-danger/10 text-danger rounded-xl border border-danger/20 text-body-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{payError}</span>
          <button onClick={() => setPayError(null)} className="ml-auto p-0.5 hover:bg-danger/20 rounded transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No payments yet"
          description={isWorker ? 'Payments will appear here once clients pay for completed jobs.' : 'Your payments to workers will appear here.'}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-primary-500/5 shadow-card divide-y divide-primary-500/5 overflow-hidden">
          {filtered.map((payment, i) => {
            const StatusIcon = statusConfig[payment.status]?.icon || Clock
            const statusColor = statusConfig[payment.status]?.color || 'text-muted'
            return (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-4 px-6 py-4"
              >
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', isWorker ? 'bg-success/10' : 'bg-danger/10')}>
                  {isWorker ? (
                    <ArrowDownLeft className="w-5 h-5 text-success" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-danger" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-sm font-medium text-primary-500 truncate">{payment.jobTitle}</p>
                  <p className="text-caption text-muted">
                    {isWorker ? `From: ${payment.clientName}` : `To: ${payment.workerName}`}
                    {' · '}
                    {payment.paidAt ? formatDate(payment.paidAt) : formatDate(payment.createdAt)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-body-sm font-semibold text-primary-500">{formatCurrency(payment.amount)}</p>
                  <div className={cn('flex items-center gap-1 justify-end text-caption mt-0.5', statusColor)}>
                    <StatusIcon className="w-3 h-3" />
                    <span>{payment.status === 'COMPLETED' ? 'Paid' : payment.status}</span>
                  </div>
                </div>
                {!isWorker && payment.status === 'PENDING' && (
                  <Button size="sm" icon={CreditCard} variant="accent" loading={payingId === payment.id} onClick={() => handlePayNow(payment)} className="shrink-0 ml-4">
                    Pay Now
                  </Button>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
