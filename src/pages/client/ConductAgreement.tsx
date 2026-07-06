import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Check, X } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import * as api from '../../lib/api'
import { DOS, DONTS, APPROVED_NAMES, BANNED_NAMES } from '../../lib/conductRules'
import type { ConductAgreement as ConductAgreementType } from '../../types'

export default function ConductAgreement() {
  const { profile } = useAuth()
  const [agreement, setAgreement] = useState<ConductAgreementType | null>(null)
  const [loading, setLoading] = useState(true)
  const [signing, setSigning] = useState(false)
  const [acknowledged, setAcknowledged] = useState(false)

  useEffect(() => {
    if (!profile) return
    api.getConductAgreement(profile.id).then((data) => {
      setAgreement(data)
      setLoading(false)
    })
  }, [profile])

  const handleSign = async () => {
    if (!profile || !acknowledged) return
    setSigning(true)
    const success = await api.signConductAgreement(profile.id)
    if (success) {
      const refreshed = await api.getConductAgreement(profile.id)
      setAgreement(refreshed)
    }
    setSigning(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (agreement) {
    return (
      <div>
        <h1 className="text-2xl font-display font-semibold text-warm-white mb-2">Conduct Agreement</h1>
        <p className="text-muted text-sm mb-8">Your commitment to a professional experience.</p>

        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-green-400">Agreement signed</p>
            <p className="text-xs text-muted mt-0.5">
              Version {agreement.version} — Signed {new Date(agreement.agreed_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-warm-white mb-2">Conduct Agreement</h1>
      <p className="text-muted text-sm mb-8">Review and accept before your first shift.</p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Shield className="w-5 h-5 text-gold" />
            <h3 className="text-sm font-semibold text-warm-white">Professional Standards</h3>
          </div>
          <p className="text-sm text-muted leading-relaxed mb-5">
            Nanny Baddies maintains strict professional boundaries to protect both clients and staff.
            Your Nanny Baddie wears a recording device during every shift — you are informed and consent
            to this as part of your membership. These rules exist so everyone feels safe, respected,
            and free to do their best work.
          </p>
        </div>

        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-green-400 mb-4">Do&apos;s</h3>
          <ul className="space-y-3">
            {DOS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-muted">
                <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-warm-white mb-4">How you may address her</h3>
          <p className="text-xs text-muted mb-4">
            Pick your preferred name in your profile. These are the only approved address terms —
            the banned list applies no matter what.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-green-400 mb-2 uppercase tracking-wider">Approved</p>
              <div className="flex flex-wrap gap-2">
                {['First name', ...APPROVED_NAMES, 'Agreed nickname'].map((n) => (
                  <span key={n} className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-xs border border-green-500/20">
                    {n}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-red-400 mb-2 uppercase tracking-wider">Banned</p>
              <div className="flex flex-wrap gap-2">
                {BANNED_NAMES.filter((n) => !n.includes(' ') || n === 'pookie bear').map((n) => (
                  <span key={n} className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-xs border border-red-500/20 inline-flex items-center gap-1">
                    <X className="w-3 h-3" />{n}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-red-400 mb-4">Violations — Immediate Consequences</h3>
          <ul className="space-y-3">
            {DONTS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-muted">
                <span className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5 shrink-0">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-white/20 bg-slate-dark/50 text-gold focus:ring-gold/20"
            />
            <span className="text-sm text-muted leading-relaxed">
              I have read, understood, and agree to the Nanny Baddies Conduct Agreement.
              I understand that violations result in immediate removal from the platform
              and potential financial penalties as outlined in the membership contract.
            </span>
          </label>
        </div>

        <button
          onClick={handleSign}
          disabled={!acknowledged || signing}
          className="w-full py-3.5 bg-gold text-midnight font-medium rounded-xl hover:bg-gold-light transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          {signing ? 'Signing…' : 'Sign Agreement'}
        </button>
      </motion.div>
    </div>
  )
}
