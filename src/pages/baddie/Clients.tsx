import { useEffect, useState } from 'react'
import { useAuth } from '../../lib/auth'
import * as api from '../../lib/api'
import type { Match, ClientProfile } from '../../types'
import { User, ChevronDown, ChevronUp } from 'lucide-react'

export default function BaddieClients() {
  const { profile } = useAuth()
  const [matches, setMatches] = useState<Match[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [clientProfiles, setClientProfiles] = useState<Record<string, ClientProfile>>({})

  useEffect(() => {
    if (!profile) return
    api.getMatches({ baddie_id: profile.id, status: 'active' }).then(setMatches)
  }, [profile])

  const toggleExpand = async (clientId: string) => {
    if (expanded === clientId) {
      setExpanded(null)
      return
    }
    setExpanded(clientId)
    if (!clientProfiles[clientId]) {
      const cp = await api.getClientProfile(clientId)
      if (cp) setClientProfiles((prev) => ({ ...prev, [clientId]: cp }))
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold text-warm-white mb-2">My Clients</h1>
      <p className="text-muted text-sm mb-8">Study their profiles before every shift.</p>

      {matches.length === 0 ? (
        <div className="bg-charcoal/50 border border-white/5 rounded-xl p-12 text-center">
          <User className="w-10 h-10 text-soft mx-auto mb-4" />
          <h3 className="text-base font-medium text-warm-white mb-2">No clients assigned yet</h3>
          <p className="text-sm text-muted">Clients will appear here once admin matches you.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => {
            const client = match.client
            if (!client) return null
            const isOpen = expanded === client.id
            const cp = clientProfiles[client.id]

            return (
              <div key={match.id} className="bg-charcoal/50 border border-white/5 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleExpand(client.id)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold text-sm font-semibold">
                      {client.first_name[0]}{client.last_name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-warm-white">{client.first_name} {client.last_name}</p>
                      <p className="text-xs text-muted">Matched {match.started_at?.split('T')[0]}</p>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
                </button>

                {isOpen && cp && (
                  <div className="px-5 pb-5 border-t border-white/5 pt-5">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      {cp.coffee_order && <ProfileField label="Coffee" value={cp.coffee_order} />}
                      {cp.water_preference && <ProfileField label="Water" value={cp.water_preference} />}
                      {cp.allergies && <ProfileField label="Allergies" value={cp.allergies} />}
                      {cp.snack_preferences && <ProfileField label="Snacks" value={cp.snack_preferences} />}
                      {cp.condiments && <ProfileField label="Condiments" value={cp.condiments} />}
                      {cp.cannabis && <ProfileField label="Cannabis" value={cp.cannabis} />}
                      {cp.supplement_schedule && <ProfileField label="Supplements" value={cp.supplement_schedule} />}
                      {cp.conversation_preference && <ProfileField label="Conversation" value={cp.conversation_preference} />}
                      {cp.home_type && <ProfileField label="Home" value={cp.home_type} />}
                      {cp.bed_making_standard && <ProfileField label="Bed standard" value={cp.bed_making_standard} />}
                      {cp.preferred_drinkware && <ProfileField label="Drinkware" value={cp.preferred_drinkware} />}
                      {cp.temperature_preference && <ProfileField label="Temperature" value={cp.temperature_preference} />}
                      {cp.scent_preference && <ProfileField label="Scent" value={cp.scent_preference} />}
                      {cp.music_preference && <ProfileField label="Music" value={cp.music_preference} />}
                      {cp.pet_details && <ProfileField label="Pets" value={cp.pet_details} />}
                      {cp.plant_details && <ProfileField label="Plants" value={cp.plant_details} />}
                    </div>
                    {cp.additional_notes && (
                      <div className="mt-4 bg-slate-dark/30 rounded-lg p-4">
                        <p className="text-xs text-gold mb-1 font-semibold">Notes</p>
                        <p className="text-sm text-muted">{cp.additional_notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gold/60 mb-0.5">{label}</p>
      <p className="text-muted">{value}</p>
    </div>
  )
}
