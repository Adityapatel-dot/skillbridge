import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, MapPin, Sparkles, Shield, Clock, Star } from 'lucide-react'
import { CATEGORIES } from '../../lib/constants'

export function Hero() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-primary-500">
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary-500" />

      <div className="absolute top-1/4 left-10 w-72 h-72 bg-secondary-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-24">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center max-w-4xl mx-auto">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-accent-400" />
            <span className="text-caption text-white/60">Trusted by 50,000+ professionals</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-hero-mobile lg:text-hero text-white font-bold tracking-tight text-balance">
            Find the Perfect
            <br />
            <span className="gradient-text">Skilled Professional</span>
            <br />
            For Any Job
          </motion.h1>

          <motion.p variants={itemVariants} className="mt-6 text-body-lg text-white/60 max-w-2xl mx-auto text-balance">
            Connect with top-rated electricians, plumbers, carpenters and more. 
            Post a job and get matched with verified professionals in minutes.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-10 max-w-2xl mx-auto">
            <div className="glass rounded-2xl p-2 flex items-center gap-2 shadow-hero">
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search className="w-5 h-5 text-white/40 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search for a service or professional..."
                  className="w-full bg-transparent border-none outline-none text-body text-white placeholder:text-white/30 py-2.5"
                />
              </div>
              <div className="hidden sm:flex items-center gap-2 px-3 border-l border-white/10">
                <MapPin className="w-4 h-4 text-white/40" />
                <select className="bg-transparent border-none outline-none text-body-sm text-white/60 py-2.5 appearance-none cursor-pointer">
                  <option>Near me</option>
                  <option>New York</option>
                  <option>Los Angeles</option>
                  <option>Chicago</option>
                  <option>San Francisco</option>
                </select>
              </div>
              <button
                onClick={() => navigate('/register')}
                className="bg-secondary-500 hover:bg-secondary-600 text-white px-6 py-2.5 rounded-xl font-medium text-body-sm transition-all duration-200 shrink-0"
              >
                Search
              </button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-12 flex flex-wrap items-center justify-center gap-8">
            {[
              { icon: Shield, text: 'Verified Professionals' },
              { icon: Clock, text: 'Fast Response Times' },
              { icon: Star, text: 'Satisfaction Guaranteed' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-white/50">
                <Icon className="w-4 h-4 text-accent-400" />
                <span className="text-caption">{text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 lg:mt-20"
        >
          <p className="text-center text-caption text-white/30 uppercase tracking-widest mb-6">Popular Categories</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/register`)}
                  className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ background: `linear-gradient(135deg, ${cat.color.replace('from-', '').replace('to-', '').split(' ')[0]}, ${cat.color.replace('from-', '').replace('to-', '').split(' ')[1]})` }}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-caption text-white/60 group-hover:text-white/90 transition-colors">{cat.name}</span>
                </button>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
