import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import * as api from '../lib/api'

interface FormData {
  // Step 1: Basics
  firstName: string
  lastName: string
  email: string
  phone: string
  age: string
  neighborhood: string
  preferredName: string
  preferredTitle: string

  // Step 2: Lifestyle
  coffeeOrder: string
  waterPreference: string
  allergies: string
  snackPreferences: string
  condiments: string
  cannabis: string
  supplementSchedule: string
  conversationPreference: string

  // Step 3: Home
  homeType: string
  bedMakingStandard: string
  preferredDrinkware: string
  temperaturePreference: string
  scentPreference: string
  musicPreference: string
  hasPets: string
  petDetails: string
  hasPlants: string
  plantDetails: string

  // Step 4: Services
  frequency: string
  selectedServices: string[]
  additionalNotes: string
}

const initialForm: FormData = {
  firstName: '', lastName: '', email: '', phone: '', age: '', neighborhood: '',
  preferredName: '', preferredTitle: '',
  coffeeOrder: '', waterPreference: '', allergies: '', snackPreferences: '',
  condiments: '', cannabis: '', supplementSchedule: '', conversationPreference: '',
  homeType: '', bedMakingStandard: '', preferredDrinkware: '', temperaturePreference: '',
  scentPreference: '', musicPreference: '', hasPets: '', petDetails: '',
  hasPlants: '', plantDetails: '',
  frequency: '', selectedServices: [], additionalNotes: '',
}

const serviceOptions = [
  'Home Reset', 'Deep Cleaning', 'Laundry', 'Kitchen & Food',
  'Groceries & Inventory', 'Lifestyle', 'Pets', 'Plants & Garden',
  'Travel & Bags', 'Organization', 'Errands', 'Home Add-Ons', 'Events',
]

const stepTitles = ['About You', 'Your Preferences', 'Your Home', 'Your Services']

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-warm-white mb-2">{label}</label>
      {children}
    </div>
  )
}

const inputClass = 'w-full bg-slate-dark/50 border border-white/10 rounded-lg px-4 py-3 text-warm-white text-sm placeholder-soft focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-colors'
const selectClass = inputClass

export default function Apply() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(initialForm)
  const [submitted, setSubmitted] = useState(false)

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const toggleService = (service: string) => {
    setForm((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(service)
        ? prev.selectedServices.filter((s) => s !== service)
        : [...prev.selectedServices, service],
    }))
  }

  const next = () => setStep((s) => Math.min(s + 1, 3))
  const prev = () => setStep((s) => Math.max(s - 1, 0))

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const { firstName, lastName, email, phone, age, neighborhood, ...rest } = form
    const result = await api.submitApplication('client', {
      firstName, lastName, email, phone, age, neighborhood,
      ...rest,
    })
    setSubmitting(false)
    if (result) setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md text-center"
        >
          <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-gold" />
          </div>
          <h1 className="font-display text-3xl font-medium text-warm-white mb-4">
            Application received
          </h1>
          <p className="text-muted mb-8">
            We review every application personally. Expect to hear from us within 48 hours.
          </p>
          <Link to="/" className="text-gold hover:text-gold-light transition-colors text-sm">
            &larr; Back to home
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pt-20 min-h-screen bg-midnight">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-gold text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Client Application
          </span>
          <h1 className="font-display text-4xl font-medium text-warm-white">
            Tell us about yourself
          </h1>
          <p className="mt-3 text-muted">
            The more we know, the better your Nanny Baddie serves you.
          </p>
        </motion.div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-10">
          {stepTitles.map((title, i) => (
            <div key={title} className="flex-1">
              <div
                className={`h-1 rounded-full transition-colors ${
                  i <= step ? 'bg-gold' : 'bg-white/10'
                }`}
              />
              <span className={`text-xs mt-2 block ${i <= step ? 'text-gold' : 'text-soft'}`}>
                {title}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basics */}
          {step === 0 && (
            <motion.div
              key="step-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="grid grid-cols-2 gap-4">
                <Field label="First name">
                  <input type="text" className={inputClass} value={form.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="Spencer" required />
                </Field>
                <Field label="Last name">
                  <input type="text" className={inputClass} value={form.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder="Burnett" required />
                </Field>
              </div>
              <Field label="Email">
                <input type="email" className={inputClass} value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@email.com" required />
              </Field>
              <Field label="Phone">
                <input type="tel" className={inputClass} value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="(512) 555-0000" required />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Age">
                  <input type="number" className={inputClass} value={form.age} onChange={(e) => update('age', e.target.value)} placeholder="32" required />
                </Field>
                <Field label="Neighborhood">
                  <input type="text" className={inputClass} value={form.neighborhood} onChange={(e) => update('neighborhood', e.target.value)} placeholder="East Austin" required />
                </Field>
              </div>
              <Field label="What should your Nanny Baddie call you?">
                <select className={selectClass} value={form.preferredTitle} onChange={(e) => update('preferredTitle', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="first_name">My first name</option>
                  <option value="mr">Mr. {form.lastName || '[Last Name]'}</option>
                  <option value="sir">Sir</option>
                  <option value="nickname">A nickname (specify below)</option>
                </select>
              </Field>
              {form.preferredTitle === 'nickname' && (
                <Field label="Preferred nickname">
                  <input type="text" className={inputClass} value={form.preferredName} onChange={(e) => update('preferredName', e.target.value)} placeholder="Big Dog, Chief, Boss..." />
                </Field>
              )}
            </motion.div>
          )}

          {/* Step 2: Lifestyle */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <Field label="How do you take your coffee?">
                <input type="text" className={inputClass} value={form.coffeeOrder} onChange={(e) => update('coffeeOrder', e.target.value)} placeholder="Black, two sugars, oat milk latte..." />
              </Field>
              <Field label="Water preference">
                <input type="text" className={inputClass} value={form.waterPreference} onChange={(e) => update('waterPreference', e.target.value)} placeholder="Room temp, no ice, Yeti tumbler..." />
              </Field>
              <Field label="Allergies or dietary restrictions">
                <input type="text" className={inputClass} value={form.allergies} onChange={(e) => update('allergies', e.target.value)} placeholder="Nuts, gluten, none..." />
              </Field>
              <Field label="Snack preferences">
                <input type="text" className={inputClass} value={form.snackPreferences} onChange={(e) => update('snackPreferences', e.target.value)} placeholder="Protein bars, fruit, chips and guac..." />
              </Field>
              <Field label="Condiment preferences">
                <input type="text" className={inputClass} value={form.condiments} onChange={(e) => update('condiments', e.target.value)} placeholder="Mustard on sandwiches, hot sauce on everything..." />
              </Field>
              <Field label="Cannabis?">
                <select className={selectClass} value={form.cannabis} onChange={(e) => update('cannabis', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="yes-roll">Yes &mdash; roll for me (specify preferences in notes)</option>
                  <option value="yes-no-roll">Yes &mdash; but I handle my own</option>
                  <option value="no">No</option>
                </select>
              </Field>
              <Field label="Supplement schedule">
                <input type="text" className={inputClass} value={form.supplementSchedule} onChange={(e) => update('supplementSchedule', e.target.value)} placeholder="Vitamin D + fish oil in the AM, magnesium PM..." />
              </Field>
              <Field label="Do you prefer conversation or quiet while she works?">
                <select className={selectClass} value={form.conversationPreference} onChange={(e) => update('conversationPreference', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="quiet">Quiet &mdash; she works, I do my thing</option>
                  <option value="light">Light conversation &mdash; friendly but focused</option>
                  <option value="social">Social &mdash; I enjoy the company</option>
                </select>
              </Field>
            </motion.div>
          )}

          {/* Step 3: Home */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <Field label="Home type">
                <select className={selectClass} value={form.homeType} onChange={(e) => update('homeType', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="house">House</option>
                  <option value="condo">Condo / Townhome</option>
                  <option value="apartment">Apartment</option>
                  <option value="penthouse">Penthouse / Loft</option>
                </select>
              </Field>
              <Field label="Bed-making standard">
                <input type="text" className={inputClass} value={form.bedMakingStandard} onChange={(e) => update('bedMakingStandard', e.target.value)} placeholder="Hospital corners, comforter pulled up, pillows fluffed..." />
              </Field>
              <Field label="Preferred drinkware">
                <input type="text" className={inputClass} value={form.preferredDrinkware} onChange={(e) => update('preferredDrinkware', e.target.value)} placeholder="Yeti mug for coffee, specific water glass..." />
              </Field>
              <Field label="Temperature preference">
                <input type="text" className={inputClass} value={form.temperaturePreference} onChange={(e) => update('temperaturePreference', e.target.value)} placeholder="72F, windows cracked, AC on low..." />
              </Field>
              <Field label="Scent preference">
                <input type="text" className={inputClass} value={form.scentPreference} onChange={(e) => update('scentPreference', e.target.value)} placeholder="Cedar candle, no fragrance, lavender diffuser..." />
              </Field>
              <Field label="Music preference">
                <input type="text" className={inputClass} value={form.musicPreference} onChange={(e) => update('musicPreference', e.target.value)} placeholder="Lo-fi, jazz, silence, Spotify playlist..." />
              </Field>
              <Field label="Pets?">
                <select className={selectClass} value={form.hasPets} onChange={(e) => update('hasPets', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </Field>
              {form.hasPets === 'yes' && (
                <Field label="Pet details (names, feeding, walk schedule)">
                  <textarea className={inputClass} rows={3} value={form.petDetails} onChange={(e) => update('petDetails', e.target.value)} placeholder="Dog named Rex, 2 cups kibble AM/PM, walks at 8am and 5pm..." />
                </Field>
              )}
              <Field label="Indoor plants or garden?">
                <select className={selectClass} value={form.hasPlants} onChange={(e) => update('hasPlants', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </Field>
              {form.hasPlants === 'yes' && (
                <Field label="Plant / garden details">
                  <textarea className={inputClass} rows={3} value={form.plantDetails} onChange={(e) => update('plantDetails', e.target.value)} placeholder="6 indoor plants, water every 3 days. Herb garden on the patio..." />
                </Field>
              )}
            </motion.div>
          )}

          {/* Step 4: Services */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Field label="Preferred frequency">
                <select className={selectClass} value={form.frequency} onChange={(e) => update('frequency', e.target.value)} required>
                  <option value="">Select your tier...</option>
                  <option value="1x">Standard &mdash; 1x/week ($3,600/quarter)</option>
                  <option value="2x">Premium &mdash; 2x/week ($7,200/quarter)</option>
                  <option value="3x">Elite &mdash; 3x/week ($10,800/quarter)</option>
                </select>
              </Field>

              <Field label="Select your services (check all that apply)">
                <div className="grid grid-cols-2 gap-2">
                  {serviceOptions.map((service) => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border text-left text-sm transition-all ${
                        form.selectedServices.includes(service)
                          ? 'bg-gold/10 border-gold/30 text-gold'
                          : 'bg-slate-dark/30 border-white/5 text-muted hover:border-white/15'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        form.selectedServices.includes(service)
                          ? 'bg-gold border-gold'
                          : 'border-white/20'
                      }`}>
                        {form.selectedServices.includes(service) && (
                          <Check className="w-3 h-3 text-midnight" />
                        )}
                      </span>
                      {service}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Anything else we should know?">
                <textarea className={inputClass} rows={4} value={form.additionalNotes} onChange={(e) => update('additionalNotes', e.target.value)} placeholder="I travel every other week, my ex still has a key, I work from home on Tuesdays..." />
              </Field>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10">
            {step > 0 ? (
              <button type="button" onClick={prev} className="flex items-center gap-2 text-muted hover:text-warm-white transition-colors text-sm">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button type="button" onClick={next} className="flex items-center gap-2 px-7 py-3 bg-gold text-midnight font-medium rounded-xl hover:bg-gold-light transition-all text-sm">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="submit" disabled={submitting} className="flex items-center gap-2 px-7 py-3 bg-gold text-midnight font-medium rounded-xl hover:bg-gold-light transition-all text-sm disabled:opacity-50">
                {submitting ? 'Submitting…' : 'Submit Application'} {!submitting && <Check className="w-4 h-4" />}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
