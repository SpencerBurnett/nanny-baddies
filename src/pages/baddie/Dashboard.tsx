import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, DollarSign, Clock } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import * as api from '../../lib/api'
import type { Shift, Earning } from '../../types'

export default function BaddieDashboard() {
  const { profile } = useAuth()
  const [todayShifts, setTodayShifts] = useState<Shift[]>([])
  const [earnings, setEarnings] = useState<Earning[]>([])

  useEffect(() => {
    if (!profile) return
    const today = new Date().toISOString().split('T')[0]
    api.getShifts({ baddie_id: profile.id, from: today, to: today }).then(setTodayShifts)
    api.getEarnings(profile.id).then(setEarnings)
  }, [profile])

  const totalEarned = earnings.reduce((sum, e) => sum + e.amount, 0)
  const pendingPay = earnings.filter((e) => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0)

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-warm-white mb-2">
        Hey, {profile?.first_name}
      </h1>
      <p className="text-muted mb-10">Here is your work dashboard.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-5">
          <Calendar className="w-5 h-5 text-gold mb-3" />
          <h3 className="text-sm font-medium text-warm-white">Today</h3>
          <p className="text-xs text-muted mt-1">
            {todayShifts.length === 0 ? 'No shifts today' : `${todayShifts.length} shift${todayShifts.length > 1 ? 's' : ''}`}
          </p>
        </div>

        <Link to="/b/clients" className="bg-charcoal/50 border border-white/5 rounded-xl p-5 hover:border-gold/20 transition-all">
          <Users className="w-5 h-5 text-gold mb-3" />
          <h3 className="text-sm font-medium text-warm-white">My Clients</h3>
          <p className="text-xs text-muted mt-1">View assigned clients</p>
        </Link>

        <Link to="/b/earnings" className="bg-charcoal/50 border border-white/5 rounded-xl p-5 hover:border-gold/20 transition-all">
          <DollarSign className="w-5 h-5 text-gold mb-3" />
          <h3 className="text-sm font-medium text-warm-white">Total Earned</h3>
          <p className="text-xs text-muted mt-1">${totalEarned.toLocaleString()}</p>
        </Link>

        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-5">
          <Clock className="w-5 h-5 text-gold mb-3" />
          <h3 className="text-sm font-medium text-warm-white">Pending Pay</h3>
          <p className="text-xs text-muted mt-1">${pendingPay.toLocaleString()}</p>
        </div>
      </div>

      {todayShifts.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gold tracking-wide uppercase mb-4">Today's Shifts</h2>
          <div className="space-y-3">
            {todayShifts.map((shift) => (
              <Link
                key={shift.id}
                to={`/b/shift/${shift.id}`}
                className="block bg-charcoal/50 border border-white/5 rounded-xl p-5 hover:border-gold/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-warm-white">
                      {shift.client?.first_name} {shift.client?.last_name}
                    </p>
                    <p className="text-xs text-muted mt-0.5">{shift.start_time} — {shift.end_time}</p>
                  </div>
                  <span className="text-xs text-gold">View checklist →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
