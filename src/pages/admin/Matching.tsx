import { useEffect, useState } from 'react'
import { useAuth } from '../../lib/auth'
import * as api from '../../lib/api'
import type { Profile, Match } from '../../types'

export default function AdminMatching() {
  const { profile } = useAuth()
  const [clients, setClients] = useState<Profile[]>([])
  const [baddies, setBaddies] = useState<Profile[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [selectedClient, setSelectedClient] = useState('')
  const [selectedBaddie, setSelectedBaddie] = useState('')

  useEffect(() => {
    Promise.all([
      api.getProfiles({ role: 'client' }),
      api.getProfiles({ role: 'baddie' }),
      api.getMatches(),
    ]).then(([c, b, m]) => {
      setClients(c)
      setBaddies(b)
      setMatches(m)
    })
  }, [])

  const handleCreateMatch = async () => {
    if (!selectedClient || !selectedBaddie || !profile) return
    const id = await api.createMatch(selectedClient, selectedBaddie, profile.id)
    if (id) {
      const refreshed = await api.getMatches()
      setMatches(refreshed)
      setSelectedClient('')
      setSelectedBaddie('')
    }
  }

  const handleUpdateStatus = async (id: string, status: Match['status']) => {
    await api.updateMatch(id, { status })
    setMatches((prev) => prev.map((m) => m.id === id ? { ...m, status } : m))
  }

  const getName = (id: string, list: Profile[]) => {
    const p = list.find((x) => x.id === id)
    return p ? `${p.first_name} ${p.last_name}` : 'Unknown'
  }

  const statusColors: Record<string, string> = {
    active: 'bg-green-500/20 text-green-400',
    paused: 'bg-yellow-500/20 text-yellow-400',
    ended: 'bg-red-500/20 text-red-400',
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-warm-white mb-2">Client–Baddie Matching</h1>
      <p className="text-muted text-sm mb-8">Assign baddies to clients.</p>

      <div className="bg-charcoal/50 border border-white/5 rounded-xl p-6 mb-8">
        <h3 className="text-sm font-semibold text-warm-white mb-4">Create New Match</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="bg-slate-dark/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-warm-white"
          >
            <option value="">Select client…</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
            ))}
          </select>

          <select
            value={selectedBaddie}
            onChange={(e) => setSelectedBaddie(e.target.value)}
            className="bg-slate-dark/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-warm-white"
          >
            <option value="">Select baddie…</option>
            {baddies.map((b) => (
              <option key={b.id} value={b.id}>{b.first_name} {b.last_name}</option>
            ))}
          </select>

          <button
            onClick={handleCreateMatch}
            disabled={!selectedClient || !selectedBaddie}
            className="bg-gold text-midnight font-medium rounded-lg px-6 py-3 text-sm hover:bg-gold/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            Create Match
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {matches.map((match) => (
          <div key={match.id} className="bg-charcoal/50 border border-white/5 rounded-xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-muted mb-0.5">Client</p>
                <p className="text-sm font-medium text-warm-white">{getName(match.client_id, clients)}</p>
              </div>
              <span className="text-muted">→</span>
              <div>
                <p className="text-xs text-muted mb-0.5">Baddie</p>
                <p className="text-sm font-medium text-warm-white">{getName(match.baddie_id, baddies)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[match.status]}`}>
                {match.status}
              </span>
              {match.status === 'active' && (
                <button
                  onClick={() => handleUpdateStatus(match.id, 'ended')}
                  className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
                >
                  End
                </button>
              )}
              {match.status === 'paused' && (
                <button
                  onClick={() => handleUpdateStatus(match.id, 'active')}
                  className="text-xs text-green-400 hover:text-green-300 cursor-pointer"
                >
                  Activate
                </button>
              )}
            </div>
          </div>
        ))}
        {matches.length === 0 && (
          <div className="bg-charcoal/50 border border-white/5 rounded-xl p-8 text-center text-muted text-sm">
            No matches created yet.
          </div>
        )}
      </div>
    </div>
  )
}
