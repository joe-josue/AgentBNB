'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { fadeLeft, fadeRight, viewportOnce } from '@/lib/animations'

export function StorySection() {
  return (
    <section id="story" className="section-pad bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <p className="font-sans text-sm uppercase tracking-[0.2em] text-primary mb-4">
              Our Story
            </p>
            <h2 className="font-serif text-display-lg text-ink mb-6 text-balance">
              A Family Home,<br />Open to Yours.
            </h2>
            <div className="space-y-5 font-sans text-base leading-relaxed text-muted-foreground">
              <p>
                Replace this paragraph with your property origin story. Explain what kind of experience you are offering, where the property sits, and why guests should care.
              </p>
              <p>
                Perched at the highest point of a private local subdivision, we offer a cool hilltop experience that traditional Your City resorts can&apos;t match. Many memories have been made in this home. We open its doors for you to make some of your own.
              </p>
              <p>
                Because of our elevation and open-concept layout, the property stays naturally cool — we&apos;ve traded air conditioning for fresh hilltop air and large, scenic windows overlooking the pool and the surrounding greenery.
              </p>
            </div>

            {/* Trust signals */}
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                { value: '10', label: 'Modular Beds' },
                { value: '2', label: 'Bathrooms' },
                { value: '~1hr', label: 'from City Center' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="font-serif text-3xl text-primary font-medium">{value}</p>
                  <p className="font-sans text-xs text-muted-foreground mt-1 uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Photo */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl"
          >
            <Image
              src="/photos/living-room/living-room-glass-doors-pool-view.jpg"
              alt="Your Property living room with large glass doors opening to pool view and lush greenery"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Subtle accent overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-serif text-white text-lg italic">
                &ldquo;Open-air living with panoramic forest views.&rdquo;
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
