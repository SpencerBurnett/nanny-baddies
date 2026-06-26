import { useEffect, useState } from 'react'
import { Clock, CheckCircle, XCircle, ExternalLink } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import * as api from '../../lib/api'
import type { TaskRequest } from '../../types'

export default function BaddieTaskRequests() {
  const { profile } = useAuth()
  const [requests, setRequests] = useState<TaskRequest[]>([])
  const [hireOutCost, setHireOutCost] = useState('')
  const [hireOutVendor, setHireOutVendor] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    if (!profile) return
    api.getTaskRequests({ baddie_id: profile.id }).then(setRequests)
  }, [profile])

  const refresh = async () => {
    if (!profile) return
    const data = await api.getTaskRequests({ baddie_id: profile.id })
    setRequests(data)
  }

  const handleAccept = async (id: string) => {
    await api.updateTaskRequest(id, { status: 'accepted' })
    refresh()
  }

  const handleDecline = async (id: string) => {
    await api.updateTaskRequest(id, { status: 'declined' })
    refresh()
  }

  const handleHireOut = async (id: string) => {
    await api.updateTaskRequest(id, {
      status: 'hired_out',
      hired_out: true,
      hired_out_cost: hireOutCost ? parseFloat(hireOutCost) : null,
      hired_out_vendor: hireOutVendor || null,
    })
    setHireOutCost('')
    setHireOutVendor('')
    setExpandedId(null)
    refresh()
  }

  const handleComplete = async (id: string) => {
    await api.updateTaskRequest(id, { status: 'completed', completed_at: new Date().toISOString() })
    refresh()
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    accepted: 'bg-blue-500/20 text-blue-400',
    declined: 'bg-red-500/20 text-red-400',
    hired_out: 'bg-purple-500/20 text-purple-400',
    completed: 'bg-green-500/20 text-green-400',
    canceled: 'bg-white/5 text-soft',
  }

  const pending = requests.filter((r) => r.status === 'pending')
  const active = requests.filter((r) => ['accepted', 'hired_out'].includes(r.status))
  const history = requests.filter((r) => ['completed', 'declined', 'canceled'].includes(r.status))

  const inputClass = 'w-full bg-slate-dark/50 border border-white/10 rounded-lg px-4 py-2.5 text-warm-white text-sm placeholder-soft focus:outline-none focus:border-gold/50 transition-colors'

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-warm-white mb-1">Task Requests</h1>
      <p className="text-muted text-sm mb-8">Manage requests from your clients.</p>

      {pending.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-yellow-400 tracking-wider uppercase mb-3">
            Pending ({pending.length})
          </h3>
          <div className="space-y-3">
            {pending.map((req) => (
              <div key={req.id} className="bg-charcoal/50 border border-yellow-500/20 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-warm-white">{req.title}</h4>
                    {req.description && <p className="text-xs text-muted mt-1">{req.description}</p>}
                    <p className="text-xs text-soft mt-1">
                      From {req.client?.first_name} {req.client?.last_name} — {new Date(req.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Clock className="w-4 h-4 text-yellow-400 shrink-0" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleAccept(req.id)} className="flex items-center gap-1.5 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/30 transition-colors cursor-pointer">
                    <CheckCircle className="w-3.5 h-3.5" /> Accept
                  </button>
                  <button onClick={() => handleDecline(req.id)} className="flex items-center gap-1.5 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-colors cursor-pointer">
                    <XCircle className="w-3.5 h-3.5" /> Decline
                  </button>
                  <button
                    onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-xs font-medium hover:bg-purple-500/30 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Hire Out
                  </button>
                </div>
                {expandedId === req.id && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                    <input type="number" placeholder="Cost estimate ($)" value={hireOutCost} onChange={(e) => setHireOutCost(e.target.value)} className={inputClass} />
                    <input type="text" placeholder="Vendor / contractor name" value={hireOutVendor} onChange={(e) => setHireOutVendor(e.target.value)} className={inputClass} />
                    <button onClick={() => handleHireOut(req.id)} className="px-5 py-2 bg-purple-500/30 text-purple-400 rounded-lg text-xs font-medium hover:bg-purple-500/40 transition-colors cursor-pointer">
                      Confirm Hire Out
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {active.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-blue-400 tracking-wider uppercase mb-3">
            Active ({active.length})
          </h3>
          <div className="space-y-3">
            {active.map((req) => (
              <div key={req.id} className="bg-charcoal/50 border border-white/5 rounded-xl p-5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-warm-white">{req.title}</h4>
                  <p className="text-xs text-soft mt-1">
                    {req.client?.first_name} {req.client?.last_name}
                    {req.hired_out && req.hired_out_cost && ` — Hired out: $${req.hired_out_cost.toFixed(2)}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[req.status]}`}>
                    {req.status === 'hired_out' ? 'Hired Out' : 'Accepted'}
                  </span>
                  <button onClick={() => handleComplete(req.id)} className="text-xs text-green-400 hover:text-green-300 cursor-pointer">
                    Mark Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-soft tracking-wider uppercase mb-3">
            History ({history.length})
          </h3>
          <div className="space-y-2">
            {history.map((req) => (
              <div key={req.id} className="bg-charcoal/30 border border-white/5 rounded-xl p-4 flex items-center justify-between opacity-70">
                <div>
                  <h4 className="text-sm text-warm-white">{req.title}</h4>
                  <p className="text-xs text-soft">{req.client?.first_name} — {new Date(req.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[req.status]}`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {requests.length === 0 && (
        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-8 text-center text-muted text-sm">
          No task requests yet. Your clients will send requests through their portal.
        </div>
      )}
    </div>
  )
}
