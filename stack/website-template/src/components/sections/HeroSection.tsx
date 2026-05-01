'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PROPERTY_CONFIG } from '@/lib/config'
import { fadeIn, fadeUp } from '@/lib/animations'

export function HeroSection() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' })
    }
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Your Property hero"
    >
      {/* Hero Image */}
      <Image
        src="/photos/pool/pool-jacuzzi-facade-01.jpg"
        alt="Your Property private pool and jacuzzi with house facade surrounded by lush tropical greenery"
        fill
        priority
        quality={85}
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/55 z-10" />

      {/* Content */}
      <div className="relative z-20 text-center text-white px-6 max-w-4xl mx-auto">
        <motion.p
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="font-sans text-sm uppercase tracking-[0.2em] text-white/70 mb-5"
        >
          {PROPERTY_CONFIG.location} &nbsp;·&nbsp; {PROPERTY_CONFIG.driveTime}
        </motion.p>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.35 }}
          className="font-serif text-display-xl text-white mb-5 text-balance"
        >
          {PROPERTY_CONFIG.tagline}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="font-sans text-lg md:text-xl text-white/80 mb-10 max-w-xl mx-auto"
        >
          A family hilltop retreat, just a 1 hour highway drive from central Metro Manila.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.65 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            onClick={() => scrollTo('availability')}
            size="lg"
            className="bg-primary hover:bg-primary-dark text-white px-8 py-6 text-base font-sans font-medium shadow-lg"
          >
            Check Availability
          </Button>
          <Button
            onClick={() => scrollTo('gallery')}
            size="lg"
            variant="outline"
            className="border-white/70 text-white bg-white/10 hover:bg-white/20 hover:text-white px-8 py-6 text-base font-sans font-medium backdrop-blur-sm"
          >
            View Gallery
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/60 animate-bounce-y cursor-pointer"
        onClick={() => scrollTo('story')}
        aria-label="Scroll down"
      >
        <ChevronDown size={28} />
      </motion.div>
    </section>
  )
}
