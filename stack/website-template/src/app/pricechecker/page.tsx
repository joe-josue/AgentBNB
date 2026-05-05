import type { Metadata } from 'next'
import { FooterSection } from '@/components/sections/FooterSection'
import { PROPERTY_CONFIG } from '@/lib/config'
import { PricecheckerPageClient } from './PricecheckerPageClient'

export const metadata: Metadata = {
  title: `Price Checker | ${PROPERTY_CONFIG.name}`,
  description:
    `Check ${PROPERTY_CONFIG.name} availability, estimate rates for overnight stays or day trips, and send a direct inquiry for your selected dates.`,
  alternates: {
    canonical: 'https://yourproperty.com/pricechecker',
  },
  openGraph: {
    title: `Price Checker | ${PROPERTY_CONFIG.name}`,
    description:
      `Availability calendar and instant rate estimator for ${PROPERTY_CONFIG.name} direct bookings.`,
    url: 'https://yourproperty.com/pricechecker',
  },
}

export default function PricecheckerPage() {
  return (
    <>
      <PricecheckerPageClient />
      <FooterSection />
    </>
  )
}
