import { ExternalLink } from 'lucide-react'
import { PROPERTY_CONFIG, KNOWN_ISSUES } from '@/lib/config'

export function FooterSection() {
  const disclosures: string[] = []
  if (KNOWN_ISSUES.noWifi) disclosures.push('WiFi not yet available')
  if (KNOWN_ISSUES.poolHeaterUnderRepair) disclosures.push('Pool heater under repair')
  if (KNOWN_ISSUES.jacuzziJetsUnderRepair) disclosures.push('Jacuzzi jets under repair')

  return (
    <footer className="bg-ink text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <p className="font-serif text-2xl text-white mb-2">
              {PROPERTY_CONFIG.name}
            </p>
            <p className="font-sans text-sm text-white/60 italic mb-4">
              {PROPERTY_CONFIG.tagline}
            </p>
            <p className="font-sans text-xs text-white/40 leading-relaxed">
              A private hilltop pool house retreat in Your City, Your Region.
            </p>
          </div>

          {/* Book on platforms */}
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
              Also Available On
            </p>
            <div className="space-y-3">
              {PROPERTY_CONFIG.airbnbUrl ? (
                <a
                  href={PROPERTY_CONFIG.airbnbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-sans text-sm text-white/70 hover:text-white transition-colors"
                >
                  <ExternalLink size={14} />
                  Book on Airbnb
                </a>
              ) : (
                <p className="font-sans text-sm text-white/30">Airbnb listing coming soon</p>
              )}
              {PROPERTY_CONFIG.bookingUrl ? (
                <a
                  href={PROPERTY_CONFIG.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-sans text-sm text-white/70 hover:text-white transition-colors"
                >
                  <ExternalLink size={14} />
                  Book on Booking.com
                </a>
              ) : (
                <p className="font-sans text-sm text-white/30">Booking.com listing coming soon</p>
              )}
            </div>
          </div>

          {/* Navigate */}
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
              Navigate
            </p>
            <div className="space-y-2">
              {[
                { href: '/#story', label: 'Our Story' },
                { href: '/#spaces', label: 'The Space' },
                { href: '/#gallery', label: 'Gallery' },
                { href: '/pricechecker', label: 'Availability' },
                { href: '/faq', label: 'FAQ' },
                { href: '/reserve', label: 'Inquire' },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="block font-sans text-sm text-white/60 hover:text-white transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-white/30">
            © {new Date().getFullYear()} Your Property. All rights reserved.
          </p>
          {disclosures.length > 0 && (
            <p className="font-sans text-xs text-white/25 text-center">
              {disclosures.join(' · ')}
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}
