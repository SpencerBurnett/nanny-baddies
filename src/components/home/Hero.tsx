import { motion } from 'framer-motion'
import Button from '../ui/Button'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight via-charcoal/50 to-midnight" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <span className="inline-block text-gold text-sm font-semibold tracking-[0.25em] uppercase mb-8">
            Austin, TX &mdash; By Invitation Only
          </span>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium leading-[1.05] tracking-tight text-warm-white">
            All the benefits of{' '}
            <span className="italic text-gold">a girlfriend.</span>
            <br />
            None of the hassle.
          </h1>

          <p className="mt-8 text-xl md:text-2xl text-muted max-w-2xl mx-auto leading-relaxed font-light">
            A curated domestic lifestyle service for successful men.
            She already knows how you take your coffee.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button to="/apply" size="lg">
            Apply as a Client
          </Button>
          <Button to="/apply-baddie" variant="outline" size="lg">
            Apply as a Baddie
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 flex items-center justify-center gap-12 text-sm text-soft"
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl font-display font-semibold text-warm-white">4hr</span>
            <span className="mt-1">Shift blocks</span>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-display font-semibold text-warm-white">90-day</span>
            <span className="mt-1">Commitments</span>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-display font-semibold text-warm-white">13+</span>
            <span className="mt-1">Service categories</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-gold/60 to-transparent"
        />
      </motion.div>
    </section>
  )
}
