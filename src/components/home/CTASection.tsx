import { motion } from 'framer-motion'
import Button from '../ui/Button'

export default function CTASection() {
  return (
    <section className="py-32 px-6 bg-midnight relative overflow-hidden">
      {/* Gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block text-gold text-sm font-semibold tracking-[0.2em] uppercase mb-6">
            This Is Status
          </span>

          <h2 className="font-display text-4xl md:text-6xl font-medium text-warm-white leading-tight">
            Your home should feel like{' '}
            <span className="italic text-gold">you built it on purpose.</span>
          </h2>

          <p className="mt-8 text-lg text-muted leading-relaxed max-w-xl mx-auto">
            Nanny Baddies is not a cleaning service. It is a lifestyle upgrade
            for men who have outgrown managing their own homes.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button to="/apply" size="lg">
              Apply as a Client
            </Button>
            <Button to="/for-clients" variant="secondary" size="lg">
              See the Full Menu
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
