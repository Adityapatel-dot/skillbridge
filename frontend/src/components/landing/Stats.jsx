import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { STATS } from '../../lib/constants'

function Counter({ value, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const numValue = parseInt(value.replace(/[^0-9]/g, ''))

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0
          const duration = 2000
          const step = Math.ceil(numValue / (duration / 16))
          const timer = setInterval(() => {
            start += step
            if (start >= numValue) {
              setCount(numValue)
              clearInterval(timer)
            } else {
              setCount(start)
            }
          }, 16)
          return () => clearInterval(timer)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [numValue])

  const formatCount = (n) => {
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K+'
    if (value.includes('%')) return n + '%'
    if (value.includes('min')) return n + 'min'
    return n + '+'
  }

  return <span ref={ref} className="text-display lg:text-hero text-white font-bold">{formatCount(count)}</span>
}

export function Stats() {
  return (
    <section className="relative py-20 lg:py-28 bg-gradient-to-b from-primary-500 to-primary-500/95">
      <div className="absolute inset-0 bg-hero-glow opacity-50" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <Counter value={stat.value} />
              <p className="mt-2 text-body-sm text-white/50">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
