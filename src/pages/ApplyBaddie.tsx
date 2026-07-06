import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import * as api from '../lib/api'
import { APPROVED_NAMES } from '../lib/conductRules'

interface FormData {
  // Step 1: About You
  firstName: string
  lastName: string
  email: string
  phone: string
  age: string
  neighborhood: string
  instagram: string

  // Step 2: Experience
  currentJob: string
  relevantExperience: string
  cleaningExperience: string
  cookingSkills: string
  whyJoin: string

  // Step 3: Availability
  availability: string[]
  shiftsPerWeek: string
  startDate: string
  hasTransportation: string
  willingToBootcamp: string

  // Step 4: About You (personality)
  strengthDescription: string
  comfortLevel: string
  acceptedNames: string[]
  boundariesAgreement: string
  additionalNotes: string
}

const initialForm: FormData = {
  firstName: '', lastName: '', email: '', phone: '', age: '', neighborhood: '', instagram: '',
  currentJob: '', relevantExperience: '', cleaningExperience: '', cookingSkills: '', whyJoin: '',
  availability: [], shiftsPerWeek: '', startDate: '', hasTransportation: '', willingToBootcamp: '',
  strengthDescription: '', comfortLevel: '', acceptedNames: [], boundariesAgreement: '', additionalNotes: '',
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const stepTitles = ['Basics', 'Experience', 'Availability', 'Personality']

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

export default function ApplyBaddie() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(initialForm)
  const [submitted, setSubmitted] = useState(false)

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const toggleName = (name: string) => {
    setForm((prev) => ({
      ...prev,
      acceptedNames: prev.acceptedNames.includes(name)
        ? prev.acceptedNames.filter((n) => n !== name)
        : [...prev.acceptedNames, name],
    }))
  }

  const toggleDay = (day: string) => {
    setForm((prev) => ({
      ...prev,
      availability: prev.availability.includes(day)
        ? prev.availability.filter((d) => d !== day)
        : [...prev.availability, day],
    }))
  }

  const next = () => setStep((s) => Math.min(s + 1, 3))
  const prev = () => setStep((s) => Math.max(s - 1, 0))

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const { firstName, lastName, email, phone, age, neighborhood, instagram, ...rest } = form
    const result = await api.submitApplication('baddie', {
      firstName, lastName, email, phone, age, neighborhood, instagram,
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
            We review every application personally. If you are a fit, we will reach out within 72 hours
            with details on the next bootcamp cohort.
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
            Baddie Application
          </span>
          <h1 className="font-display text-4xl font-medium text-warm-white">
            Join the team
          </h1>
          <p className="mt-3 text-muted">
            $35/hour. Premium clients. Flexible schedule. Professional environment.
          </p>
        </motion.div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-10">
          {stepTitles.map((title, i) => (
            <div key={title} className="flex-1">
              <div className={`h-1 rounded-full transition-colors ${i <= step ? 'bg-gold' : 'bg-white/10'}`} />
              <span className={`text-xs mt-2 block ${i <= step ? 'text-gold' : 'text-soft'}`}>{title}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basics */}
          {step === 0 && (
            <motion.div key="step-0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Field label="First name">
                  <input type="text" className={inputClass} value={form.firstName} onChange={(e) => update('firstName', e.target.value)} required />
                </Field>
                <Field label="Last name">
                  <input type="text" className={inputClass} value={form.lastName} onChange={(e) => update('lastName', e.target.value)} required />
                </Field>
              </div>
              <Field label="Email">
                <input type="email" className={inputClass} value={form.email} onChange={(e) => update('email', e.target.value)} required />
              </Field>
              <Field label="Phone">
                <input type="tel" className={inputClass} value={form.phone} onChange={(e) => update('phone', e.target.value)} required />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Age">
                  <input type="number" className={inputClass} value={form.age} onChange={(e) => update('age', e.target.value)} required />
                </Field>
                <Field label="Austin neighborhood">
                  <input type="text" className={inputClass} value={form.neighborhood} onChange={(e) => update('neighborhood', e.target.value)} required />
                </Field>
              </div>
              <Field label="Instagram handle (optional)">
                <input type="text" className={inputClass} value={form.instagram} onChange={(e) => update('instagram', e.target.value)} placeholder="@" />
              </Field>
            </motion.div>
          )}

          {/* Step 2: Experience */}
          {step === 1 && (
            <motion.div key="step-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <Field label="Current job / occupation">
                <input type="text" className={inputClass} value={form.currentJob} onChange={(e) => update('currentJob', e.target.value)} placeholder="Bartender, student, makeup artist..." />
              </Field>
              <Field label="Relevant experience">
                <textarea className={inputClass} rows={3} value={form.relevantExperience} onChange={(e) => update('relevantExperience', e.target.value)} placeholder="Hospitality, service industry, personal assistant, nannying..." />
              </Field>
              <Field label="Cleaning / organization experience">
                <select className={selectClass} value={form.cleaningExperience} onChange={(e) => update('cleaningExperience', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="professional">Professional cleaning experience</option>
                  <option value="personal">Strong personal standards, no professional experience</option>
                  <option value="learning">Willing to learn in bootcamp</option>
                </select>
              </Field>
              <Field label="Cooking skills">
                <select className={selectClass} value={form.cookingSkills} onChange={(e) => update('cookingSkills', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="advanced">Advanced &mdash; meal prep, complex recipes</option>
                  <option value="intermediate">Intermediate &mdash; follow recipes, basic meal prep</option>
                  <option value="basic">Basic &mdash; sandwiches, snacks, shakes</option>
                  <option value="learning">Willing to learn</option>
                </select>
              </Field>
              <Field label="Why do you want to join Nanny Baddies?">
                <textarea className={inputClass} rows={3} value={form.whyJoin} onChange={(e) => update('whyJoin', e.target.value)} placeholder="Be honest. We value authenticity." />
              </Field>
            </motion.div>
          )}

          {/* Step 3: Availability */}
          {step === 2 && (
            <motion.div key="step-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <Field label="Which days are you available? (select all that apply)">
                <div className="grid grid-cols-2 gap-2">
                  {days.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border text-left text-sm transition-all ${
                        form.availability.includes(day)
                          ? 'bg-gold/10 border-gold/30 text-gold'
                          : 'bg-slate-dark/30 border-white/5 text-muted hover:border-white/15'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        form.availability.includes(day) ? 'bg-gold border-gold' : 'border-white/20'
                      }`}>
                        {form.availability.includes(day) && <Check className="w-3 h-3 text-midnight" />}
                      </span>
                      {day}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="How many shifts per week do you want?">
                <select className={selectClass} value={form.shiftsPerWeek} onChange={(e) => update('shiftsPerWeek', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="1-2">1-2 shifts (side income)</option>
                  <option value="3-4">3-4 shifts (part-time)</option>
                  <option value="5+">5+ shifts (full-time)</option>
                </select>
              </Field>

              <Field label="Earliest start date">
                <input type="date" className={inputClass} value={form.startDate} onChange={(e) => update('startDate', e.target.value)} />
              </Field>

              <Field label="Do you have reliable transportation?">
                <select className={selectClass} value={form.hasTransportation} onChange={(e) => update('hasTransportation', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="car">Yes &mdash; I have a car</option>
                  <option value="other">Yes &mdash; rideshare or other reliable transport</option>
                  <option value="no">Not currently</option>
                </select>
              </Field>

              <Field label="Are you willing to complete the Nanny Baddies bootcamp?">
                <select className={selectClass} value={form.willingToBootcamp} onChange={(e) => update('willingToBootcamp', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="yes">Yes &mdash; I am committed</option>
                  <option value="tell-me-more">I want to learn more first</option>
                </select>
              </Field>
            </motion.div>
          )}

          {/* Step 4: Personality */}
          {step === 3 && (
            <motion.div key="step-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
              <Field label="Describe your top strength in 1-2 sentences">
                <textarea className={inputClass} rows={2} value={form.strengthDescription} onChange={(e) => update('strengthDescription', e.target.value)} placeholder="What makes you great at taking care of people?" />
              </Field>

              <Field label="Comfort level in premium home environments">
                <select className={selectClass} value={form.comfortLevel} onChange={(e) => update('comfortLevel', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="very">Very comfortable &mdash; this is my element</option>
                  <option value="comfortable">Comfortable &mdash; I adapt quickly</option>
                  <option value="growing">Growing into it &mdash; ready to learn</option>
                </select>
              </Field>

              <Field label="Which names are you comfortable being asked to use?">
                <p className="text-xs text-soft mb-3">Clients may only be addressed by an approved term. Pick the ones you&apos;ll use — you&apos;re never required to use one you didn&apos;t select.</p>
                <div className="flex flex-wrap gap-2">
                  {['First name', ...APPROVED_NAMES].map((name) => {
                    const on = form.acceptedNames.includes(name)
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => toggleName(name)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer border ${
                          on
                            ? 'bg-gold/20 text-gold border-gold/30'
                            : 'bg-slate-dark/50 text-muted border-white/10 hover:border-white/20'
                        }`}
                      >
                        {name}
                      </button>
                    )
                  })}
                </div>
              </Field>

              <Field label="Boundary agreement">
                <div className="bg-charcoal/50 border border-white/5 rounded-lg p-5 text-sm text-muted leading-relaxed mb-3">
                  <p className="mb-3">Nanny Baddies maintains strict professional boundaries:</p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>No personal phone numbers exchanged with clients</li>
                    <li>No social media connections with clients</li>
                    <li>All communication through the app only</li>
                    <li>Zero tolerance for crossing professional boundaries</li>
                    <li>Enforced by contract with financial penalties</li>
                  </ul>
                </div>
                <select className={selectClass} value={form.boundariesAgreement} onChange={(e) => update('boundariesAgreement', e.target.value)} required>
                  <option value="">Select...</option>
                  <option value="agree">I understand and agree to these boundaries</option>
                  <option value="questions">I have questions about this</option>
                </select>
              </Field>

              <Field label="Anything else you want us to know?">
                <textarea className={inputClass} rows={3} value={form.additionalNotes} onChange={(e) => update('additionalNotes', e.target.value)} placeholder="Tell us what sets you apart..." />
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
