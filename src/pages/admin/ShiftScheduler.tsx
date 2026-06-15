import { useEffect, useState } from 'react'
import * as api from '../../lib/api'
import type { Shift, Profile, Match } from '../../types'

export default function ShiftScheduler() {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [clients, setClients] = useState<Profile[]>([])
  const [baddies, setBaddies] = useState<Profile[]>([])
  const [selectedMatch, setSelectedMatch] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')

  useEffect(() => {
    Promise.all([
      api.getShifts(),
      api.getMatches({ status: 'active' }),
      api.getProfiles({ role: 'client' }),
      api.getProfiles({ role: 'baddie' }),
    ]).then(([s, m, c, b]) => {
      setShifts(s)
      setMatches(m)
      setClients(c)
      setBaddies(b)
    })
  }, [])

  const getName = (id: string, list: Profile[]) => {
    const p = list.find((x) => x.id === id)
    return p ? `${p.first_name} ${p.last_name}` : 'Unknown'
  }

  const handleSchedule = async () => {
    const match = matches.find((m) => m.id === selectedMatch)
    if (!match || !date) return
    const shift = await api.createShift({
      match_id: match.id,
      client_id: match.client_id,
      baddie_id: match.baddie_id,
      scheduled_date: date,
      scheduled_start: startTime,
      scheduled_end: `${parseInt(startTime) + 4}:00`,
    })
    if (shift) {
      setShifts((prev) => [shift, ...prev])
      setSelectedMatch('')
      setDate('')
    }
  }

  const statusColors: Record<string, string> = {
    scheduled: 'bg-blue-500/20 text-blue-400',
    in_progress: 'bg-yellow-500/20 text-yellow-400',
    completed: 'bg-green-500/20 text-green-400',
    canceled: 'bg-red-500/20 text-red-400',
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-warm-white mb-2">Shift Scheduler</h1>
      <p className="text-muted text-sm mb-8">Schedule and manage service shifts.</p>

      <div className="bg-charcoal/50 border border-white/5 rounded-xl p-6 mb-8">
        <h3 className="text-sm font-semibold text-warm-white mb-4">Schedule Shift</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={selectedMatch}
            onChange={(e) => setSelectedMatch(e.target.value)}
            className="bg-slate-dark/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-warm-white"
          >
            <option value="">Select match…</option>
            {matches.map((m) => (
              <option key={m.id} value={m.id}>
                {getName(m.client_id, clients)} ↔ {getName(m.baddie_id, baddies)}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-slate-dark/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-warm-white"
          />

          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="bg-slate-dark/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-warm-white"
          />

          <button
            onClick={handleSchedule}
            disabled={!selectedMatch || !date}
            className="bg-gold text-midnight font-medium rounded-lg px-6 py-3 text-sm hover:bg-gold/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            Schedule
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {shifts.map((shift) => (
          <div key={shift.id} className="bg-charcoal/50 border border-white/5 rounded-xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div>
                <p className="text-xs text-muted mb-0.5">Date</p>
                <p className="text-sm font-medium text-warm-white">{shift.scheduled_date}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-0.5">Time</p>
                <p className="text-sm text-warm-white">{shift.scheduled_start} – {shift.scheduled_end}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-0.5">Client</p>
                <p className="text-sm text-warm-white">{getName(shift.client_id, clients)}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-0.5">Baddie</p>
                <p className="text-sm text-warm-white">{getName(shift.baddie_id, baddies)}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[shift.status]}`}>
              {shift.status}
            </span>
          </div>
        ))}
        {shifts.length === 0 && (
          <div className="bg-charcoal/50 border border-white/5 rounded-xl p-8 text-center text-muted text-sm">
            No shifts scheduled yet.
          </div>
        )}
      </div>
    </div>
  )
}
