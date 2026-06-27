import { Search, SlidersHorizontal, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { CATEGORIES } from '../../lib/constants'

export function JobFilters({ filters, setFilters }) {
  const clearFilters = () => setFilters({ search: '', category: '', status: '', sort: 'newest' })

  const hasFilters = filters.search || filters.category || filters.status

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search jobs..."
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            className="w-full bg-white border border-primary-500/10 rounded-xl pl-10 pr-4 py-2.5 text-body-sm text-primary-500 placeholder:text-muted/50 outline-none focus:border-secondary-500/30 focus:ring-2 focus:ring-secondary-500/10 transition-all"
          />
        </div>
        <select
          value={filters.category}
          onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
          className="bg-white border border-primary-500/10 rounded-xl px-4 py-2.5 text-body-sm text-primary-500 outline-none focus:border-secondary-500/30 transition-all appearance-none cursor-pointer"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          className="bg-white border border-primary-500/10 rounded-xl px-4 py-2.5 text-body-sm text-primary-500 outline-none focus:border-secondary-500/30 transition-all appearance-none cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="OPEN">Open</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <select
          value={filters.sort}
          onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}
          className="bg-white border border-primary-500/10 rounded-xl px-4 py-2.5 text-body-sm text-primary-500 outline-none focus:border-secondary-500/30 transition-all appearance-none cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="budget_high">Budget: High to Low</option>
          <option value="budget_low">Budget: Low to High</option>
        </select>
      </div>

      {hasFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2"
        >
          <span className="text-caption text-muted">Active filters:</span>
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-100 text-secondary-700 rounded-lg text-caption font-medium">
              Search: {filters.search}
              <button onClick={() => setFilters(f => ({ ...f, search: '' }))}><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.category && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent-100 text-accent-700 rounded-lg text-caption font-medium">
              {CATEGORIES.find(c => c.id === filters.category)?.name || filters.category}
              <button onClick={() => setFilters(f => ({ ...f, category: '' }))}><X className="w-3 h-3" /></button>
            </span>
          )}
          {filters.status && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-caption font-medium">
              {filters.status}
              <button onClick={() => setFilters(f => ({ ...f, status: '' }))}><X className="w-3 h-3" /></button>
            </span>
          )}
          <button onClick={clearFilters} className="text-caption text-danger hover:text-red-600 ml-2">Clear all</button>
        </motion.div>
      )}
    </div>
  )
}
