// ============================================================
// SOFT OPENING FLAG — set to false when ops fully stabilize
// Changing this one line toggles: banner visibility + pricing
// ============================================================
export const SOFT_OPENING = true

// Known property limitations — drives disclosures site-wide
export const KNOWN_ISSUES = {
  noWifi: true,
  poolHeaterUnderRepair: true,
  jacuzziJetsUnderRepair: true,
}

export const PROPERTY_CONFIG = {
  name: 'Your Property',
  tagline: 'Escape the City.',
  shortDescription:
    'A family hilltop retreat, just a 1 hour highway drive from the central Metro Manila.',
  location: 'Your City, Your Region',
  driveTime: '~1 hour from City Center',
  coordinates: { lat: 14.1650464, lng: 121.2087127 },
  maxGuests: 10,
  beds: 10,
  bathrooms: 2,
  excessPaxRate: 500,
  // Fill these when listings go live
  airbnbUrl: '',
  bookingUrl: '',
  // Contact
  email: 'inquiries@yourproperty.com',
}
