import { useEffect, useState } from 'react'
import { useAuth } from '../../lib/auth'
import * as api from '../../lib/api'
import type { ClientProfile as ClientProfileType } from '../../types'

const inputClass = 'w-full bg-slate-dark/50 border border-white/10 rounded-lg px-4 py-3 text-warm-white text-sm placeholder-soft focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-colors'
const selectClass = inputClass

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-warm-white mb-2">{label}</label>
      {children}
    </div>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h3 className="text-gold text-xs font-semibold tracking-[0.15em] uppercase mt-10 mb-4 first:mt-0">
      {title}
    </h3>
  )
}

type Fields = Omit<ClientProfileType, 'id' | 'profile_id' | 'created_at' | 'updated_at'>

const empty: Fields = {
  age: null, neighborhood: null, coffee_order: null, water_preference: null,
  allergies: null, snack_preferences: null, condiments: null, cannabis: null,
  supplement_schedule: null, conversation_preference: null, home_type: null,
  bed_making_standard: null, preferred_drinkware: null, temperature_preference: null,
  scent_preference: null, music_preference: null, has_pets: false, pet_details: null,
  has_plants: false, plant_details: null, additional_notes: null,
  preferred_name: null, preferred_title: null,
}

export default function ClientProfile() {
  const { profile } = useAuth()
  const [form, setForm] = useState<Fields>(empty)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!profile) return
    api.getClientProfile(profile.id).then((cp) => {
      if (cp) {
        const { id: _, profile_id: __, created_at: ___, updated_at: ____, ...fields } = cp
        setForm(fields)
      }
    })
  }, [profile])

  const update = (field: keyof Fields, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    await api.upsertClientProfile(profile.id, form)
    setSaving(false)
    setSaved(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-semibold text-warm-white">Your Profile</h1>
          <p className="text-muted text-sm mt-1">The more detail, the better she serves you.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-gold text-midnight font-medium text-sm rounded-lg hover:bg-gold-light transition-all disabled:opacity-50 cursor-pointer"
        >
          {saving ? 'Saving...' : saved ? 'Saved' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-charcoal/50 border border-white/5 rounded-xl p-6 md:p-8 space-y-5">
        <SectionTitle title="Beverages" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="How do you take your coffee?">
            <input type="text" className={inputClass} value={form.coffee_order ?? ''} onChange={(e) => update('coffee_order', e.target.value)} placeholder="Black, two sugars, oat milk latte..." />
          </Field>
          <Field label="Water preference">
            <input type="text" className={inputClass} value={form.water_preference ?? ''} onChange={(e) => update('water_preference', e.target.value)} placeholder="Room temp, no ice, Yeti tumbler..." />
          </Field>
        </div>

        <SectionTitle title="Food" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Allergies or dietary restrictions">
            <input type="text" className={inputClass} value={form.allergies ?? ''} onChange={(e) => update('allergies', e.target.value)} placeholder="Nuts, gluten, none..." />
          </Field>
          <Field label="Snack preferences">
            <input type="text" className={inputClass} value={form.snack_preferences ?? ''} onChange={(e) => update('snack_preferences', e.target.value)} placeholder="Protein bars, fruit, chips..." />
          </Field>
          <Field label="Condiment preferences">
            <input type="text" className={inputClass} value={form.condiments ?? ''} onChange={(e) => update('condiments', e.target.value)} placeholder="Mustard on sandwiches, hot sauce..." />
          </Field>
        </div>

        <SectionTitle title="Lifestyle" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Cannabis?">
            <select className={selectClass} value={form.cannabis ?? ''} onChange={(e) => update('cannabis', e.target.value || null)}>
              <option value="">Select...</option>
              <option value="yes-roll">Yes — roll for me</option>
              <option value="yes-no-roll">Yes — I handle my own</option>
              <option value="no">No</option>
            </select>
          </Field>
          <Field label="Supplement schedule">
            <input type="text" className={inputClass} value={form.supplement_schedule ?? ''} onChange={(e) => update('supplement_schedule', e.target.value)} placeholder="Vitamin D AM, magnesium PM..." />
          </Field>
          <Field label="Conversation preference">
            <select className={selectClass} value={form.conversation_preference ?? ''} onChange={(e) => update('conversation_preference', e.target.value || null)}>
              <option value="">Select...</option>
              <option value="quiet">Quiet — she works, I do my thing</option>
              <option value="light">Light conversation</option>
              <option value="social">Social — I enjoy the company</option>
            </select>
          </Field>
        </div>

        <SectionTitle title="Home" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Home type">
            <select className={selectClass} value={form.home_type ?? ''} onChange={(e) => update('home_type', e.target.value || null)}>
              <option value="">Select...</option>
              <option value="house">House</option>
              <option value="condo">Condo / Townhome</option>
              <option value="apartment">Apartment</option>
              <option value="penthouse">Penthouse / Loft</option>
            </select>
          </Field>
          <Field label="Bed-making standard">
            <input type="text" className={inputClass} value={form.bed_making_standard ?? ''} onChange={(e) => update('bed_making_standard', e.target.value)} placeholder="Hospital corners, comforter pulled up..." />
          </Field>
          <Field label="Preferred drinkware">
            <input type="text" className={inputClass} value={form.preferred_drinkware ?? ''} onChange={(e) => update('preferred_drinkware', e.target.value)} placeholder="Yeti mug for coffee, glass for water..." />
          </Field>
          <Field label="Temperature preference">
            <input type="text" className={inputClass} value={form.temperature_preference ?? ''} onChange={(e) => update('temperature_preference', e.target.value)} placeholder="72F, windows cracked..." />
          </Field>
          <Field label="Scent preference">
            <input type="text" className={inputClass} value={form.scent_preference ?? ''} onChange={(e) => update('scent_preference', e.target.value)} placeholder="Cedar candle, no fragrance..." />
          </Field>
          <Field label="Music preference">
            <input type="text" className={inputClass} value={form.music_preference ?? ''} onChange={(e) => update('music_preference', e.target.value)} placeholder="Lo-fi, jazz, silence..." />
          </Field>
        </div>

        <SectionTitle title="Pets & Plants" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Do you have pets?">
            <select className={selectClass} value={form.has_pets ? 'yes' : 'no'} onChange={(e) => update('has_pets', e.target.value === 'yes')}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </Field>
          {form.has_pets && (
            <Field label="Pet details (names, feeding, walk schedule)">
              <textarea className={inputClass} rows={3} value={form.pet_details ?? ''} onChange={(e) => update('pet_details', e.target.value)} />
            </Field>
          )}
          <Field label="Indoor plants or garden?">
            <select className={selectClass} value={form.has_plants ? 'yes' : 'no'} onChange={(e) => update('has_plants', e.target.value === 'yes')}>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </Field>
          {form.has_plants && (
            <Field label="Plant / garden details">
              <textarea className={inputClass} rows={3} value={form.plant_details ?? ''} onChange={(e) => update('plant_details', e.target.value)} />
            </Field>
          )}
        </div>

        <SectionTitle title="Additional Notes" />
        <Field label="Anything else we should know?">
          <textarea className={inputClass} rows={4} value={form.additional_notes ?? ''} onChange={(e) => update('additional_notes', e.target.value)} placeholder="Travel schedule, work-from-home days, preferences..." />
        </Field>
      </div>
    </div>
  )
}
