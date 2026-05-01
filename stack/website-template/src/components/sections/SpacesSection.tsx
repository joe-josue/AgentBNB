'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { fadeLeft, fadeRight, fadeUp, viewportOnce } from '@/lib/animations'

const spaces = [
  {
    id: 'pool',
    label: 'Pool & Outdoor',
    headline: 'Lush, Private, and Pristine.',
    description:
      'A beautifully designed outdoor pool area surrounded by lush tropical greenery. Natural temperature, refreshing, and private. Includes a jacuzzi pool area and an outdoor grill (ihawan) perfect for unwinding after the drive up.',
    photo: '/photos/pool/pool-jacuzzi-facade-02.jpg',
    alt: 'Your Property private outdoor pool and jacuzzi area with tropical green surroundings',
  },
  {
    id: 'living',
    label: 'Living Room',
    headline: 'Open-Air Living with Panoramic Forest Views.',
    description:
      'Polished hardwood floors, open-beam ceilings, and large glass doors that frame the pool and the surrounding forest. Modern, calm, and filled with natural light.',
    photo: '/photos/living-room/living-room-01.jpg',
    alt: 'Your Property modern living room with open interiors and natural lighting',
  },
  {
    id: 'dining',
    label: 'Dining & Kitchen',
    headline: 'Modern Communal Dining Under Artisan Paper Lanterns.',
    description:
      'A 10-seater dining table for gathering the whole group. Full kitchen with a 2-burner gas stove, refrigerator, cookware, utensils, and everything you need to cook a proper meal together.',
    photo: '/photos/dining/dining-room-01.jpg',
    alt: 'Your Property dining room with 10-seater table and artisan pendant lights',
  },
  {
    id: 'dormitory',
    label: 'The Bedroom',
    headline: 'Comfort Tailored to Your Group.',
    description:
      'Our flexible setup features stackable beds that can be arranged to fit your group. One shared bedroom that keeps the common areas open and breathable.',
    photo: '/photos/dormitory/dormitory-01.jpg',
    alt: 'Your Property dormitory bedroom with modular single beds',
  },
  {
    id: 'upstairs',
    label: 'Upstairs Lounge',
    headline: 'Elevated Views, Relaxed Afternoons.',
    description:
      'An upper balcony and lounge area overlooking the pool and canopy of trees. The best seat in the house for morning coffee or an evening wind-down.',
    photo: '/photos/upstairs/upper-balcony-pool-view-01.jpg',
    alt: 'Your Property upper balcony lounge area with pool view and lush tree canopy',
  },
]

export function SpacesSection() {
  return (
    <section id="spaces" className="section-pad bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mb-20"
        >
          <p className="font-sans text-sm uppercase tracking-[0.2em] text-primary mb-3">
            The Space
          </p>
          <h2 className="font-serif text-display-lg text-ink text-balance">
            Every Corner Crafted with Care.
          </h2>
        </motion.div>

        {/* Alternating zones */}
        <div className="space-y-28">
          {spaces.map((space, index) => {
            const isEven = index % 2 === 1
            return (
              <div
                key={space.id}
                className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
              >
                {/* Photo — odd index: right side on desktop */}
                <motion.div
                  variants={isEven ? fadeRight : fadeLeft}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  className={`relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg ${
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <Image
                    src={space.photo}
                    alt={space.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    loading="lazy"
                  />
                </motion.div>

                {/* Text */}
                <motion.div
                  variants={isEven ? fadeLeft : fadeRight}
                  initial="hidden"
                  whileInView="visible"
                  viewport={viewportOnce}
                  className={isEven ? 'lg:order-1' : 'lg:order-2'}
                >
                  <p className="font-sans text-xs uppercase tracking-[0.2em] text-primary mb-3">
                    {space.label}
                  </p>
                  <h3 className="font-serif text-display-md text-ink mb-5">
                    {space.headline}
                  </h3>
                  <p className="font-sans text-base leading-relaxed text-muted-foreground">
                    {space.description}
                  </p>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
