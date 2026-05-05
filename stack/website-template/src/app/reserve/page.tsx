import type { Metadata } from 'next'
import { InquireSection } from '@/components/sections/InquireSection'
import { FooterSection } from '@/components/sections/FooterSection'
import { PROPERTY_CONFIG } from '@/lib/config'

export const metadata: Metadata = {
  title: `Reserve | ${PROPERTY_CONFIG.name}`,
  description:
    `Send a direct booking inquiry for ${PROPERTY_CONFIG.name} with your preferred dates, stay type, headcount, and guest questions.`,
  alternates: {
    canonical: 'https://yourproperty.com/reserve',
  },
  openGraph: {
    title: `Reserve | ${PROPERTY_CONFIG.name}`,
    description:
      `Direct booking inquiry form for ${PROPERTY_CONFIG.name}.`,
    url: 'https://yourproperty.com/reserve',
  },
}

export default function ReservePage() {
  return (
    <>
      <main className="pt-28 md:pt-32">
        <InquireSection />
      </main>
      <FooterSection />
    </>
  )
}
