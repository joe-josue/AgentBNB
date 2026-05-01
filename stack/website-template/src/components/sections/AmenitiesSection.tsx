'use client'

import { motion } from 'framer-motion'
import {
  Waves,
  BedDouble,
  UtensilsCrossed,
  Flame,
  Bath,
  Binoculars,
  Wind,
} from 'lucide-react'
import { KNOWN_ISSUES } from '@/lib/config'
import { staggerContainer, fadeUp, viewportOnce } from '@/lib/animations'

const amenities = [
  {
    icon: Waves,
    label: 'Private Pool',
    note: 'Natural temperature · Lush surroundings',
  },
  {
    icon: BedDouble,
    label: '10 Single Beds',
    note: 'Modular & stackable layout',
  },
  {
    icon: UtensilsCrossed,
    label: 'Full Kitchen',
    note: 'Gas stove, ref/freezer, cookware',
  },
  {
    icon: Flame,
    label: 'Outdoor Grill (Ihawan)',
    note: 'Guests can grill food outdoors',
  },
  {
    icon: Bath,
    label: '2 Bathrooms',
    note: 'Shower heater & bidet in each',
  },
  {
    icon: Binoculars,
    label: 'Balcony Views',
    note: 'Pool & garden panorama',
  },
  {
    icon: Wind,
    label: 'Natural Breeze',
    note: 'Hilltop airflow — no AC needed',
  },
]

export function AmenitiesSection() {
  const issues: string[] = []
  if (KNOWN_ISSUES.poolHeaterUnderRepair) issues.push('pool heater under repair')
  if (KNOWN_ISSUES.jacuzziJetsUnderRepair) issues.push('jacuzzi jets under repair')
  if (KNOWN_ISSUES.noWifi) issues.push('WiFi not yet available')

  return (
    <section id="amenities" className="section-pad bg-muted">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mb-14"
        >
          <p className="font-sans text-sm uppercase tracking-[0.2em] text-primary mb-3">
            What&apos;s Included
          </p>
          <h2 className="font-serif text-display-lg text-ink text-balance">
            Everything You Need.<br />Nothing You Don&apos;t.
          </h2>
        </motion.div>

        {/* Amenity cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
        >
          {amenities.map(({ icon: Icon, label, note }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-4">
                <Icon size={22} className="text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-lg text-ink mb-1">{label}</h3>
              <p className="font-sans text-sm text-muted-foreground">{note}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Current issues disclosure */}
        {issues.length > 0 && (
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="text-center font-sans text-xs text-muted-foreground mt-8"
          >
            Current notes: {issues.join(' · ')}
          </motion.p>
        )}
      </div>
    </section>
  )
}
