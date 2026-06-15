import { motion } from 'framer-motion'
import { DollarSign, Calendar, Shield, Star, ArrowRight } from 'lucide-react'
import Button from '../components/ui/Button'
import SectionHeading from '../components/ui/SectionHeading'

const perks = [
  {
    icon: DollarSign,
    title: '$35/hour',
    description: 'Earn more than bartending, serving, or hosting. Consistent shifts, reliable income, zero tip dependency.',
  },
  {
    icon: Calendar,
    title: 'Flexible schedule',
    description: 'Choose your availability. 4-hour shift blocks that fit around your life, classes, or other work.',
  },
  {
    icon: Shield,
    title: 'Safe & professional',
    description: 'Strict no-contact policies enforced by contract. In-app messaging only. Background checks on all clients.',
  },
  {
    icon: Star,
    title: 'Premium clientele',
    description: 'Serve successful, respectful men in high-end homes. Clean environments. Clear expectations.',
  },
]

const earningsTable = [
  { shifts: '1 shift / week', weekly: '$140', monthly: '$560', annual: '$7,280', label: 'Side income' },
  { shifts: '3 shifts / week', weekly: '$420', monthly: '$1,680', annual: '$21,840', label: 'Part-time' },
  { shifts: '5 shifts / week', weekly: '$700', monthly: '$2,800', annual: '$36,400', label: 'Full-time' },
  { shifts: '7 shifts / week', weekly: '$980', monthly: '$3,920', annual: '$50,960', label: 'Hustle mode' },
]

const requirements = [
  'Women aged 21-30 based in Austin, TX',
  'Reliable, punctual, and detail-oriented',
  'Comfortable in premium home environments',
  'Excellent communication skills',
  'Clean driving record and reliable transportation',
  'Willing to complete the Nanny Baddies bootcamp',
  'Committed to maintaining professional boundaries',
  'Available for a minimum of 1 shift per week',
]

export default function ForBaddies() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="py-24 px-6 bg-gradient-to-b from-midnight to-charcoal/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-gold text-sm font-semibold tracking-[0.2em] uppercase mb-6">
              For Baddies
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-medium text-warm-white leading-tight">
              Get paid to be{' '}
              <span className="italic text-gold">exceptional</span>
            </h1>
            <p className="mt-6 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
              $35/hour. Premium clients. Flexible shifts. Professional environment.
              This is domestic lifestyle work elevated to a career.
            </p>
            <div className="mt-10">
              <Button to="/apply-baddie" size="lg">
                Apply Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-24 px-6 bg-midnight">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label="Why Join"
            title="Built for ambitious women"
            subtitle="Better pay than bartending, more flexibility than a 9-5, and clients who respect you."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {perks.map((perk, i) => (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-charcoal/50 border border-white/5 rounded-xl p-8 hover:border-gold/20 transition-all"
              >
                <perk.icon className="w-8 h-8 text-gold mb-4" />
                <h3 className="text-xl font-semibold text-warm-white mb-2">{perk.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{perk.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section className="py-24 px-6 bg-charcoal">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            label="Earnings"
            title="Your earning potential"
            subtitle="$35/hour, 4-hour shifts. You choose how many shifts you want."
          />

          <div className="bg-slate-dark/50 border border-white/5 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-5 gap-px bg-white/5">
              <div className="bg-charcoal p-4 text-xs font-semibold text-muted uppercase tracking-wider">Pace</div>
              <div className="bg-charcoal p-4 text-xs font-semibold text-muted uppercase tracking-wider">Weekly</div>
              <div className="bg-charcoal p-4 text-xs font-semibold text-muted uppercase tracking-wider">Monthly</div>
              <div className="bg-charcoal p-4 text-xs font-semibold text-muted uppercase tracking-wider">Annual</div>
              <div className="bg-charcoal p-4 text-xs font-semibold text-muted uppercase tracking-wider">Mode</div>
            </div>
            {earningsTable.map((row) => (
              <div key={row.shifts} className="grid grid-cols-5 gap-px bg-white/5">
                <div className="bg-slate-dark/30 p-4 text-sm text-muted">{row.shifts}</div>
                <div className="bg-slate-dark/30 p-4 text-sm text-warm-white">{row.weekly}</div>
                <div className="bg-slate-dark/30 p-4 text-sm text-warm-white">{row.monthly}</div>
                <div className="bg-slate-dark/30 p-4 text-sm text-gold font-medium">{row.annual}</div>
                <div className="bg-slate-dark/30 p-4 text-sm text-muted italic">{row.label}</div>
              </div>
            ))}
          </div>

          <p className="text-center mt-6 text-sm text-soft">
            Compare: Austin bartender $25-40/hr (tips), hostess $14-16/hr, makeup artist $20-30/hr.
          </p>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-24 px-6 bg-midnight">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            label="Requirements"
            title="What we look for"
          />

          <div className="bg-charcoal/50 border border-white/5 rounded-xl p-8">
            <ul className="space-y-4">
              {requirements.map((req, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 text-sm text-muted"
                >
                  <span className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  </span>
                  {req}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 bg-gradient-to-t from-charcoal to-midnight text-center">
        <h2 className="font-display text-3xl md:text-4xl font-medium text-warm-white mb-4">
          Ready to join the team?
        </h2>
        <p className="text-muted mb-8">Applications are reviewed within 72 hours.</p>
        <Button to="/apply-baddie" size="lg">
          Apply as a Baddie
        </Button>
      </section>
    </div>
  )
}
