import { motion } from 'framer-motion'
import { Check, ArrowRight } from 'lucide-react'
import Button from '../components/ui/Button'
import SectionHeading from '../components/ui/SectionHeading'
import { DOS, DONTS } from '../lib/conductRules'

const serviceCategories = [
  {
    title: 'Home Reset',
    tagline: 'Every single visit',
    items: [
      'General tidy-up',
      'Dishes — washed, dried, put away',
      'Trash and recycling out',
      'Bathroom wipe-down',
      'Floors swept / vacuumed / mopped',
      'Beds made to your standard',
      'Refills — soap, paper goods, supplies',
    ],
  },
  {
    title: 'Deep Cleaning',
    tagline: 'Weekly or bi-weekly add-on',
    items: [
      'Full kitchen scrub (counters, backsplash, sink)',
      'Microwave and oven interior',
      'Fridge cleaned and organized',
      'Bathroom deep scrub (tile, grout, fixtures)',
      'Windows and mirrors',
      'Baseboards and trim',
    ],
  },
  {
    title: 'Laundry',
    tagline: 'Wash, dry, fold, done',
    items: [
      'Full wash / dry / fold cycle',
      'Put away in your drawers and closets',
      'Hang and steam dress clothes',
      'Bed linens changed and laundered',
    ],
  },
  {
    title: 'Kitchen & Food',
    tagline: 'Your fridge, your way',
    items: [
      'Meal prep — 1 meal, 2-3 days, or full week',
      'Batch juicing for the week',
      'Protein shake — your recipe, your cup',
      'Snacks prepped and portioned',
      'Coffee exactly how you take it',
    ],
  },
  {
    title: 'Groceries & Inventory',
    tagline: 'Nothing ever runs out',
    items: [
      'Grocery shopping from your list or profile',
      'Consumables audit and restock',
      'Cleaning supplies, paper goods, soap, toiletries',
      'Standing reorder list maintained',
    ],
  },
  {
    title: 'Lifestyle',
    tagline: 'The details that matter',
    items: [
      'Blunts rolled — your paper, filter, density, strain',
      'Water ready — your cup, your way',
      'Supplements set out on schedule',
      'Workday presence — ambient, quiet, available',
      'Pre-Zoom prep — space camera-ready, background clean',
    ],
  },
  {
    title: 'Pets',
    tagline: 'Your animals, handled',
    items: [
      'Cat litter cleaned',
      'Dog walked and played with',
      'Feeding on schedule',
      'Pet area cleaned and organized',
    ],
  },
  {
    title: 'Plants & Garden',
    tagline: 'Green and growing',
    items: [
      'Indoor and outdoor watering',
      'Garden tending and weeding',
      'Harvest food you grow',
      'Special care per plant notes',
    ],
  },
  {
    title: 'Travel & Bags',
    tagline: 'Packed and ready',
    items: [
      'Gym bag packed to your standard kit',
      'Gym bag unpacked and reset after use',
      'Trip packed — clothes, toiletries, gear per profile',
      'Trip unpacked — laundry done, toiletries restocked, bag put away clean',
    ],
  },
  {
    title: 'Organization',
    tagline: 'Order from chaos',
    items: [
      'Closet organization',
      'Pantry reset',
      'Office and desk cleanup',
      'Doom pile sorted',
      'Junk drawer purged',
      'Storage area organized',
    ],
  },
  {
    title: 'Errands',
    tagline: 'She handles the runs',
    items: [
      'Dry cleaning pickup and drop-off',
      'Returns and mail',
      'Store runs',
      'Car to wash or detail',
      'Food pickup',
    ],
  },
  {
    title: 'Home Add-Ons',
    tagline: 'The finishing touches',
    items: [
      'Pre-hosting prep for guests',
      'Fresh bed linens',
      'Outdoor area reset (patio, grill)',
      'Unboxing and organizing deliveries',
      'Candles, diffusers, ambiance set',
    ],
  },
  {
    title: 'Events',
    tagline: 'She produces your gatherings',
    items: [
      'Logistics planning and timeline',
      'Guest list management',
      'Home staged and decorated',
      'Food and drink coordination',
      'Hosting support during the event',
      'Full breakdown and cleanup after',
    ],
  },
]

const faqs = [
  {
    q: 'Is this a dating service?',
    a: 'No. Nanny Baddies is a professional domestic lifestyle service. There is zero sexual or romantic component. This is enforced by contract with financial penalties.',
  },
  {
    q: 'How does the matching process work?',
    a: 'After you complete your client profile, we review your lifestyle, schedule, and preferences to match you with a Nanny Baddie who fits. She reviews your full profile before her first visit.',
  },
  {
    q: 'What is the 90-day commitment?',
    a: 'All memberships run in 90-day cycles. You select your tier (1x, 2x, or 3x per week), commit for 90 days, and can cancel or adjust at the end of any cycle.',
  },
  {
    q: 'Can I change my checklist?',
    a: 'Anytime. Your service checklist lives in the app and updates in real time. Your Baddie sees the latest version before every shift.',
  },
  {
    q: 'What if I need to cancel a shift?',
    a: '24-hour notice for rescheduling at no charge. Same-day cancellations are billed at the standard shift rate.',
  },
  {
    q: 'Is this available outside Austin?',
    a: 'We are launching in Austin, TX. Expansion cities are being planned based on demand.',
  },
]

export default function ForClients() {
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
              For Clients
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-medium text-warm-white leading-tight">
              Drop the{' '}
              <span className="italic text-gold">mental load.</span>
            </h1>
            <p className="mt-6 text-lg text-muted max-w-2xl mx-auto leading-relaxed">
              You build. She executes. Come home to a life that runs itself —
              nothing to remember, nothing to manage.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button to="/apply" size="lg">
                Apply Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button to="/enroll?trial=true" variant="outline" size="lg">
                Try It First — $2,000
              </Button>
            </div>
            <p className="mt-4 text-xs text-soft">
              Paid trial includes 3 orientation meetings + 1 full day of service. No commitment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Full Service Menu */}
      <section className="py-24 px-6 bg-midnight">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            label="Complete Service Menu"
            title="Every box she checks"
            subtitle="Your personalized checklist is built from these categories. Choose what matters to you."
          />

          <div className="space-y-6">
            {serviceCategories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="bg-charcoal/50 border border-white/5 rounded-xl p-6 md:p-8"
              >
                <div className="flex items-baseline justify-between mb-4">
                  <h3 className="text-lg font-semibold text-warm-white">{cat.title}</h3>
                  <span className="text-xs text-gold/70 italic">{cat.tagline}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {cat.items.map((item) => (
                    <div key={item} className="flex items-center gap-2.5 text-sm text-muted">
                      <Check className="w-3.5 h-3.5 text-gold/60 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 bg-charcoal">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            label="Pricing"
            title="Simple, quarterly billing"
            subtitle="90-day cycles billed quarterly. Cancel at the end of any cycle with 30-day notice."
          />

          <div className="bg-slate-dark/50 border border-white/5 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-4 gap-px bg-white/5">
              <div className="bg-charcoal p-5 text-xs font-semibold text-muted uppercase tracking-wider">Tier</div>
              <div className="bg-charcoal p-5 text-xs font-semibold text-muted uppercase tracking-wider">Frequency</div>
              <div className="bg-charcoal p-5 text-xs font-semibold text-muted uppercase tracking-wider">Per Quarter</div>
              <div className="bg-charcoal p-5 text-xs font-semibold text-muted uppercase tracking-wider">Monthly Equiv.</div>
            </div>
            {[
              { tier: 'Standard', freq: '1x / week', quarterly: '$3,600', monthly: '$1,200/mo' },
              { tier: 'Premium', freq: '2x / week', quarterly: '$7,200', monthly: '$2,400/mo' },
              { tier: 'Elite', freq: '3x / week', quarterly: '$10,800', monthly: '$3,600/mo' },
            ].map((row) => (
              <div key={row.tier} className="grid grid-cols-4 gap-px bg-white/5">
                <div className="bg-slate-dark/30 p-5 text-sm font-medium text-warm-white">{row.tier}</div>
                <div className="bg-slate-dark/30 p-5 text-sm text-muted">{row.freq}</div>
                <div className="bg-slate-dark/30 p-5 text-sm text-gold font-medium">{row.quarterly}</div>
                <div className="bg-slate-dark/30 p-5 text-sm text-soft">{row.monthly}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-charcoal/50 border border-gold/10 rounded-xl p-6 text-center">
            <p className="text-sm text-muted mb-3">
              Not ready for a 90-day commitment? <span className="text-gold font-medium">Try us first.</span>
            </p>
            <p className="text-xs text-soft mb-4">
              $2,000 gets you 3 orientation meetings and 1 full day of service. Experience the difference before you commit.
            </p>
            <Button to="/enroll?trial=true" variant="outline" size="sm">
              Start with a Paid Trial
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-midnight">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            label="FAQ"
            title="Questions answered"
          />

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-charcoal/50 border border-white/5 rounded-xl p-6"
              >
                <h3 className="text-base font-semibold text-warm-white mb-2">{faq.q}</h3>
                <p className="text-sm text-muted leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Conduct Preview */}
      <section className="py-24 px-6 bg-charcoal/30">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            label="Our Standards"
            title="A professional relationship, always"
            subtitle="Every client signs a conduct agreement before their first shift. These rules protect both you and your Nanny Baddie."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-charcoal/50 border border-green-500/10 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-green-400 mb-4 uppercase tracking-wider">The Do&apos;s</h3>
              <ul className="space-y-2.5 text-sm text-muted">
                {DOS.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check className="w-3.5 h-3.5 text-green-400/60 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-charcoal/50 border border-red-500/10 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-red-400 mb-4 uppercase tracking-wider">Zero Tolerance</h3>
              <ul className="space-y-2.5 text-sm text-muted">
                {DONTS.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 bg-red-400/60 rounded-full shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-xs text-soft text-center mt-6">
            All shifts are recorded for safety. Violations result in immediate removal from the platform.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 bg-gradient-to-t from-charcoal to-midnight text-center">
        <h2 className="font-display text-3xl md:text-4xl font-medium text-warm-white mb-4">
          Ready to upgrade your life?
        </h2>
        <p className="text-muted mb-8">Applications are reviewed within 48 hours.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button to="/apply" size="lg">
            Apply as a Client
          </Button>
          <Button to="/enroll?trial=true" variant="outline" size="lg">
            Try It First — $2,000
          </Button>
        </div>
      </section>
    </div>
  )
}
