import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import * as api from '../lib/api'
import type { Tier } from '../types'

const fallbackTiers: Tier[] = [
  {
    id: '1',
    slug: 'standard',
    name: 'Standard',
    shifts_per_week: 1,
    monthly_price: 1200,
    stripe_price_id: '',
    features: ['1 shift per week (4 hours)', 'Personalized checklist', 'Dedicated Nanny Baddie', 'Full client profile', 'In-app messaging'],
    created_at: '',
  },
  {
    id: '2',
    slug: 'premium',
    name: 'Premium',
    shifts_per_week: 2,
    monthly_price: 2400,
    stripe_price_id: '',
    features: ['2 shifts per week (4 hours each)', 'Personalized checklist', 'Dedicated Nanny Baddie', 'Full client profile', 'In-app messaging', 'Priority scheduling', 'House sitting access'],
    created_at: '',
  },
  {
    id: '3',
    slug: 'elite',
    name: 'Elite',
    shifts_per_week: 3,
    monthly_price: 3600,
    stripe_price_id: '',
    features: ['3 shifts per week (4 hours each)', 'Personalized checklist', 'Dedicated Nanny Baddie', 'Full client profile', 'In-app messaging', 'Priority scheduling', 'House sitting access', 'Event production included', 'Travel coverage'],
    created_at: '',
  },
]

export default function Enrollment() {
  const [searchParams] = useSearchParams()
  const preselected = searchParams.get('tier')
  const [tiers, setTiers] = useState<Tier[]>(fallbackTiers)
  const [selected, setSelected] = useState<string>(preselected || 'premium')

  useEffect(() => {
    api.getTiers().then((data) => {
      if (data.length > 0) setTiers(data)
    })
  }, [])

  const handleCheckout = () => {
    const tier = tiers.find((t) => t.slug === selected)
    if (!tier?.stripe_price_id) {
      alert('Stripe integration pending — checkout will be connected once Stripe products are created.')
      return
    }
    // In production: call api.createCheckoutSession(tier.slug)
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
            90-day commitment. 4-hour shifts. $75/hour. Cancel after any cycle.
          </p>
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

              <div className="mt-6 mb-6">
                <span className="text-4xl font-display font-semibold text-warm-white">
                  ${tier.monthly_price.toLocaleString()}
                </span>
                <span className="text-muted text-sm">/month</span>
              </div>

              <ul className="space-y-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted">
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 ${selected === tier.slug ? 'text-gold' : 'text-soft'}`} />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Selection indicator */}
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
            className="inline-flex items-center gap-2 px-10 py-4.5 bg-gold text-midnight font-medium text-lg rounded-xl hover:bg-gold-light transition-all shadow-lg shadow-gold/20 cursor-pointer"
          >
            Continue to Checkout <ArrowRight className="w-5 h-5" />
          </button>
          <p className="mt-4 text-xs text-soft">
            90-day cycle billed monthly. You can adjust or cancel at the end of any cycle.
          </p>
        </div>
      </div>
    </div>
  )
}
