import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { MapPin } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { jobsApi } from '../api/jobs'
import { CardSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { Badge } from '../components/ui/Badge'
import { formatCurrency, cn } from '../lib/utils'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const jobIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const selectedIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [30, 49],
  iconAnchor: [15, 49],
  popupAnchor: [1, -34],
  shadowSize: [49, 49],
})

function FlyToJob({ lat, lng }) {
  const map = useMap()
  useEffect(() => {
    if (lat != null && lng != null) {
      map.flyTo([lat, lng], 13, { duration: 0.8 })
    }
  }, [lat, lng, map])
  return null
}

function getUserLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 5000 }
    )
  })
}

export default function JobMap() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const init = async () => {
      const [jobsRes, location] = await Promise.all([
        jobsApi.getAll().catch(() => ({ data: [] })),
        getUserLocation(),
      ])
      const jobList = Array.isArray(jobsRes.data) ? jobsRes.data : []
      setJobs(jobList)
      setUserLocation(location)
      setLoading(false)
    }
    init()
  }, [])

  useEffect(() => {
    let result = jobs
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(j =>
        j.title?.toLowerCase().includes(q) ||
        j.clientName?.toLowerCase().includes(q) ||
        j.address?.toLowerCase().includes(q)
      )
    }
    setFilteredJobs(result)
  }, [search, jobs])

  const jobsWithCoords = filteredJobs.filter(j => j.latitude != null && j.longitude != null)
  const center = selectedJob
    ? [selectedJob.latitude, selectedJob.longitude]
    : userLocation
      ? [userLocation.lat, userLocation.lng]
      : [20.5937, 78.9629]

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-heading-2 text-primary-500">
            Job Map
          </motion.h1>
          <p className="text-body text-muted mt-1">Find jobs near you on the map</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search jobs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-2 rounded-xl border border-primary-500/10 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 w-48"
          />
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className="flex-1 rounded-2xl overflow-hidden border border-primary-500/5 relative">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center bg-primary-50">
              <div className="w-8 h-8 border-2 border-secondary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : jobsWithCoords.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center bg-primary-50">
              <EmptyState
                title="No jobs on map"
                description="Jobs with location coordinates will appear here."
              />
            </div>
          ) : (
            <MapContainer
              center={center}
              zoom={5}
              className="w-full h-full"
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FlyToJob lat={selectedJob?.latitude} lng={selectedJob?.longitude} />
              {jobsWithCoords.map(job => (
                <Marker
                  key={job.id}
                  position={[job.latitude, job.longitude]}
                  icon={selectedJob?.id === job.id ? selectedIcon : jobIcon}
                  eventHandlers={{
                    click: () => setSelectedJob(job),
                  }}
                >
                  <Popup>
                    <div className="min-w-[200px]">
                      <h3 className="font-semibold text-primary-500 mb-1">{job.title}</h3>
                      <p className="text-caption text-muted mb-2">{job.clientName}</p>
                      {job.budget && (
                        <p className="text-body-sm font-semibold text-accent-500 mb-2">{formatCurrency(job.budget)}</p>
                      )}
                      <p className="text-caption text-muted line-clamp-2 mb-2">{job.description}</p>
                      {job.address && (
                        <div className="flex items-center gap-1 text-caption text-muted mb-2">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{job.address}</span>
                        </div>
                      )}
                      <button
                        onClick={() => navigate(`/worker/jobs/${job.id}`)}
                        className="w-full mt-1 px-3 py-1.5 bg-primary-500 text-white text-body-sm font-medium rounded-lg hover:bg-primary-600 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
              {userLocation && (
                <Marker
                  position={[userLocation.lat, userLocation.lng]}
                  icon={new L.Icon({
                    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41],
                  })}
                >
                  <Popup>
                    <div className="text-center">
                      <p className="font-semibold text-primary-500">Your Location</p>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          )}
        </div>
        <div className="w-72 shrink-0 overflow-y-auto space-y-2 pl-1">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="w-8 h-8 text-muted mx-auto mb-2" />
              <p className="text-body-sm text-muted">No jobs found</p>
            </div>
          ) : (
            filteredJobs.map(job => (
              <motion.button
                key={job.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => {
                  if (job.latitude && job.longitude) {
                    setSelectedJob(job)
                  }
                }}
                className={cn(
                  'w-full text-left p-3 rounded-xl border transition-all',
                  selectedJob?.id === job.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-primary-500/5 hover:border-primary-500/20 bg-white'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-body-sm font-semibold text-primary-500 truncate">{job.title}</p>
                    <p className="text-caption text-muted truncate">{job.clientName}</p>
                  </div>
                  {job.budget && (
                    <span className="text-body-sm font-semibold text-accent-500 shrink-0">{formatCurrency(job.budget)}</span>
                  )}
                </div>
                {job.address && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <MapPin className="w-3 h-3 text-muted shrink-0" />
                    <span className="text-caption text-muted truncate">{job.address}</span>
                  </div>
                )}
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {(job.requiredSkills || []).slice(0, 2).map(s => (
                    <Badge key={s} className="text-caption">{s}</Badge>
                  ))}
                </div>
              </motion.button>
            ))
          )}
        </div>

      </div>
    </div>
  )
}
