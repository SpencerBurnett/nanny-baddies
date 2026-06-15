import { useEffect, useState } from 'react'
import { Calendar, Clock } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import * as api from '../../lib/api'
import type { Shift } from '../../types'

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-500/20 text-blue-400',
  in_progress: 'bg-gold/20 text-gold',
  completed: 'bg-green-500/20 text-green-400',
  canceled: 'bg-red-500/20 text-red-400',
  no_show: 'bg-red-500/20 text-red-400',
}

export default function ClientSchedule() {
  const { profile } = useAuth()
  const [shifts, setShifts] = useState<Shift[]>([])

  useEffect(() => {
    if (!profile) return
    api.getShifts({ client_id: profile.id }).then(setShifts)
  }, [profile])

  const upcoming = shifts.filter((s) => s.status === 'scheduled' || s.status === 'in_progress')
  const past = shifts.filter((s) => s.status === 'completed' || s.status === 'canceled' || s.status === 'no_show')

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-warm-white mb-2">Schedule</h1>
      <p className="text-muted text-sm mb-8">Your upcoming and past shifts.</p>

      <h2 className="text-sm font-semibold text-gold tracking-wide uppercase mb-4">Upcoming</h2>
      {upcoming.length === 0 ? (
        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-8 text-center text-muted text-sm mb-10">
          No upcoming shifts scheduled. Your admin will schedule shifts after matching.
        </div>
      ) : (
        <div className="space-y-3 mb-10">
          {upcoming.map((shift) => (
            <div key={shift.id} className="bg-charcoal/50 border border-white/5 rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-medium text-warm-white">{shift.scheduled_date}</p>
                  <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> {shift.start_time} — {shift.end_time}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[shift.status]}`}>
                {shift.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      )}

      {past.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-muted tracking-wide uppercase mb-4">Past</h2>
          <div className="space-y-3">
            {past.map((shift) => (
              <div key={shift.id} className="bg-charcoal/30 border border-white/5 rounded-xl p-5 flex items-center justify-between opacity-60">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-soft" />
                  </div>
                  <div>
                    <p className="text-sm text-muted">{shift.scheduled_date}</p>
                    <p className="text-xs text-soft">{shift.start_time} — {shift.end_time}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[shift.status]}`}>
                  {shift.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
