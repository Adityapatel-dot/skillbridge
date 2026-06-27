import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Briefcase, Star, Calendar, Award, Mail, Phone, CheckCircle, Clock, Shield } from 'lucide-react'
import { profilesApi } from '../api/profiles'
import { reviewsApi } from '../api/reviews'
import { Avatar } from '../components/ui/Avatar'
import { Rating } from '../components/ui/Rating'
import Button from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { formatDate, formatRating } from '../lib/utils'

export default function WorkerProfile() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileRes, reviewsRes] = await Promise.all([
          profilesApi.getById(id),
          reviewsApi.getUserReviews(id),
        ])
        setProfile(profileRes.data)
        setReviews(reviewsRes.data || [])
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
          <div className="h-32 bg-gradient-to-r from-secondary-500 via-secondary-400 to-accent-500" />
          <CardContent className="relative pt-0">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
              <Avatar name={profile.fullName} size="2xl" className="ring-4 ring-white shadow-soft" />
              <div className="flex-1 pt-2 sm:pb-2">
                <h1 className="text-heading-3 text-primary-500">{profile.fullName}</h1>
                <p className="text-body text-muted">{profile.experience || 'Professional'}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" icon={Mail}>Message</Button>
                <Button size="sm" icon={Phone}>Contact</Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 mt-6 p-4 bg-primary-50/50 rounded-2xl">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-warning text-warning" />
                <span className="text-heading-4 text-primary-500">{formatRating(profile.averageRating)}</span>
                <span className="text-caption text-muted">Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent-500" />
                <span className="text-body-sm text-primary-500 font-medium">Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted" />
                <span className="text-body-sm text-muted">Member since {formatDate(profile.createdAt)}</span>
              </div>
              {profile.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted" />
                  <span className="text-body-sm text-muted">{profile.address}</span>
                </div>
              )}
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

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-heading-4 text-primary-500 mb-4">Reviews ({reviews.length})</h3>
                {reviews.length === 0 ? (
                  <p className="text-body-sm text-muted">No reviews yet.</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review, i) => (
                      <div key={review.id || i} className="p-4 bg-primary-50/50 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar name={review.reviewerName} size="sm" />
                          <div>
                            <p className="text-body-sm font-medium text-primary-500">{review.reviewerName}</p>
                            <Rating value={review.rating} size="sm" />
                          </div>
                        </div>
                        <p className="text-body-sm text-muted">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-heading-4 text-primary-500 mb-4">Skills</h3>
                {profile.skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map(skill => (
                      <Badge key={skill} variant="info" className="text-body-sm px-3 py-1.5">{skill}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-body-sm text-muted">No skills listed</p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-heading-4 text-primary-500 mb-4">Availability</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-body-sm">
                    <CheckCircle className="w-4 h-4 text-accent-500" />
                    <span className="text-primary-500">Available for new jobs</span>
                  </div>
                  <div className="flex items-center gap-3 text-body-sm">
                    <Clock className="w-4 h-4 text-muted" />
                    <span className="text-muted">Response time: &lt; 2 hours</span>
                  </div>
                  <div className="flex items-center gap-3 text-body-sm">
                    <Briefcase className="w-4 h-4 text-muted" />
                    <span className="text-muted">3 active projects</span>
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
