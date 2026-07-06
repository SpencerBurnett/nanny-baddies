import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Sparkles } from 'lucide-react'
import * as api from '../lib/api'
import { startCheckout } from '../lib/stripe'
import type { Tier } from '../types'

const fallbackTiers: Tier[] = [
  {
    id: '1',
    slug: 'standard',
    name: 'Standard',
    shifts_per_week: 1,
    quarterly_price: 3600,
    stripe_price_id: '',
    features: ['1 shift per week (4 hours)', 'Personalized checklist', 'Dedicated Nanny Baddie', 'Full client profile', 'In-app messaging'],
    created_at: '',
  },
  {
    id: '2',
    slug: 'premium',
    name: 'Premium',
    shifts_per_week: 2,
    quarterly_price: 7200,
    stripe_price_id: '',
    features: ['2 shifts per week (4 hours each)', 'Personalized checklist', 'Dedicated Nanny Baddie', 'Full client profile', 'In-app messaging', 'Priority scheduling', 'Home inventory management'],
    created_at: '',
  },
  {
    id: '3',
    slug: 'elite',
    name: 'Elite',
    shifts_per_week: 3,
    quarterly_price: 10800,
    stripe_price_id: '',
    features: ['3 shifts per week (4 hours each)', 'Personalized checklist', 'Dedicated Nanny Baddie', 'Full client profile', 'In-app messaging', 'Priority scheduling', 'Home inventory management', 'Event production included', 'Travel coverage'],
    created_at: '',
  },
]

export default function Enrollment() {
  const [searchParams] = useSearchParams()
  const preselected = searchParams.get('tier')
  const [tiers, setTiers] = useState<Tier[]>(fallbackTiers)
  const [selected, setSelected] = useState<string>(preselected || 'premium')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    api.getTiers().then((data) => {
      if (data.length > 0) setTiers(data)
    })
  }, [])

  const handleCheckout = async () => {
    setBusy(true)
    setNotice(null)
    const tier = tiers.find((t) => t.slug === selected)
    const { url } = await startCheckout({ tierSlug: tier?.slug })
    if (url) { window.location.href = url; return }
    setNotice('Checkout is being connected — Stripe products are still being set up. Hang tight.')
    setBusy(false)
  }

  const handleTrialCheckout = async () => {
    setBusy(true)
    setNotice(null)
    const { url } = await startCheckout({ trial: true })
    if (url) { window.location.href = url; return }
    setNotice('The $2,000 paid trial checkout is being connected. Check back shortly.')
    setBusy(false)
  }

  return (
    <div className="pt-20 min-h-screen bg-midnight">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-gold text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Enroll
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-medium text-warm-white">
            Choose your membership
          </h1>
          <p className="mt-4 text-muted max-w-lg mx-auto">
            90-day commitment. 4-hour shifts. $75/hour. Billed quarterly.
          </p>
        </motion.div>

        {/* Paid Trial CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/20 rounded-2xl p-6 md:p-8 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-gold" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-warm-white">Experience it first</h3>
              <p className="text-sm text-muted mt-1 max-w-md">
                3 orientation meetings + 1 full day of service. See the magic before you commit to a quarterly membership.
              </p>
            </div>
          </div>
          <button
            onClick={handleTrialCheckout}
            disabled={busy}
            className="shrink-0 px-6 py-3 bg-gold/20 text-gold border border-gold/30 font-medium text-sm rounded-xl hover:bg-gold/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Paid Trial — $2,000
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {tiers.map((tier) => (
            <motion.button
              key={tier.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setSelected(tier.slug)}
              className={`relative text-left rounded-2xl p-8 border transition-all duration-300 cursor-pointer ${
                selected === tier.slug
                  ? 'bg-gradient-to-b from-gold/10 to-charcoal border-gold/40 shadow-xl shadow-gold/5'
                  : 'bg-slate-dark/50 border-white/5 hover:border-white/10'
              }`}
            >
              {tier.slug === 'premium' && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-midnight text-xs font-bold tracking-wider uppercase px-4 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <h3 className="text-lg font-semibold text-warm-white">{tier.name}</h3>
              <p className="text-sm text-muted mt-1">{tier.shifts_per_week}x / week</p>

              <div className="mt-6 mb-1">
                <span className="text-4xl font-display font-semibold text-warm-white">
                  ${(tier.quarterly_price ?? 0).toLocaleString()}
                </span>
                <span className="text-muted text-sm">/quarter</span>
              </div>
              <p className="text-xs text-soft mb-6">
                ${Math.round((tier.quarterly_price ?? 0) / 3).toLocaleString()}/mo equivalent
              </p>

              <ul className="space-y-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted">
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 ${selected === tier.slug ? 'text-gold' : 'text-soft'}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <div className={`mt-6 flex items-center justify-center py-2.5 rounded-lg border text-sm font-medium transition-all ${
                selected === tier.slug
                  ? 'bg-gold text-midnight border-gold'
                  : 'border-white/10 text-muted'
              }`}>
                {selected === tier.slug ? 'Selected' : 'Select'}
              </div>
            </motion.button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleCheckout}
            disabled={busy}
            className="inline-flex items-center gap-2 px-10 py-4.5 bg-gold text-midnight font-medium text-lg rounded-xl hover:bg-gold-light transition-all shadow-lg shadow-gold/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? 'Connecting…' : <>Continue to Checkout <ArrowRight className="w-5 h-5" /></>}
          </button>
          {notice && (
            <p className="mt-4 text-xs text-gold/80 max-w-md mx-auto">{notice}</p>
          )}
          <p className="mt-4 text-xs text-soft">
            90-day cycle billed quarterly. Cancel at the end of any cycle with 30-day notice.
          </p>
        </div>
      </div>
    </div>
  )
}
