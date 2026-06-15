import { useEffect, useState } from 'react'
import * as api from '../../lib/api'
import type { Profile } from '../../types'

const stages = ['lead', 'enrolled', 'active', 'paused', 'churned'] as const
const stageColors: Record<string, string> = {
  lead: 'border-l-blue-400',
  enrolled: 'border-l-yellow-400',
  active: 'border-l-green-400',
  paused: 'border-l-orange-400',
  churned: 'border-l-red-400',
}

export default function ClientPipeline() {
  const [clients, setClients] = useState<Profile[]>([])

  useEffect(() => {
    api.getProfiles({ role: 'client' }).then(setClients)
  }, [])

  const handleStatusChange = async (id: string, status: string) => {
    await api.updateProfile(id, { status: status as Profile['status'] })
    setClients((prev) => prev.map((c) => c.id === id ? { ...c, status: status as Profile['status'] } : c))
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-warm-white mb-2">Client Pipeline</h1>
      <p className="text-muted text-sm mb-8">Manage your client lifecycle.</p>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {stages.map((stage) => {
          const stageClients = clients.filter((c) => c.status === stage)
          return (
            <div key={stage}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-warm-white capitalize">{stage}</h3>
                <span className="text-xs text-muted bg-white/5 px-2 py-0.5 rounded">{stageClients.length}</span>
              </div>
              <div className="space-y-2 min-h-[200px]">
                {stageClients.map((client) => (
                  <div
                    key={client.id}
                    className={`bg-charcoal/50 border border-white/5 border-l-2 ${stageColors[stage]} rounded-lg p-3`}
                  >
                    <p className="text-sm font-medium text-warm-white">
                      {client.first_name} {client.last_name}
                    </p>
                    <p className="text-xs text-muted mt-0.5">{client.email}</p>
                    <select
                      value={client.status}
                      onChange={(e) => handleStatusChange(client.id, e.target.value)}
                      className="mt-2 w-full bg-slate-dark/50 border border-white/5 rounded px-2 py-1 text-xs text-muted"
                    >
                      {stages.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
