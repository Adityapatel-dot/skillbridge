import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react'

export function CTA() {
  const navigate = useNavigate()

  return (
    <section className="relative py-20 lg:py-28 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/5 via-white to-accent-500/5" />
      <div className="absolute top-10 right-10 w-64 h-64 bg-secondary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-50 border border-secondary-100 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-secondary-500" />
            <span className="text-caption text-secondary-700 font-medium">Join 50K+ professionals</span>
          </div>

          <h2 className="text-heading-2 lg:text-heading-1 text-primary-500 mb-4 text-balance">
            Ready to Transform Your
            <br />
            <span className="gradient-text">Service Experience?</span>
          </h2>
          <p className="text-body-lg text-muted max-w-2xl mx-auto mb-8">
            Join thousands of satisfied customers and skilled workers already using SkillBridge. 
            Post your first job or create your professional profile today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-3 rounded-xl font-medium text-body hover:bg-primary-600 transition-all duration-200 shadow-soft hover:shadow-elevated"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 bg-white text-primary-500 px-8 py-3 rounded-xl font-medium text-body border border-primary-500/10 hover:border-primary-500/20 hover:bg-primary-50 transition-all duration-200"
            >
              Sign In
            </button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            {[
              { icon: Shield, text: 'No commitment required' },
              { icon: Zap, text: 'Free to browse' },
              { icon: Sparkles, text: 'Cancel anytime' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-muted">
                <Icon className="w-4 h-4 text-accent-500" />
                <span className="text-body-sm">{text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
