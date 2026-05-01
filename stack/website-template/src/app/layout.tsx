import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import { JsonLd } from '@/components/JsonLd'
import { ConditionalNav } from '@/components/ConditionalNav'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Your Property | Hilltop Pool House Retreat in Your City, Your Region',
  description:
    'Private hilltop pool house retreat in Your City, Your Region. ~1 hour from City Center via highway. Natural breeze, 10 beds, private pool, full kitchen. Perfect for families and barkadas. Book direct.',
  keywords: [
    'Your City resort',
    'private pool Your Region',
    'pool house near Manila',
    'family getaway Your City',
    'hilltop retreat Philippines',
    'private resort Your City',
    'barkada getaway Your Region',
    'Your City pool house',
    'private pool Your City',
    'resort near City Center',
  ],
  openGraph: {
    title: 'Your Property | Hilltop Pool House Retreat',
    description:
      'A private hilltop pool house in Your City, Your Region — ~1 hour from City Center. 10 beds, private pool, natural breeze.',
    url: 'https://yourproperty.com',
    siteName: 'Your Property',
    images: [
      {
        url: 'https://yourproperty.com/photos/pool/pool-jacuzzi-facade-01.jpg',
        width: 1200,
        height: 630,
        alt: 'Your Property private pool and jacuzzi with house facade',
      },
    ],
    locale: 'en_PH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your Property | Hilltop Pool House Retreat',
    description:
      'Private hilltop pool house in Your City, Your Region. ~1hr from City Center.',
    images: ['https://yourproperty.com/photos/pool/pool-jacuzzi-facade-01.jpg'],
  },
  alternates: {
    canonical: 'https://yourproperty.com',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable}`}
    >
      <head>
        <JsonLd />
      </head>
      <body className="antialiased bg-background text-ink font-sans">
        <ConditionalNav />
        {children}
      </body>
    </html>
  )
}
