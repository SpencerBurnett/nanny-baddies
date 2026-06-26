import { useEffect, useState } from 'react'
import { Plus, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import * as api from '../../lib/api'
import type { TaskRequest, Match } from '../../types'

const statusConfig: Record<string, { icon: typeof Clock; color: string; label: string }> = {
  pending: { icon: Clock, color: 'text-yellow-400 bg-yellow-500/20', label: 'Pending' },
  accepted: { icon: CheckCircle, color: 'text-blue-400 bg-blue-500/20', label: 'Accepted' },
  declined: { icon: XCircle, color: 'text-red-400 bg-red-500/20', label: 'Declined' },
  hired_out: { icon: DollarSign, color: 'text-purple-400 bg-purple-500/20', label: 'Hired Out' },
  completed: { icon: CheckCircle, color: 'text-green-400 bg-green-500/20', label: 'Completed' },
  canceled: { icon: XCircle, color: 'text-soft bg-white/5', label: 'Canceled' },
}

export default function ClientTaskRequests() {
  const { profile } = useAuth()
  const [requests, setRequests] = useState<TaskRequest[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedMatch, setSelectedMatch] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!profile) return
    Promise.all([
      api.getTaskRequests({ client_id: profile.id }),
      api.getMatches({ client_id: profile.id, status: 'active' }),
    ]).then(([r, m]) => {
      setRequests(r)
      setMatches(m)
      if (m.length === 1) setSelectedMatch(m[0].id)
    })
  }, [profile])

  const handleSubmit = async () => {
    if (!profile || !title || !selectedMatch) return
    setSubmitting(true)
    const match = matches.find((m) => m.id === selectedMatch)
    if (!match) return
    const id = await api.createTaskRequest({
      match_id: match.id,
      client_id: profile.id,
      baddie_id: match.baddie_id,
      title,
      description: description || undefined,
    })
    if (id) {
      const refreshed = await api.getTaskRequests({ client_id: profile.id })
      setRequests(refreshed)
      setTitle('')
      setDescription('')
      setShowForm(false)
    }
    setSubmitting(false)
  }

  const inputClass = 'w-full bg-slate-dark/50 border border-white/10 rounded-lg px-4 py-3 text-warm-white text-sm placeholder-soft focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-colors'

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-semibold text-warm-white mb-1">Task Requests</h1>
          <p className="text-muted text-sm">Request tasks from your Nanny Baddie.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gold text-midnight font-medium rounded-lg text-sm hover:bg-gold-light transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> New Request
        </button>
      </div>

      {showForm && (
        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-6 mb-8">
          <h3 className="text-sm font-semibold text-warm-white mb-4">New Task Request</h3>
          <div className="space-y-4">
            {matches.length > 1 && (
              <select
                value={selectedMatch}
                onChange={(e) => setSelectedMatch(e.target.value)}
                className={inputClass}
              >
                <option value="">Select your Nanny Baddie...</option>
                {matches.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.baddie?.first_name} {m.baddie?.last_name}
                  </option>
                ))}
              </select>
            )}
            <input
              type="text"
              placeholder="What do you need? (e.g., Hang the pictures in the living room)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
            <textarea
              placeholder="Additional details (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={inputClass}
            />
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={!title || !selectedMatch || submitting}
                className="px-6 py-2.5 bg-gold text-midnight font-medium rounded-lg text-sm hover:bg-gold-light transition-all disabled:opacity-30 cursor-pointer"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 border border-white/10 text-muted rounded-lg text-sm hover:border-white/20 transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
          <p className="text-xs text-soft mt-3">
            The answer is always yes — if she can&apos;t do it herself, she&apos;ll hire it out for you (additional cost may apply).
          </p>
        </div>
      )}

      <div className="space-y-3">
        {requests.map((req) => {
          const cfg = statusConfig[req.status]
          const Icon = cfg.icon
          return (
            <div key={req.id} className="bg-charcoal/50 border border-white/5 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-warm-white">{req.title}</h4>
                  {req.description && <p className="text-xs text-muted mt-1">{req.description}</p>}
                  <p className="text-xs text-soft mt-2">
                    {new Date(req.created_at).toLocaleDateString()}
                    {req.hired_out && req.hired_out_cost && (
                      <span className="ml-3 text-purple-400">
                        Hired out — ${req.hired_out_cost.toFixed(2)}
                        {req.hired_out_vendor && ` via ${req.hired_out_vendor}`}
                      </span>
                    )}
                  </p>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {cfg.label}
                </span>
              </div>
            </div>
          )
        })}
        {requests.length === 0 && (
          <div className="bg-charcoal/50 border border-white/5 rounded-xl p-8 text-center text-muted text-sm">
            No task requests yet. Click &ldquo;New Request&rdquo; to ask your Nanny Baddie for something.
          </div>
        )}
      </div>
    </div>
  )
}
