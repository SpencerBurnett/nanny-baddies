import { useEffect, useState } from 'react'
import * as api from '../../lib/api'
import type { Profile } from '../../types'

const stages = ['applicant', 'bootcamp', 'active', 'inactive'] as const
const stageColors: Record<string, string> = {
  applicant: 'border-l-blue-400',
  bootcamp: 'border-l-yellow-400',
  active: 'border-l-green-400',
  inactive: 'border-l-red-400',
}

export default function BaddiePipeline() {
  const [baddies, setBaddies] = useState<Profile[]>([])

  useEffect(() => {
    api.getProfiles({ role: 'baddie' }).then(setBaddies)
  }, [])

  const handleStatusChange = async (id: string, status: string) => {
    await api.updateProfile(id, { status: status as Profile['status'] })
    setBaddies((prev) => prev.map((b) => b.id === id ? { ...b, status: status as Profile['status'] } : b))
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-warm-white mb-2">Baddie Pipeline</h1>
      <p className="text-muted text-sm mb-8">Manage your worker lifecycle.</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stages.map((stage) => {
          const stageBaddies = baddies.filter((b) => b.status === stage)
          return (
            <div key={stage}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-warm-white capitalize">{stage}</h3>
                <span className="text-xs text-muted bg-white/5 px-2 py-0.5 rounded">{stageBaddies.length}</span>
              </div>
              <div className="space-y-2 min-h-[200px]">
                {stageBaddies.map((baddie) => (
                  <div
                    key={baddie.id}
                    className={`bg-charcoal/50 border border-white/5 border-l-2 ${stageColors[stage]} rounded-lg p-3`}
                  >
                    <p className="text-sm font-medium text-warm-white">
                      {baddie.first_name} {baddie.last_name}
                    </p>
                    <p className="text-xs text-muted mt-0.5">{baddie.email}</p>
                    <select
                      value={baddie.status}
                      onChange={(e) => handleStatusChange(baddie.id, e.target.value)}
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
