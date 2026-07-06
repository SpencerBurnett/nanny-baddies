import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarCheck, MapPin, Clock, Check, Sparkles, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import * as api from '../../lib/api'
import type { Orientation } from '../../types'

const statusCopy: Record<Orientation['status'], { label: string; tone: string }> = {
  requested: { label: 'Requested — we\'ll confirm your time', tone: 'text-yellow-400' },
  scheduled: { label: 'Scheduled', tone: 'text-gold' },
  attended: { label: 'Attended', tone: 'text-green-400' },
  no_show: { label: 'Missed — reach out to rebook', tone: 'text-red-400' },
  canceled: { label: 'Canceled', tone: 'text-soft' },
}

export default function ClientOrientation() {
  const { profile } = useAuth()
  const [orientation, setOrientation] = useState<Orientation | null>(null)
  const [loading, setLoading] = useState(true)
  const [preferredDate, setPreferredDate] = useState('')
  const [booking, setBooking] = useState(false)

  const load = () => {
    if (!profile) return
    api.getOrientations({ client_id: profile.id }).then((list) => {
      const live = list.find((o) => o.status !== 'canceled') ?? null
      setOrientation(live)
      setLoading(false)
    })
  }

  useEffect(load, [profile])

  const handleBook = async () => {
    if (!profile) return
    setBooking(true)
    const id = await api.createOrientation({
      client_id: profile.id,
      scheduled_date: preferredDate || null,
      status: 'requested',
      created_by: profile.id,
    })
    if (id) {
      await api.updateProfile(profile.id, { status: 'orientation_booked' })
      load()
    }
    setBooking(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-warm-white mb-2">In-Person Orientation</h1>
      <p className="text-muted text-sm mb-8">
        Before your first shift you visit the model house — meet the team, see the standard, sign your terms.
      </p>

      {orientation ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="bg-charcoal/50 border border-gold/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <CalendarCheck className="w-5 h-5 text-gold" />
              <span className={`text-sm font-semibold ${statusCopy[orientation.status].tone}`}>
                {statusCopy[orientation.status].label}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <Detail icon={CalendarCheck} label="Date" value={orientation.scheduled_date ?? 'To be confirmed'} />
              <Detail icon={Clock} label="Time" value={orientation.scheduled_time ?? 'To be confirmed'} />
              <Detail icon={MapPin} label="Location" value={orientation.location ?? 'Sent after we confirm'} />
            </div>
            {orientation.notes && (
              <div className="mt-4 bg-slate-dark/30 rounded-lg p-4 text-sm text-muted">{orientation.notes}</div>
            )}
          </div>

          {orientation.status === 'attended' ? (
            <Link
              to="/portal/agreement"
              className="flex items-center justify-between bg-gold/10 border border-gold/20 rounded-xl p-5 hover:bg-gold/15 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-gold" />
                <span className="text-sm text-warm-white font-medium">Next step: sign your conduct agreement</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <p className="text-xs text-soft">
              We confirm every orientation personally. You&apos;ll get your date, time, and the model-house address here.
            </p>
          )}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg">
          <div className="bg-charcoal/50 border border-white/5 rounded-xl p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-gold" />
              </div>
              <p className="text-sm text-muted leading-relaxed">
                Orientations run on Fridays at the model house. It takes about an hour — you see exactly how your
                Nanny Baddie will run your home, then sign your terms.
              </p>
            </div>

            <label className="block text-sm font-medium text-warm-white mb-2">Preferred date</label>
            <input
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              className="w-full bg-slate-dark/50 border border-white/10 rounded-lg px-4 py-3 text-warm-white text-sm focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-colors mb-5"
            />

            <button
              onClick={handleBook}
              disabled={booking}
              className="w-full py-3.5 bg-gold text-midnight font-medium rounded-xl hover:bg-gold-light transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {booking ? 'Requesting…' : 'Request my orientation'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

function Detail({ icon: Icon, label, value }: { icon: React.FC<{ className?: string }>; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-gold/60 mb-1">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <p className="text-warm-white">{value}</p>
    </div>
  )
}
