import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { CATEGORIES } from '../../lib/constants'

export function Categories() {
  return (
    <section id="categories" className="relative py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12 lg:mb-16"
        >
          <span className="text-label text-secondary-500">Categories</span>
          <h2 className="text-heading-2 lg:text-heading-1 text-primary-500 mt-3">
            Find the Right Professional
          </h2>
          <p className="text-body-lg text-muted mt-4">
            Browse our curated categories of skilled professionals ready to help with your next project.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative bg-white rounded-2xl border border-primary-500/5 p-6 text-left hover:shadow-elevated hover:border-primary-500/10 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-heading-4 text-primary-500 mb-1">{cat.name}</h3>
                <p className="text-body-sm text-muted mb-3">{cat.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-caption text-muted">{cat.count} workers</span>
                  <ArrowRight className="w-4 h-4 text-secondary-500 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0" />
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
