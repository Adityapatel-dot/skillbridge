import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Shield, Mail, Phone, Star, Briefcase, CheckCircle, IndianRupee } from 'lucide-react'
import { profilesApi } from '../api/profiles'
import { Avatar } from '../components/ui/Avatar'
import { Rating } from '../components/ui/Rating'
import Button from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { formatDate, formatRating } from '../lib/utils'

export default function CustomerProfile() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await profilesApi.getById(id)
        setProfile(data)
      } catch {}
      setLoading(false)
    }
    fetchProfile()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-48 shimmer rounded-2xl" />
        <div className="h-64 shimmer rounded-2xl" />
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500" />
          <CardContent className="relative pt-0">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
              <Avatar name={profile.fullName} size="2xl" className="ring-4 ring-white shadow-soft" />
              <div className="flex-1 pt-2 sm:pb-2">
                <h1 className="text-heading-3 text-primary-500">{profile.fullName}</h1>
                <p className="text-body text-muted">Customer</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" icon={Mail}>Message</Button>
                <Button size="sm" icon={Phone}>Contact</Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 mt-6 p-4 bg-primary-50/50 rounded-2xl">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent-500" />
                <span className="text-body-sm font-medium text-primary-500">Verified Customer</span>
              </div>
              {profile.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted" />
                  <span className="text-body-sm text-muted">{profile.address}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted" />
                <span className="text-body-sm text-muted">Member since {formatDate(profile.createdAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {profile.bio && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-heading-4 text-primary-500 mb-3">About</h3>
                  <p className="text-body text-muted leading-relaxed">{profile.bio}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-heading-4 text-primary-500 mb-4">Customer Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-body-sm">
                      <Briefcase className="w-4 h-4 text-muted" />
                      <span className="text-muted">Jobs Posted</span>
                    </div>
                    <span className="text-body-sm font-medium text-primary-500">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-body-sm">
                      <CheckCircle className="w-4 h-4 text-muted" />
                      <span className="text-muted">Completed</span>
                    </div>
                    <span className="text-body-sm font-medium text-primary-500">22</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-body-sm">
                      <Star className="w-4 h-4 text-muted" />
                      <span className="text-muted">Avg. Rating Given</span>
                    </div>
                    <span className="text-body-sm font-medium text-primary-500">4.8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-body-sm">
                      <IndianRupee className="w-4 h-4 text-muted" />
                      <span className="text-muted">Total Spent</span>
                    </div>
                    <span className="text-body-sm font-medium text-accent-500">₹18,450</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-heading-4 text-primary-500 mb-4">Verification</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-body-sm">
                    <CheckCircle className="w-4 h-4 text-accent-500" />
                    <span className="text-primary-500">Email verified</span>
                  </div>
                  <div className="flex items-center gap-3 text-body-sm">
                    <CheckCircle className="w-4 h-4 text-accent-500" />
                    <span className="text-primary-500">Phone verified</span>
                  </div>
                  <div className="flex items-center gap-3 text-body-sm">
                    <CheckCircle className="w-4 h-4 text-accent-500" />
                    <span className="text-primary-500">Identity verified</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
