import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { TESTIMONIALS } from '../../lib/constants'

export function Testimonials() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent(c => (c === 0 ? TESTIMONIALS.length - 1 : c - 1))
  const next = () => setCurrent(c => (c === TESTIMONIALS.length - 1 ? 0 : c + 1))

  return (
    <section className="relative py-20 lg:py-28 bg-background overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-secondary-500/5 to-transparent rounded-full" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12 lg:mb-16"
        >
          <span className="text-label text-secondary-500">Testimonials</span>
          <h2 className="text-heading-2 lg:text-heading-1 text-primary-500 mt-3">
            Trusted by Thousands
          </h2>
          <p className="text-body-lg text-muted mt-4">
            See why customers and workers love SkillBridge.
          </p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="bg-white rounded-3xl p-8 lg:p-12 shadow-elevated border border-primary-500/5"
            >
              <div className="flex gap-1 mb-6">
                {Array.from({ length: TESTIMONIALS[current].rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                ))}
              </div>
              <blockquote className="text-body-lg lg:text-heading-4 text-primary-500 leading-relaxed mb-8">
                "{TESTIMONIALS[current].content}"
              </blockquote>
              <div className="flex items-center gap-4">
                <img
                  src={TESTIMONIALS[current].image}
                  alt={TESTIMONIALS[current].name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-body-sm font-semibold text-primary-500">{TESTIMONIALS[current].name}</p>
                  <p className="text-caption text-muted">{TESTIMONIALS[current].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-3 mt-8">
            <button onClick={prev} className="p-2.5 rounded-xl bg-white border border-primary-500/5 hover:shadow-soft transition-all">
              <ChevronLeft className="w-4 h-4 text-muted" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-secondary-500 w-6' : 'bg-primary-200'}`}
                />
              ))}
            </div>
            <button onClick={next} className="p-2.5 rounded-xl bg-white border border-primary-500/5 hover:shadow-soft transition-all">
              <ChevronRight className="w-4 h-4 text-muted" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
