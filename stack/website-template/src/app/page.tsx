'use client'

import { useState } from 'react'
import { HeroSection } from '@/components/sections/HeroSection'
import { StorySection } from '@/components/sections/StorySection'
import { AmenitiesSection } from '@/components/sections/AmenitiesSection'
import { SpacesSection } from '@/components/sections/SpacesSection'
import { GallerySection } from '@/components/sections/GallerySection'
import { AvailabilitySection } from '@/components/sections/AvailabilitySection'
import { LocationSection } from '@/components/sections/LocationSection'
import { FaqSection } from '@/components/sections/FaqSection'
import { InquireSection } from '@/components/sections/InquireSection'
import { FooterSection } from '@/components/sections/FooterSection'
import type { StayType } from '@/lib/types'

interface InquireParams {
  checkIn?: string
  checkOut?: string
  headcount: number
  stayType: StayType
}

export default function Home() {
  const [inquireParams, setInquireParams] = useState<InquireParams | undefined>()

  const handleInquireFromAvailability = (params: InquireParams) => {
    setInquireParams(params)
  }

  return (
    <>
      <main>
        <HeroSection />
        <StorySection />
        <AmenitiesSection />
        <SpacesSection />
        <GallerySection />
        <AvailabilitySection onInquireParams={handleInquireFromAvailability} />
        <LocationSection />
        <FaqSection />
        <InquireSection prefillParams={inquireParams} />
      </main>
      <FooterSection />
    </>
  )
}
