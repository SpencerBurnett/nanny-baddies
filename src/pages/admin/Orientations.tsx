import { useEffect, useState } from 'react'
import { CalendarClock, Check, MapPin } from 'lucide-react'
import * as api from '../../lib/api'
import { getModelHouseAddress } from '../../lib/settings'
import type { Orientation, OrientationStatus } from '../../types'

const STATUSES: OrientationStatus[] = ['requested', 'scheduled', 'attended', 'no_show', 'canceled']

const statusColors: Record<OrientationStatus, string> = {
  requested: 'bg-yellow-500/20 text-yellow-400',
  scheduled: 'bg-gold/20 text-gold',
  attended: 'bg-green-500/20 text-green-400',
  no_show: 'bg-red-500/20 text-red-400',
  canceled: 'bg-white/10 text-soft',
}

const inputClass = 'bg-slate-dark/50 border border-white/10 rounded-lg px-3 py-2 text-warm-white text-sm focus:outline-none focus:border-gold/50 transition-colors'

export default function AdminOrientations() {
  const [orientations, setOrientations] = useState<Orientation[]>([])
  const [drafts, setDrafts] = useState<Record<string, Partial<Orientation>>>({})
  const [savingId, setSavingId] = useState<string | null>(null)

  const load = () => api.getOrientations().then(setOrientations)
  useEffect(() => { load() }, [])

  const draftFor = (o: Orientation): Partial<Orientation> => drafts[o.id] ?? o
  const setDraft = (id: string, patch: Partial<Orientation>) =>
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))

  const save = async (o: Orientation) => {
    const d = draftFor(o)
    setSavingId(o.id)
    const nextStatus = (d.status ?? o.status) as OrientationStatus
    await api.updateOrientation(o.id, {
      scheduled_date: d.scheduled_date ?? o.scheduled_date,
      scheduled_time: d.scheduled_time ?? o.scheduled_time,
      location: d.location ?? o.location ?? getModelHouseAddress(),
      status: nextStatus,
      attended_at: nextStatus === 'attended' ? new Date().toISOString() : o.attended_at,
    })
    // Advance the client's onboarding status to match.
    if (nextStatus === 'attended') await api.updateProfile(o.client_id, { status: 'orientation_attended' })
    else if (nextStatus === 'scheduled') await api.updateProfile(o.client_id, { status: 'orientation_booked' })
    setSavingId(null)
    setDrafts((prev) => { const n = { ...prev }; delete n[o.id]; return n })
    load()
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <CalendarClock className="w-6 h-6 text-gold" />
        <h1 className="text-2xl font-display font-semibold text-warm-white">Orientations</h1>
      </div>
      <p className="text-muted text-sm mb-6">Schedule and track in-person orientations at the model house.</p>

      <div className="inline-flex items-center gap-2 bg-charcoal/50 border border-white/5 rounded-lg px-4 py-2 mb-8">
        <MapPin className="w-4 h-4 text-gold" />
        <span className="text-xs text-muted">Model house:</span>
        <span className="text-xs text-warm-white">{getModelHouseAddress()}</span>
      </div>

      {orientations.length === 0 ? (
        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-12 text-center">
          <CalendarClock className="w-10 h-10 text-soft mx-auto mb-4" />
          <p className="text-sm text-muted">No orientations requested yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orientations.map((o) => {
            const d = draftFor(o)
            const dirty = !!drafts[o.id]
            return (
              <div key={o.id} className="bg-charcoal/50 border border-white/5 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-warm-white">
                      {o.client ? `${o.client.first_name} ${o.client.last_name}` : 'Client'}
                    </p>
                    <p className="text-xs text-muted">{o.client?.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[o.status]}`}>
                    {o.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="date"
                    className={inputClass}
                    value={d.scheduled_date ?? ''}
                    onChange={(e) => setDraft(o.id, { scheduled_date: e.target.value || null })}
                  />
                  <input
                    type="text"
                    placeholder="Time (e.g. 3:00 PM)"
                    className={inputClass}
                    value={d.scheduled_time ?? ''}
                    onChange={(e) => setDraft(o.id, { scheduled_time: e.target.value || null })}
                  />
                  <input
                    type="text"
                    placeholder="Model house address"
                    className={inputClass}
                    value={d.location ?? ''}
                    onChange={(e) => setDraft(o.id, { location: e.target.value || null })}
                  />
                  <select
                    className={inputClass}
                    value={d.status ?? o.status}
                    onChange={(e) => setDraft(o.id, { status: e.target.value as OrientationStatus })}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => save(o)}
                    disabled={savingId === o.id || !dirty}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-gold text-midnight rounded-lg text-sm font-medium hover:bg-gold-light transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    {savingId === o.id ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
