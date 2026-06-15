import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { ProtectedRoute } from './lib/auth'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import PortalShell from './components/layout/PortalShell'
import Home from './pages/Home'
import ForClients from './pages/ForClients'
import ForBaddies from './pages/ForBaddies'
import Apply from './pages/Apply'
import ApplyBaddie from './pages/ApplyBaddie'
import Login from './pages/Login'
import Enrollment from './pages/Enrollment'

import ClientDashboard from './pages/client/Dashboard'
import ClientProfile from './pages/client/Profile'
import ClientChecklist from './pages/client/Checklist'
import ClientSchedule from './pages/client/Schedule'
import ClientMessages from './pages/client/Messages'
import ClientBilling from './pages/client/Billing'

import BaddieDashboard from './pages/baddie/Dashboard'
import BaddieClients from './pages/baddie/Clients'
import BaddieSchedule from './pages/baddie/Schedule'
import ActiveShift from './pages/baddie/ActiveShift'
import BaddieEarnings from './pages/baddie/Earnings'
import BaddieMessages from './pages/baddie/Messages'

import AdminDashboard from './pages/admin/Dashboard'
import AdminApplications from './pages/admin/Applications'
import ClientPipeline from './pages/admin/ClientPipeline'
import BaddiePipeline from './pages/admin/BaddiePipeline'
import Matching from './pages/admin/Matching'
import ShiftScheduler from './pages/admin/ShiftScheduler'
import Payments from './pages/admin/Payments'
import AdminMessages from './pages/admin/Messages'
import AdminSettings from './pages/admin/Settings'

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-midnight text-warm-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="for-clients" element={<ForClients />} />
        <Route path="for-baddies" element={<ForBaddies />} />
        <Route path="apply" element={<Apply />} />
        <Route path="apply-baddie" element={<ApplyBaddie />} />
        <Route path="enroll" element={<Enrollment />} />
      </Route>

      {/* Login (no nav/footer) */}
      <Route path="login" element={<Login />} />

      {/* Client Portal */}
      <Route
        path="portal"
        element={
          <ProtectedRoute role="client">
            <PortalShell role="client" />
          </ProtectedRoute>
        }
      >
        <Route index element={<ClientDashboard />} />
        <Route path="profile" element={<ClientProfile />} />
        <Route path="checklist" element={<ClientChecklist />} />
        <Route path="schedule" element={<ClientSchedule />} />
        <Route path="messages" element={<ClientMessages />} />
        <Route path="billing" element={<ClientBilling />} />
      </Route>

      {/* Baddie Portal */}
      <Route
        path="b"
        element={
          <ProtectedRoute role="baddie">
            <PortalShell role="baddie" />
          </ProtectedRoute>
        }
      >
        <Route index element={<BaddieDashboard />} />
        <Route path="clients" element={<BaddieClients />} />
        <Route path="schedule" element={<BaddieSchedule />} />
        <Route path="shift/:shiftId" element={<ActiveShift />} />
        <Route path="earnings" element={<BaddieEarnings />} />
        <Route path="messages" element={<BaddieMessages />} />
      </Route>

      {/* Admin CRM */}
      <Route
        path="admin"
        element={
          <ProtectedRoute role="admin">
            <PortalShell role="admin" />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="applications" element={<AdminApplications />} />
        <Route path="clients" element={<ClientPipeline />} />
        <Route path="baddies" element={<BaddiePipeline />} />
        <Route path="matching" element={<Matching />} />
        <Route path="shifts" element={<ShiftScheduler />} />
        <Route path="payments" element={<Payments />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
