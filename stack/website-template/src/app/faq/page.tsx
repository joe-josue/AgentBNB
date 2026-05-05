import type { Metadata } from 'next'
import { FaqSection } from '@/components/sections/FaqSection'
import { FooterSection } from '@/components/sections/FooterSection'
import { PROPERTY_CONFIG } from '@/lib/config'

export const metadata: Metadata = {
  title: `FAQ | ${PROPERTY_CONFIG.name}`,
  description:
    `Frequently asked questions for ${PROPERTY_CONFIG.name}, including house rules, guest capacity, amenities, cooking, road access, WiFi, pool details, and booking logistics.`,
  alternates: {
    canonical: 'https://yourproperty.com/faq',
  },
  openGraph: {
    title: `FAQ | ${PROPERTY_CONFIG.name}`,
    description:
      `House rules, logistics, amenities, and common guest questions for ${PROPERTY_CONFIG.name}.`,
    url: 'https://yourproperty.com/faq',
  },
}

export default function FaqPage() {
  return (
    <>
      <main className="pt-28 md:pt-32">
        <FaqSection />
      </main>
      <FooterSection />
    </>
  )
}
