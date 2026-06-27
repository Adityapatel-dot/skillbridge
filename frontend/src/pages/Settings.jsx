import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, Bell, Globe, CreditCard, Shield, Palette, ChevronRight, Save, Sun, Moon, Monitor, Type, Languages } from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import { Avatar } from '../components/ui/Avatar'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { cn } from '../lib/utils'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useTranslate } from '../lib/i18n'

const themeOptions = [
  { id: 'light', label: 'Light Mode', icon: Sun },
  { id: 'dark', label: 'Dark Mode', icon: Moon },
  { id: 'system', label: 'System Default', icon: Monitor },
]

const colorSchemes = [
  { id: 'blue', label: 'Professional Blue (Default)' },
  { id: 'green', label: 'Emerald Green' },
  { id: 'orange', label: 'Orange' },
  { id: 'purple', label: 'Purple' },
]

const fontSizes = [
  { id: 'small', label: 'Small' },
  { id: 'medium', label: 'Medium (Default)' },
  { id: 'large', label: 'Large' },
  { id: 'extra-large', label: 'Extra Large' },
]

const languages = [
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'हिन्दी (Hindi)' },
  { id: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { id: 'te', label: 'తెలుగు (Telugu)' },
]

export default function Settings() {
  const { user } = useAuth()
  const { settings, updateSetting } = useTheme()
  const { theme, colorScheme, fontSize, language } = settings
  const t = useTranslate(language)
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)

  const tabs = [
    { id: 'profile', label: t('settings.profile'), icon: User },
    { id: 'security', label: t('settings.security'), icon: Lock },
    { id: 'appearance', label: t('settings.appearance'), icon: Palette },
    { id: 'notifications', label: t('settings.notifications'), icon: Bell },
    { id: 'payments', label: t('settings.payments'), icon: CreditCard },
    { id: 'privacy', label: t('settings.privacy'), icon: Shield },
  ]

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    address: '',
  })

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-heading-2 text-primary-500">{t('settings.title')}</h1>
        <p className="text-body text-muted mt-1">{t('settings.desc')}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-56 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl text-body-sm font-medium transition-all whitespace-nowrap shrink-0',
                    activeTab === tab.id ? 'bg-primary-500 text-white shadow-soft' : 'text-muted hover:text-primary-500 hover:bg-primary-50'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="flex-1 min-w-0">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {activeTab === 'profile' && (
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar name={form.fullName} size="xl" />
                    <div>
                      <p className="text-heading-4 text-primary-500">{form.fullName}</p>
                      <p className="text-body-sm text-muted">{form.email}</p>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto">Change Photo</Button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="Full Name" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} />
                    <Input label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                    <Input label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                    <Input label="Address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
                  </div>

                  <div>
                    <label className="text-label text-muted block mb-1.5">Bio</label>
                    <textarea
                      value={form.bio}
                      onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                      rows={3}
                      className="w-full bg-white border border-primary-500/10 rounded-xl px-4 py-2.5 text-body-sm text-primary-500 placeholder:text-muted/50 outline-none focus:border-secondary-500/30 focus:ring-2 focus:ring-secondary-500/10 transition-all resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="flex justify-end pt-4 border-t border-primary-500/5">
                    <Button loading={saving} icon={Save} onClick={handleSave}>{t('common.save')}</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <h3 className="text-heading-4 text-primary-500 mb-1">Change Password</h3>
                    <p className="text-body-sm text-muted mb-4">Update your password to keep your account secure</p>
                    <div className="space-y-4 max-w-md">
                      <Input label="Current Password" type="password" />
                      <Input label="New Password" type="password" />
                      <Input label="Confirm Password" type="password" />
                      <Button>Update Password</Button>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-primary-500/5">
                    <h3 className="text-heading-4 text-primary-500 mb-1">Two-Factor Authentication</h3>
                    <p className="text-body-sm text-muted mb-4">Add an extra layer of security to your account</p>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'appearance' && (
              <Card>
                <CardContent className="pt-6 space-y-8">
                  <div>
                    <h3 className="text-heading-4 text-primary-500 mb-1">Theme</h3>
                    <p className="text-body-sm text-muted mb-4">Choose your preferred appearance</p>
                    <div className="grid grid-cols-3 gap-3">
                      {themeOptions.map(opt => {
                        const Icon = opt.icon
                        return (
                          <button
                            key={opt.id}
                            onClick={() => updateSetting('theme', opt.id)}
                            className={cn(
                              'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                              theme === opt.id
                                ? 'border-secondary-500 bg-secondary-50 text-secondary-700'
                                : 'border-primary-500/10 bg-white text-muted hover:border-primary-500/20'
                            )}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="text-caption font-medium">{opt.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-heading-4 text-primary-500 mb-1">Color Scheme</h3>
                    <p className="text-body-sm text-muted mb-4">Customize the accent colors</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {colorSchemes.map(scheme => (
                        <button
                          key={scheme.id}
                          onClick={() => updateSetting('colorScheme', scheme.id)}
                          className={cn(
                            'flex items-center gap-3 p-3 rounded-xl border-2 transition-all',
                            colorScheme === scheme.id
                              ? 'border-secondary-500 bg-secondary-50'
                              : 'border-primary-500/10 bg-white hover:border-primary-500/20'
                          )}
                        >
                          <span className={cn(
                            'w-4 h-4 rounded-full shrink-0',
                            scheme.id === 'blue' && 'bg-[#2563EB]',
                            scheme.id === 'green' && 'bg-[#10B981]',
                            scheme.id === 'orange' && 'bg-[#F97316]',
                            scheme.id === 'purple' && 'bg-[#A855F7]',
                          )} />
                          <span className="text-body-sm text-primary-500">{scheme.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-heading-4 text-primary-500 mb-1">Font Size</h3>
                    <p className="text-body-sm text-muted mb-4">Adjust the text size for better readability</p>
                    <div className="flex gap-2">
                      {fontSizes.map(size => (
                        <button
                          key={size.id}
                          onClick={() => updateSetting('fontSize', size.id)}
                          className={cn(
                            'flex-1 p-3 rounded-xl border-2 text-center transition-all',
                            fontSize === size.id
                              ? 'border-secondary-500 bg-secondary-50 text-secondary-700'
                              : 'border-primary-500/10 bg-white text-muted hover:border-primary-500/20'
                          )}
                        >
                          <span className={cn(
                            'font-medium block',
                            size.id === 'small' && 'text-xs',
                            size.id === 'medium' && 'text-sm',
                            size.id === 'large' && 'text-base',
                            size.id === 'extra-large' && 'text-lg',
                          )}>Aa</span>
                          <span className="text-caption mt-1 block">{size.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-heading-4 text-primary-500 mb-1">Language</h3>
                    <p className="text-body-sm text-muted mb-4">Select your preferred language</p>
                    <div className="grid grid-cols-2 gap-3">
                      {languages.map(lang => (
                        <button
                          key={lang.id}
                          onClick={() => updateSetting('language', lang.id)}
                          className={cn(
                            'flex items-center gap-3 p-3 rounded-xl border-2 transition-all',
                            language === lang.id
                              ? 'border-secondary-500 bg-secondary-50 text-secondary-700'
                              : 'border-primary-500/10 bg-white text-muted hover:border-primary-500/20'
                          )}
                        >
                          <Globe className="w-4 h-4 shrink-0" />
                          <span className="text-body-sm">{lang.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <h3 className="text-heading-4 text-primary-500 mb-4">Notification Preferences</h3>
                  {[
                    { label: 'Job applications', desc: 'When someone applies to your job' },
                    { label: 'Messages', desc: 'When you receive a new message' },
                    { label: 'Job updates', desc: 'When a job status changes' },
                    { label: 'Reviews', desc: 'When you receive a new review' },
                    { label: 'Marketing emails', desc: 'Tips, updates, and offers' },
                  ].map((item, i) => (
                    <label key={i} className="flex items-center justify-between py-3 border-b border-primary-500/5 last:border-0">
                      <div>
                        <p className="text-body-sm font-medium text-primary-500">{item.label}</p>
                        <p className="text-caption text-muted">{item.desc}</p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-10 h-6 bg-primary-100 rounded-full peer-checked:bg-secondary-500 transition-colors cursor-pointer after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:shadow-soft after:transition-all peer-checked:after:translate-x-4" />
                      </div>
                    </label>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeTab === 'payments' && (
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-heading-4 text-primary-500">Payment Methods</h3>
                      <p className="text-body-sm text-muted">Manage your payment methods and billing</p>
                    </div>
                    <Button>Add Payment Method</Button>
                  </div>
                  <div className="p-6 bg-primary-50/50 rounded-2xl text-center">
                    <CreditCard className="w-10 h-10 text-muted mx-auto mb-3" />
                    <p className="text-body-sm text-muted">No payment methods added yet</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'privacy' && (
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <h3 className="text-heading-4 text-primary-500 mb-4">Privacy Settings</h3>
                  {[
                    { label: 'Show profile to everyone', desc: 'Your profile will be visible in search results' },
                    { label: 'Show online status', desc: 'Others can see when you are active' },
                    { label: 'Read receipts', desc: 'Let others know when you read their messages' },
                  ].map((item, i) => (
                    <label key={i} className="flex items-center justify-between py-3 border-b border-primary-500/5 last:border-0">
                      <div>
                        <p className="text-body-sm font-medium text-primary-500">{item.label}</p>
                        <p className="text-caption text-muted">{item.desc}</p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-10 h-6 bg-primary-100 rounded-full peer-checked:bg-secondary-500 transition-colors cursor-pointer after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:shadow-soft after:transition-all peer-checked:after:translate-x-4" />
                      </div>
                    </label>
                  ))}
                  <div className="pt-4">
                    <Button variant="danger">Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
