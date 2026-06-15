import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, Briefcase, FileText, CalendarClock } from 'lucide-react'
import * as api from '../../lib/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ activeClients: 0, activeBaddies: 0, pendingApplications: 0, shiftsThisWeek: 0 })

  useEffect(() => {
    api.getAdminStats().then(setStats)
  }, [])

  const cards = [
    { label: 'Active Clients', value: stats.activeClients, icon: Users, to: '/admin/clients', color: 'text-gold' },
    { label: 'Active Baddies', value: stats.activeBaddies, icon: Briefcase, to: '/admin/baddies', color: 'text-purple-400' },
    { label: 'Pending Applications', value: stats.pendingApplications, icon: FileText, to: '/admin/applications', color: 'text-blue-400' },
    { label: 'Shifts This Week', value: stats.shiftsThisWeek, icon: CalendarClock, to: '/admin/shifts', color: 'text-green-400' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-warm-white mb-2">Admin Dashboard</h1>
      <p className="text-muted mb-10">Overview of the Nanny Baddies operation.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="bg-charcoal/50 border border-white/5 rounded-xl p-6 hover:border-gold/20 transition-all"
          >
            <card.icon className={`w-6 h-6 ${card.color} mb-3`} />
            <p className="text-3xl font-display font-semibold text-warm-white">{card.value}</p>
            <p className="text-sm text-muted mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-base font-semibold text-warm-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link to="/admin/applications" className="block px-4 py-3 bg-slate-dark/30 rounded-lg text-sm text-muted hover:text-gold transition-colors">
              Review pending applications →
            </Link>
            <Link to="/admin/matching" className="block px-4 py-3 bg-slate-dark/30 rounded-lg text-sm text-muted hover:text-gold transition-colors">
              Match clients with baddies →
            </Link>
            <Link to="/admin/shifts" className="block px-4 py-3 bg-slate-dark/30 rounded-lg text-sm text-muted hover:text-gold transition-colors">
              Schedule shifts →
            </Link>
          </div>
        </div>

        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-base font-semibold text-warm-white mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Database</span>
              <span className="text-green-400">Connected</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Stripe</span>
              <span className="text-yellow-400">Pending setup</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Messaging</span>
              <span className="text-yellow-400">Phase 6</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
