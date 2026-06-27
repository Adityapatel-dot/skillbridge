import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, MapPin, Star, Briefcase, Zap, Wrench, Hammer, Truck, Sparkles, Paintbrush, Settings, Cpu, SlidersHorizontal, X, Send, IndianRupee, CheckCircle } from 'lucide-react'
import { profilesApi } from '../api/profiles'
import { requestsApi } from '../api/requests'
import { Avatar } from '../components/ui/Avatar'
import { Rating } from '../components/ui/Rating'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { CardSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { cn } from '../lib/utils'

const ICON_MAP = { Zap, Wrench, Hammer, Truck, Sparkles, Paintbrush, Settings, Cpu }

const SKILL_CATEGORIES = [
  { id: '', label: 'All Skills', icon: null },
  { id: 'Electrician', label: 'Electricians', icon: Zap, color: 'from-yellow-400 to-orange-500' },
  { id: 'Plumber', label: 'Plumbers', icon: Wrench, color: 'from-blue-400 to-cyan-500' },
  { id: 'Carpenter', label: 'Carpenters', icon: Hammer, color: 'from-amber-400 to-orange-500' },
  { id: 'Driver', label: 'Drivers', icon: Truck, color: 'from-green-400 to-emerald-500' },
  { id: 'Cleaner', label: 'Cleaners', icon: Sparkles, color: 'from-sky-400 to-indigo-500' },
  { id: 'Painter', label: 'Painters', icon: Paintbrush, color: 'from-pink-400 to-rose-500' },
  { id: 'Mechanic', label: 'Mechanics', icon: Settings, color: 'from-violet-400 to-purple-500' },
  { id: 'Technician', label: 'Technicians', icon: Cpu, color: 'from-teal-400 to-cyan-500' },
]

const categorySkillMap = {
  Electrician: ['Electrical', 'Wiring', 'Smart Home', 'Panel'],
  Plumber: ['Plumbing', 'Pipe', 'Drainage', 'Fixture'],
  Carpenter: ['Carpentry', 'Furniture', 'Cabinetry', 'Framing'],
  Driver: ['Driving', 'Transport', 'Delivery', 'Logistics'],
  Cleaner: ['Cleaning', 'Deep Clean', 'Housekeeping', 'Janitorial'],
  Painter: ['Painting', 'Interior', 'Exterior', 'Finishing'],
  Mechanic: ['Mechanical', 'Auto Repair', 'Engine', 'Maintenance'],
  Technician: ['Technical', 'IT Support', 'Electronics', 'Smart Home'],
}

function WorkerCard({ worker, index }) {
  const navigate = useNavigate()
  const [showAssign, setShowAssign] = useState(false)
  const [assigning, setAssigning] = useState(false)
  const [assigned, setAssigned] = useState(false)
  const [form, setForm] = useState({ jobTitle: '', description: '', budget: '', address: '' })
  const skillList = worker.skills?.length > 0 ? worker.skills : ['Professional']

  const handleAssign = async (e) => {
    e.stopPropagation()
    setAssigning(true)
    try {
      await requestsApi.create({
        workerId: worker.id,
        jobTitle: form.jobTitle,
        description: form.description,
        budget: form.budget ? parseFloat(form.budget) : null,
        address: form.address || null,
      })
      setAssigned(true)
      setShowAssign(false)
      setForm({ jobTitle: '', description: '', budget: '', address: '' })
      setTimeout(() => setAssigned(false), 3000)
    } catch {}
    setAssigning(false)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
        className="group bg-white rounded-2xl border border-primary-500/5 overflow-hidden hover:shadow-elevated hover:border-primary-500/10 transition-all duration-200"
      >
        <div className="p-5 cursor-pointer" onClick={() => navigate(`/customer/profile/${worker.id}`)}>
          <div className="flex items-start gap-4 mb-4">
            <Avatar
              name={worker.fullName}
              size="lg"
              className="ring-2 ring-white shadow-soft shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-body font-semibold text-primary-500 group-hover:text-secondary-500 transition-colors truncate">
                {worker.fullName}
              </h3>
              <p className="text-caption text-muted mt-0.5">
                {worker.experience || 'Professional'}
              </p>
              <div className="flex items-center gap-3 mt-1.5">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                  <span className="text-body-sm font-medium text-primary-500">
                    {worker.averageRating ? Number(worker.averageRating).toFixed(1) : '0.0'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-muted">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span className="text-caption">Available</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {skillList.slice(0, 4).map(skill => (
              <span
                key={skill}
                className="px-2.5 py-1 bg-primary-50 text-primary-500 text-caption rounded-lg font-medium"
              >
                {skill}
              </span>
            ))}
            {skillList.length > 4 && (
              <span className="px-2.5 py-1 bg-primary-50 text-muted text-caption rounded-lg font-medium">
                +{skillList.length - 4}
              </span>
            )}
          </div>

          {worker.address && (
            <div className="flex items-center gap-1.5 text-caption text-muted">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{worker.address}</span>
            </div>
          )}
        </div>

        <div className="px-5 pb-4" onClick={e => e.stopPropagation()}>
          {assigned ? (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-accent-50 text-accent-700 rounded-xl text-body-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Work request sent
            </div>
          ) : (
            <Button
              size="sm"
              icon={Send}
              className="w-full"
              onClick={() => setShowAssign(true)}
            >
              Assign Work
            </Button>
          )}
        </div>
      </motion.div>

      {showAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowAssign(false)}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-primary-500/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={e => e.stopPropagation()}
            className="relative bg-white rounded-2xl shadow-modal w-full max-w-md max-h-[90vh] overflow-y-auto p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-heading-4 text-primary-500">Assign Work</h2>
                <p className="text-body-sm text-muted mt-0.5">to {worker.fullName}</p>
              </div>
              <button onClick={() => setShowAssign(false)} className="p-1.5 rounded-lg hover:bg-primary-50 transition-colors">
                <X className="w-5 h-5 text-muted" />
              </button>
            </div>

            <form onSubmit={handleAssign} className="space-y-4">
              <Input label="Job Title" placeholder="e.g. Kitchen Renovation" value={form.jobTitle} onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))} required />
              <div className="space-y-1.5">
                <label className="text-label text-muted">Description</label>
                <textarea
                  placeholder="Describe the work..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  required
                  className="w-full bg-white border border-primary-500/10 rounded-xl px-4 py-2.5 text-body-sm text-primary-500 placeholder:text-muted/50 outline-none focus:border-secondary-500/30 focus:ring-2 focus:ring-secondary-500/10 transition-all resize-none"
                />
              </div>
              <Input label="Budget (₹)" type="number" placeholder="e.g. 3500" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} />
              <Input label="Location" placeholder="e.g. 123 Main St, NY" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />

              <div className="flex gap-3 pt-4 border-t border-primary-500/5">
                <Button type="submit" loading={assigning} className="flex-1" icon={Send}>
                  Send Request
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowAssign(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  )
}

export default function WorkerMarketplace() {
  const [workers, setWorkers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const { data } = await profilesApi.getWorkers()
        setWorkers(Array.isArray(data) ? data : [])
      } catch {
        setWorkers([])
      } finally {
        setLoading(false)
      }
    }
    fetchWorkers()
  }, [])

  const filteredWorkers = workers.filter(worker => {
    const nameMatch = worker.fullName?.toLowerCase().includes(search.toLowerCase())
    const skillMatch = !search || (worker.skills || []).some(s => s.toLowerCase().includes(search.toLowerCase()))

    if (selectedCategory) {
      const categorySkills = categorySkillMap[selectedCategory] || []
      const hasCategorySkill = categorySkills.some(cs =>
        (worker.skills || []).some(s => s.toLowerCase().includes(cs.toLowerCase()))
      )
      if (!hasCategorySkill) return false
    }

    return nameMatch || skillMatch
  })

  const clearFilters = () => {
    setSearch('')
    setSelectedCategory('')
  }

  const hasFilters = search || selectedCategory

  return (
    <div className="space-y-6">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-heading-2 text-primary-500"
        >
          Find Workers
        </motion.h1>
        <p className="text-body text-muted mt-1">
          Browse skilled professionals and hire the best for your job
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search by name or skill..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-primary-500/10 rounded-xl pl-10 pr-4 py-2.5 text-body-sm text-primary-500 placeholder:text-muted/50 outline-none focus:border-secondary-500/30 focus:ring-2 focus:ring-secondary-500/10 transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {SKILL_CATEGORIES.map(cat => {
            const Icon = cat.icon
            const active = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(active ? '' : cat.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap text-body-sm font-medium transition-all shrink-0 border',
                  active
                    ? 'bg-primary-500 text-white border-primary-500 shadow-soft'
                    : 'bg-white text-muted border-primary-500/5 hover:border-primary-500/20 hover:text-primary-500'
                )}
              >
                {Icon && (
                  <div className={cn('w-6 h-6 rounded-lg flex items-center justify-center', active ? 'bg-white/20' : `bg-gradient-to-br ${cat.color} bg-opacity-20`)}>
                    <Icon className={cn('w-3.5 h-3.5', active ? 'text-white' : 'text-white')} />
                  </div>
                )}
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {hasFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <span className="text-caption text-muted">Active filters:</span>
          {search && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-100 text-secondary-700 rounded-lg text-caption font-medium">
              Search: {search}
              <button onClick={() => setSearch('')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {selectedCategory && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent-100 text-accent-700 rounded-lg text-caption font-medium">
              {SKILL_CATEGORIES.find(c => c.id === selectedCategory)?.label}
              <button onClick={() => setSelectedCategory('')}><X className="w-3 h-3" /></button>
            </span>
          )}
          <button onClick={clearFilters} className="text-caption text-danger hover:text-red-600 ml-2">
            Clear all
          </button>
        </motion.div>
      )}

      <motion.p layout className="text-body-sm text-muted">
        Showing {filteredWorkers.length} {filteredWorkers.length === 1 ? 'worker' : 'workers'}
      </motion.p>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filteredWorkers.length === 0 ? (
        <EmptyState
          title="No workers found"
          description="Try adjusting your search or filters to find available workers."
          action={hasFilters ? { children: 'Clear Filters', onClick: clearFilters, variant: 'outline' } : undefined}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredWorkers.map((worker, i) => (
            <WorkerCard key={worker.id} worker={worker} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
