import { useEffect, useState } from 'react'
import { Calendar, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import * as api from '../../lib/api'
import type { Shift } from '../../types'

export default function BaddieSchedule() {
  const { profile } = useAuth()
  const [shifts, setShifts] = useState<Shift[]>([])

  useEffect(() => {
    if (!profile) return
    api.getShifts({ baddie_id: profile.id }).then(setShifts)
  }, [profile])

  const upcoming = shifts.filter((s) => s.status === 'scheduled' || s.status === 'in_progress')
  const past = shifts.filter((s) => s.status === 'completed' || s.status === 'canceled')

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-warm-white mb-2">My Schedule</h1>
      <p className="text-muted text-sm mb-8">Your upcoming and past shifts.</p>

      <h2 className="text-sm font-semibold text-gold tracking-wide uppercase mb-4">Upcoming</h2>
      {upcoming.length === 0 ? (
        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-8 text-center text-muted text-sm mb-10">
          No upcoming shifts. Admin will schedule your shifts after matching.
        </div>
      ) : (
        <div className="space-y-3 mb-10">
          {upcoming.map((shift) => (
            <Link
              key={shift.id}
              to={`/b/shift/${shift.id}`}
              className="block bg-charcoal/50 border border-white/5 rounded-xl p-5 hover:border-gold/20 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-warm-white">
                      {shift.client?.first_name} {shift.client?.last_name} — {shift.scheduled_date}
                    </p>
                    <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {shift.start_time} — {shift.end_time}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gold">Checklist →</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {past.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-muted tracking-wide uppercase mb-4">Completed</h2>
          <div className="space-y-3">
            {past.map((shift) => (
              <div key={shift.id} className="bg-charcoal/30 border border-white/5 rounded-xl p-5 opacity-60">
                <p className="text-sm text-muted">
                  {shift.client?.first_name} {shift.client?.last_name} — {shift.scheduled_date}
                </p>
                <p className="text-xs text-soft">{shift.start_time} — {shift.end_time}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
