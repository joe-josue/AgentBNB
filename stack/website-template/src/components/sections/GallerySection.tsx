'use client'

import { useState } from 'react'
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { motion } from 'framer-motion'
import { fadeUp, viewportOnce } from '@/lib/animations'

type Category = 'all' | 'pool' | 'living-room' | 'dining' | 'kitchen' | 'dormitory' | 'upstairs'

interface GalleryPhoto {
  src: string
  alt: string
  category: Exclude<Category, 'all'>
}

const photos: GalleryPhoto[] = [
  // Pool
  { src: '/photos/pool/pool-jacuzzi-facade-01.jpg', alt: 'Your Property pool and jacuzzi with house facade', category: 'pool' },
  { src: '/photos/pool/pool-jacuzzi-facade-03.jpg', alt: 'Pool and facade framed by palm trees', category: 'pool' },
  { src: '/photos/pool/pool-overhead-view.jpg', alt: 'Overhead view of the private pool from upper level', category: 'pool' },
  { src: '/photos/pool/pool-garden-view.jpg', alt: 'Pool garden view at Your Property', category: 'pool' },
  { src: '/photos/pool/pool-garden-from-balcony.jpg', alt: 'Pool and garden seen from the upper balcony', category: 'pool' },
  { src: '/photos/pool/facade-pool-wide-02.jpg', alt: 'Wide view of the property facade and pool', category: 'pool' },
  // Living room
  { src: '/photos/living-room/living-room-glass-doors-pool-view.jpg', alt: 'Living room glass doors framing pool view', category: 'living-room' },
  { src: '/photos/living-room/living-room-01.jpg', alt: 'Your Property modern open living room', category: 'living-room' },
  { src: '/photos/living-room/living-room-02.jpg', alt: 'Living room with warm natural light', category: 'living-room' },
  { src: '/photos/living-room/living-room-03.jpg', alt: 'Living area with terracotta tile floors', category: 'living-room' },
  { src: '/photos/living-room/living-room-staircase-01.jpg', alt: 'Open staircase from the living room', category: 'living-room' },
  // Dining
  { src: '/photos/dining/dining-room-01.jpg', alt: 'Dining room with 10-seater table and artisan paper lanterns', category: 'dining' },
  { src: '/photos/dining/dining-room-04.jpg', alt: 'Bright dining room with garden views on two sides', category: 'dining' },
  { src: '/photos/dining/dining-room-corner.jpg', alt: 'Dining room corner with natural light', category: 'dining' },
  // Kitchen
  { src: '/photos/kitchen/kitchen-wide-01.jpg', alt: 'Full kitchen view at Your Property', category: 'kitchen' },
  { src: '/photos/kitchen/kitchen-01.jpg', alt: 'Kitchen counter and appliances', category: 'kitchen' },
  { src: '/photos/kitchen/kitchen-02.jpg', alt: 'Gas stove and rangehood in kitchen', category: 'kitchen' },
  // Dormitory
  { src: '/photos/dormitory/dormitory-01.jpg', alt: 'Your Property dormitory with modular single beds', category: 'dormitory' },
  { src: '/photos/dormitory/dormitory-03.jpg', alt: 'Flexible sleeping arrangement across the full bedroom', category: 'dormitory' },
  // Upstairs
  { src: '/photos/upstairs/upper-balcony-pool-view-01.jpg', alt: 'Upper balcony with pool view and tree canopy', category: 'upstairs' },
  { src: '/photos/upstairs/upper-balcony-pool-view-02.jpg', alt: 'Balcony lounge area overlooking pool', category: 'upstairs' },
  { src: '/photos/upstairs/upstairs-lounge-01.jpg', alt: 'Upstairs lounge seating area with treetop views', category: 'upstairs' },
  { src: '/photos/upstairs/upstairs-sitting-room.jpg', alt: 'Sitting room on the upper floor', category: 'upstairs' },
]

const categories: { value: Category; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pool', label: 'Pool' },
  { value: 'living-room', label: 'Living Room' },
  { value: 'dining', label: 'Dining' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'dormitory', label: 'Bedroom' },
  { value: 'upstairs', label: 'Upstairs' },
]

export function GallerySection() {
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [lightboxIndex, setLightboxIndex] = useState(-1)

  const filtered =
    activeCategory === 'all'
      ? photos
      : photos.filter((p) => p.category === activeCategory)

  return (
    <section id="gallery" className="section-pad bg-muted">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="text-center mb-10"
        >
          <p className="font-sans text-sm uppercase tracking-[0.2em] text-primary mb-3">
            Photo Gallery
          </p>
          <h2 className="font-serif text-display-lg text-ink text-balance">
            Explore the Property
          </h2>
        </motion.div>

        {/* Category filters */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {categories.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setActiveCategory(value)}
              className={`px-4 py-1.5 rounded-full text-sm font-sans font-medium transition-all border ${
                activeCategory === value
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-ink border-border hover:border-primary hover:text-primary'
              }`}
            >
              {label}
            </button>
          ))}
        </motion.div>

        {/* Masonry grid */}
        <div
          style={{ columnCount: undefined }}
          className="[column-count:2] md:[column-count:3] gap-3 md:gap-4 [column-gap:12px] md:[column-gap:16px]"
        >
          {filtered.map((photo, index) => (
            <div
              key={photo.src}
              className="break-inside-avoid mb-3 md:mb-4 relative overflow-hidden rounded-xl cursor-pointer group"
              onClick={() => setLightboxIndex(index)}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 33vw"
                  loading={index < 6 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        <Lightbox
          open={lightboxIndex >= 0}
          index={lightboxIndex}
          close={() => setLightboxIndex(-1)}
          slides={filtered.map((p) => ({ src: p.src, alt: p.alt }))}
          on={{
            view: ({ index }) => setLightboxIndex(index),
          }}
          styles={{
            container: { backgroundColor: 'rgba(0, 0, 0, 0.92)' },
          }}
        />
      </div>
    </section>
  )
}
