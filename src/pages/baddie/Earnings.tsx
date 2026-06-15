import { useEffect, useState } from 'react'
import { DollarSign, Clock, CheckCircle } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import * as api from '../../lib/api'
import type { Earning } from '../../types'

export default function BaddieEarnings() {
  const { profile } = useAuth()
  const [earnings, setEarnings] = useState<Earning[]>([])

  useEffect(() => {
    if (!profile) return
    api.getEarnings(profile.id).then(setEarnings)
  }, [profile])

  const total = earnings.reduce((sum, e) => sum + e.amount, 0)
  const pending = earnings.filter((e) => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0)
  const paid = earnings.filter((e) => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0)
  const totalHours = earnings.reduce((sum, e) => sum + e.hours, 0)

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-warm-white mb-2">Earnings</h1>
      <p className="text-muted text-sm mb-8">Track your income and payouts.</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-5">
          <DollarSign className="w-5 h-5 text-gold mb-2" />
          <p className="text-2xl font-display font-semibold text-warm-white">${total.toLocaleString()}</p>
          <p className="text-xs text-muted mt-1">Total earned</p>
        </div>
        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-5">
          <Clock className="w-5 h-5 text-yellow-400 mb-2" />
          <p className="text-2xl font-display font-semibold text-warm-white">${pending.toLocaleString()}</p>
          <p className="text-xs text-muted mt-1">Pending</p>
        </div>
        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-5">
          <CheckCircle className="w-5 h-5 text-green-400 mb-2" />
          <p className="text-2xl font-display font-semibold text-warm-white">${paid.toLocaleString()}</p>
          <p className="text-xs text-muted mt-1">Paid out</p>
        </div>
        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-5">
          <Clock className="w-5 h-5 text-blue-400 mb-2" />
          <p className="text-2xl font-display font-semibold text-warm-white">{totalHours}</p>
          <p className="text-xs text-muted mt-1">Hours worked</p>
        </div>
      </div>

      <h2 className="text-sm font-semibold text-gold tracking-wide uppercase mb-4">History</h2>
      {earnings.length === 0 ? (
        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-8 text-center text-muted text-sm">
          No earnings yet. Earnings appear after your first completed shift.
        </div>
      ) : (
        <div className="bg-charcoal/50 border border-white/5 rounded-xl overflow-hidden">
          <div className="grid grid-cols-5 gap-px bg-white/5">
            <div className="bg-charcoal p-4 text-xs font-semibold text-muted uppercase">Date</div>
            <div className="bg-charcoal p-4 text-xs font-semibold text-muted uppercase">Hours</div>
            <div className="bg-charcoal p-4 text-xs font-semibold text-muted uppercase">Rate</div>
            <div className="bg-charcoal p-4 text-xs font-semibold text-muted uppercase">Amount</div>
            <div className="bg-charcoal p-4 text-xs font-semibold text-muted uppercase">Status</div>
          </div>
          {earnings.map((e) => (
            <div key={e.id} className="grid grid-cols-5 gap-px bg-white/5">
              <div className="bg-slate-dark/30 p-4 text-sm text-muted">{e.created_at.split('T')[0]}</div>
              <div className="bg-slate-dark/30 p-4 text-sm text-warm-white">{e.hours}h</div>
              <div className="bg-slate-dark/30 p-4 text-sm text-muted">${e.rate}/hr</div>
              <div className="bg-slate-dark/30 p-4 text-sm text-warm-white font-medium">${e.amount}</div>
              <div className="bg-slate-dark/30 p-4">
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  e.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                  e.status === 'approved' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>{e.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
