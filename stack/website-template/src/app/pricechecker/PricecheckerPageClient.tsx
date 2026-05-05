'use client'

import { useState } from 'react'
import { AvailabilitySection } from '@/components/sections/AvailabilitySection'
import { InquireSection } from '@/components/sections/InquireSection'
import type { StayType } from '@/lib/types'

interface InquireParams {
  checkIn?: string
  checkOut?: string
  headcount: number
  stayType: StayType
}

export function PricecheckerPageClient() {
  const [inquireParams, setInquireParams] = useState<InquireParams | undefined>()

  return (
    <main className="pt-28 md:pt-32">
      <AvailabilitySection onInquireParams={setInquireParams} />
      <InquireSection prefillParams={inquireParams} />
    </main>
  )
}
