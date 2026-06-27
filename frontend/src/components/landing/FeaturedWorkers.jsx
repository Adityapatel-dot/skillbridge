import { motion } from 'framer-motion'
import { Star, MapPin, Briefcase } from 'lucide-react'
import { FEATURED_WORKERS } from '../../lib/constants'

export function FeaturedWorkers() {
  return (
    <section id="workers" className="relative py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12 lg:mb-16"
        >
          <span className="text-label text-secondary-500">Featured Workers</span>
          <h2 className="text-heading-2 lg:text-heading-1 text-primary-500 mt-3">
            Top-Rated Professionals
          </h2>
          <p className="text-body-lg text-muted mt-4">
            Meet our most skilled and trusted workers, hand-picked for their expertise and reliability.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {FEATURED_WORKERS.map((worker, i) => (
            <motion.div
              key={worker.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-background rounded-2xl p-6 hover:shadow-elevated hover:bg-white transition-all duration-300 border border-transparent hover:border-primary-500/5"
            >
              <div className="relative mb-4">
                <img
                  src={worker.image}
                  alt={worker.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-white shadow-soft"
                />
                <div className="absolute -bottom-1 -right-1 bg-accent-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  TOP
                </div>
              </div>
              <h3 className="text-heading-4 text-primary-500">{worker.name}</h3>
              <p className="text-body-sm text-muted mb-3">{worker.role}</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                  <span className="text-body-sm font-medium text-primary-500">{worker.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-muted">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span className="text-caption">{worker.jobs} jobs</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {worker.skills.map(skill => (
                  <span key={skill} className="px-2.5 py-1 bg-primary-50 text-primary-500 text-caption rounded-lg font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
