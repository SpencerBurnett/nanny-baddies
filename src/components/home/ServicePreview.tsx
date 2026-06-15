import { motion } from 'framer-motion'
import {
  Sparkles, Shirt, UtensilsCrossed, ShoppingCart,
  Cannabis, PawPrint, Flower2, Briefcase,
  Package, Scissors, Home, Gift, CalendarCheck
} from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'

const services = [
  { icon: Sparkles, name: 'Home Reset', desc: 'Tidy, dishes, floors, bathrooms, beds, refills' },
  { icon: Home, name: 'Deep Clean', desc: 'Full kitchen, oven, fridge, windows, baseboards' },
  { icon: Shirt, name: 'Laundry', desc: 'Wash, dry, fold, put away, hang and steam' },
  { icon: UtensilsCrossed, name: 'Kitchen & Food', desc: 'Meal prep, juicing, shakes, snacks, coffee' },
  { icon: ShoppingCart, name: 'Groceries & Inventory', desc: 'Shop, restock consumables, nothing runs out' },
  { icon: Cannabis, name: 'Lifestyle', desc: 'Blunts, supplements, water, Zoom-ready space' },
  { icon: PawPrint, name: 'Pets', desc: 'Litter, walks, feeding, play, pet area clean' },
  { icon: Flower2, name: 'Plants & Garden', desc: 'Watering, garden tending, harvest your food' },
  { icon: Briefcase, name: 'Travel & Bags', desc: 'Gym bag packed, trip packed, unpacked on return' },
  { icon: Package, name: 'Organization', desc: 'Closets, pantry, office, doom piles, junk drawers' },
  { icon: Scissors, name: 'Errands', desc: 'Dry cleaning, returns, car wash, store runs' },
  { icon: Gift, name: 'Home Add-Ons', desc: 'Pre-hosting, linens, candles, unboxing' },
  { icon: CalendarCheck, name: 'Events', desc: 'She produces your home events, start to finish' },
]

export default function ServicePreview() {
  return (
    <section className="py-28 px-6 bg-midnight relative">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          label="The Menu"
          title="Everything she handles"
          subtitle="Build your personalized checklist. She executes it every shift, exactly how you like it."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {services.map((service, i) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group bg-charcoal/50 border border-white/5 rounded-xl p-5 hover:border-gold/20 hover:bg-charcoal transition-all duration-300"
            >
              <service.icon className="w-5 h-5 text-gold mb-3" />
              <h3 className="text-sm font-semibold text-warm-white mb-1">
                {service.name}
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10 text-sm text-soft italic"
        >
          She knows how you take your coffee. She knows you're allergic to nuts.
          She knows you like your water with no ice, in that cup.
        </motion.p>
      </div>
    </section>
  )
}
