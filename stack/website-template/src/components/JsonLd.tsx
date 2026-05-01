import { PROPERTY_CONFIG } from '@/lib/config'

export function JsonLd() {
  const lodging = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: PROPERTY_CONFIG.name,
    description:
      'Private hilltop pool house retreat in Your City, Your Region. Natural breeze, 10 single beds, private pool, full kitchen, and outdoor grill. ~1 hour from City Center.',
    url: 'https://yourproperty.com',
    image: [
      'https://yourproperty.com/photos/pool/pool-jacuzzi-facade-01.jpg',
      'https://yourproperty.com/photos/pool/pool-jacuzzi-facade-02.jpg',
      'https://yourproperty.com/photos/living-room/living-room-glass-doors-pool-view.jpg',
      'https://yourproperty.com/photos/dining/dining-room-01.jpg',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Your District Subdivision, Purok 1, Brgy. Your Barangay',
      addressLocality: 'Your City',
      addressRegion: 'Your Region',
      addressCountry: 'PH',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: PROPERTY_CONFIG.coordinates.lat,
      longitude: PROPERTY_CONFIG.coordinates.lng,
    },
    amenityFeature: [
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Private Swimming Pool',
        value: true,
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Kitchen',
        value: true,
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Outdoor Grill',
        value: true,
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Balcony',
        value: true,
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: 'Air Conditioning',
        value: false,
      },
    ],
    numberOfRooms: 1,
    priceRange: '₱₱₱',
    telephone: '',
    email: PROPERTY_CONFIG.email,
  }

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is there air conditioning?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Your Property is a hilltop breeze home. Because of the elevation and open layout, the property stays cooler than lower areas in Your City, especially late afternoon to evening. No air conditioning is needed.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is the pool heated?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The pool is private and natural temperature — no heating. It is refreshing especially during warmer hours and is surrounded by lush greenery.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the road like to get to Your Property?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Your Property is at the highest point of the subdivision. The road has steep sections. We recommend confident drivers. The cool hilltop setting is worth it once you arrive.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is WiFi available?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'WiFi is not yet available. Internet setup is in progress. We recommend bringing mobile data.',
        },
      },
      {
        '@type': 'Question',
        name: 'How many guests can stay?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The property sleeps up to 10 guests with modular single beds. Day trips include up to 10 guests in the base rate, with an excess pax rate of ₱500 per additional guest.',
        },
      },
      {
        '@type': 'Question',
        name: 'How far is Your Property from Manila?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Your Property is approximately 1 hour from City Center via SLEX/CALAX, located in a private subdivision in Your City, Your Region.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you have an outdoor grill (ihawan)?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Your Property now has an outdoor grill that guests can use for barbecue and grilled meals.',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lodging) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  )
}
