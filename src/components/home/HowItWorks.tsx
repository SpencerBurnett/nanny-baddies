import { motion } from 'framer-motion'
import { ClipboardList, UserCheck, Sparkles } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'

const steps = [
  {
    icon: ClipboardList,
    number: '01',
    title: 'Build Your Profile',
    description:
      'Tell us everything. How you take your coffee. What brand of soap you use. Your gym bag kit. Your allergies. Your schedule. The more we know, the better she serves.',
  },
  {
    icon: UserCheck,
    number: '02',
    title: 'Get Matched',
    description:
      'We pair you with a Nanny Baddie matched to your lifestyle, schedule, and preferences. She reviews your full profile before her first visit.',
  },
  {
    icon: Sparkles,
    number: '03',
    title: 'She Already Knows',
    description:
      'Your Baddie arrives with gifts, knows your home inside out, and executes your personalized checklist every shift. You come home to a life that runs itself.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-28 px-6 bg-charcoal relative">
      <div className="absolute inset-0 bg-gradient-to-b from-midnight/50 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeading
          label="How It Works"
          title="Three steps to a life that handles itself"
          subtitle="No apps. No algorithms. A real person who knows your world."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group relative bg-slate-dark/50 border border-white/5 rounded-2xl p-8 hover:border-gold/30 transition-all duration-500"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-gold" />
                </div>
                <span className="font-display text-3xl font-semibold text-white/5 group-hover:text-gold/10 transition-colors">
                  {step.number}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-warm-white mb-3">
                {step.title}
              </h3>
              <p className="text-muted leading-relaxed text-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
