import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Button from '../ui/Button'
import SectionHeading from '../ui/SectionHeading'

const packages = [
  {
    name: 'Standard',
    slug: 'standard',
    shifts: '1x / week',
    price: '$1,200',
    period: '/month',
    features: [
      '1 shift per week (4 hours each)',
      'Personalized service checklist',
      'Dedicated Nanny Baddie',
      'Full client profile on file',
      'In-app messaging',
    ],
    featured: false,
  },
  {
    name: 'Premium',
    slug: 'premium',
    shifts: '2x / week',
    price: '$2,400',
    period: '/month',
    features: [
      '2 shifts per week (4 hours each)',
      'Personalized service checklist',
      'Dedicated Nanny Baddie',
      'Full client profile on file',
      'In-app messaging',
      'Priority scheduling',
      'House sitting access',
    ],
    featured: true,
  },
  {
    name: 'Elite',
    slug: 'elite',
    shifts: '3x / week',
    price: '$3,600',
    period: '/month',
    features: [
      '3 shifts per week (4 hours each)',
      'Personalized service checklist',
      'Dedicated Nanny Baddie',
      'Full client profile on file',
      'In-app messaging',
      'Priority scheduling',
      'House sitting access',
      'Event production included',
      'Travel coverage',
    ],
    featured: false,
  },
]

export default function Packages() {
  return (
    <section className="py-28 px-6 bg-charcoal relative">
      <div className="absolute inset-0 bg-gradient-to-b from-midnight/30 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeading
          label="Membership"
          title="Select your tier"
          subtitle="All memberships are 90-day commitments at $75/hour. 4-hour shifts. Cancel after any 90-day cycle."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 border transition-all duration-300 ${
                pkg.featured
                  ? 'bg-gradient-to-b from-gold/10 to-charcoal border-gold/30 shadow-xl shadow-gold/5'
                  : 'bg-slate-dark/50 border-white/5 hover:border-white/10'
              }`}
            >
              {pkg.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-midnight text-xs font-bold tracking-wider uppercase px-4 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-warm-white">{pkg.name}</h3>
                <p className="text-sm text-muted mt-1">{pkg.shifts}</p>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-display font-semibold text-warm-white">
                  {pkg.price}
                </span>
                <span className="text-muted text-sm">{pkg.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-muted">
                    <Check className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                to={`/enroll?tier=${pkg.slug}`}
                variant={pkg.featured ? 'primary' : 'secondary'}
                className="w-full"
              >
                Enroll Now
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
