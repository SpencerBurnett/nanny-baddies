import { motion } from 'framer-motion'
import SectionHeading from '../ui/SectionHeading'

const profileFields = [
  { category: 'Beverages', items: ['Coffee order', 'Tea preference', 'Water (ice / no ice / cup)', 'Shake recipe', 'Alcohol'] },
  { category: 'Food', items: ['Allergies', 'Condiment preferences', 'Usual orders & spots', 'Snack preferences', 'Foods you avoid'] },
  { category: 'Lifestyle', items: ['Cannabis rolling specs', 'Supplement schedule', 'Zoom schedule', 'Conversation vs. quiet', 'Music & scent'] },
  { category: 'Home', items: ['Bed-making standard', 'Preferred drinkware', 'Where everything lives', 'Temperature preference'] },
  { category: 'Travel', items: ['Gym bag standard kit', 'Trip packing style', 'Toiletry kit contents'] },
  { category: 'Pets & Plants', items: ['Pet names & feeding', 'Walk preferences', 'Watering schedule', 'Special care notes'] },
]

export default function ProfileTeaser() {
  return (
    <section className="py-28 px-6 bg-midnight relative">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label="The Profile"
          title="She already knows"
          subtitle="Before her first shift, your Nanny Baddie studies your complete profile. No training period. No guesswork. She walks in ready."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {profileFields.map((field, i) => (
            <motion.div
              key={field.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-charcoal/50 border border-white/5 rounded-xl p-6"
            >
              <h3 className="text-gold text-xs font-semibold tracking-[0.15em] uppercase mb-3">
                {field.category}
              </h3>
              <ul className="space-y-2">
                {field.items.map((item) => (
                  <li key={item} className="text-sm text-muted flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-gold/40 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
