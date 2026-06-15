import { useEffect, useState } from 'react'
import { DollarSign, TrendingUp, Users, AlertCircle } from 'lucide-react'
import * as api from '../../lib/api'
import type { Subscription } from '../../types'

export default function AdminPayments() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])

  useEffect(() => {
    api.getSubscriptions().then(setSubscriptions)
  }, [])

  const active = subscriptions.filter((s) => s.status === 'active')
  const pastDue = subscriptions.filter((s) => s.status === 'past_due')

  const statusColors: Record<string, string> = {
    active: 'bg-green-500/20 text-green-400',
    past_due: 'bg-red-500/20 text-red-400',
    canceled: 'bg-gray-500/20 text-gray-400',
    paused: 'bg-yellow-500/20 text-yellow-400',
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-warm-white mb-2">Payments</h1>
      <p className="text-muted text-sm mb-8">Subscription overview and revenue tracking.</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-5">
          <DollarSign className="w-5 h-5 text-gold mb-2" />
          <p className="text-2xl font-display font-semibold text-warm-white">${(active.length * 1200).toLocaleString()}</p>
          <p className="text-xs text-muted mt-1">Est. MRR</p>
        </div>
        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-5">
          <TrendingUp className="w-5 h-5 text-green-400 mb-2" />
          <p className="text-2xl font-display font-semibold text-warm-white">{active.length}</p>
          <p className="text-xs text-muted mt-1">Active Subscriptions</p>
        </div>
        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-5">
          <AlertCircle className="w-5 h-5 text-red-400 mb-2" />
          <p className="text-2xl font-display font-semibold text-warm-white">{pastDue.length}</p>
          <p className="text-xs text-muted mt-1">Past Due</p>
        </div>
        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-5">
          <Users className="w-5 h-5 text-blue-400 mb-2" />
          <p className="text-2xl font-display font-semibold text-warm-white">{subscriptions.length}</p>
          <p className="text-xs text-muted mt-1">Total Subscriptions</p>
        </div>
      </div>

      <div className="bg-charcoal/50 border border-white/5 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="text-sm font-semibold text-warm-white">All Subscriptions</h3>
        </div>
        {subscriptions.length === 0 ? (
          <div className="p-8 text-center text-muted text-sm">No subscriptions yet.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-xs text-muted border-b border-white/5">
                <th className="text-left px-6 py-3 font-medium">Client</th>
                <th className="text-left px-6 py-3 font-medium">Tier</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
                <th className="text-left px-6 py-3 font-medium">Current Period</th>
                <th className="text-left px-6 py-3 font-medium">Cycle</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="border-b border-white/5 last:border-0">
                  <td className="px-6 py-4 text-sm text-warm-white">{sub.profile_id.slice(0, 8)}…</td>
                  <td className="px-6 py-4 text-sm text-muted">{sub.tier_id.slice(0, 8)}…</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[sub.status]}`}>
                      {sub.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted">
                    {sub.current_period_start?.split('T')[0]} – {sub.current_period_end?.split('T')[0]}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted">{sub.cycle_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
