'use client'

import { motion } from 'framer-motion'
import { Clock, MapPin, Mountain } from 'lucide-react'
import { fadeUp, staggerContainer, viewportOnce } from '@/lib/animations'
const info = [
  {
    icon: Clock,
    title: 'About an Hour Away',
    body: `~1 hour from City Center via SLEX/CALAX. An easy highway drive out of the city with a rewarding arrival.`,
  },
  {
    icon: MapPin,
    title: 'Private Subdivision',
    body: `Located inside a quiet private subdivision in Your District, Purok 1, Brgy. Your Barangay, Your City, Your Region. Secluded and peaceful.`,
  },
  {
    icon: Mountain,
    title: 'Steep Approach Road',
    body: `The property is at the highest point of the subdivision. The road up has steep sections — we recommend confident drivers. Four-wheel vehicles are welcome.`,
  },
]

// Replace with your own Google Maps embed query string.
const mapEmbedUrl = `https://www.google.com/maps/embed?pb=REPLACE_WITH_YOUR_PROPERTY_MAP_EMBED`

export function LocationSection() {

  return (
    <section id="location" className="section-pad bg-background">
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
            Getting Here
          </p>
          <h2 className="font-serif text-display-lg text-ink text-balance">
            Close to the City.<br />Far from the Noise.
          </h2>
        </motion.div>

        {/* Info cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {info.map(({ icon: Icon, title, body }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="bg-muted rounded-xl p-6 border border-border"
            >
              <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-4">
                <Icon size={20} className="text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-lg text-ink mb-2">{title}</h3>
              <p className="font-sans text-sm leading-relaxed text-muted-foreground">{body}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Map */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="rounded-2xl overflow-hidden border border-border shadow-sm"
          style={{ aspectRatio: '16/7' }}
        >
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Your Property location map"
          />
        </motion.div>
      </div>
    </section>
  )
}
