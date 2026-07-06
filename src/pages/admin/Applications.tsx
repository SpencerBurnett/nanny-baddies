import { useEffect, useState } from 'react'
import { useAuth } from '../../lib/auth'
import * as api from '../../lib/api'
import type { Application } from '../../types'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  reviewed: 'bg-blue-500/20 text-blue-400',
  accepted: 'bg-green-500/20 text-green-400',
  rejected: 'bg-red-500/20 text-red-400',
}

export default function AdminApplications() {
  const { profile } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [filter, setFilter] = useState<'all' | 'client' | 'baddie'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    const filters = filter === 'all' ? undefined : { type: filter as 'client' | 'baddie' }
    api.getApplications(filters).then(setApplications)
  }, [filter])

  const handleAction = async (id: string, status: 'accepted' | 'rejected') => {
    await api.updateApplication(id, { status, reviewed_by: profile?.id })
    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status } : a))
  }

  // Client vetting gate: approving a client application vets their profile
  // (if one exists yet) and queues their in-person orientation.
  const handleApproveClient = async (app: Application) => {
    await api.updateApplication(app.id, { status: 'accepted', reviewed_by: profile?.id })
    const existing = await api.getProfileByEmail(app.email)
    if (existing) {
      await api.updateProfile(existing.id, { status: 'vetted' })
      await api.createOrientation({ client_id: existing.id, status: 'requested', created_by: profile?.id })
    }
    setApplications((prev) => prev.map((a) => a.id === app.id ? { ...a, status: 'accepted' } : a))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-semibold text-warm-white">Applications</h1>
          <p className="text-muted text-sm mt-1">Review and manage incoming applications.</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'client', 'baddie'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                filter === f ? 'bg-gold text-midnight font-medium' : 'bg-charcoal text-muted hover:text-warm-white'
              }`}
            >
              {f === 'all' ? 'All' : f === 'client' ? 'Clients' : 'Baddies'}
            </button>
          ))}
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-8 text-center text-muted text-sm">
          No applications found.
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app.id} className="bg-charcoal/50 border border-white/5 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`px-2.5 py-1 rounded text-xs font-medium ${
                    app.type === 'client' ? 'bg-gold/20 text-gold' : 'bg-purple-500/20 text-purple-400'
                  }`}>
                    {app.type}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-warm-white">{app.first_name} {app.last_name}</p>
                    <p className="text-xs text-muted">{app.email} · {app.created_at.split('T')[0]}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                  {app.status}
                </span>
              </button>

              {expanded === app.id && (
                <div className="px-5 pb-5 border-t border-white/5 pt-5">
                  <div className="bg-slate-dark/30 rounded-lg p-4 mb-4">
                    <pre className="text-xs text-muted whitespace-pre-wrap overflow-auto max-h-64">
                      {JSON.stringify(app.data, null, 2)}
                    </pre>
                  </div>

                  {app.status === 'pending' && (
                    <div className="flex gap-3">
                      {app.type === 'client' ? (
                        <button
                          onClick={() => handleApproveClient(app)}
                          className="px-5 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/30 transition-all cursor-pointer"
                        >
                          Approve → Orientation
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAction(app.id, 'accepted')}
                          className="px-5 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/30 transition-all cursor-pointer"
                        >
                          Accept
                        </button>
                      )}
                      <button
                        onClick={() => handleAction(app.id, 'rejected')}
                        className="px-5 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-all cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {app.type === 'client' && app.status === 'accepted' && (
                    <p className="mt-3 text-xs text-soft">
                      Vetted. Their orientation is queued — schedule it under Orientations.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
