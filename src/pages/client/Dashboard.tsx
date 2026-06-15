import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, CheckSquare, MessageSquare } from 'lucide-react'
import { useAuth } from '../../lib/auth'
import * as api from '../../lib/api'
import type { Shift, Match } from '../../types'

export default function ClientDashboard() {
  const { profile } = useAuth()
  const [nextShift, setNextShift] = useState<Shift | null>(null)
  const [match, setMatch] = useState<Match | null>(null)

  useEffect(() => {
    if (!profile) return
    api.getShifts({ client_id: profile.id, from: new Date().toISOString().split('T')[0] })
      .then((shifts) => setNextShift(shifts[0] ?? null))
    api.getMatches({ client_id: profile.id, status: 'active' })
      .then((matches) => setMatch(matches[0] ?? null))
  }, [profile])

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-warm-white mb-2">
        Welcome back, {profile?.first_name}
      </h1>
      <p className="text-muted mb-10">Here is your dashboard.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Link to="/portal/schedule" className="bg-charcoal/50 border border-white/5 rounded-xl p-5 hover:border-gold/20 transition-all">
          <Calendar className="w-5 h-5 text-gold mb-3" />
          <h3 className="text-sm font-medium text-warm-white">Next Shift</h3>
          <p className="text-xs text-muted mt-1">
            {nextShift ? `${nextShift.scheduled_date} at ${nextShift.start_time}` : 'None scheduled'}
          </p>
        </Link>

        <Link to="/portal/profile" className="bg-charcoal/50 border border-white/5 rounded-xl p-5 hover:border-gold/20 transition-all">
          <User className="w-5 h-5 text-gold mb-3" />
          <h3 className="text-sm font-medium text-warm-white">Your Baddie</h3>
          <p className="text-xs text-muted mt-1">
            {match?.baddie ? `${match.baddie.first_name} ${match.baddie.last_name}` : 'Matching in progress'}
          </p>
        </Link>

        <Link to="/portal/checklist" className="bg-charcoal/50 border border-white/5 rounded-xl p-5 hover:border-gold/20 transition-all">
          <CheckSquare className="w-5 h-5 text-gold mb-3" />
          <h3 className="text-sm font-medium text-warm-white">Checklist</h3>
          <p className="text-xs text-muted mt-1">Edit your service preferences</p>
        </Link>

        <Link to="/portal/messages" className="bg-charcoal/50 border border-white/5 rounded-xl p-5 hover:border-gold/20 transition-all">
          <MessageSquare className="w-5 h-5 text-gold mb-3" />
          <h3 className="text-sm font-medium text-warm-white">Messages</h3>
          <p className="text-xs text-muted mt-1">Chat with your Baddie</p>
        </Link>
      </div>

      {profile?.status === 'enrolled' && (
        <div className="bg-gold/10 border border-gold/20 rounded-xl p-6">
          <h3 className="text-base font-semibold text-gold mb-2">Complete your profile</h3>
          <p className="text-sm text-muted mb-4">
            The more we know about you, the better your Nanny Baddie serves you. Fill out your full profile so she arrives ready.
          </p>
          <Link
            to="/portal/profile"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold text-midnight text-sm font-medium rounded-lg hover:bg-gold-light transition-all"
          >
            Complete Profile
          </Link>
        </div>
      )}
    </div>
  )
}
