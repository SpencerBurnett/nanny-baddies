import { useEffect, useState } from 'react'
import { CreditCard, ExternalLink } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import * as api from '../../lib/api'
import type { Subscription } from '../../types'

export default function ClientBilling() {
  const { profile } = useAuth()
  const [sub, setSub] = useState<Subscription | null>(null)

  useEffect(() => {
    if (!profile) return
    api.getSubscription(profile.id).then(setSub)
  }, [profile])

  const statusColors: Record<string, string> = {
    active: 'bg-green-500/20 text-green-400',
    past_due: 'bg-yellow-500/20 text-yellow-400',
    canceled: 'bg-red-500/20 text-red-400',
    paused: 'bg-blue-500/20 text-blue-400',
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-warm-white mb-2">Billing</h1>
      <p className="text-muted text-sm mb-8">Manage your subscription and payments.</p>

      {sub ? (
        <div className="space-y-6">
          <div className="bg-charcoal/50 border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-warm-white">Current Subscription</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[sub.status]}`}>
                {sub.status}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted mb-1">Tier</p>
                <p className="text-sm text-warm-white font-medium">{sub.tier?.name ?? 'Standard'}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Amount</p>
                <p className="text-sm text-warm-white font-medium">${sub.tier?.monthly_price?.toLocaleString()}/mo</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Current Period</p>
                <p className="text-sm text-warm-white font-medium">
                  {sub.current_period_start?.split('T')[0] ?? '—'} to {sub.current_period_end?.split('T')[0] ?? '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Cycle</p>
                <p className="text-sm text-warm-white font-medium">#{sub.cycle_count}</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => alert('Stripe Customer Portal integration pending')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-charcoal border border-white/10 rounded-lg text-sm text-warm-white hover:border-gold/30 transition-all cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            Manage Subscription on Stripe
          </button>
        </div>
      ) : (
        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-12 text-center">
          <CreditCard className="w-10 h-10 text-soft mx-auto mb-4" />
          <h3 className="text-base font-medium text-warm-white mb-2">No active subscription</h3>
          <p className="text-sm text-muted">Your subscription will appear here after enrollment.</p>
        </div>
      )}
    </div>
  )
}
