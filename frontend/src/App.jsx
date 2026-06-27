import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'
import { DashboardLayout } from './components/layout/DashboardLayout'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import CustomerDashboard from './pages/CustomerDashboard'
import WorkerDashboard from './pages/WorkerDashboard'
import JobMarketplace from './pages/JobMarketplace'
import JobDetails from './pages/JobDetails'
import WorkerProfile from './pages/WorkerProfile'
import CustomerProfile from './pages/CustomerProfile'
import WorkerMarketplace from './pages/WorkerMarketplace'
import MyJobs from './pages/MyJobs'
import JobMap from './pages/JobMap'
import WorkRequests from './pages/WorkRequests'
import Applications from './pages/Applications'
import Messages from './pages/Messages'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'
import Payments from './pages/Payments'
import AdminDashboard from './pages/AdminDashboard'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return children
}

function RoleGuard({ role, children }) {
  const { user } = useAuth()
  if (user?.role !== role) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-secondary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-body-sm text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={user ? <Navigate to={user.role === 'WORKER' ? '/worker/dashboard' : '/customer/dashboard'} /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to={user.role === 'WORKER' ? '/worker/dashboard' : '/customer/dashboard'} /> : <Register />} />

        <Route path="/worker" element={<PrivateRoute><RoleGuard role="WORKER"><DashboardLayout /></RoleGuard></PrivateRoute>}>
          <Route path="dashboard" element={<WorkerDashboard />} />
          <Route path="marketplace" element={<JobMarketplace />} />
          <Route path="job-map" element={<JobMap />} />
          <Route path="jobs" element={<MyJobs />} />
          <Route path="jobs/:id" element={<JobDetails />} />
          <Route path="applications" element={<Applications />} />
          <Route path="requests" element={<WorkRequests />} />
          <Route path="messages" element={<Messages />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="payments" element={<Payments />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile/:id" element={<WorkerProfile />} />
        </Route>

        <Route path="/customer" element={<PrivateRoute><RoleGuard role="CLIENT"><DashboardLayout /></RoleGuard></PrivateRoute>}>
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="marketplace" element={<WorkerMarketplace />} />
          <Route path="workers" element={<WorkerMarketplace />} />
          <Route path="jobs" element={<MyJobs />} />
          <Route path="jobs/:id" element={<JobDetails />} />
          <Route path="requests" element={<WorkRequests />} />
          <Route path="messages" element={<Messages />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="payments" element={<Payments />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<CustomerProfile />} />
          <Route path="profile/:id" element={<CustomerProfile />} />
        </Route>

        <Route path="/admin" element={<PrivateRoute><RoleGuard role="ADMIN"><DashboardLayout /></RoleGuard></PrivateRoute>}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminDashboard />} />
          <Route path="analytics" element={<AdminDashboard />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
