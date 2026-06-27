import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, Briefcase, UserCircle } from 'lucide-react'
import { AuthLayout } from '../components/layout/AuthLayout'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '', role: 'CLIENT' })
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await register(form)
      navigate(data.role === 'WORKER' ? '/worker/dashboard' : '/customer/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout image="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-heading-2 text-primary-500 mb-1">Create your account</h1>
        <p className="text-body text-muted mb-8">Join SkillBridge and start connecting</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" placeholder="John Doe" icon={User} value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} required />
          <Input label="Email" type="email" placeholder="you@example.com" icon={Mail} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          <div className="relative">
            <Input label="Password" type={showPassword ? 'text' : 'password'} placeholder="Create a password" icon={Lock} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-muted hover:text-primary-500">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <Input label="Phone (optional)" type="tel" placeholder="+1 (555) 000-0000" icon={Phone} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />

          <div className="space-y-1.5">
            <label className="text-label text-muted">I want to join as</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'CLIENT', label: 'Customer', icon: UserCircle, desc: 'Hire professionals' },
                { value: 'WORKER', label: 'Worker', icon: Briefcase, desc: 'Find work opportunities' },
              ].map(option => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => setForm(f => ({ ...f, role: option.value }))}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${form.role === option.value ? 'border-secondary-500 bg-secondary-50' : 'border-primary-500/10 hover:border-primary-500/20'}`}
                >
                  <option.icon className={`w-5 h-5 mb-1 ${form.role === option.value ? 'text-secondary-500' : 'text-muted'}`} />
                  <p className={`text-body-sm font-medium ${form.role === option.value ? 'text-secondary-700' : 'text-primary-500'}`}>{option.label}</p>
                  <p className="text-caption text-muted">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-body-sm text-danger bg-danger/5 rounded-xl px-4 py-2">{error}</p>}

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Create Account <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <p className="mt-6 text-center text-body-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-secondary-500 hover:text-secondary-600 font-medium">Sign in</Link>
        </p>
      </motion.div>
    </AuthLayout>
  )
}
